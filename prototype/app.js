const suppliers = {
  SUP26052171152: {
    id: "SUP26052171152",
    name: "材料测试0521",
    status: "预录入",
    inspectionStatus: "备选",
    type: "渠道",
    boundAt: "2026-05-25 15:47:41",
  },
  SUP26052071150: {
    id: "SUP26052071150",
    name: "clceshi5201",
    status: "预录入",
    inspectionStatus: "备选",
    type: "精品",
    boundAt: "2026-05-25 15:48:40",
  },
};

const conditionMeta = {
  "1-1": {
    title: "有效期内三方验厂通过",
    desc: "上传三方验厂报告，并填写报告日期和有效期。",
  },
  "1-2": {
    title: "主板上市公司",
    desc: "调用企查查 API 查询上市交易信息，结果不可修改。",
  },
  "1-3": {
    title: "标杆大卖背书",
    desc: "上传发票和商务协议。",
  },
  "1-4": {
    title: "工商实缴及账期达标",
    desc: "调用企查查 API 查询工商实缴资本，上传商务协议并手动填写账期。",
  },
};

const orderedCodes = ["1-1", "1-2", "1-3", "1-4"];
const apiCodes = new Set(["1-2", "1-4"]);
const queryTimers = {};
const todayDate = new Date().toISOString().slice(0, 10);

const state = {
  supplierId: "",
  inspectionType: "onsite",
  selectedConditions: new Set(),
  files: {},
  accountDays: {},
  dateFields: {},
  queryResults: {},
  apiScenario: {
    "1-2": "pass",
    "1-4": "pass",
  },
  touched: false,
};

const modal = document.getElementById("inspectionModal");
const modalSupplier = document.getElementById("modalSupplier");
const onsiteSection = document.getElementById("onsiteSection");
const onsiteExpectedDate = document.getElementById("onsiteExpectedDate");
const onsiteRemark = document.getElementById("onsiteRemark");
const onsiteRemarkCount = document.getElementById("onsiteRemarkCount");
const exemptSection = document.getElementById("exemptSection");
const conditionTrigger = document.getElementById("conditionTrigger");
const conditionTriggerText = document.getElementById("conditionTriggerText");
const conditionPanel = document.getElementById("conditionPanel");
const conditionChips = document.getElementById("conditionChips");
const conditionSections = document.getElementById("conditionSections");
const modalStatus = document.getElementById("modalStatus");
const detailDrawer = document.getElementById("detailDrawer");
const drawerSubtitle = document.getElementById("drawerSubtitle");
const drawerBody = document.getElementById("drawerBody");
const toast = document.getElementById("toast");

document.addEventListener("click", (event) => {
  const operationTrigger = event.target.closest("[data-menu-trigger]");
  if (operationTrigger) {
    const operation = operationTrigger.closest(".operation");
    closeOperationMenus(operation);
    const willOpen = !operation.classList.contains("is-open");
    operation.classList.toggle("is-open", willOpen);
    operation.querySelector(".operation-menu").setAttribute("aria-hidden", String(!willOpen));
    return;
  }

  const menuAction = event.target.closest("[data-menu-action]");
  if (menuAction) {
    const row = menuAction.closest("tr");
    const supplierId = row.dataset.supplierId;
    closeOperationMenus();
    handleMenuAction(menuAction.dataset.menuAction, supplierId);
    return;
  }

  if (!event.target.closest(".operation")) {
    closeOperationMenus();
  }

  if (event.target === conditionTrigger || event.target.closest("#conditionTrigger")) {
    toggleConditionPanel();
    return;
  }

  if (!event.target.closest("[data-select-root]")) {
    closeConditionPanel();
  }

  const scenarioButton = event.target.closest("[data-scenario-code]");
  if (scenarioButton) {
    const code = scenarioButton.dataset.scenarioCode;
    state.apiScenario[code] = scenarioButton.dataset.scenario;
    triggerExternalQuery(code);
    return;
  }
});

document.addEventListener("change", (event) => {
  const typeInput = event.target.closest('input[name="inspectionType"]');
  if (typeInput) {
    state.inspectionType = typeInput.value;
    renderInspectionType();
    renderModalStatus();
    return;
  }

  const conditionInput = event.target.closest('#conditionPanel input[type="checkbox"]');
  if (conditionInput) {
    const code = conditionInput.value;
    if (conditionInput.checked) {
      state.selectedConditions.add(code);
      if (apiCodes.has(code)) {
        triggerExternalQuery(code);
      }
    } else {
      state.selectedConditions.delete(code);
    }
    renderConditionPicker();
    renderConditionSections();
    renderModalStatus();
    return;
  }

  const fileInput = event.target.closest("input[type='file'][data-file-key]");
  if (fileInput) {
    const key = fileStateKey(fileInput.dataset.code, fileInput.dataset.fileKey);
    state.files[key] = fileInput.files && fileInput.files[0] ? fileInput.files[0].name : "";
    renderConditionSections();
    renderModalStatus();
    return;
  }

  const dateInput = event.target.closest("[data-date-code]");
  if (dateInput) {
    state.dateFields[dateStateKey(dateInput.dataset.dateCode, dateInput.dataset.dateField)] =
      dateInput.value;
    renderModalStatus();
    return;
  }

  if (event.target === onsiteExpectedDate) {
    renderModalStatus();
  }
});

document.addEventListener("input", (event) => {
  if (event.target === onsiteRemark) {
    onsiteRemarkCount.textContent = `${onsiteRemark.value.length}/256`;
    return;
  }

  const accountInput = event.target.closest("[data-account-code]");
  if (accountInput) {
    state.accountDays[accountInput.dataset.accountCode] = accountInput.value;
    renderModalStatus();
    return;
  }

  const dateInput = event.target.closest("[data-date-code]");
  if (!dateInput) return;
  state.dateFields[dateStateKey(dateInput.dataset.dateCode, dateInput.dataset.dateField)] =
    dateInput.value;
  renderModalStatus();
});

document.getElementById("closeModal").addEventListener("click", closeModal);
document.getElementById("cancelModal").addEventListener("click", closeModal);
document.getElementById("confirmApply").addEventListener("click", confirmApply);
document.getElementById("closeDrawer").addEventListener("click", closeDrawer);

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (modal.classList.contains("is-open")) closeModal();
  if (detailDrawer.classList.contains("is-open")) closeDrawer();
});

function handleMenuAction(action, supplierId) {
  if (action === "detail") {
    openDrawer(supplierId);
    return;
  }
  if (action === "complete") {
    showToast("已进入完善资料动作，可在后续原型中扩展资料表单。");
    return;
  }
  if (action === "apply") {
    openModal(supplierId);
  }
}

function openModal(supplierId) {
  const supplier = suppliers[supplierId];
  state.supplierId = supplierId;
  state.inspectionType = "onsite";
  state.selectedConditions = new Set();
  state.files = {};
  state.accountDays = {};
  state.dateFields = {};
  state.queryResults = {};
  state.apiScenario = {
    "1-2": "pass",
    "1-4": "pass",
  };
  state.touched = false;

  modalSupplier.textContent = `${supplier.id} / ${supplier.name}`;
  document.querySelector('input[name="inspectionType"][value="onsite"]').checked = true;
  document.querySelector('input[name="inspectionType"][value="exempt"]').checked = false;
  conditionPanel.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
    checkbox.checked = false;
  });
  onsiteExpectedDate.value = "";
  onsiteRemark.value = "";
  onsiteRemarkCount.textContent = "0/256";

  closeConditionPanel();
  renderInspectionType();
  renderConditionPicker();
  renderConditionSections();
  renderModalStatus();

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  Object.values(queryTimers).forEach((timer) => clearTimeout(timer));
}

function renderInspectionType() {
  const isExempt = state.inspectionType === "exempt";
  onsiteSection.classList.toggle("is-hidden", isExempt);
  exemptSection.classList.toggle("is-hidden", !isExempt);
}

function renderConditionPicker() {
  const selected = orderedCodes.filter((code) => state.selectedConditions.has(code));
  conditionTriggerText.textContent = selected.length
    ? `${selected.join("、")} 已选择`
    : "请选择 1-1 到 1-4，可多选";

  conditionPanel.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
    checkbox.checked = state.selectedConditions.has(checkbox.value);
  });

  conditionChips.innerHTML = selected
    .map((code) => `<span class="chip">${code} ${conditionMeta[code].title}</span>`)
    .join("");
}

function renderConditionSections() {
  const selected = orderedCodes.filter((code) => state.selectedConditions.has(code));
  if (!selected.length) {
    conditionSections.innerHTML =
      '<div class="empty-state">选择免验条件后，这里会展示对应材料上传、日期填写、账期填写或 API 查询结果。</div>';
    return;
  }

  conditionSections.innerHTML = selected.map((code) => renderConditionCard(code)).join("");
}

function renderConditionCard(code) {
  const meta = conditionMeta[code];
  const status = getConditionStatus(code);
  const errors = validateCondition(code).messages;
  const showErrors = state.touched || hasApiFailure(code);
  return `
    <article class="condition-card" data-condition-card="${code}">
      <header>
        <div class="condition-title">
          <strong>${code}</strong>
          <span>${meta.title}</span>
        </div>
        <span class="status-pill ${status.className}">${status.text}</span>
      </header>
      <div class="condition-body">
        ${renderConditionBody(code)}
        ${
          showErrors && errors.length
            ? `<div class="field-error">${errors.map(escapeHtml).join("；")}</div>`
            : ""
        }
      </div>
    </article>
  `;
}

function renderConditionBody(code) {
  if (code === "1-1") {
    return `
      <div class="form-grid">
        ${renderUpload("1-1", "thirdPartyReport", "三方验厂报告", "FCCA、QSM、GMP 等报告")}
        ${renderDateInput("1-1", "reportDate", "报告日期")}
        ${renderDateInput("1-1", "validUntil", "有效期")}
      </div>
    `;
  }

  if (code === "1-2") {
    return `
      ${renderApiBlock("1-2")}
      <div class="form-grid follow-up-grid">
        ${renderUpload(
          "1-2",
          "apiFallback",
          "补充材料",
          "可上传上市信息证明、工厂信息清单等",
          { optional: true, full: true },
        )}
      </div>
    `;
  }

  if (code === "1-3") {
    return `
      <div class="form-grid">
        ${renderUpload("1-3", "invoice", "发票", "近 6 个月与标杆大卖交易发票")}
        ${renderUpload("1-3", "businessAgreement", "商务协议", "可证明合作关系的协议材料")}
      </div>
    `;
  }

  return `
    ${renderApiBlock("1-4")}
    <div class="form-grid follow-up-grid">
      ${renderUpload("1-4", "businessAgreement", "商务协议", "可证明账期的协议材料")}
      ${renderAccountInput("1-4", "账期", "填写账期天数，例如 60")}
      ${renderUpload(
        "1-4",
        "apiFallback",
        "补充材料",
        "可上传工商实缴证明、工厂信息清单等",
        { optional: true, full: true },
      )}
    </div>
  `;
}

function renderUpload(code, key, title, hint, options = {}) {
  const fileName = state.files[fileStateKey(code, key)];
  return `
    <div class="form-field ${options.full ? "full" : ""}">
      <span class="form-caption">
        ${escapeHtml(title)}
        ${options.optional ? '<em class="optional-mark">非必填</em>' : ""}
      </span>
      <label class="upload-box ${fileName ? "has-file" : ""}">
        <span class="upload-icon">⇧</span>
        <span>
          <span class="upload-title">${escapeHtml(title)}</span>
          <span class="upload-file">${fileName ? escapeHtml(fileName) : escapeHtml(hint)}</span>
        </span>
        <span class="upload-action">${fileName ? "更换" : "上传"}</span>
        <input type="file" data-code="${code}" data-file-key="${key}" />
      </label>
    </div>
  `;
}

function renderAccountInput(code, label, placeholder) {
  const value = state.accountDays[code] || "";
  return `
    <div class="form-field">
      <label for="account-${code}">${label}</label>
      <input
        id="account-${code}"
        type="number"
        min="0"
        value="${escapeHtml(value)}"
        placeholder="${placeholder}"
        data-account-code="${code}"
      />
    </div>
  `;
}

function renderDateInput(code, field, label) {
  const key = dateStateKey(code, field);
  const value = state.dateFields[key] || "";
  return `
    <div class="form-field">
      <label for="${key}">${label}</label>
      <input
        id="${key}"
        type="date"
        value="${escapeHtml(value)}"
        data-date-code="${code}"
        data-date-field="${field}"
      />
    </div>
  `;
}

function renderApiBlock(code) {
  const result = state.queryResults[code] || { status: "idle" };
  const isLoading = result.status === "loading" || result.status === "idle";
  const activeScenario = state.apiScenario[code];
  const fields = getApiFields(code, result);
  const loadingText =
    code === "1-4" ? "正在调用企查查 API 查询工商实缴资本..." : "正在调用企查查 API 查询...";
  return `
    <div class="api-toolbar">
      <div class="api-state">${isLoading ? loadingText : "API 查询结果已回填，不可修改"}</div>
      <div class="scenario-buttons" aria-label="${code} 查询示例切换">
        <button class="${activeScenario === "pass" ? "is-active" : ""}" type="button" data-scenario-code="${code}" data-scenario="pass">达标示例</button>
        <button class="${activeScenario === "fail" ? "is-active" : ""}" type="button" data-scenario-code="${code}" data-scenario="fail">未达标示例</button>
      </div>
    </div>
    <div class="form-grid">
      ${fields
        .map(
          (field) => `
            <div class="form-field ${field.full ? "full" : ""}">
              <label>${escapeHtml(field.label)}</label>
              <input type="text" readonly value="${escapeHtml(field.value)}" />
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function getApiFields(code, result) {
  if (result.status === "loading" || result.status === "idle" || !result.status) {
    return [
      { label: "查询主体", value: suppliers[state.supplierId].name },
      { label: "查询状态", value: "查询中" },
      { label: "查询结论", value: "等待 API 返回", full: true },
    ];
  }

  if (code === "1-2") {
    return [
      { label: "查询主体", value: result.companyName },
      { label: "上市板块", value: result.board },
      { label: "股票代码", value: result.stockCode },
      { label: "查询时间", value: result.queryAt },
      { label: "查询结论", value: result.summary, full: true },
    ];
  }

  return [
    { label: "查询主体", value: result.companyName },
    { label: "工商实缴资本", value: `${result.paidCapital} 万元 RMB` },
    { label: "查询时间", value: result.queryAt },
    { label: "查询结论", value: result.summary, full: true },
  ];
}

function triggerExternalQuery(code) {
  clearTimeout(queryTimers[code]);
  state.queryResults[code] = { status: "loading" };
  renderConditionSections();
  renderModalStatus();

  queryTimers[code] = setTimeout(() => {
    state.queryResults[code] = buildApiResult(code, state.apiScenario[code]);
    renderConditionSections();
    renderModalStatus();
  }, 650);
}

function buildApiResult(code, scenario) {
  const supplier = suppliers[state.supplierId];
  const queryAt = "2026-05-25 16:20:18";

  if (code === "1-2") {
    if (scenario === "pass") {
      return {
        status: "success",
        matched: true,
        companyName: `${supplier.name}科技股份有限公司`,
        board: "深交所主板",
        stockCode: "002681",
        queryAt,
        summary: "查询到主板上市交易信息，符合 1-2 免验条件。",
      };
    }
    return {
      status: "success",
      matched: false,
      companyName: `${supplier.name}贸易有限公司`,
      board: "未查询到主板上市记录",
      stockCode: "-",
      queryAt,
      summary: "未查询到主板上市交易信息，无法按 1-2 申请免验厂。",
    };
  }

  if (scenario === "pass") {
    return {
      status: "success",
      matched: true,
      companyName: `${supplier.name}制造有限公司`,
      paidCapital: 2600,
      queryAt,
      summary: "工商实缴资本不小于 2000 万，满足 1-4 的实缴资本要求。",
    };
  }
  return {
    status: "success",
    matched: false,
    companyName: `${supplier.name}制造有限公司`,
    paidCapital: 1200,
    queryAt,
    summary: "工商实缴资本小于 2000 万，无法满足 1-4 的实缴资本要求。",
  };
}

function validateCondition(code) {
  const messages = [];

  if (code === "1-1") {
    if (!state.files[fileStateKey("1-1", "thirdPartyReport")]) {
      messages.push("请上传三方验厂报告");
    }
    const reportDate = state.dateFields[dateStateKey("1-1", "reportDate")];
    const validUntil = state.dateFields[dateStateKey("1-1", "validUntil")];
    if (!reportDate) messages.push("请填写报告日期");
    if (!validUntil) messages.push("请填写有效期");
    if (reportDate && validUntil && validUntil < reportDate) {
      messages.push("有效期不能早于报告日期");
    }
    if (validUntil && validUntil < todayDate) {
      messages.push("有效期需不早于今天");
    }
  }

  if (code === "1-2") {
    const result = state.queryResults["1-2"];
    if (!result || result.status === "loading") {
      messages.push("主板上市信息查询未完成");
    } else if (!result.matched) {
      messages.push("API 未查询到主板上市信息");
    }
  }

  if (code === "1-3") {
    if (!state.files[fileStateKey("1-3", "invoice")]) {
      messages.push("请上传发票");
    }
    if (!state.files[fileStateKey("1-3", "businessAgreement")]) {
      messages.push("请上传商务协议");
    }
  }

  if (code === "1-4") {
    const result = state.queryResults["1-4"];
    if (!result || result.status === "loading") {
      messages.push("工商实缴资本查询未完成");
    } else {
      if (Number(result.paidCapital) < 2000) {
        messages.push("工商实缴资本需不小于 2000 万元 RMB");
      }
    }
    if (!state.files[fileStateKey("1-4", "businessAgreement")]) {
      messages.push("请上传商务协议");
    }
    const accountDays = Number(state.accountDays["1-4"] || 0);
    if (!state.accountDays["1-4"]) {
      messages.push("请填写账期");
    } else if (accountDays < 60) {
      messages.push("账期需不低于月结 60 天");
    }
  }

  return {
    valid: messages.length === 0,
    messages,
  };
}

function getConditionStatus(code) {
  if (apiCodes.has(code)) {
    const result = state.queryResults[code];
    if (!result || result.status === "loading") {
      return { text: "查询中", className: "warning" };
    }
  }

  const validation = validateCondition(code);
  if (validation.valid) {
    return { text: "已达标", className: "success" };
  }

  if (hasApiFailure(code) || state.touched) {
    return { text: "未达标", className: "danger" };
  }

  return { text: "待补充", className: "warning" };
}

function hasApiFailure(code) {
  const result = state.queryResults[code];
  return apiCodes.has(code) && result && result.status === "success" && !result.matched;
}

function confirmApply() {
  if (state.inspectionType === "onsite") {
    if (!onsiteExpectedDate.value) {
      setModalStatus("请填写期望验厂时间。", "error");
      return;
    }
    markApplication("onsite", []);
    closeModal();
    showToast("已提交普通验厂申请，流程进入待验厂。");
    return;
  }

  state.touched = true;
  const selected = orderedCodes.filter((code) => state.selectedConditions.has(code));
  renderConditionPicker();
  renderConditionSections();

  if (!selected.length) {
    setModalStatus("请选择至少一个免验厂条件。", "error");
    return;
  }

  const invalid = selected
    .map((code) => ({ code, validation: validateCondition(code) }))
    .filter((item) => !item.validation.valid);

  if (invalid.length) {
    const message = invalid
      .map((item) => `${item.code}：${item.validation.messages.join("、")}`)
      .join("；");
    setModalStatus(`校验未通过，无法确定申请验厂。${message}`, "error");
    return;
  }

  markApplication("exempt", selected);
  closeModal();
  showToast(`已提交免验厂申请，命中条件 ${selected.join("、")}，流程进入待审核。`);
}

function renderModalStatus() {
  if (state.inspectionType === "onsite") {
    if (onsiteExpectedDate.value) {
      setModalStatus("当前为普通验厂申请，可确定进入待验厂流程。", "success");
      return;
    }
    setModalStatus("当前为普通验厂申请，请填写期望验厂时间。", "info");
    return;
  }

  const selected = orderedCodes.filter((code) => state.selectedConditions.has(code));
  if (!selected.length) {
    setModalStatus("请选择至少一个免验厂条件；系统会按所选条件展示材料或 API 查询结果。", "info");
    return;
  }

  const invalid = selected
    .map((code) => ({ code, validation: validateCondition(code) }))
    .filter((item) => !item.validation.valid);
  if (state.touched && invalid.length) {
    const message = invalid
      .map((item) => `${item.code}：${item.validation.messages.join("、")}`)
      .join("；");
    setModalStatus(`校验未通过，无法确定申请验厂。${message}`, "error");
    return;
  }

  const loading = selected.some((code) => {
    const result = state.queryResults[code];
    return apiCodes.has(code) && (!result || result.status === "loading");
  });
  if (loading) {
    setModalStatus("已选择免验条件，正在回填 API 查询结果。", "info");
    return;
  }

  const allValid = selected.every((code) => validateCondition(code).valid);
  if (allValid) {
    setModalStatus("已选免验条件均达标，可确定提交并进入待审核。", "success");
    return;
  }

  setModalStatus("已选择免验条件，请补齐材料或调整未达标查询项。", "info");
}

function setModalStatus(message, type) {
  modalStatus.classList.toggle("error", type === "error");
  modalStatus.classList.toggle("success", type === "success");
  modalStatus.querySelector("span:last-child").textContent = message;
}

function markApplication(type, codes) {
  const row = document.querySelector(`tr[data-supplier-id="${state.supplierId}"]`);
  const statusCell = row.querySelector("[data-status-cell]");
  const remarkCell = row.querySelector("[data-remark-cell]");
  if (type === "onsite") {
    suppliers[state.supplierId].inspectionStatus = "普通验厂 · 待验厂";
    statusCell.innerHTML = '<span class="status-pill warning">普通验厂 · 待验厂</span>';
    const remark = onsiteRemark.value.trim();
    remarkCell.textContent = `期望验厂：${onsiteExpectedDate.value}${remark ? `；${remark}` : ""}`;
    return;
  }

  suppliers[state.supplierId].inspectionStatus = "免验厂 · 待审核";
  statusCell.innerHTML = '<span class="status-pill success">免验厂 · 待审核</span>';
  remarkCell.innerHTML = `<span class="chip">${codes.join("、")}</span>`;
}

function openDrawer(supplierId) {
  const supplier = suppliers[supplierId];
  drawerSubtitle.textContent = `${supplier.id} / ${supplier.name}`;
  drawerBody.innerHTML = `
    <div class="detail-list">
      <div class="detail-item"><span>供应商ID</span><strong>${supplier.id}</strong></div>
      <div class="detail-item"><span>供应商名称</span><strong>${supplier.name}</strong></div>
      <div class="detail-item"><span>供应商状态</span><strong>${supplier.status}</strong></div>
      <div class="detail-item"><span>验厂状态</span><strong>${supplier.inspectionStatus}</strong></div>
      <div class="detail-item"><span>供应商类型</span><strong>${supplier.type}</strong></div>
      <div class="detail-item"><span>绑定时间</span><strong>${supplier.boundAt}</strong></div>
    </div>
  `;
  detailDrawer.classList.add("is-open");
  detailDrawer.setAttribute("aria-hidden", "false");
}

function closeDrawer() {
  detailDrawer.classList.remove("is-open");
  detailDrawer.setAttribute("aria-hidden", "true");
}

function closeOperationMenus(except) {
  document.querySelectorAll(".operation").forEach((operation) => {
    if (operation === except) return;
    operation.classList.remove("is-open");
    operation.querySelector(".operation-menu").setAttribute("aria-hidden", "true");
  });
}

function toggleConditionPanel() {
  const root = conditionTrigger.closest("[data-select-root]");
  const willOpen = !root.classList.contains("is-open");
  root.classList.toggle("is-open", willOpen);
  conditionTrigger.setAttribute("aria-expanded", String(willOpen));
  conditionPanel.setAttribute("aria-hidden", String(!willOpen));
}

function closeConditionPanel() {
  const root = conditionTrigger.closest("[data-select-root]");
  root.classList.remove("is-open");
  conditionTrigger.setAttribute("aria-expanded", "false");
  conditionPanel.setAttribute("aria-hidden", "true");
}

function fileStateKey(code, key) {
  return `${code}:${key}`;
}

function dateStateKey(code, field) {
  return `${code}:${field}`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-open");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("is-open");
  }, 2600);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

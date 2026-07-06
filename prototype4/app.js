const suppliers = {
  SUP26062271172: {
    id: "SUP26062271172",
    name: "测试12332",
    status: "准入",
    inspectionStatus: "无验厂记录",
    owner: "黄超群",
  },
  SUP26070271177: {
    id: "SUP26070271177",
    name: "材料测试0702",
    status: "准入",
    inspectionStatus: "审核通过",
    owner: "杨鹏",
  },
};

const conditionMeta = {
  "1-1": {
    title: "有效期内三方验厂通过",
    desc: "上传三方验厂报告，并填写报告日期和有效期。",
  },
  "1-2": {
    title: "主板上市公司",
    desc: "人工补充主板上市证明材料，由审核人员人工确认。",
  },
  "1-3": {
    title: "标杆大卖背书",
    desc: "上传发票和商务协议。",
  },
  "1-4": {
    title: "工商实缴及账期达标",
    desc: "人工补充工商实缴资本证明、商务协议，账期由系统自动抓取。",
  },
};

const orderedCodes = ["1-1", "1-2", "1-3", "1-4"];
const autoPaymentTerm = "香港星商-CNY-银行转账-(优备对公)月结90天";
const todayDate = new Date().toISOString().slice(0, 10);

const state = {
  supplierId: "",
  inspectionType: "onsite",
  selectedConditions: new Set(),
  files: {},
  dateFields: {},
  touched: false,
};

const modal = document.getElementById("inspectionModal");
const modalSupplier = document.getElementById("modalSupplier");
const onsiteSection = document.getElementById("onsiteSection");
const onsiteExpectedDate = document.getElementById("onsiteExpectedDate");
const onsiteInputs = onsiteSection.querySelectorAll("input");
const onsiteRemark = document.getElementById("onsiteRemark");
const onsiteRemarkCount = document.getElementById("onsiteRemarkCount");
const exemptSection = document.getElementById("exemptSection");
const conditionTrigger = document.getElementById("conditionTrigger");
const conditionTriggerText = document.getElementById("conditionTriggerText");
const conditionPanel = document.getElementById("conditionPanel");
const conditionChips = document.getElementById("conditionChips");
const conditionSections = document.getElementById("conditionSections");
const modalStatus = document.getElementById("modalStatus");
const toast = document.getElementById("toast");

document.addEventListener("click", (event) => {
  const rowAction = event.target.closest("[data-action]");
  if (rowAction) {
    const row = rowAction.closest("tr[data-supplier-id]");
    handleRowAction(rowAction.dataset.action, row.dataset.supplierId);
    return;
  }

  if (event.target === conditionTrigger || event.target.closest("#conditionTrigger")) {
    toggleConditionPanel();
    return;
  }

  if (!event.target.closest("[data-select-root]")) {
    closeConditionPanel();
  }

  const stepperButton = event.target.closest("[data-stepper-action]");
  if (stepperButton) {
    updateNumberStepper(stepperButton);
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

  const dateInput = event.target.closest("[data-date-code]");
  if (!dateInput) return;
  state.dateFields[dateStateKey(dateInput.dataset.dateCode, dateInput.dataset.dateField)] =
    dateInput.value;
  renderModalStatus();
});

document.getElementById("closeModal").addEventListener("click", closeModal);
document.getElementById("cancelModal").addEventListener("click", closeModal);
document.getElementById("confirmApply").addEventListener("click", confirmApply);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) {
    closeModal();
  }
});

function handleRowAction(action, supplierId) {
  if (action === "apply-inspection") {
    openModal(supplierId);
    return;
  }

  const actionText = {
    detail: "查看详情",
    edit: "编辑资料",
    log: "操作记录",
    withdraw: "撤回审核",
  }[action];

  showToast(`${actionText || "操作"} 为列表原型占位动作。`);
}

function openModal(supplierId) {
  const supplier = suppliers[supplierId];
  state.supplierId = supplierId;
  state.inspectionType = "onsite";
  state.selectedConditions = new Set();
  state.files = {};
  state.dateFields = {};
  state.touched = false;

  modalSupplier.textContent = `${supplier.id} / ${supplier.name}`;
  document.querySelector('input[name="inspectionType"][value="onsite"]').checked = true;
  document.querySelector('input[name="inspectionType"][value="exempt"]').checked = false;
  conditionPanel.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
    checkbox.checked = false;
  });
  onsiteInputs.forEach((input) => {
    input.value = input.defaultValue;
  });
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
      '<div class="empty-state">选择免验条件后，这里会展示对应人工补充材料、日期填写或系统抓取信息。</div>';
    return;
  }

  conditionSections.innerHTML = selected.map((code) => renderConditionCard(code)).join("");
}

function renderConditionCard(code) {
  const meta = conditionMeta[code];
  const status = getConditionStatus(code);
  const errors = validateCondition(code).messages;
  const showErrors = state.touched;
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
      <div class="form-grid">
        ${renderUpload(
          "1-2",
          "listedProof",
          "上市证明材料",
          "人工补充主板上市证明材料、证券交易所公告、股票代码截图等",
          { full: true },
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
    <div class="form-grid">
      ${renderUpload("1-4", "paidCapitalProof", "实缴资本证明", "人工补充工商实缴资本证明、验资报告等")}
      ${renderUpload("1-4", "businessAgreement", "商务协议", "可证明账期的协议材料")}
      ${renderAutoFetchedField("账期", autoPaymentTerm)}
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

function renderAutoFetchedField(label, value) {
  return `
    <div class="form-field">
      <span class="form-caption">
        ${escapeHtml(label)}
        <em class="optional-mark">系统自动抓取</em>
      </span>
      <input
        id="auto-payment-term"
        type="text"
        readonly
        value="${escapeHtml(value)}"
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

  if (code === "1-2" && !state.files[fileStateKey("1-2", "listedProof")]) {
    messages.push("请上传上市证明材料");
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
    if (!state.files[fileStateKey("1-4", "paidCapitalProof")]) {
      messages.push("请上传实缴资本证明");
    }
    if (!state.files[fileStateKey("1-4", "businessAgreement")]) {
      messages.push("请上传商务协议");
    }
  }

  return {
    valid: messages.length === 0,
    messages,
  };
}

function getConditionStatus(code) {
  const validation = validateCondition(code);
  if (validation.valid) {
    return { text: "已达标", className: "success" };
  }

  if (state.touched) {
    return { text: "未达标", className: "danger" };
  }

  return { text: "待补充", className: "warning" };
}

function updateNumberStepper(button) {
  const input = button.parentElement.querySelector("input[type='number']");
  if (!input) return;

  const step = Number(input.step || 1);
  const min = input.min === "" ? Number.NEGATIVE_INFINITY : Number(input.min);
  const current = input.value === "" ? 0 : Number(input.value);
  const direction = button.dataset.stepperAction === "increment" ? 1 : -1;
  const nextValue = Math.max(min, current + direction * step);
  input.value = String(nextValue);
  input.dispatchEvent(new Event("input", { bubbles: true }));
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
    setModalStatus("请选择至少一个免验厂条件；系统会按所选条件展示人工补材要求。", "info");
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

  const allValid = selected.every((code) => validateCondition(code).valid);
  if (allValid) {
    setModalStatus("已选免验条件均达标，可确定提交并进入待审核。", "success");
    return;
  }

  setModalStatus("已选择免验条件，请补齐人工补充材料。", "info");
}

function setModalStatus(message, type) {
  modalStatus.classList.toggle("error", type === "error");
  modalStatus.classList.toggle("success", type === "success");
  modalStatus.querySelector("span:last-child").textContent = message;
}

function markApplication(type, codes) {
  const row = document.querySelector(`tr[data-supplier-id="${state.supplierId}"]`);
  const auditCell = row.querySelector("[data-audit-cell]");
  const supplier = suppliers[state.supplierId];

  if (type === "onsite") {
    supplier.inspectionStatus = "普通验厂 · 待验厂";
    const remark = onsiteRemark.value.trim();
    auditCell.innerHTML = `
      <div class="info-stack compact-stack">
        <span>验厂审核：<b class="orange">普通验厂 · 待验厂</b></span>
        <span>期望验厂：${escapeHtml(onsiteExpectedDate.value)}</span>
        ${remark ? `<span>备注：${escapeHtml(remark)}</span>` : ""}
      </div>
    `;
    return;
  }

  supplier.inspectionStatus = "免验厂 · 待审核";
  auditCell.innerHTML = `
    <div class="info-stack compact-stack">
      <span>验厂审核：<b class="teal">免验厂 · 待审核</b></span>
      <span>命中条件：${codes.map(escapeHtml).join("、")}</span>
      <span>供应商生效审核：待人工审核</span>
    </div>
  `;
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

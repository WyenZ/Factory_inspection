const conditionLabels = {
  third: { text: "三方验厂", className: "third" },
  listed: { text: "上市公司", className: "listed" },
  seller: { text: "大卖背书", className: "seller" },
  capital: { text: "实缴资本", className: "capital" },
};

const evidenceMap = {
  third: {
    title: "三方验厂",
    type: "上传资料",
    fields: [
      [
        "三方验厂报告",
        {
          fileName: "FCCA_2026_03_01.pdf",
          fileType: "PDF",
          fileSize: "2.4 MB",
          fileNo: "TPR-20260301-094",
        },
      ],
      ["报告日期", "2026-03-01"],
      ["有效期", "2027-03-01"],
      ["审核口径", "有效期内知名第三方关于生产与品质控制的验厂通过企业"],
    ],
  },
  listed: {
    title: "上市公司",
    type: "上传资料",
    fields: [
      [
        "上市证明材料",
        {
          fileName: "listed_company_proof.pdf",
          fileType: "PDF",
          fileSize: "1.1 MB",
          fileNo: "LISTED-PROOF-20260304",
          desc: "人工补充主板上市证明材料、证券交易所公告、股票代码截图等",
        },
      ],
      ["审核口径", "人工补充上市公司证明材料，由审核人员人工确认"],
    ],
  },
  seller: {
    title: "大卖背书",
    type: "上传资料",
    fields: [
      [
        "发票",
        {
          fileName: "近6个月发票汇总.zip",
          fileType: "ZIP",
          fileSize: "8.6 MB",
          fileNo: "INV-20260303-084",
        },
      ],
      [
        "商务协议",
        {
          fileName: "benchmark_seller_agreement.pdf",
          fileType: "PDF",
          fileSize: "1.8 MB",
          fileNo: "AGR-20260303-084",
        },
      ],
      ["标杆大卖", "Anker / SHEIN"],
      ["近6个月销售额", "186.4 万元"],
    ],
  },
  capital: {
    title: "实缴资本",
    type: "上传资料",
    fields: [
      [
        "实缴资本证明",
        {
          fileName: "paid_capital_proof.pdf",
          fileType: "PDF",
          fileSize: "1.3 MB",
          fileNo: "CAPITAL-PROOF-20260303",
          desc: "人工补充工商实缴资本证明、验资报告等",
        },
      ],
      [
        "商务协议",
        {
          fileName: "payment_terms_agreement.pdf",
          fileType: "PDF",
          fileSize: "1.8 MB",
          fileNo: "PAYMENT-TERMS-20260303",
          desc: "可证明账期的协议材料",
        },
      ],
      ["账期", "香港星商-CNY-银行转账-(优备对公)月结90天"],
    ],
  },
};

const rows = [
  {
    supplierId: "SUP26030471094",
    supplierName: "线下255",
    conditions: ["third"],
    projectLevel: "B级",
    projectNo: "B20220714K9CG",
    product: "HY0044",
    applicant: "吴良\n星美四部",
    applyDate: "2026-03-05",
    expectDate: "2026-03-24",
  },
  {
    supplierId: "SUP26030471088",
    supplierName: "古*****",
    conditions: ["listed"],
    projectLevel: "B级",
    projectNo: "B20220714K9CG",
    product: "HY0044",
    applicant: "吴良",
    applyDate: "2026-03-04",
    expectDate: "2026-03-06",
  },
  {
    supplierId: "SUP26030371084",
    supplierName: "3*******",
    conditions: ["seller"],
    projectLevel: "默认值/未设置",
    projectNo: "B20201013T9P8",
    product: "园林工具套装",
    applicant: "吴良",
    applyDate: "2026-03-03",
    expectDate: "2026-03-31",
  },
  {
    supplierId: "SUP26030371081",
    supplierName: "王******",
    conditions: ["capital"],
    projectLevel: "B级",
    projectNo: "B202211080JY8",
    product: "交叉绑带短上衣（美）",
    applicant: "吴良",
    applyDate: "2026-03-03",
    expectDate: "2026-03-31",
  },
  {
    supplierId: "SUP26030371083",
    supplierName: "2-王******",
    conditions: ["listed", "capital"],
    projectLevel: "默认值/未设置",
    projectNo: "B2020101310HJ",
    product: "意大利绒毛绒毛巾绣圣诞鹿抱枕壳子一对",
    applicant: "吴良",
    applyDate: "2026-03-03",
    expectDate: "2026-03-31",
  },
  {
    supplierId: "SUP26030271078",
    supplierName: "C**********-7",
    conditions: [],
    projectLevel: "默认值/未设置",
    projectNo: "B20201209U9R0",
    product: "不锈钢西餐刀叉套装",
    applicant: "吴良",
    applyDate: "2026-03-02",
    expectDate: "2026-03-18",
  },
  {
    supplierId: "SUP26030271076",
    supplierName: "M*******",
    conditions: [],
    projectLevel: "B级",
    projectNo: "B20211120K2M3",
    product: "厨房收纳套装",
    applicant: "吴良",
    applyDate: "2026-03-02",
    expectDate: "2026-03-16",
  },
];

rows.forEach((row) => {
  row.stage = "processing";
  row.isExempt = row.conditions.length > 0;
});

const stageLabels = {
  agreement: "待协议确认",
  processing: "待处理",
  inspection: "待验厂",
  review: "待审核",
  passed: "通过",
  failed: "不通过",
  rejected: "驳回",
  all: "全部",
};

let activeRow = null;
let activeAuditRow = null;
let currentStage = "processing";
let currentInspectionType = "all";

const tableHead = document.getElementById("tableHead");
const tableBody = document.getElementById("tableBody");
const statusTabs = document.getElementById("statusTabs");
const inspectionTypeFilter = document.getElementById("inspectionTypeFilter");
const resetFilters = document.getElementById("resetFilters");
const modal = document.getElementById("assignModal");
const auditModal = document.getElementById("auditModal");
const modalSupplier = document.getElementById("modalSupplier");
const regularFields = document.getElementById("regularFields");
const collapsedNote = document.getElementById("collapsedNote");
const exemptionSection = document.getElementById("exemptionSection");
const exemptionContent = document.getElementById("exemptionContent");
const toast = document.getElementById("toast");
let filePreview = null;

renderRows();

tableBody.addEventListener("click", (event) => {
  const fileLink = event.target.closest("[data-file-preview]");
  if (fileLink) {
    event.preventDefault();
    openFilePreview(fileLink.dataset.filePreview);
    return;
  }

  const assignButton = event.target.closest("[data-assign]");
  if (assignButton) {
    const row = rows.find((item) => item.supplierId === assignButton.dataset.assign);
    openAssignModal(row);
    return;
  }

  const auditButton = event.target.closest("[data-audit]");
  if (auditButton) {
    const row = rows.find((item) => item.supplierId === auditButton.dataset.audit);
    openAuditModal(row);
  }
});

statusTabs.addEventListener("click", (event) => {
  const stageButton = event.target.closest("[data-stage]");
  if (!stageButton) return;
  currentStage = stageButton.dataset.stage;
  renderRows();
});

inspectionTypeFilter.addEventListener("change", () => {
  currentInspectionType = inspectionTypeFilter.value;
  renderRows();
});

resetFilters.addEventListener("click", () => {
  currentInspectionType = "all";
  inspectionTypeFilter.value = "all";
  renderRows();
});

modal.addEventListener("change", (event) => {
  const input = event.target.closest('input[name="useExemption"]');
  if (!input) return;
  renderAssignMode(input.value === "yes");
});

modal.addEventListener("click", (event) => {
  const fileLink = event.target.closest("[data-file-preview]");
  if (!fileLink) return;
  event.preventDefault();
  openFilePreview(fileLink.dataset.filePreview);
});

document.getElementById("closeModal").addEventListener("click", closeModal);
document.getElementById("cancelModal").addEventListener("click", closeModal);
document.getElementById("confirmModal").addEventListener("click", () => {
  const useExemption = document.querySelector('input[name="useExemption"]:checked').value === "yes";
  if (useExemption && activeRow) {
    moveExemptionToReview(activeRow);
  } else if (activeRow) {
    activeRow.stage = "inspection";
    currentStage = "inspection";
    renderRows();
  }
  closeModal();
  showToast(useExemption ? "已按免验厂资料提交至待审核" : "已按普通验厂分配人员");
});
document.getElementById("closeAuditModal").addEventListener("click", closeAuditModal);
document.getElementById("cancelAuditModal").addEventListener("click", closeAuditModal);
document.getElementById("confirmAuditModal").addEventListener("click", () => {
  if (activeAuditRow) {
    activeAuditRow.stage = "passed";
    currentStage = "passed";
    renderRows();
  }
  closeAuditModal();
  showToast("审核已提交，记录流转至通过");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
    closeAuditModal();
  }
});

function renderRows() {
  renderStatusTabs();
  renderTableHead();

  const stageRows =
    currentStage === "all" ? rows : rows.filter((row) => row.stage === currentStage);
  const visibleRows = stageRows.filter(matchesInspectionType);

  tableBody.innerHTML = visibleRows
    .map(
      (row) =>
        currentStage === "review"
          ? renderReviewRow(row)
          : renderProcessingRow(row),
    )
    .join("");

  if (!visibleRows.length) {
    tableBody.innerHTML = `<tr><td class="empty-row" colspan="${currentStage === "review" ? 14 : 8}">暂无${stageLabels[currentStage]}数据</td></tr>`;
  }
}

function renderStatusTabs() {
  statusTabs.querySelectorAll("[data-stage]").forEach((button) => {
    const stage = button.dataset.stage;
    const baseCount = {
      agreement: 59,
      processing: 28,
      inspection: 5,
      review: 6,
      passed: 1792,
      failed: 475,
      rejected: 472,
      all: 2961,
    }[stage];
    const movedCount = rows.filter((row) => row.stage === stage).length;
    const count = stage === "all" ? baseCount : Math.max(baseCount, movedCount);
    button.textContent = `${stageLabels[stage]}(${count})`;
    button.classList.toggle("active", stage === currentStage);
  });
}

function renderTableHead() {
  if (currentStage === "review") {
    tableHead.innerHTML = `
      <tr>
        <th class="check"><input type="checkbox" /></th>
        <th>供应商</th>
        <th>项目</th>
        <th>申请人</th>
        <th>验厂申请时间</th>
        <th>期望验厂时间</th>
        <th>确认验厂时间</th>
        <th>验厂人员</th>
        <th>实际验厂时间</th>
        <th>验厂分数</th>
        <th>验厂报告</th>
        <th>不合格项</th>
        <th>备注</th>
        <th>操作</th>
      </tr>
    `;
    return;
  }

  tableHead.innerHTML = `
    <tr>
      <th class="check"><input type="checkbox" /></th>
      <th>供应商</th>
      <th>项目</th>
      <th>申请人</th>
      <th>验厂申请时间</th>
      <th>期望验厂时间</th>
      <th>备注</th>
      <th>操作</th>
    </tr>
  `;
}

function renderProcessingRow(row) {
  return `
    <tr>
      <td class="check"><input type="checkbox" /></td>
      <td>${renderSupplier(row)}</td>
      <td>${renderProject(row)}</td>
      <td>${escapeHtml(row.applicant).replaceAll("\n", "<br />")}</td>
      <td>${escapeHtml(row.applyDate)}</td>
      <td>${escapeHtml(row.expectDate)}</td>
      <td><span class="remark">添加备注</span></td>
      <td>${renderNormalActions(row)}</td>
    </tr>
  `;
}

function renderReviewRow(row) {
  return `
    <tr>
      <td class="check"><input type="checkbox" /></td>
      <td>${renderSupplier(row)}</td>
      <td>${renderProject(row)}</td>
      <td>${escapeHtml(row.applicant).replaceAll("\n", "<br />")}</td>
      <td>${escapeHtml(row.applyDate)}</td>
      <td>${escapeHtml(row.expectDate)}</td>
      <td>${escapeHtml(row.confirmDate || row.applyDate)}</td>
      <td>${escapeHtml(row.inspector || "")}</td>
      <td>${escapeHtml(row.actualDate || row.confirmDate || row.applyDate)}</td>
      <td>${escapeHtml(row.score || "")}</td>
      <td>${renderReportFiles(row)}</td>
      <td>${row.isExempt ? "" : "-"}</td>
      <td><span class="remark">添加备注</span></td>
      <td>${renderReviewActions(row)}</td>
    </tr>
  `;
}

function renderProject(row) {
  return `
    <div class="project">
      <span class="level">${escapeHtml(row.projectLevel)}</span>
      <span>${escapeHtml(row.projectNo)}</span>
      <span>${escapeHtml(row.product)}</span>
    </div>
  `;
}

function renderNormalActions(row) {
  return `
    <div class="actions">
      <button class="assign" type="button" data-assign="${escapeHtml(row.supplierId)}">分配</button>
      <button class="reject" type="button">驳回</button>
      <button class="note" type="button">备注</button>
      <button class="log" type="button">日志</button>
    </div>
  `;
}

function renderReviewActions(row) {
  return `
    <div class="actions">
      <button class="assign" type="button" data-audit="${escapeHtml(row.supplierId)}">审核</button>
      <button class="note" type="button">备注</button>
      <button class="log" type="button">日志</button>
    </div>
  `;
}

function renderSupplier(row) {
  const tags = `<div class="tag-row">
    ${renderInspectionTypeTag(row)}
    ${row.isExempt ? row.conditions.map((condition) => renderTag(condition)).join("") : ""}
  </div>`;

  return `
    <div class="supplier-cell">
      <div class="supplier-id">${escapeHtml(row.supplierId)}　▣</div>
      <div class="supplier-sub">⊙ ${escapeHtml(row.supplierName)}　▣</div>
      ${tags}
    </div>
  `;
}

function matchesInspectionType(row) {
  if (currentInspectionType === "regular") return !row.isExempt;
  if (currentInspectionType === "exempt") return row.isExempt;
  return true;
}

function renderInspectionTypeTag(row) {
  const label = row.isExempt ? "免验厂" : "普通验厂";
  if (row.isExempt) return `<span class="tag exempt">${label}</span>`;
  return `<span class="tag regular">${label}</span>`;
}

function renderTag(condition) {
  const item = conditionLabels[condition];
  return `<span class="tag ${item.className}">${item.text}</span>`;
}

function moveExemptionToReview(row) {
  row.stage = "review";
  row.isExempt = true;
  row.confirmDate = row.applyDate;
  row.actualDate = row.applyDate;
  row.inspector = "免验厂";
  row.score = "100";
  row.reportFiles = collectEvidenceFiles(row);
  currentStage = "review";
  renderRows();
}

function collectEvidenceFiles(row) {
  return row.conditions
    .flatMap((condition) => evidenceMap[condition].fields.map(([, value]) => value))
    .filter((value) => value && typeof value === "object")
    .map((file) => ({
      ...file,
      fileName: file.fileName || String(file),
      fileType: file.fileType || "FILE",
      fileSize: file.fileSize || "-",
      fileNo: file.fileNo || "-",
    }));
}

function renderReportFiles(row) {
  const files = row.reportFiles && row.reportFiles.length ? row.reportFiles : collectEvidenceFiles(row);
  if (!files.length) return '<span class="muted-text">相关证明文件</span>';
  return `
    <div class="report-list">
      ${files
        .map((file) => {
          const payload = encodeURIComponent(JSON.stringify(file));
          return `<a href="#" data-file-preview="${payload}">${escapeHtml(file.fileName)}</a>`;
        })
        .join("")}
    </div>
  `;
}

function openAssignModal(row) {
  activeRow = row;
  modalSupplier.innerHTML = `
    <strong>${escapeHtml(row.supplierId)}</strong>
    <span> / ${escapeHtml(row.supplierName)}</span>
    ${renderInspectionTypeTag(row)}
    ${row.isExempt ? row.conditions.map((condition) => renderTag(condition)).join("") : ""}
  `;
  document.querySelector('input[name="useExemption"][value="no"]').checked = true;
  document.querySelector('input[name="useExemption"][value="yes"]').checked = false;
  renderAssignMode(false);
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function openAuditModal(row) {
  activeAuditRow = row;
  auditModal.classList.add("open");
  auditModal.setAttribute("aria-hidden", "false");
}

function renderAssignMode(useExemption) {
  regularFields.classList.toggle("collapsed", useExemption);
  collapsedNote.classList.toggle("is-hidden", !useExemption);
  exemptionSection.classList.toggle("is-hidden", !useExemption);

  if (!useExemption) return;

  if (!activeRow.conditions.length) {
    exemptionContent.innerHTML = `
      <div class="evidence-card">
        <h3>暂无免验厂资料 <span class="tag">普通验厂</span></h3>
        <div class="evidence-grid">
          <div><span>处理建议：</span>切回“否”，继续选择验厂时间和验厂人员。</div>
        </div>
      </div>
    `;
    return;
  }

  exemptionContent.innerHTML = activeRow.conditions
    .map((condition) => renderEvidenceCard(evidenceMap[condition], condition))
    .join("");
}

function renderEvidenceCard(evidence, condition) {
  return `
    <article class="evidence-card">
      <h3>
        ${escapeHtml(evidence.title)}
        ${renderTag(condition)}
      </h3>
      <div class="evidence-grid">
        ${evidence.fields
          .map(
            ([label, value]) =>
              `<div><span>${escapeHtml(label)}：</span>${renderEvidenceValue(value)}</div>`,
          )
          .join("")}
      </div>
    </article>
  `;
}

function renderEvidenceValue(value) {
  if (!value || typeof value !== "object") return escapeHtml(value);
  const payload = encodeURIComponent(JSON.stringify(value));
  return `
    <a class="file-link evidence-file" href="#" data-file-preview="${payload}">
      <span class="file-link-name">${escapeHtml(value.fileName)}</span>
      ${value.desc ? `<span class="file-link-desc">${escapeHtml(value.desc)}</span>` : ""}
    </a>
  `;
}

function openFilePreview(encodedFile) {
  const file = JSON.parse(decodeURIComponent(encodedFile));
  if (!filePreview) {
    filePreview = document.createElement("div");
    filePreview.className = "file-preview";
    document.body.appendChild(filePreview);
  }
  filePreview.innerHTML = `
    <div class="file-preview-card" role="dialog" aria-modal="true" aria-label="证明文件预览">
      <header>
        <h2>证明文件预览</h2>
        <button type="button" data-close-preview aria-label="关闭">×</button>
      </header>
      <div class="file-preview-body">
        <div class="file-icon">${escapeHtml(file.fileType)}</div>
        <div class="file-meta">
          <strong>${escapeHtml(file.fileName)}</strong>
          <span>文件编号：${escapeHtml(file.fileNo)}</span>
          <span>文件大小：${escapeHtml(file.fileSize)}</span>
          <span>当前为原型预览，真实系统中点击后打开或下载附件。</span>
        </div>
      </div>
      <footer>
        <button type="button" data-close-preview>关闭</button>
      </footer>
    </div>
  `;
  filePreview.classList.add("open");
  filePreview.querySelectorAll("[data-close-preview]").forEach((button) => {
    button.addEventListener("click", closeFilePreview);
  });
}

function closeFilePreview() {
  if (!filePreview) return;
  filePreview.classList.remove("open");
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  closeFilePreview();
}

function closeAuditModal() {
  auditModal.classList.remove("open");
  auditModal.setAttribute("aria-hidden", "true");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

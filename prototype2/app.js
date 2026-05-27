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
      ["三方验厂报告", "FCCA_2026_03_01.pdf"],
      ["报告日期", "2026-03-01"],
      ["有效期", "2027-03-01"],
      ["审核口径", "有效期内知名第三方关于生产与品质控制的验厂通过企业"],
    ],
  },
  listed: {
    title: "上市公司",
    type: "API 查询",
    fields: [
      ["查询主体", "广东星海智能制造股份有限公司"],
      ["上市板块", "深交所主板"],
      ["股票代码", "002681"],
      ["查询时间", "2026-03-05 10:21:36"],
    ],
  },
  seller: {
    title: "大卖背书",
    type: "上传资料",
    fields: [
      ["发票", "近6个月发票汇总.zip"],
      ["商务协议", "benchmark_seller_agreement.pdf"],
      ["标杆大卖", "Anker / SHEIN"],
      ["近6个月销售额", "186.4 万元"],
    ],
  },
  capital: {
    title: "实缴资本",
    type: "API + 手填",
    fields: [
      ["查询主体", "深圳市拓海家居用品有限公司"],
      ["工商实缴资本", "2600 万元 RMB"],
      ["商务协议", "payment_terms_agreement.pdf"],
      ["账期", "月结 90 天"],
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

let activeRow = null;

const tableBody = document.getElementById("tableBody");
const modal = document.getElementById("assignModal");
const modalSupplier = document.getElementById("modalSupplier");
const regularFields = document.getElementById("regularFields");
const collapsedNote = document.getElementById("collapsedNote");
const exemptionSection = document.getElementById("exemptionSection");
const exemptionContent = document.getElementById("exemptionContent");
const toast = document.getElementById("toast");

renderRows();

tableBody.addEventListener("click", (event) => {
  const assignButton = event.target.closest("[data-assign]");
  if (!assignButton) return;
  const row = rows.find((item) => item.supplierId === assignButton.dataset.assign);
  openAssignModal(row);
});

modal.addEventListener("change", (event) => {
  const input = event.target.closest('input[name="useExemption"]');
  if (!input) return;
  renderAssignMode(input.value === "yes");
});

document.getElementById("closeModal").addEventListener("click", closeModal);
document.getElementById("cancelModal").addEventListener("click", closeModal);
document.getElementById("confirmModal").addEventListener("click", () => {
  const useExemption = document.querySelector('input[name="useExemption"]:checked').value === "yes";
  closeModal();
  showToast(useExemption ? "已按免验厂资料提交至待审核" : "已按普通验厂分配人员");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

function renderRows() {
  tableBody.innerHTML = rows
    .map(
      (row) => `
        <tr>
          <td class="check"><input type="checkbox" /></td>
          <td>${renderSupplier(row)}</td>
          <td>
            <div class="project">
              <span class="level">${escapeHtml(row.projectLevel)}</span>
              <span>${escapeHtml(row.projectNo)}</span>
              <span>${escapeHtml(row.product)}</span>
            </div>
          </td>
          <td>${escapeHtml(row.applicant).replaceAll("\n", "<br />")}</td>
          <td>${escapeHtml(row.applyDate)}</td>
          <td>${escapeHtml(row.expectDate)}</td>
          <td><span class="remark">添加备注</span></td>
          <td>
            <div class="actions">
              <button class="assign" type="button" data-assign="${escapeHtml(row.supplierId)}">分配</button>
              <button class="reject" type="button">驳回</button>
              <button class="note" type="button">备注</button>
              <button class="log" type="button">日志</button>
            </div>
          </td>
        </tr>
      `,
    )
    .join("");
}

function renderSupplier(row) {
  const tags = row.conditions.length
    ? `<div class="tag-row">
        <span class="tag exempt">免验厂</span>
        ${row.conditions.map((condition) => renderTag(condition)).join("")}
      </div>`
    : "";

  return `
    <div class="supplier-cell">
      <div class="supplier-id">${escapeHtml(row.supplierId)}　▣</div>
      <div class="supplier-sub">⊙ ${escapeHtml(row.supplierName)}　▣</div>
      ${tags}
    </div>
  `;
}

function renderTag(condition) {
  const item = conditionLabels[condition];
  return `<span class="tag ${item.className}">${item.text}</span>`;
}

function openAssignModal(row) {
  activeRow = row;
  modalSupplier.innerHTML = `
    <strong>${escapeHtml(row.supplierId)}</strong>
    <span> / ${escapeHtml(row.supplierName)}</span>
    ${row.conditions.length ? `<span class="tag exempt">免验厂</span>` : ""}
  `;
  document.querySelector('input[name="useExemption"][value="no"]').checked = true;
  document.querySelector('input[name="useExemption"][value="yes"]').checked = false;
  renderAssignMode(false);
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
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
              `<div><span>${escapeHtml(label)}：</span>${escapeHtml(value)}</div>`,
          )
          .join("")}
      </div>
    </article>
  `;
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
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

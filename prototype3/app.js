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
    conditions: [],
    projectLevel: "B级",
    projectNo: "B20220714K9CG",
    product: "HY0044",
    applicant: "吴良",
    applyDate: "2026-03-04",
    expectDate: "2026-03-06",
    confirmDate: "2026-03-04",
    actualDate: "2026-03-04",
    inspector: "程小亚",
    score: "60",
  },
  {
    supplierId: "SUP26030371084",
    supplierName: "3*******",
    conditions: [],
    projectLevel: "默认值/未设置",
    projectNo: "B20201013T9P8",
    product: "园林工具套装",
    applicant: "吴良",
    applyDate: "2026-03-03",
    expectDate: "2026-03-31",
    confirmDate: "2026-03-03",
    actualDate: "2026-03-03",
    inspector: "程小亚",
    score: "123",
  },
  {
    supplierId: "SUP26030371081",
    supplierName: "王******",
    conditions: [],
    projectLevel: "B级",
    projectNo: "B202211080JY8",
    product: "交叉绑带短上衣（美）",
    applicant: "吴良",
    applyDate: "2026-03-03",
    expectDate: "2026-03-31",
    confirmDate: "2026-03-03",
    actualDate: "2026-03-03",
    inspector: "吴良",
    score: "77",
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
    confirmDate: "2026-03-02",
    actualDate: "2026-03-02",
    inspector: "钟伟青",
    score: "123",
  },
];

const reportCategoryConfig = [
  { name: "全部", full: 280 },
  { name: "质保体系", full: 20 },
  { name: "全过程品质控制", full: 92 },
  { name: "采购和仓库管理", full: 38 },
  { name: "生产过程控制", full: 44 },
  { name: "工程/技术", full: 36 },
  { name: "人员资质及培训", full: 12 },
  { name: "其它", full: 36 },
];

const reportCheckItems = [
  ["质保体系", "是否已建立 ISO9001 质量管理体系？", 0, 0, 2],
  ["质保体系", "是否已通过第三方认证机构认可并获得有效认证证书？", 0, 0, 2],
  ["质保体系", "有无编写质量手册 / 程序文件 / 作业指导书等相关文件？", 0, 2, 4],
  ["质保体系", "是否制定质量方针、目标并向员工发布？", 0, 1, 2],
  ["质保体系", "有无公司组织架构图？", 0, 0, 2],
  ["质保体系", "有无各部门的组织架构图和岗位职责说明？", 0, 2, 4],
  ["质保体系", "是否定期进行内部审核及管理评审？", 0, 2, 4],

  ["全过程品质控制", "是否有独立的质量部门并能行使质量否决权？", 0, 2, 4],
  ["全过程品质控制", "是否有质量部门组织架构图和岗位职责说明？", 0, 0, 2],
  ["全过程品质控制", "质量人员配备是否足够？", 0, 1, 2],
  ["全过程品质控制", "有无产品可靠性测试标准和作业指导书？", 0, 0, 2],
  ["全过程品质控制", "样品或量产前的产品是否有进行测试，包括可靠性方面？", 0, 1, 2],
  ["全过程品质控制", "是否定期进行型式试验并出具型式试验报告？", 0, 0, 2],
  ["全过程品质控制", "是否已编制抽样计划、检验规范、作业流程等文件？", 0, 2, 4],
  ["全过程品质控制", "IQC 是否按文件规定进行抽样检验？", 0, 1, 2],
  ["全过程品质控制", "检验后的物料状态是否已进行标识？", 0, 1, 2],
  ["全过程品质控制", "不合格品的管控是否符合规定要求？", 0, 2, 4],
  ["全过程品质控制", "是否有编制过程品质控制等品质文件？", 0, 1, 2],
  ["全过程品质控制", "是否有首件样品和确认报告？", 0, 2, 4],
  ["全过程品质控制", "IPQC 是否按规定时间进行巡检？查巡检记录。", 0, 1, 2],
  ["全过程品质控制", "车间 QC 是否按要求进行全检并做好 QC 记录？", 0, 1, 2],
  ["全过程品质控制", "不良品是否已做好标识并及时隔离，比如放入红色不合格品框内？", 0, 2, 4],
  ["全过程品质控制", "有无出厂检验相关作业流程、检验规范等文件？", 0, 2, 4],
  ["全过程品质控制", "QA / OQC 是否按文件规定进行出货前的产品检验？", 0, 2, 4],
  ["全过程品质控制", "检验前后的物料状态是否已进行标识？", 0, 1, 2],
  ["全过程品质控制", "不合格品是否已做好标识并妥善处置？", 0, 2, 4],
  ["全过程品质控制", "是否有客户投诉一览表？", 0, 0, 2],
  ["全过程品质控制", "是否定期对客户投诉的处理结果进行评审？", 0, 1, 2],
  ["全过程品质控制", "是否有对供应商进行分类 / 评级的系统？", 0, 0, 2],
  ["全过程品质控制", "是否有对关键供应商进行审核和定期考核评价？", 0, 2, 4],
  ["全过程品质控制", "是否积极主动地发出纠正预防措施报告，要求供应商改善？", 0, 1, 2],
  ["全过程品质控制", "是否有独立的实验室？", 0, 1, 2],
  ["全过程品质控制", "品质部主要检测仪器、设备、工装是否完备？", 0, 2, 4],
  ["全过程品质控制", "是否已编制检测仪器、设备和工装清单？", 0, 1, 2],
  ["全过程品质控制", "检测用仪器、设备、工装是否有定期维护保养、点检、校准？", 0, 2, 4],
  ["全过程品质控制", "文件发放和回收是否按要求进行？查文件发放和回收记录。", 0, 1, 2],
  ["全过程品质控制", "是否定期对文件进行评审、修订？", 0, 1, 2],
  ["全过程品质控制", "各场所品质文件是否已盖受控章？", 0, 1, 2],
  ["全过程品质控制", "质量记录是否按要求进行保存及处理？", 0, 1, 2],
  ["全过程品质控制", "是否有做品质周报、月报？", 0, 2, 4],
  ["全过程品质控制", "是否有应用到统计技术，如控制图、CPK？", 0, 1, 2],

  ["采购和仓库管理", "有无订单评审管理办法，以确保交期和质量？", 0, 1, 2],
  ["采购和仓库管理", "是否有物料计划及安全库存？", 0, 1, 2],
  ["采购和仓库管理", "新引进供应商是否已进行了评审，包括现场审核？", 0, 2, 4],
  ["采购和仓库管理", "有无《合格供应商名单》并定期修订？", 0, 1, 2],
  ["采购和仓库管理", "是否有对合格供应商进行月度考核评价的系统？", 0, 1, 2],
  ["采购和仓库管理", "原材料进货渠道有无固定长期合作的重点供应商？", 0, 1, 2],
  ["采购和仓库管理", "是否已和供应商签订采购合同？", 0, 1, 2],
  ["采购和仓库管理", "是否有进行区域划分和标识？", 0, 1, 2],
  ["采购和仓库管理", "是否有进行温湿度控制和记录？", 0, 1, 2],
  ["采购和仓库管理", "物料和产品摆放、标识是否符合规定要求？", 0, 2, 4],
  ["采购和仓库管理", "不合格物料是否已做好标识并摆放在指定区域？", 0, 2, 4],
  ["采购和仓库管理", "是否已做出限高标示？", 0, 1, 2],
  ["采购和仓库管理", "物料发放是否遵循先进先出？", 0, 2, 4],
  ["采购和仓库管理", "是否有独立的化学品仓库？", 0, 0, 2],
  ["采购和仓库管理", "是否有化学品清单和 MSDS 表？", 0, 1, 2],

  ["生产过程控制", "主要生产设备是否齐全、完好？", 0, 2, 4],
  ["生产过程控制", "生产设备、工装等是否有做状态标识？", 0, 1, 2],
  ["生产过程控制", "是否有维护保养？查维护保养记录表。", 0, 1, 2],
  ["生产过程控制", "是否对作业环境进行控制、记录？", 0, 1, 2],
  ["生产过程控制", "各作业岗位是否有作业指导书？", 0, 2, 4],
  ["生产过程控制", "员工是否按文件要求进行作业？", 0, 2, 4],
  ["生产过程控制", "员工是否有进行自检、互检？", 0, 1, 2],
  ["生产过程控制", "车间是否有进行区域划分和标识？", 0, 1, 2],
  ["生产过程控制", "物品摆放是否整齐有序？", 0, 1, 2],
  ["生产过程控制", "物品上标识是否规范、齐全？", 0, 1, 2],
  ["生产过程控制", "不合格品是否有标识并及时处理？", 0, 2, 4],
  ["生产过程控制", "关键工序是否标识并设置质量控制点？", 0, 2, 4],
  ["生产过程控制", "特殊工序是否有醒目标识？", 0, 0, 2],
  ["生产过程控制", "是否有对防静电控制、烙铁点检、电批扭力等进行每日点检？", 0, 2, 4],
  ["生产过程控制", "是否按规定使用危险化学品？", 0, 1, 2],
  ["生产过程控制", "有无对危险品进行登记、标识、隔离保存，以避免误用、丢失或对员工造成伤害？", 0, 1, 2],

  ["工程/技术", "是否有生产设备、工装夹具、模具等档案资料，包括设备清单、维修记录、保养计划等？", 0, 2, 4],
  ["工程/技术", "各设备是否有 SOP，且操作人员接受过相关培训？", 0, 2, 4],
  ["工程/技术", "产品工艺文件是否齐全？", 0, 2, 4],
  ["工程/技术", "是否有生产作业工艺流程图？", 0, 1, 2],
  ["工程/技术", "是否有工程变更处理流程？", 0, 2, 4],
  ["工程/技术", "工程变更执行前，是否被相关人员审核和通过？", 0, 1, 2],
  ["工程/技术", "设计开发能力能否满足客户需求？", 0, 2, 4],
  ["工程/技术", "有无设计开发规划和进展一览表？", 0, 1, 2],
  ["工程/技术", "设计开发各阶段评审和验证记录是否齐全？", 0, 2, 4],
  ["工程/技术", "是否有做 DFMEA？", 0, 0, 2],
  ["工程/技术", "是否编制产品规格书并经客户确认？", 0, 2, 4],

  ["人员资质及培训", "是否有年度培训计划并有效执行？查看年度培训计划和培训记录。", 0, 2, 4],
  ["人员资质及培训", "新员工进厂是否有进行培训、考核？", 0, 1, 2],
  ["人员资质及培训", "员工上岗前是否进行培训、考核？", 0, 1, 2],
  ["人员资质及培训", "对特殊工种 / 岗位是否有专门的培训？", 0, 1, 2],
  ["人员资质及培训", "特殊工种 / 岗位人员是否佩戴上岗证？", 0, 1, 2],

  ["其它", "业务部门是否有进行客户满意度调查？", 0, 1, 2],
  ["其它", "客户订单是否有进行评审？", 0, 1, 2],
  ["其它", "是否建立有环保要求管控体系和文件？", 0, 2, 4],
  ["其它", "是否定期进行环保要求检测？", 0, 1, 2],
  ["其它", "是否已在采购订单中注明环保控制要求？", 0, 2, 4],
  ["其它", "有环保要求时，物料或产品是否有做环保标识？", 0, 1, 2],
  ["其它", "是否购买有 RoHS 测试仪器？", 0, 0, 2],
  ["其它", "是否建立消防安全管理规定？", 0, 0, 2],
  ["其它", "是否每年至少一次进行消防演习？", 0, 0, 2],
  ["其它", "消防设施是否完善？", 0, 2, 4],
].map((item, index) => ({
  id: index,
  category: item[0],
  content: item[1],
  fail: item[2],
  partial: item[3],
  pass: item[4],
  selected: index % 7 === 0 ? "partial" : index % 5 === 0 ? "fail" : "pass",
  remark: "",
}));

const reportPhotoCategories = [
  "公司环境及样品间",
  "品质和体系管理",
  "车间生产管理",
  "采购和仓库管理",
  "产品开发管理及客户",
  "其他",
];

rows.forEach((row) => {
  row.isExempt = row.conditions.length > 0;
  row.stage = "review";
  if (row.isExempt) {
    row.confirmDate = row.applyDate;
    row.actualDate = row.applyDate;
    row.inspector = "免验厂";
    row.score = "100";
    row.reportFiles = collectEvidenceFiles(row);
  }
  if (!row.isExempt) {
    row.confirmDate = row.confirmDate || row.applyDate;
    row.actualDate = row.actualDate || row.confirmDate;
    row.inspector = row.inspector || "程小亚";
    row.score = row.score || "60";
  }
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
let currentStage = "review";
let currentInspectionType = "all";
let activeReportCategory = "全部";
let restoreAuditAfterReport = false;

const tableHead = document.getElementById("tableHead");
const tableBody = document.getElementById("tableBody");
const statusTabs = document.getElementById("statusTabs");
const inspectionTypeFilter = document.getElementById("inspectionTypeFilter");
const resetFilters = document.getElementById("resetFilters");
const modal = document.getElementById("assignModal");
const auditModal = document.getElementById("auditModal");
const reportModal = document.getElementById("reportModal");
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
document.getElementById("openReportModal").addEventListener("click", openReportModal);
document.getElementById("confirmAuditModal").addEventListener("click", () => {
  if (activeAuditRow) {
    const result = document.getElementById("auditResult").value || "passed";
    activeAuditRow.stage = result;
    currentStage = result;
    renderRows();
  }
  closeAuditModal();
  showToast("审核已提交");
});

reportModal.querySelectorAll(".js-close-report").forEach((button) => {
  button.addEventListener("click", closeReportModal);
});
document.getElementById("saveDraft").addEventListener("click", () => saveReportChanges(false));
document.getElementById("submitReport").addEventListener("click", () => saveReportChanges(true));

reportModal.addEventListener("click", (event) => {
  if (event.target === reportModal) {
    closeReportModal();
    return;
  }

  const tab = event.target.closest("[data-panel]");
  if (tab) {
    switchReportPanel(tab.dataset.panel);
    return;
  }

  const category = event.target.closest(".category-tab");
  if (category) {
    activeReportCategory = category.dataset.category;
    renderReportCategoryTabs();
    renderReportCheckRows();
    return;
  }

  const uploadButton = event.target.closest(".upload-btn");
  if (uploadButton) {
    document.getElementById(`photoInput-${uploadButton.dataset.upload}`).click();
    return;
  }

  const certTrigger = event.target.closest("[data-cert-trigger]");
  if (certTrigger) {
    const extra = document.querySelector(`[data-cert-options="${certTrigger.dataset.certTrigger}"]`);
    if (!extra || extra.hidden) return;
    const shouldOpen = !extra.classList.contains("open");
    closeCertMenus(extra);
    extra.classList.toggle("open", shouldOpen);
    return;
  }

  if (!event.target.closest("[data-cert-options]")) closeCertMenus();
});

reportModal.addEventListener("change", (event) => {
  if (event.target.matches(".score-select")) {
    const item = reportCheckItems.find((row) => row.id === Number(event.target.dataset.id));
    item.selected = event.target.value;
    refreshReportScores();
    return;
  }

  if (event.target.matches(".hidden-file")) {
    renderSelectedPhotoNames(event.target);
    return;
  }

  if (event.target.matches('input[name="system-cert"], input[name="product-cert"]')) {
    updateCertVisibility(event.target.name.replace("-cert", ""));
    return;
  }

  const certOptions = event.target.closest("[data-cert-options]");
  if (certOptions) {
    updateCertSummary(certOptions.dataset.certOptions);
  }
});

reportModal.addEventListener("input", (event) => {
  if (event.target.matches(".remark-input")) {
    const item = reportCheckItems.find((row) => row.id === Number(event.target.dataset.remarkId));
    item.remark = event.target.value;
    return;
  }

  const certOptions = event.target.closest("[data-cert-options]");
  if (certOptions) {
    updateCertSummary(certOptions.dataset.certOptions);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (reportModal.classList.contains("open")) {
      closeReportModal();
      return;
    }
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
  const generatedFiles = {
    listed: [{ fileName: "上市公司企查查结果.pdf", fileType: "PDF", fileSize: "720 KB", fileNo: "QCC-LISTED" }],
    capital: [{ fileName: "实缴资本与账期证明.pdf", fileType: "PDF", fileSize: "1.1 MB", fileNo: "QCC-CAPITAL" }],
  };

  return row.conditions.flatMap((condition) => {
    const uploadedFiles = evidenceMap[condition].fields
      .map(([, value]) => value)
      .filter((value) => value && typeof value === "object")
      .map((file) => ({
        ...file,
        fileName: file.fileName || String(file),
        fileType: file.fileType || "FILE",
        fileSize: file.fileSize || "-",
        fileNo: file.fileNo || "-",
      }));
    return uploadedFiles.length ? uploadedFiles : generatedFiles[condition] || [];
  });
}

function renderReportFiles(row) {
  if (!row.isExempt) return "-";
  const files = row.reportFiles && row.reportFiles.length ? row.reportFiles : collectEvidenceFiles(row);
  if (!files.length) return '<span class="muted-text">相关证明文件</span>';
  const firstFile = files[0];
  const payload = encodeURIComponent(JSON.stringify(firstFile));
  return `
    <div class="report-list">
      <a class="report-file" href="#" data-file-preview="${payload}">
        <span class="report-file-icon">${escapeHtml(firstFile.fileType || "FILE")}</span>
        <span class="report-file-names">
          ${files.map((file) => `<span>${escapeHtml(file.fileName)}</span>`).join("")}
        </span>
      </a>
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
  document.getElementById("auditResult").value = "";
  updateAuditReportSummary();
  auditModal.classList.add("open");
  auditModal.setAttribute("aria-hidden", "false");
}

function updateAuditReportSummary() {
  const summary = document.getElementById("auditReportSummary");
  const reportButton = document.getElementById("openReportModal");
  if (!activeAuditRow) {
    summary.textContent = "请选择待审核记录";
    reportButton.disabled = true;
    reportButton.setAttribute("aria-disabled", "true");
    reportButton.title = "请选择待审核记录";
    return;
  }
  const type = activeAuditRow.isExempt ? "免验厂" : "普通验厂";
  summary.textContent = `${type} / ${activeAuditRow.supplierId} / ${activeAuditRow.projectNo}`;
  reportButton.disabled = activeAuditRow.isExempt;
  reportButton.setAttribute("aria-disabled", String(activeAuditRow.isExempt));
  reportButton.title = activeAuditRow.isExempt ? "免验厂无需查看验厂报告" : "";
}

function openReportModal() {
  if (!activeAuditRow) return;
  if (activeAuditRow.isExempt) return;
  restoreAuditAfterReport = auditModal.classList.contains("open");
  if (restoreAuditAfterReport) {
    auditModal.classList.remove("open");
    auditModal.setAttribute("aria-hidden", "true");
  }
  fillReportBasicInfo(activeAuditRow);
  activeReportCategory = "全部";
  renderReportCategoryTabs();
  renderReportCheckRows();
  renderReportPhotos();
  refreshReportScores();
  switchReportPanel("basic");
  reportModal.classList.add("open");
  reportModal.setAttribute("aria-hidden", "false");
}

function fillReportBasicInfo(row) {
  document.getElementById("reportMeta").innerHTML = `
    <span>供应商：${escapeHtml(row.supplierName)}</span>
    <span>项目：${escapeHtml(row.projectNo)} ${escapeHtml(row.product)}</span>
    <span>状态：待验厂</span>
  `;
  document.getElementById("reportInspector").textContent = row.inspector || "何鹏程";
  document.getElementById("reportMethod").value = "实地验厂";
  document.getElementById("reportDate").value = row.actualDate || row.confirmDate || row.applyDate;
  document.getElementById("reportSupplierName").value = row.supplierName;
  document.getElementById("reportProduct").value = row.product || "节庆装饰品、塑料配件";
  document.getElementById("reportPlanProduct").value = row.product || "圣诞球、挂饰、礼品包装件";
  document.getElementById("saveState").textContent = "当前为演示原型，数据仅在本页面临时展示";
  updateCertVisibility("system");
  updateCertVisibility("product");
}

function closeReportModal() {
  reportModal.classList.remove("open");
  reportModal.setAttribute("aria-hidden", "true");
  if (restoreAuditAfterReport) {
    auditModal.classList.add("open");
    auditModal.setAttribute("aria-hidden", "false");
    restoreAuditAfterReport = false;
  }
}

function switchReportPanel(panelName) {
  reportModal.querySelectorAll("[data-panel]").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.panel === panelName);
  });
  reportModal.querySelectorAll(".panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `panel-${panelName}`);
  });
}

function renderReportCategoryTabs() {
  document.getElementById("categoryTabs").innerHTML = reportCategoryConfig
    .map(
      (category) => `
        <button
          class="category-tab ${category.name === activeReportCategory ? "active" : ""}"
          type="button"
          data-category="${escapeHtml(category.name)}"
        >${escapeHtml(category.name)}</button>
      `,
    )
    .join("");
}

function renderReportCheckRows() {
  const visibleItems =
    activeReportCategory === "全部"
      ? reportCheckItems
      : reportCheckItems.filter((item) => item.category === activeReportCategory);

  const categoryCounts = visibleItems.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});
  const firstSeen = {};

  document.getElementById("checkRows").innerHTML = visibleItems
    .map((item) => {
      const projectCell = !firstSeen[item.category]
        ? `<td class="project-cell" rowspan="${categoryCounts[item.category]}">${escapeHtml(item.category)}</td>`
        : "";
      firstSeen[item.category] = true;
      return `
        <tr data-category="${escapeHtml(item.category)}">
          ${projectCell}
          <td class="content-cell">${escapeHtml(item.content)}</td>
          <td>${escapeHtml(item.fail)}</td>
          <td>${escapeHtml(item.partial)}</td>
          <td>${escapeHtml(item.pass)}</td>
          <td>
            <select class="score-select" data-id="${item.id}">
              <option value="fail" ${item.selected === "fail" ? "selected" : ""}>不符</option>
              <option value="partial" ${item.selected === "partial" ? "selected" : ""}>部分不符</option>
              <option value="pass" ${item.selected === "pass" ? "selected" : ""}>符合</option>
            </select>
          </td>
          <td><textarea class="remark-input" data-remark-id="${item.id}" placeholder="填写备注">${escapeHtml(item.remark)}</textarea></td>
        </tr>
      `;
    })
    .join("");
}

function reportOptionValue(item) {
  if (item.selected === "fail") return item.fail;
  if (item.selected === "partial") return item.partial;
  return item.pass;
}

function calculateReportCategory(categoryName) {
  const items = reportCheckItems.filter((item) => item.category === categoryName);
  const full = reportCategoryConfig.find((category) => category.name === categoryName)?.full || 0;
  const visibleFull = items.reduce((sum, item) => sum + item.pass, 0);
  const visibleActual = items.reduce((sum, item) => sum + reportOptionValue(item), 0);
  const normalizedActual = visibleFull ? (visibleActual / visibleFull) * full : 0;
  return {
    name: categoryName,
    actual: Math.round(normalizedActual * 10) / 10,
    full,
    rate: full ? normalizedActual / full : 0,
  };
}

function judgeReportByScore(score) {
  if (score >= 75) return { text: "合格", className: "" };
  if (score >= 60) return { text: "合格但需改善", className: "warn" };
  return { text: "不合格", className: "fail" };
}

function refreshReportScores() {
  const categories = reportCategoryConfig
    .filter((category) => category.name !== "全部")
    .map((category) => calculateReportCategory(category.name));
  const fullTotal = reportCategoryConfig.find((category) => category.name === "全部")?.full
    || categories.reduce((sum, item) => sum + item.full, 0);
  const actualTotal = categories.reduce((sum, item) => sum + item.actual, 0);
  const score = Math.round((actualTotal / fullTotal) * 1000) / 10;
  const judge = judgeReportByScore(score);

  document.getElementById("toolbarScore").textContent = `${score}`;
  document.getElementById("toolbarRate").textContent = `${score}%`;
  document.getElementById("toolbarJudge").textContent = judge.text;
  document.getElementById("finalScore").textContent = `${score}分（综合达成率*100）分`;

  const judgeEl = document.getElementById("finalJudge");
  judgeEl.textContent = judge.text;
  judgeEl.className = `judgement ${judge.className}`;

  document.getElementById("resultRows").innerHTML = categories
    .map(
      (item, index) => `
        <tr>
          <td>${escapeHtml(item.name)}</td>
          <td>${index === 0 ? `<strong>${escapeHtml(item.actual)}（系统根据填写情况自动计算）</strong>` : escapeHtml(item.actual)}</td>
          <td>${escapeHtml(item.full)}</td>
          <td>${Math.round(item.rate * 1000) / 10}%（实际评分/满分）</td>
        </tr>
      `,
    )
    .join("") + `
      <tr>
        <td>综合</td>
        <td><strong>${Math.round(actualTotal * 10) / 10}</strong></td>
        <td>${escapeHtml(fullTotal)}</td>
        <td>${score}%</td>
      </tr>
    `;
}

function renderReportPhotos() {
  document.getElementById("photoGrid").innerHTML = reportPhotoCategories
    .map(
      (name, index) => `
        <article class="photo-card">
          <div class="photo-card-head">
            <span>${escapeHtml(name)}</span>
            <button class="upload-btn" type="button" data-upload="${index}">选择图片</button>
            <input class="hidden-file" id="photoInput-${index}" type="file" accept="image/*" multiple />
          </div>
          <div class="photo-body" id="photoBody-${index}">
            <div class="photo-empty">暂无照片<br />可多选图片预览</div>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderSelectedPhotoNames(input) {
  const index = input.id.replace("photoInput-", "");
  const body = document.getElementById(`photoBody-${index}`);
  const files = Array.from(input.files);
  body.innerHTML = files.length
    ? files.map((file) => `<div class="photo-empty">${escapeHtml(file.name)}</div>`).join("")
    : '<div class="photo-empty">暂无照片<br />可多选图片预览</div>';
}

function saveReportChanges(closeAfterSave) {
  if (!activeAuditRow) return;
  const scoreText = document.getElementById("toolbarScore").textContent;
  activeAuditRow.score = scoreText;
  activeAuditRow.inspector = document.getElementById("reportInspector").textContent || activeAuditRow.inspector;
  activeAuditRow.actualDate = document.getElementById("reportDate").value || activeAuditRow.actualDate;
  activeAuditRow.reportOpinion = document.getElementById("reportSqeOpinion").value;
  renderRows();
  updateAuditReportSummary();
  document.getElementById("saveState").textContent = `草稿已保存：${new Date().toLocaleTimeString("zh-CN", { hour12: false })}`;
  if (closeAfterSave) {
    showToast("验厂报告已更新");
    closeReportModal();
    return;
  }
  showToast("草稿已保存");
}

function certPlaceholder(group) {
  return group === "system" ? "请选择体系认证" : "请选择产品认证";
}

function updateCertSummary(group) {
  const extra = document.querySelector(`[data-cert-options="${group}"]`);
  const summary = document.querySelector(`[data-cert-summary="${group}"]`);
  if (!extra || !summary) return;

  const checkedLabels = Array.from(extra.querySelectorAll('input[type="checkbox"]:checked'))
    .map((input) => input.parentElement.textContent.trim());
  const otherValue = extra.querySelector(".cert-other")?.value.trim();
  const values = otherValue ? [...checkedLabels, otherValue] : checkedLabels;
  summary.textContent = values.length ? values.join("、") : certPlaceholder(group);
}

function updateCertVisibility(group) {
  const yes = document.querySelector(`input[name="${group}-cert"][value="yes"]`);
  const extra = document.querySelector(`[data-cert-options="${group}"]`);
  if (!yes || !extra) return;

  extra.hidden = !yes.checked;
  if (!yes.checked) extra.classList.remove("open");
  updateCertSummary(group);
}

function closeCertMenus(except) {
  document.querySelectorAll("[data-cert-options]").forEach((extra) => {
    if (extra !== except) extra.classList.remove("open");
  });
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
  return `<a class="file-link" href="#" data-file-preview="${payload}">📎 ${escapeHtml(value.fileName)}</a>`;
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

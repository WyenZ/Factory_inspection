import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");
const app = readFileSync(new URL("./app.js", import.meta.url), "utf8");
const css = readFileSync(new URL("./styles.css", import.meta.url), "utf8");

test("filters include inspection type dropdown options", () => {
  assert.match(html, /id="inspectionTypeFilter"/);
  assert.match(html, /<option value="regular">普通验厂<\/option>/);
  assert.match(html, /<option value="exempt">免验厂<\/option>/);
});

test("non-exempt supplier rows render regular inspection tags", () => {
  assert.match(app, /renderInspectionTypeTag/);
  assert.match(app, /row\.isExempt \? "免验厂" : "普通验厂"/);
  assert.match(app, /tag regular/);
  assert.match(css, /\.tag\.regular/);
});

test("regular inspection rows do not render report files", () => {
  assert.match(app, /function renderReportFiles/);
  assert.match(app, /if \(!row\.isExempt\) return "-";/);
  assert.doesNotMatch(app, /products\.xlsx|配件SKU修改\.xlsx|送货清单_202603\.xlsx|运动工厂自评\.docx/);
  assert.match(app, /collectEvidenceFiles\(row\)/);
});

test("audit dialog opens editable online report instead of upload fields", () => {
  assert.doesNotMatch(html, /更新验厂报告|更新不合格项/);
  assert.match(html, /id="openReportModal"/);
  assert.match(html, />查看验厂报告</);
  assert.match(html, /id="reportModal"/);
  assert.match(html, /验厂检查项/);
  assert.match(html, /SQE意见/);
  assert.match(html, /整改建议/);
  assert.match(app, /function openReportModal/);
  assert.match(app, /function renderReportCheckRows/);
  assert.match(app, /function refreshReportScores/);
  assert.match(css, /\.modal-backdrop/);
});

test("online report modal keeps source design and changes submit to update", () => {
  assert.match(html, /<div class="modal-backdrop" id="reportModal"/);
  assert.match(html, /<article class="modal" role="dialog"/);
  assert.match(html, /<h1 class="modal-title" id="reportTitle">提交验厂报告<\/h1>/);
  assert.match(html, /class="modal-meta"/);
  assert.match(html, /data-panel="basic"/);
  assert.match(html, /id="panel-basic"/);
  assert.match(html, /class="form-grid"/);
  assert.match(html, /id="categoryTabs"/);
  assert.match(html, /class="check-table"/);
  assert.match(html, /id="photoGrid"/);
  assert.match(html, /<footer class="modal-foot">/);
  assert.match(html, /<button class="btn js-close-report" type="button">取消<\/button>/);
  assert.match(html, /<button class="btn ghost" id="saveDraft" type="button">保存草稿<\/button>/);
  assert.match(html, /<button class="btn primary" id="submitReport" type="button">更新<\/button>/);
  assert.doesNotMatch(html, /返回审核|保存修改|同步到审核|查看验厂报告<\/h1>/);
  assert.match(app, /showToast\("验厂报告已更新"\)/);
});

test("report modal temporarily hides audit dialog while matching source overlay", () => {
  assert.match(app, /let restoreAuditAfterReport = false;/);
  assert.match(app, /restoreAuditAfterReport = auditModal\.classList\.contains\("open"\);/);
  assert.match(app, /auditModal\.classList\.remove\("open"\);/);
  assert.match(app, /if \(restoreAuditAfterReport\) \{/);
  assert.match(app, /auditModal\.classList\.add\("open"\);/);
});

test("online report uses complete inspection checklist from source prototype", () => {
  assert.match(app, /\{ name: "全部", full: 280 \}/);
  assert.match(app, /\{ name: "全过程品质控制", full: 92 \}/);
  assert.match(app, /\{ name: "工程\/技术", full: 36 \}/);
  assert.match(app, /\{ name: "人员资质及培训", full: 12 \}/);
  assert.match(app, /\{ name: "其它", full: 36 \}/);
  assert.match(app, /是否已建立 ISO9001 质量管理体系/);
  assert.match(app, /是否有生产设备、工装夹具、模具等档案资料/);
  assert.match(app, /是否每年至少一次进行消防演习/);
  assert.match(app, /selected: index % 7 === 0 \? "partial" : index % 5 === 0 \? "fail" : "pass"/);
  assert.match(app, /产品开发管理及客户/);
  assert.match(app, /const fullTotal = reportCategoryConfig\.find\(\(category\) => category\.name === "全部"\)\?\.full/);
});

test("exempt inspection rows disable audit and report buttons", () => {
  assert.match(app, /function renderReviewActions\(row\)/);
  assert.match(app, /row\.isExempt \? 'disabled aria-disabled="true" title="免验厂无需审核"' : `data-audit="\$\{escapeHtml\(row\.supplierId\)\}"`/);
  assert.match(app, /row\.isExempt \? "disabled" : ""/);
  assert.match(app, /reportButton\.disabled = activeAuditRow\.isExempt;/);
  assert.match(app, /reportButton\.setAttribute\("aria-disabled", String\(activeAuditRow\.isExempt\)\);/);
  assert.match(css, /\.actions button:disabled/);
  assert.match(css, /\.report-view-button:disabled/);
});

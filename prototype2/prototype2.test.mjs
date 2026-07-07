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

test("exempt evidence uses uploaded files instead of API query results", () => {
  assert.match(html, /<div class="section-title">免验厂资料<\/div>/);
  assert.doesNotMatch(html, /API 查询结果/);
  assert.doesNotMatch(app, /API 查询|API \+ 手填|\["查询主体"|\["上市板块"|\["股票代码"|\["工商实缴资本"/);
  assert.match(app, /type: "上传资料"/);
  assert.match(app, /上市证明材料/);
  assert.match(app, /listed_company_proof\.pdf/);
  assert.match(app, /实缴资本证明/);
  assert.match(app, /paid_capital_proof\.pdf/);
  assert.match(app, /payment_terms_agreement\.pdf/);
});

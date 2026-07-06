import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");
const app = readFileSync(new URL("./app.js", import.meta.url), "utf8");
const css = readFileSync(new URL("./styles.css", import.meta.url), "utf8");

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractOnsiteSection() {
  const match = html.match(/<section class="form-block" id="onsiteSection">([\s\S]*?)<section class="form-block is-hidden" id="exemptSection">/);
  assert.ok(match, "ordinary inspection section should exist");
  return match[1];
}

function extractPreFactorySection() {
  const onsiteSection = extractOnsiteSection();
  const match = onsiteSection.match(/<div class="factory-data-section"[\s\S]*?<\/div>\s*<div class="onsite-form">/);
  assert.ok(match, "pre-factory data section should exist");
  return match[0];
}

test("ordinary inspection modal shows requested pre-factory information fields", () => {
  const preFactorySection = extractPreFactorySection();
  const requiredLabels = [
    "预验厂信息",
    "项目编号",
    "项目名称",
    "联系人",
    "TEL",
    "手机号码",
    "Email",
    "主要目标国家",
    "厂房面积(m²)",
    "仓库面积(m²)",
    "投产日期",
    "工厂总人数",
    "研发人数",
    "质检人数",
    "交货周期(天)",
    "办公地址",
    "工厂地址",
    "主要生产产品",
    "主要检查设备",
  ];

  for (const label of requiredLabels) {
    assert.match(preFactorySection, new RegExp(label.replace(/[()]/g, "\\$&")), `${label} should be present`);
  }

  assert.match(preFactorySection, /项目名称自动填充/, "project name placeholder should match the target");
  assert.doesNotMatch(preFactorySection, /验厂资料/, "old section title should be replaced");
  assert.doesNotMatch(preFactorySection, /期望验厂日期/, "expected inspection date should stay out of pre-factory info");
});

test("exemption flow uses manual supplement materials instead of API query", () => {
  const source = `${html}\n${app}\n${css}`;

  for (const forbidden of [
    "API",
    "企查查",
    "queryResults",
    "apiScenario",
    "apiCodes",
    "renderApiBlock",
    "triggerExternalQuery",
    "buildApiResult",
  ]) {
    assert.doesNotMatch(source, new RegExp(forbidden), `${forbidden} should be removed`);
  }

  for (const expected of [
    "上市证明材料",
    "人工补充主板上市证明材料",
    "请上传上市证明材料",
    "实缴资本证明",
    "人工补充工商实缴资本证明",
    "请上传实缴资本证明",
    "系统自动抓取",
    "香港星商-CNY-银行转账-(优备对公)月结90天",
  ]) {
    assert.match(app, new RegExp(escapeRegExp(expected)), `${expected} should be present`);
  }

  for (const manualAccountText of [
    "填写账期天数，例如 60",
    "请填写账期",
    "账期需不低于月结 60 天",
    "data-account-code",
  ]) {
    assert.doesNotMatch(app, new RegExp(escapeRegExp(manualAccountText)), `${manualAccountText} should be removed`);
  }
});

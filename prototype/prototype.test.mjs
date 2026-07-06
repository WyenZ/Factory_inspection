import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");

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

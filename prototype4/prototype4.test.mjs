import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const baseUrl = new URL("./", import.meta.url);

function readRequiredFile(fileName) {
  const fileUrl = new URL(fileName, baseUrl);
  assert.ok(existsSync(fileUrl), `${fileName} should exist in prototype4`);
  return readFileSync(fileUrl, "utf8");
}

test("supplier operation column adds request inspection below operation log", () => {
  const html = readRequiredFile("index.html");

  assert.match(html, /星商供应商中心/, "prototype4 should be the supplier center page");
  assert.match(html, /供应商列表/, "prototype4 should show supplier list context");

  const operationBlock = html.match(/<div class="row-actions">([\s\S]*?)<\/div>/);
  assert.ok(operationBlock, "supplier row actions should exist");
  assert.ok(
    operationBlock[1].indexOf("操作记录") < operationBlock[1].indexOf("申请验厂"),
    "申请验厂 should appear after 操作记录",
  );
  assert.match(operationBlock[1], /data-action="apply-inspection"/);
});

test("request inspection modal keeps prototype inspection workflow", () => {
  const source = [
    readRequiredFile("index.html"),
    readRequiredFile("app.js"),
    readRequiredFile("styles.css"),
  ].join("\n");

  for (const expected of [
    "申请验厂",
    "普通验厂",
    "免验厂",
    "预验厂信息",
    "期望验厂时间",
    "人工补充主板上市证明材料",
    "人工补充工商实缴资本证明",
    "系统自动抓取",
    "香港星商-CNY-银行转账-(优备对公)月结90天",
  ]) {
    assert.ok(source.includes(expected), `${expected} should be present`);
  }

  for (const forbidden of ["API", "企查查", "填写账期天数，例如 60"]) {
    assert.ok(!source.includes(forbidden), `${forbidden} should not be present`);
  }
});

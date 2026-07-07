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

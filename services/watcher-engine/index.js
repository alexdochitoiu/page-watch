import express from "express";
import pino from "pino";
import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";

const log = pino({ level: process.env.LOG_LEVEL || "info" });
const app = express();
app.use(express.json({ limit: "1mb" }));

console.log({ env: process.env });

const {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  SCREENSHOTS_BUCKET = "screenshots",
  PORT = 8080
} = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  log.warn("Supabase env vars missing: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
}

const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
  : null;

app.get("/healthz", (_, res) => res.send("ok"));

app.post("/check-now", async (req, res) => {
  const { watcherId, url, rules } = req.body || {};
  if (!url || !Array.isArray(rules)) return res.status(400).json({ error: "Missing url or rules" });

  let browser;
  const startedAt = new Date().toISOString();
  try {
    browser = await chromium.launch({ headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
    const context = await browser.newContext({
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36",
      locale: "en-US",
      viewport: { width: 1366, height: 900 }
    });
    const page = await context.newPage();

    const strategies = [
      { waitUntil: "domcontentloaded", timeout: 45000 },
      { waitUntil: "load", timeout: 60000 },
      { waitUntil: "networkidle", timeout: 30000 },
    ];

    let navOk = false;
    for (const s of strategies) {
      try {
        await page.goto(url, s);
        navOk = true;
        break;
      } catch (e) {
        log.warn({ err: e.message, strategy: s.waitUntil }, "nav_failed");
      }
    }
    if (!navOk) throw new Error("Navigation failed");

    await page.waitForTimeout(1500);

    // Simple rule eval compatible with your Operation types
    const ruleResults = [];
    for (const rule of rules) {
      const { operation, selector, value } = rule;
      let passed = false;
      let actualValue = undefined;
      let error = undefined;
      try {
        const count = await page.locator(selector).count();
        if (operation === "element_exists") {
          passed = count > 0;
          actualValue = count > 0 ? "Element exists" : "Element does not exist";
        } else if (operation === "contains") {
          if (count === 0) {
            actualValue = "No elements found";
          } else {
            const text = await page.locator(selector).first().textContent();
            actualValue = text || "";
            passed = !!text && text.includes(value || "");
          }
        } else if (operation === "equals") {
          if (count === 0) {
            actualValue = "No elements found";
          } else {
            const text = await page.locator(selector).first().textContent();
            actualValue = text || "";
            passed = text === value;
          }
        } else if (operation === "greater_than") {
          if (count === 0) {
            actualValue = "No elements found";
          } else {
            const text = await page.locator(selector).first().textContent();
            actualValue = text || "";
            const n = parseFloat((text || "").replace(/[^\d.-]/g, ""));
            const tgt = parseFloat(value || "0");
            passed = n > tgt;
          }
        } else if (operation === "less_than") {
          if (count === 0) {
            actualValue = "No elements found";
          } else {
            const text = await page.locator(selector).first().textContent();
            actualValue = text || "";
            const n = parseFloat((text || "").replace(/[^\d.-]/g, ""));
            const tgt = parseFloat(value || "0");
            passed = n < tgt;
          }
        } else if (operation === "regex_match") {
          if (count === 0) {
            actualValue = "No elements found";
          } else {
            const text = await page.locator(selector).first().textContent();
            actualValue = text || "";
            const re = value ? new RegExp(value) : null;
            passed = re ? re.test(text || "") : false;
          }
        }
      } catch (e) {
        error = e.message || String(e);
      }
      ruleResults.push({ ruleId: rule.id, passed, actualValue, expectedValue: value, error });
    }

    const success = ruleResults.every(r => r.passed);
    const screenshot = await page.screenshot({ type: "png", fullPage: true });

    let screenshotUrl = null;
    if (supabase) {
      const path = `runs/${Date.now()}-${Math.random().toString(36).slice(2)}.png`;
      const upload = await supabase.storage.from(SCREENSHOTS_BUCKET).upload(path, screenshot, {
        contentType: "image/png",
        upsert: false
      });
      if (!upload.error) {
        const { data } = supabase.storage.from(SCREENSHOTS_BUCKET).getPublicUrl(path);
        screenshotUrl = data.publicUrl;
      }

      await supabase.from("watcher_runs").insert({
        watcher_id: watcherId ?? null,
        url,
        success,
        rule_results: ruleResults,
        screenshot_url: screenshotUrl,
        started_at: startedAt,
        finished_at: new Date().toISOString()
      });
    }

    res.json({ success, ruleResults, screenshotUrl });
  } catch (err) {
    log.error({ err }, "check_failed");
    res.status(502).json({ error: err.message });
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
});

app.listen(PORT, () => log.info({ PORT }, "watcher_engine_up"));

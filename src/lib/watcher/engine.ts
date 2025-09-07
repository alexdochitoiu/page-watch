import { chromium, Browser, Page } from "playwright";
import { WatcherRule, Operation } from "@/types/watcher";

export interface WatcherCheckResult {
  success: boolean;
  message: string;
  ruleResults: RuleResult[];
  screenshot?: string;
  timestamp: string;
}

export interface RuleResult {
  ruleId: string;
  passed: boolean;
  actualValue?: string;
  expectedValue?: string;
  error?: string;
}

export class WatcherEngine {
  private browser: Browser | null = null;

  async initialize() {
    console.log("🌐 [WATCHER-ENGINE] Initializing browser...");
    if (!this.browser) {
      try {
        this.browser = await chromium.launch({
          headless: true,
          args: [
            "--no-sandbox",
            "--disable-dev-shm-usage",
            "--disable-blink-features=AutomationControlled",
            "--disable-web-security",
            "--disable-features=VizDisplayCompositor",
          ],
        });
        console.log("✅ [WATCHER-ENGINE] Browser launched successfully");
      } catch (error) {
        console.error("💥 [WATCHER-ENGINE] Failed to launch browser:", error);
        throw error;
      }
    } else {
      console.log("✅ [WATCHER-ENGINE] Browser already initialized");
    }
  }

  async cleanup() {
    console.log("🧹 [WATCHER-ENGINE] Cleaning up browser...");
    if (this.browser) {
      try {
        await this.browser.close();
        this.browser = null;
        console.log("✅ [WATCHER-ENGINE] Browser closed successfully");
      } catch (error) {
        console.error("💥 [WATCHER-ENGINE] Error closing browser:", error);
      }
    }
  }

  async checkWatcher(url: string, rules: WatcherRule[]): Promise<WatcherCheckResult> {
    const startTime = Date.now();
    console.log(`🔍 [WATCHER-ENGINE] Starting check for URL: ${url}`);
    console.log(`🔍 [WATCHER-ENGINE] Rules to evaluate: ${rules.length}`);

    let page: Page | null = null;

    try {
      // Initialize browser
      console.log("🌐 [WATCHER-ENGINE] Initializing browser...");
      await this.initialize();

      console.log("📄 [WATCHER-ENGINE] Creating new page...");
      page = await this.browser!.newPage();

      // Set user agent to avoid being detected as a bot
      await page.setExtraHTTPHeaders({
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      });

      // Set viewport size
      await page.setViewportSize({ width: 1920, height: 1080 });

      // Navigate to the URL with more robust settings
      console.log(`🌍 [WATCHER-ENGINE] Navigating to: ${url}`);
      const navigationStart = Date.now();

      // Try multiple navigation strategies
      let navigationSuccess = false;
      const strategies = [
        { waitUntil: "domcontentloaded" as const, timeout: 45000, name: "domcontentloaded" },
        { waitUntil: "load" as const, timeout: 60000, name: "load" },
        { waitUntil: "networkidle" as const, timeout: 30000, name: "networkidle" },
      ];

      for (const strategy of strategies) {
        try {
          console.log(
            `🔄 [WATCHER-ENGINE] Trying navigation strategy: ${strategy.name} (timeout: ${strategy.timeout}ms)`
          );
          await page.goto(url, {
            waitUntil: strategy.waitUntil,
            timeout: strategy.timeout,
          });
          navigationSuccess = true;
          console.log(`✅ [WATCHER-ENGINE] Navigation successful with strategy: ${strategy.name}`);
          break;
        } catch (error) {
          console.warn(
            `⚠️ [WATCHER-ENGINE] Strategy ${strategy.name} failed:`,
            error instanceof Error ? error.message : error
          );
          if (strategy === strategies[strategies.length - 1]) {
            // If this is the last strategy, rethrow the error
            throw error;
          }
        }
      }

      const navigationTime = Date.now() - navigationStart;
      console.log(`✅ [WATCHER-ENGINE] Navigation completed in ${navigationTime}ms`);

      // Wait a bit more for any dynamic content to load
      console.log(`⏳ [WATCHER-ENGINE] Waiting for dynamic content...`);
      await page.waitForTimeout(3000);

      // Take screenshot for debugging
      console.log("📸 [WATCHER-ENGINE] Taking screenshot...");
      const screenshotStart = Date.now();
      const screenshotBuffer = await page.screenshot();
      const screenshot = screenshotBuffer.toString("base64");
      const screenshotTime = Date.now() - screenshotStart;
      console.log(`✅ [WATCHER-ENGINE] Screenshot taken in ${screenshotTime}ms`);

      // Evaluate all rules
      console.log("📋 [WATCHER-ENGINE] Starting rule evaluation...");
      const ruleResults: RuleResult[] = [];
      let overallSuccess = true;

      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        console.log(`🔍 [WATCHER-ENGINE] Evaluating rule ${i + 1}/${rules.length}: ${rule.id}`);
        console.log(`🔍 [WATCHER-ENGINE] Rule details:`, JSON.stringify(rule, null, 2));

        const ruleStart = Date.now();
        const result = await this.evaluateRule(page, rule);
        const ruleTime = Date.now() - ruleStart;

        console.log(
          `📊 [WATCHER-ENGINE] Rule ${rule.id} result (${ruleTime}ms):`,
          JSON.stringify(result, null, 2)
        );
        ruleResults.push(result);

        // Handle logic operators
        if (i === 0) {
          overallSuccess = result.passed;
          console.log(`📊 [WATCHER-ENGINE] Initial success state: ${overallSuccess}`);
        } else {
          const prevRule = rules[i - 1];
          const previousSuccess = overallSuccess;

          if (prevRule.logicOperator === "and") {
            overallSuccess = overallSuccess && result.passed;
            console.log(
              `📊 [WATCHER-ENGINE] AND operation: ${previousSuccess} && ${result.passed} = ${overallSuccess}`
            );
          } else if (prevRule.logicOperator === "or") {
            overallSuccess = overallSuccess || result.passed;
            console.log(
              `📊 [WATCHER-ENGINE] OR operation: ${previousSuccess} || ${result.passed} = ${overallSuccess}`
            );
          } else {
            console.log(
              `📊 [WATCHER-ENGINE] No logic operator, keeping previous success: ${overallSuccess}`
            );
          }
        }
      }

      const totalTime = Date.now() - startTime;
      console.log(
        `✅ [WATCHER-ENGINE] All rules evaluated in ${totalTime}ms. Overall success: ${overallSuccess}`
      );

      const finalResult = {
        success: overallSuccess,
        message: overallSuccess ? "All rules passed" : "Some rules failed",
        ruleResults,
        screenshot: `data:image/png;base64,${screenshot}`,
        timestamp: new Date().toISOString(),
      };

      console.log(
        `📊 [WATCHER-ENGINE] Final result summary: ${finalResult.success ? "SUCCESS" : "FAILURE"}`
      );
      return finalResult;
    } catch (error) {
      const totalTime = Date.now() - startTime;
      console.error(`💥 [WATCHER-ENGINE] Error during watcher check after ${totalTime}ms:`, error);
      console.error(
        `💥 [WATCHER-ENGINE] Error stack:`,
        error instanceof Error ? error.stack : "No stack trace"
      );

      return {
        success: false,
        message: `Error checking watcher: ${error instanceof Error ? error.message : "Unknown error"}`,
        ruleResults: [],
        timestamp: new Date().toISOString(),
      };
    } finally {
      if (page) {
        console.log("🧹 [WATCHER-ENGINE] Closing page...");
        try {
          await page.close();
          console.log("✅ [WATCHER-ENGINE] Page closed successfully");
        } catch (error) {
          console.error("💥 [WATCHER-ENGINE] Error closing page:", error);
        }
      }
    }
  }

  private async evaluateRule(page: Page, rule: WatcherRule): Promise<RuleResult> {
    console.log(`🔍 [RULE-EVAL] Starting evaluation for rule: ${rule.id}`);
    console.log(`🔍 [RULE-EVAL] Selector: "${rule.selector}", Operation: ${rule.operation}`);

    try {
      const { selector, operation, value, not } = rule;

      let result: boolean = false;
      let actualValue: string | undefined;

      // First, check if the selector is valid and element exists
      console.log(`🔍 [RULE-EVAL] Checking if selector "${selector}" finds elements...`);
      const elementCount = await page.locator(selector).count();
      console.log(`🔍 [RULE-EVAL] Found ${elementCount} elements with selector "${selector}"`);

      switch (operation) {
        case Operation.ELEMENT_EXISTS:
          console.log(`🔍 [RULE-EVAL] ELEMENT_EXISTS: checking if element exists`);
          const elementExists = elementCount > 0;
          result = elementExists;
          actualValue = elementExists ? "Element exists" : "Element does not exist";
          console.log(`📊 [RULE-EVAL] ELEMENT_EXISTS result: ${result} (${actualValue})`);
          break;

        case Operation.CONTAINS:
          console.log(`🔍 [RULE-EVAL] CONTAINS: getting text content to check for "${value}"`);
          if (elementCount === 0) {
            console.warn(`⚠️ [RULE-EVAL] No elements found for CONTAINS operation`);
            actualValue = "No elements found";
            result = false;
          } else {
            const textContent = await page.locator(selector).first().textContent();
            actualValue = textContent || "";
            result = textContent ? textContent.includes(value || "") : false;
            console.log(
              `📊 [RULE-EVAL] CONTAINS: "${actualValue}" contains "${value}" = ${result}`
            );
          }
          break;

        case Operation.EQUALS:
          console.log(`🔍 [RULE-EVAL] EQUALS: getting text content to compare with "${value}"`);
          if (elementCount === 0) {
            console.warn(`⚠️ [RULE-EVAL] No elements found for EQUALS operation`);
            actualValue = "No elements found";
            result = false;
          } else {
            const exactContent = await page.locator(selector).first().textContent();
            actualValue = exactContent || "";
            result = exactContent === value;
            console.log(`📊 [RULE-EVAL] EQUALS: "${actualValue}" === "${value}" = ${result}`);
          }
          break;

        case Operation.GREATER_THAN:
          console.log(
            `🔍 [RULE-EVAL] GREATER_THAN: getting numeric content to compare with ${value}`
          );
          if (elementCount === 0) {
            console.warn(`⚠️ [RULE-EVAL] No elements found for GREATER_THAN operation`);
            actualValue = "No elements found";
            result = false;
          } else {
            const gtContent = await page.locator(selector).first().textContent();
            actualValue = gtContent || "";
            const gtNumber = parseFloat(gtContent?.replace(/[^\d.-]/g, "") || "0");
            const gtTarget = parseFloat(value || "0");
            result = gtNumber > gtTarget;
            console.log(
              `📊 [RULE-EVAL] GREATER_THAN: ${gtNumber} > ${gtTarget} = ${result} (from "${actualValue}")`
            );
          }
          break;

        case Operation.LESS_THAN:
          console.log(`🔍 [RULE-EVAL] LESS_THAN: getting numeric content to compare with ${value}`);
          if (elementCount === 0) {
            console.warn(`⚠️ [RULE-EVAL] No elements found for LESS_THAN operation`);
            actualValue = "No elements found";
            result = false;
          } else {
            const ltContent = await page.locator(selector).first().textContent();
            actualValue = ltContent || "";
            const ltNumber = parseFloat(ltContent?.replace(/[^\d.-]/g, "") || "0");
            const ltTarget = parseFloat(value || "0");
            result = ltNumber < ltTarget;
            console.log(
              `📊 [RULE-EVAL] LESS_THAN: ${ltNumber} < ${ltTarget} = ${result} (from "${actualValue}")`
            );
          }
          break;

        case Operation.REGEX_MATCH:
          console.log(`🔍 [RULE-EVAL] REGEX_MATCH: testing content against pattern "${value}"`);
          if (elementCount === 0) {
            console.warn(`⚠️ [RULE-EVAL] No elements found for REGEX_MATCH operation`);
            actualValue = "No elements found";
            result = false;
          } else {
            const regexContent = await page.locator(selector).first().textContent();
            actualValue = regexContent || "";
            if (value) {
              try {
                const regex = new RegExp(value);
                result = regex.test(regexContent || "");
                console.log(
                  `📊 [RULE-EVAL] REGEX_MATCH: /${value}/.test("${actualValue}") = ${result}`
                );
              } catch (regexError) {
                console.error(`💥 [RULE-EVAL] Invalid regex pattern "${value}":`, regexError);
                throw new Error(`Invalid regex pattern: ${value}`);
              }
            } else {
              console.warn(`⚠️ [RULE-EVAL] No regex pattern provided`);
              result = false;
            }
          }
          break;

        default:
          throw new Error(`Unknown operation: ${operation}`);
      }

      // Apply NOT logic if specified
      if (not) {
        const originalResult = result;
        result = !result;
        console.log(`🔄 [RULE-EVAL] NOT applied: ${originalResult} -> ${result}`);
      }

      const finalResult = {
        ruleId: rule.id,
        passed: result,
        actualValue,
        expectedValue: value,
        error: undefined,
      };

      console.log(`✅ [RULE-EVAL] Rule ${rule.id} completed: ${result ? "PASSED" : "FAILED"}`);
      return finalResult;
    } catch (error) {
      console.error(`💥 [RULE-EVAL] Error evaluating rule ${rule.id}:`, error);
      return {
        ruleId: rule.id,
        passed: false,
        actualValue: undefined,
        expectedValue: rule.value,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

// Export singleton instance
export const watcherEngine = new WatcherEngine();

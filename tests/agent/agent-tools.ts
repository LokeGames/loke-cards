/**
 * Agentic Browser Tools for Loke Cards Testing
 *
 * This provides AI-driven browser control with observations and actions.
 * The AI can "see" the page through DOM/ARIA/console logs and "act" through tools.
 */

import { Page, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ESM compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface Observation {
  url: string;
  title: string;
  roles: Array<{ role: string; name: string; tag?: string }>;
  consoleLogs: string[];
  timestamp: string;
}

export interface ToolResult {
  success: boolean;
  observation?: Observation;
  error?: string;
  screenshot?: string;
}

/**
 * Console log collector - captures all browser console messages
 */
class ConsoleCollector {
  private logs: string[] = [];
  private maxLogs = 100;

  constructor(page: Page) {
    page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();
      const entry = `[${type.toUpperCase()}] ${text}`;
      this.logs.push(entry);
      if (this.logs.length > this.maxLogs) {
        this.logs.shift();
      }
    });

    page.on('pageerror', (error) => {
      this.logs.push(`[ERROR] ${error.message}`);
    });
  }

  getLogs(): string[] {
    return [...this.logs];
  }

  clear(): void {
    this.logs = [];
  }
}

/**
 * Serialize page view into AI-readable format
 */
async function serializeView(page: Page, consoleCollector: ConsoleCollector): Promise<Observation> {
  // Extract ARIA roles and interactive elements
  const roles = await page.evaluate(() => {
    const out: Array<{ role: string; name: string; tag?: string }> = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);

    while (walker.nextNode()) {
      const el = walker.currentNode as HTMLElement;
      const role = el.getAttribute('role') || (el as any).role;
      const ariaLabel = el.getAttribute('aria-label');
      const textContent = el.textContent?.trim() || '';
      const tag = el.tagName.toLowerCase();

      // Capture buttons, links, inputs, and elements with roles
      if (role || tag === 'button' || tag === 'a' || tag === 'input' || tag === 'select') {
        const name = ariaLabel || textContent.slice(0, 80);
        if (name && name.length > 0) {
          out.push({
            role: role || tag,
            name,
            tag
          });
        }
      }
    }

    // Limit to first 200 elements to avoid token overflow
    return out.slice(0, 200);
  });

  const url = page.url();
  const title = await page.title();
  const consoleLogs = consoleCollector.getLogs();
  const timestamp = new Date().toISOString();

  return { url, title, roles, consoleLogs, timestamp };
}

/**
 * Create locator from flexible selector
 */
function locator(page: Page, by: { role?: string; name?: string; css?: string; text?: string }) {
  if (by.role && by.name) {
    return page.getByRole(by.role as any, { name: new RegExp(by.name, 'i') });
  }
  if (by.text) {
    return page.getByText(by.text, { exact: false });
  }
  if (by.css) {
    return page.locator(by.css);
  }
  throw new Error('No valid selector provided');
}

/**
 * Save screenshot with timestamp
 */
async function saveScreenshot(page: Page, label: string): Promise<string> {
  const timestamp = Date.now();
  const filename = `${timestamp}-${label.replace(/\s+/g, '-')}.png`;
  const filepath = path.join(__dirname, 'artifacts', filename);

  await page.screenshot({ path: filepath, fullPage: true });
  return filepath;
}

/**
 * Agent Tools - These are the actions the AI can perform
 */
export function makeTools(page: Page) {
  const consoleCollector = new ConsoleCollector(page);

  return {
    /**
     * Navigate to URL
     */
    async goto(url: string): Promise<ToolResult> {
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });
        const observation = await serializeView(page, consoleCollector);
        return { success: true, observation };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },

    /**
     * Click element by role/name/css/text
     */
    async click(by: { role?: string; name?: string; css?: string; text?: string }): Promise<ToolResult> {
      try {
        const loc = locator(page, by);
        await loc.click({ timeout: 5000 });
        await page.waitForTimeout(500); // Brief wait for UI updates
        const observation = await serializeView(page, consoleCollector);
        return { success: true, observation };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },

    /**
     * Fill input field
     */
    async fill(by: { role?: string; name?: string; css?: string }, text: string): Promise<ToolResult> {
      try {
        const loc = locator(page, by);
        await loc.fill(text, { timeout: 5000 });
        const observation = await serializeView(page, consoleCollector);
        return { success: true, observation };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },

    /**
     * Press keyboard key
     */
    async press(key: string): Promise<ToolResult> {
      try {
        await page.keyboard.press(key);
        await page.waitForTimeout(300);
        const observation = await serializeView(page, consoleCollector);
        return { success: true, observation };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },

    /**
     * Wait for text to be visible
     */
    async waitForText(text: string, timeout: number = 5000): Promise<ToolResult> {
      try {
        await page.getByText(text, { exact: false }).waitFor({ timeout });
        const observation = await serializeView(page, consoleCollector);
        return { success: true, observation };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },

    /**
     * Assert element is visible
     */
    async assertVisible(text: string): Promise<ToolResult> {
      try {
        await expect(page.getByText(text, { exact: false })).toBeVisible({ timeout: 5000 });
        const observation = await serializeView(page, consoleCollector);
        return { success: true, observation };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },

    /**
     * Assert element is NOT visible
     */
    async assertNotVisible(text: string): Promise<ToolResult> {
      try {
        await expect(page.getByText(text, { exact: false })).not.toBeVisible({ timeout: 3000 });
        const observation = await serializeView(page, consoleCollector);
        return { success: true, observation };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },

    /**
     * Take screenshot with label
     */
    async screenshot(label: string): Promise<ToolResult> {
      try {
        const filepath = await saveScreenshot(page, label);
        const observation = await serializeView(page, consoleCollector);
        return { success: true, observation, screenshot: filepath };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },

    /**
     * Get current page observation (read-only)
     */
    async observe(): Promise<ToolResult> {
      try {
        const observation = await serializeView(page, consoleCollector);
        return { success: true, observation };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },

    /**
     * Wait for navigation/network idle
     */
    async waitForLoad(): Promise<ToolResult> {
      try {
        await page.waitForLoadState('networkidle', { timeout: 10000 });
        const observation = await serializeView(page, consoleCollector);
        return { success: true, observation };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    },

    /**
     * Clear console logs
     */
    clearLogs(): void {
      consoleCollector.clear();
    }
  };
}

export type AgentTools = ReturnType<typeof makeTools>;

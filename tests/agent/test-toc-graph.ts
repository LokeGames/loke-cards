/**
 * Agentic Test: TOC Graph Visualization
 *
 * Tests the GitKraken-style TOC Graph feature:
 * - Navigation to /cards/toc-graph route
 * - Graph rendering with SVG elements
 * - Presence of rails, edges, and nodes
 * - No console errors
 */

import { chromium } from 'playwright';
import { makeTools } from './agent-tools';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ESM compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TestStep {
  step: number;
  action: string;
  result: any;
  screenshot?: string;
  timestamp: string;
}

class TestReport {
  private steps: TestStep[] = [];
  private startTime: Date = new Date();

  addStep(action: string, result: any, screenshot?: string) {
    this.steps.push({
      step: this.steps.length + 1,
      action,
      result,
      screenshot,
      timestamp: new Date().toISOString()
    });
  }

  save(filename: string) {
    const report = {
      testName: 'TOC Graph Visualization',
      startTime: this.startTime.toISOString(),
      endTime: new Date().toISOString(),
      duration: Date.now() - this.startTime.getTime(),
      steps: this.steps,
      summary: {
        totalSteps: this.steps.length,
        successful: this.steps.filter(s => s.result?.success).length,
        failed: this.steps.filter(s => !s.result?.success).length
      }
    };

    const filepath = path.join(__dirname, 'artifacts', filename);

    // Ensure artifacts directory exists
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Report saved: ${filepath}`);
    return report;
  }
}

/**
 * Test Scenario: TOC Graph Visualization
 */
async function testTocGraphVisualization() {
  console.log('🎬 Starting Agentic Test: TOC Graph Visualization\n');

  const browser = await chromium.launch({
    headless: false, // Show browser for observation
    slowMo: 500      // Slow down for better visibility
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 } // Larger viewport for graph
  });

  const page = await context.newPage();
  const tools = makeTools(page);
  const report = new TestReport();

  try {
    // ==========================================
    // STEP 1: Navigate to app
    // ==========================================
    console.log('📍 Step 1: Navigate to http://localhost:5183/');
    let result = await tools.goto('http://localhost:5183/');
    report.addStep('goto http://localhost:5183/', result);

    if (!result.success) {
      throw new Error(`Failed to load app: ${result.error}`);
    }

    console.log(`   ✓ Page loaded: ${result.observation?.title}`);
    console.log(`   📊 Found ${result.observation?.roles.length} interactive elements`);

    // ==========================================
    // STEP 2: Navigate to TOC Graph route
    // ==========================================
    console.log('\n🎯 Step 2: Navigate to /cards/toc-graph');
    result = await tools.goto('http://localhost:5183/cards/toc-graph');
    report.addStep('goto /cards/toc-graph', result);

    if (!result.success) {
      throw new Error(`Failed to load TOC Graph page: ${result.error}`);
    }

    console.log(`   ✓ TOC Graph page loaded`);
    console.log(`   📍 Current URL: ${result.observation?.url}`);

    // Take initial screenshot
    result = await tools.screenshot('01-toc-graph-loaded');
    report.addStep('screenshot: toc-graph-loaded', result, result.screenshot);
    console.log(`   📷 Screenshot saved: ${result.screenshot}`);

    // ==========================================
    // STEP 3: Wait for page to fully load
    // ==========================================
    console.log('\n⏳ Step 3: Wait for page load');
    result = await tools.waitForLoad();
    report.addStep('wait for network idle', result);
    console.log('   ✓ Page fully loaded');

    // ==========================================
    // STEP 4: Check for SVG elements
    // ==========================================
    console.log('\n🔍 Step 4: Check for SVG graph elements');

    const svgElementsCheck = await page.evaluate(() => {
      const svg = document.querySelector('svg');
      if (!svg) {
        return { found: false, error: 'No SVG element found' };
      }

      const circles = svg.querySelectorAll('circle').length;
      const paths = svg.querySelectorAll('path').length;
      const lines = svg.querySelectorAll('line').length;
      const texts = svg.querySelectorAll('text').length;

      return {
        found: true,
        svg: true,
        circles,
        paths,
        lines,
        texts,
        viewBox: svg.getAttribute('viewBox')
      };
    });

    report.addStep('check SVG elements', { success: svgElementsCheck.found, observation: svgElementsCheck });

    if (svgElementsCheck.found) {
      console.log('   ✓ SVG graph found!');
      console.log(`   📊 Graph contains:`);
      console.log(`      - ${svgElementsCheck.circles} circles (nodes)`);
      console.log(`      - ${svgElementsCheck.paths} paths (edges/curves)`);
      console.log(`      - ${svgElementsCheck.lines} lines (rails)`);
      console.log(`      - ${svgElementsCheck.texts} text labels`);
      console.log(`      - ViewBox: ${svgElementsCheck.viewBox}`);
    } else {
      console.log(`   ⚠ SVG not found: ${svgElementsCheck.error}`);
    }

    // Take screenshot of graph
    result = await tools.screenshot('02-graph-elements');
    report.addStep('screenshot: graph-elements', result, result.screenshot);
    console.log(`   📷 Screenshot saved: ${result.screenshot}`);

    // ==========================================
    // STEP 5: Check for TOC list (left column)
    // ==========================================
    console.log('\n📋 Step 5: Check for TOC list');
    result = await tools.waitForText('Table of Contents', 3000);
    report.addStep('verify TOC heading', result);

    if (result.success) {
      console.log('   ✓ TOC heading found');
    } else {
      console.log('   ⚠ TOC heading not found');
    }

    // ==========================================
    // STEP 6: Check for empty state or data
    // ==========================================
    console.log('\n📦 Step 6: Check for graph data or empty state');

    const hasEmptyState = await page.evaluate(() => {
      const body = document.body.textContent || '';
      return body.includes('No scenes found') || body.includes('Create some scenes first');
    });

    if (hasEmptyState) {
      console.log('   ℹ Empty state detected (no scenes in database)');
      console.log('   💡 This is expected if database is empty');
    } else {
      console.log('   ✓ Graph has data (scenes exist)');
    }

    report.addStep('check empty state', { success: true, observation: { hasEmptyState } });

    // ==========================================
    // STEP 7: Check console for errors
    // ==========================================
    console.log('\n📝 Step 7: Check console logs for errors');
    result = await tools.observe();
    report.addStep('check console logs', result);

    const consoleLogs = result.observation?.consoleLogs || [];
    const errors = consoleLogs.filter(log => log.includes('[ERROR]'));
    const warnings = consoleLogs.filter(log => log.includes('[WARNING]'));

    console.log(`   Total console logs: ${consoleLogs.length}`);
    console.log(`   Errors: ${errors.length}`);
    console.log(`   Warnings: ${warnings.length}`);

    if (errors.length > 0) {
      console.log('\n   ⚠ Console errors found:');
      errors.forEach(err => console.log(`      ${err}`));
    } else {
      console.log('   ✓ No console errors!');
    }

    if (consoleLogs.length > 0) {
      console.log('\n   Recent console logs:');
      consoleLogs.slice(-5).forEach(log => {
        console.log(`      ${log}`);
      });
    }

    // ==========================================
    // STEP 8: Test responsive layout
    // ==========================================
    console.log('\n📐 Step 8: Test responsive layout');

    const layoutCheck = await page.evaluate(() => {
      const grid = document.querySelector('.grid');
      const svg = document.querySelector('svg');

      return {
        hasGrid: !!grid,
        hasSvg: !!svg,
        gridClasses: grid?.className || '',
        svgWidth: svg?.clientWidth || 0,
        svgHeight: svg?.clientHeight || 0
      };
    });

    report.addStep('check responsive layout', { success: layoutCheck.hasGrid && layoutCheck.hasSvg, observation: layoutCheck });

    console.log(`   Grid layout: ${layoutCheck.hasGrid ? '✓' : '✗'}`);
    console.log(`   SVG size: ${layoutCheck.svgWidth}x${layoutCheck.svgHeight}px`);
    console.log(`   Grid classes: ${layoutCheck.gridClasses}`);

    // Final screenshot
    result = await tools.screenshot('03-final-state');
    report.addStep('screenshot: final-state', result, result.screenshot);
    console.log(`\n📷 Final screenshot: ${result.screenshot}`);

    // ==========================================
    // STEP 9: Navigation test - go back to TOC
    // ==========================================
    console.log('\n🔙 Step 9: Test navigation back to regular TOC');
    result = await tools.click({ text: 'Table of Contents' });
    report.addStep('click TOC nav link', result);

    if (result.success) {
      console.log('   ✓ Clicked TOC nav link');
      console.log(`   📍 Current URL: ${result.observation?.url}`);

      // Should be at /cards/toc now
      const isAtToc = result.observation?.url.includes('/cards/toc') && !result.observation?.url.includes('/cards/toc-graph');
      console.log(`   Navigation to /cards/toc: ${isAtToc ? '✓' : '✗'}`);
    }

    console.log('\n✅ Test completed successfully!');

  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message);
    report.addStep('ERROR', { success: false, error: error.message });

    // Take error screenshot
    try {
      const result = await tools.screenshot('ERROR-state');
      report.addStep('screenshot: error-state', result, result.screenshot);
      console.log(`📷 Error screenshot: ${result.screenshot}`);
    } catch {}
  } finally {
    // Generate report
    const finalReport = report.save('test-report-toc-graph.json');

    console.log('\n📊 Test Summary:');
    console.log(`   Total Steps: ${finalReport.summary.totalSteps}`);
    console.log(`   Successful: ${finalReport.summary.successful}`);
    console.log(`   Failed: ${finalReport.summary.failed}`);
    console.log(`   Duration: ${finalReport.duration}ms`);

    // Wait a bit before closing to see final state
    await page.waitForTimeout(2000);
    await browser.close();
  }
}

// Run the test
testTocGraphVisualization().catch(console.error);

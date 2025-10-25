/**
 * Agentic Test: ProjectPicker Basic Flow
 *
 * This test demonstrates AI-driven UI testing where the test
 * can observe the browser (DOM + console logs) and make decisions.
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
      testName: 'ProjectPicker Basic Flow',
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
    fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Report saved: ${filepath}`);
    return report;
  }
}

/**
 * Test Scenario: ProjectPicker Basic Flow
 */
async function testProjectPickerBasicFlow() {
  console.log('🎬 Starting Agentic Test: ProjectPicker Basic Flow\n');

  const browser = await chromium.launch({
    headless: false, // Show browser so AI can "see"
    slowMo: 500      // Slow down for observation
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
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
    console.log(`   📝 Console logs: ${result.observation?.consoleLogs.length} entries`);

    // Print console logs
    if (result.observation?.consoleLogs.length) {
      console.log('\n   Browser Console:');
      result.observation.consoleLogs.forEach(log => {
        console.log(`      ${log}`);
      });
    }

    // ==========================================
    // STEP 2: Take initial screenshot
    // ==========================================
    console.log('\n📷 Step 2: Capture initial state');
    result = await tools.screenshot('01-initial-load');
    report.addStep('screenshot: initial-load', result, result.screenshot);
    console.log(`   ✓ Screenshot saved: ${result.screenshot}`);

    // ==========================================
    // STEP 3: Observe page elements
    // ==========================================
    console.log('\n🔍 Step 3: Observe page elements');
    result = await tools.observe();
    report.addStep('observe page', result);

    console.log('   Interactive elements found:');
    result.observation?.roles.slice(0, 20).forEach((el, i) => {
      console.log(`      ${i + 1}. [${el.role}] "${el.name.slice(0, 50)}"`);
    });

    // ==========================================
    // STEP 4: Look for ProjectPicker or Projects link
    // ==========================================
    console.log('\n🎯 Step 4: Find and click ProjectPicker/Projects');

    // Try to find Projects link in sidebar or ProjectPicker button
    const projectElements = result.observation?.roles.filter(el =>
      el.name.toLowerCase().includes('project') ||
      el.name.toLowerCase().includes('horror') ||
      el.name.toLowerCase().includes('adventure')
    );

    console.log(`   Found ${projectElements?.length} project-related elements:`);
    projectElements?.forEach(el => {
      console.log(`      - [${el.role}] "${el.name}"`);
    });

    // Try clicking Projects in sidebar
    result = await tools.click({ text: 'Projects' });
    report.addStep('click Projects link', result);

    if (result.success) {
      console.log('   ✓ Clicked Projects link');
      console.log(`   📍 Current URL: ${result.observation?.url}`);

      // Take screenshot of projects page
      result = await tools.screenshot('02-projects-page');
      report.addStep('screenshot: projects-page', result, result.screenshot);
      console.log(`   ✓ Screenshot saved: ${result.screenshot}`);
    } else {
      console.log(`   ⚠ Could not click Projects link: ${result.error}`);

      // Alternative: try finding ProjectPicker button directly
      console.log('   🔄 Trying alternative: look for project button in header');
      result = await tools.click({ role: 'button', name: 'horror' });
      report.addStep('click ProjectPicker button', result);

      if (result.success) {
        console.log('   ✓ Clicked ProjectPicker button');
      }
    }

    // ==========================================
    // STEP 5: Verify project list is visible
    // ==========================================
    console.log('\n✅ Step 5: Verify project elements are visible');

    // Look for known projects
    const projects = ['horror-story', 'adventure-game', 'default'];

    for (const project of projects) {
      result = await tools.waitForText(project, 3000);
      report.addStep(`verify project visible: ${project}`, result);

      if (result.success) {
        console.log(`   ✓ Project found: ${project}`);
      } else {
        console.log(`   ✗ Project not found: ${project}`);
      }
    }

    // Final screenshot
    result = await tools.screenshot('03-final-state');
    report.addStep('screenshot: final-state', result, result.screenshot);
    console.log(`\n📷 Final screenshot: ${result.screenshot}`);

    // ==========================================
    // STEP 6: Observe final console logs
    // ==========================================
    console.log('\n📝 Step 6: Final console log check');
    result = await tools.observe();
    report.addStep('final observation', result);

    console.log(`   Total console logs: ${result.observation?.consoleLogs.length}`);
    if (result.observation?.consoleLogs.length) {
      console.log('\n   Recent console activity:');
      result.observation.consoleLogs.slice(-10).forEach(log => {
        console.log(`      ${log}`);
      });
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
    const finalReport = report.save('test-report-project-picker.json');

    console.log('\n📊 Test Summary:');
    console.log(`   Total Steps: ${finalReport.summary.totalSteps}`);
    console.log(`   Successful: ${finalReport.summary.successful}`);
    console.log(`   Failed: ${finalReport.summary.failed}`);
    console.log(`   Duration: ${finalReport.duration}ms`);

    await browser.close();
  }
}

// Run the test
testProjectPickerBasicFlow().catch(console.error);

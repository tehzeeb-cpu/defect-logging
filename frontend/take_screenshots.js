import puppeteer from 'puppeteer-core';
import path from 'path';

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const outDir = '/Users/mac/.gemini/antigravity-ide/scratch/sobha-quality-management/screenshots';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  // 1. All Activities View
  console.log('Capturing All Activities View...');
  await page.goto('http://localhost:5173/?view=activities', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '1_All_Activities_View.png'), fullPage: false });

  // 2. Defect Threshold Mapping View
  console.log('Capturing Defect Threshold Mapping View...');
  await page.goto('http://localhost:5173/?view=thresholds', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '2_Defect_Threshold_Mapping_View.png'), fullPage: false });

  // 3. Defects Report View
  console.log('Capturing Defects Report View...');
  await page.goto('http://localhost:5173/?view=report', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '3_Defects_Report_View.png'), fullPage: false });

  // 4. Add Activity Modal View
  console.log('Capturing Add Activity Modal View...');
  await page.goto('http://localhost:5173/?view=activities', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));
  const addBtn = await page.$('.btn-black');
  if (addBtn) {
    await addBtn.click();
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(outDir, '4_Add_Activity_Modal.png'), fullPage: false });
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

run().catch(console.error);

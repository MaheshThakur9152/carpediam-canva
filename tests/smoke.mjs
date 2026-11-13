import { chromium } from 'playwright';

const PORT = process.env.PORT || 4321;
const BASE_URL = `http://localhost:${PORT}`;

async function smokeTest() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const errors = [];

  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Test 1: Home page loads with Next.js loading screen
    console.log('Testing Home page and Loading Screen...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    const loader = await page.$('#site-loading-screen');
    if (!loader) throw new Error('New Next.js loading screen element (#site-loading-screen) missing');

    // Loader shows the logo only: no progress line or text label
    if (await page.$('.loader-line, .loader-label')) throw new Error('Loader should show only the logo');

    const loaderLogo = await page.$('.loader-logo');
    if (!loaderLogo) throw new Error('.loader-logo missing');

    // Wait for loader to complete and dismiss (2.2s timer + 0.8s transition)
    await page.waitForTimeout(3200);
    const isHidden = await page.$eval('#site-loading-screen', el => {
      const style = window.getComputedStyle(el);
      return style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0';
    });
    if (!isHidden) throw new Error('Loading screen did not dismiss within expected time');

    // Test 2: Hero Carousel on Home page
    console.log('Testing Hero Carousel on Home...');
    const activeSlide = await page.$('.hero-slide.is-active');
    if (!activeSlide) throw new Error('No active hero slide found on Home');

    // Test 3: Navigate to /the-edit (The Edit Option 1 3x3 grid)
    console.log('Testing /the-edit (Option 1 3x3 gallery grid)...');
    await page.goto(`${BASE_URL}/the-edit`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    const editGrid = await page.$('#the-edit-grid');
    if (!editGrid) throw new Error('#the-edit-grid element missing on /the-edit');

    const cards = await page.$$('#the-edit-grid .the-edit-card:not(.is-clone)');
    if (cards.length !== 9) throw new Error(`Expected 9 edit cards, found: ${cards.length}`);

    // Verify first card image loads
    const firstImg = await page.$eval('#the-edit-grid .the-edit-card img', el => el.getAttribute('src'));
    if (!firstImg || !firstImg.includes('earing.avif')) throw new Error(`First card src unexpected: ${firstImg}`);

    // Test 4: Navigate to /atelier
    console.log('Testing /atelier tab preservation...');
    await page.goto(`${BASE_URL}/atelier`, { waitUntil: 'domcontentloaded' });
    const atelierTitle = await page.$eval('h1', el => el.textContent?.trim());
    if (!atelierTitle || !atelierTitle.includes('Carpe Diam was born')) throw new Error('Atelier page failed to load');

    // Test 5: Navigate to /contact
    console.log('Testing /contact tab preservation...');
    await page.goto(`${BASE_URL}/contact`, { waitUntil: 'domcontentloaded' });
    const contactTitle = await page.$eval('h1', el => el.textContent?.trim());
    if (!contactTitle || !contactTitle.includes('From the first thought')) throw new Error('Contact page failed to load');

    // Test 6: Direct reload on /the-edit
    console.log('Testing direct reload on /the-edit...');
    await page.goto(`${BASE_URL}/the-edit`, { waitUntil: 'domcontentloaded' });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);
    const reloadedCards = await page.$$('#the-edit-grid .the-edit-card:not(.is-clone)');
    if (reloadedCards.length !== 9) throw new Error('Failed to reload /the-edit');

    if (errors.length > 0) throw new Error(`Console errors: ${errors.join(' | ')}`);
    console.log('✓ All smoke tests passed successfully!');
  } finally {
    await browser.close();
  }
}

smokeTest().catch(err => {
  console.error('Smoke test failed:', err);
  process.exit(1);
});

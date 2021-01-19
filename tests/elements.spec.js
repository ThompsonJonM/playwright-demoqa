const { chromium } = require('playwright');

let browser, page;
const user = {
  name: 'Test Tester',
  email: 'test@test.com',
  currentAddress: '3930 N Pine Grove Ave, Chicago, IL 60613',
  permanentAddress: '24 Girard St, Rochester, NY 14610',
};

beforeAll(async () => {
  browser = await chromium.launch({ headless: false });
  page = await browser.newPage();
});

afterAll(async () => {
  await page.close();
});

it('As a user, I should be able to visit the Elements page', async () => {
  await page.goto('https://www.demoqa.com/elements');
  const headerText = await page.$eval('.main-header', (el) => el.innerText);

  expect(headerText).toContain('Elements');
});

it('As a user, I should be able to collapse the Elements container', async () => {
  await page.goto('https://www.demoqa.com/elements');
  const elementGroupHandle = await page.waitForSelector('.element-group');
  await page.click('.header-right');
  const elementListClass = await elementGroupHandle.$eval('.element-list', (el) => el.className);
  expect(elementListClass).not.toContain('show');
});

it('As a user, I should be able to submit valid data', async () => {
  page.goto('https://www.demoqa.com/text-box');
  const userForm = await page.waitForSelector('#userForm');
  const usernameField = await userForm.$('#userName');
  const userEmailField = await userForm.$('#userEmail');
  const userCurrentAddressField = await userForm.$('#currentAddress');
  const userPermanentAddressField = await userForm.$('#permanentAddress');

  await usernameField.fill(user.name);
  await userEmailField.fill(user.email);
  await userCurrentAddressField.fill(user.currentAddress);
  await userPermanentAddressField.fill(user.permanentAddress);

  await page.click('#submit');

  const output = await page.$('#output');
  for (const [key, value] of Object.entries(user)) {
    const eleValue = await output.$eval(`#${key}`, (el) => el.innerText);
    expect(eleValue).toContain(value);
  }
});

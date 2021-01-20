const { chromium } = require('playwright');

let browser, page;

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

const user = {
  name: 'Test Tester',
  email: 'test@test.com',
  currentAddress: '3930 N Pine Grove Ave, Chicago, IL 60613',
  permanentAddress: '24 Girard St, Rochester, NY 14610',
};

it('As a user, I should be able to submit valid data', async () => {
  await page.goto('https://www.demoqa.com/text-box');
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

it('As a user, I should receive an error when inputting invalid email', async () => {
  await page.goto('https://www.demoqa.com/text-box');
  const userForm = await page.waitForSelector('#userForm');
  const userEmailField = await userForm.$('#userEmail');
  await userEmailField.fill('test');
  await page.click('#submit');
  const emailClass = await userForm.$eval('#userEmail', (el) => el.className);
  expect(emailClass).toContain('field-error');
});

const buttonTuple = [
  ['Double Click', 'doubleClickMessage'],
  ['Right Click', 'rightClickMessage'],
  ['Click', 'dynamicClickMessage'],
];

buttonTuple.forEach(async ($type) => {
  const [clickType, messageSelector] = $type;

  it.only(`As a user, I should be able to ${clickType} an element`, async () => {
    await page.goto('https://www.demoqa.com/buttons');

    if (clickType === 'Double Click') {
      await page.dblclick('#doubleClickBtn');
    } else if (clickType === 'Right Click') {
      await page.click('#rightClickBtn', { button: 'right' });
    } else {
      await page.click('button >> text="Click Me"');
    }
    const messageHandle = await page.$(`#${messageSelector}`);

    expect(!!messageHandle).toBe(true);
  });
});

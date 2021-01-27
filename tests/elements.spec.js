const { chromium } = require('playwright');

let browser, page;
const baseUrl = 'https://www.demoqa.com';

beforeAll(async () => {
  browser = await chromium.launch();
  page = await browser.newPage();
});

afterAll(async () => {
  await page.close();
});

describe('Base Tests', () => {
  it('As a user, I should be able to visit the Elements page', async () => {
    await page.goto(`${baseUrl}/elements`);
    const headerText = await page.innerText('.main-header');

    expect(headerText).toContain('Elements');
  });

  it('As a user, I should be able to collapse the Elements container', async () => {
    await page.goto(`${baseUrl}/elements`);
    const elementGroupHandle = await page.waitForSelector('.element-group');
    await page.click('.header-right');
    const elementList = await elementGroupHandle.$('.element-list');
    const elementListClass = await elementList.getAttribute('class');
    expect(elementListClass).not.toContain('show');
  });
});

describe('Text Box Tests', () => {
  const user = {
    name: 'Test Tester',
    email: 'test@test.com',
    currentAddress: '3930 N Pine Grove Ave, Chicago, IL 60613',
    permanentAddress: '24 Girard St, Rochester, NY 14610',
  };

  it('As a user, I should be able to submit valid data', async () => {
    await page.goto(`${baseUrl}/text-box`);
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
      const eleValue = await output.innerText(`#${key}`);
      expect(eleValue).toContain(value);
    }
  });

  it('As a user, I should receive an error when inputting invalid email', async () => {
    await page.goto(`${baseUrl}/text-box`);
    const userForm = await page.waitForSelector('#userForm');
    const userEmailField = await userForm.$('#userEmail');
    await userEmailField.fill('test');
    await page.click('#submit');
    const emailClass = await userEmailField.getAttribute('class');
    expect(emailClass).toContain('field-error');
  });
});

describe('Buttons Tests', () => {
  const buttonTuple = [
    ['Double Click', 'doubleClickMessage'],
    ['Right Click', 'rightClickMessage'],
    ['Click', 'dynamicClickMessage'],
  ];

  buttonTuple.forEach(async ($type) => {
    const [clickType, messageSelector] = $type;

    it(`As a user, I should be able to ${clickType} an element`, async () => {
      await page.goto(`${baseUrl}/buttons`);

      if (clickType === 'Double Click') {
        await page.dblclick('#doubleClickBtn');
      } else if (clickType === 'Right Click') {
        await page.click('#rightClickBtn', { button: 'right' });
      } else {
        await page.click('button >> text="Click Me"');
      }
      const messageHandle = await page.isVisible(`#${messageSelector}`);

      expect(messageHandle).toBeTruthy();
    });
  });
});

const { chromium } = require('playwright');

let browser, context, page;
const baseUrl = 'https://www.demoqa.com';

beforeAll(async () => {
  browser = await chromium.launch();
  context = await browser.newContext();

  page = await context.newPage();

  await page.goto(`${baseUrl}/login`);
  await page.fill('#userName', 'test.user123');
  await page.fill('#password', 'Test1234!');

  await page.click('#login >> text="Login"');

  const storage = await context.storageState();
  process.env.STORAGE = JSON.stringify(storage);
});

beforeEach(async () => {
  const storageState = JSON.parse(process.env.STORAGE);
  context = await browser.newContext({ storageState });
});

afterAll(async () => {
  await page.close();
});

describe('Add Books Tests', () => {
  it('As a user, I should be able to visit my profile', async () => {
    await page.goto(`${baseUrl}/profile`);
    const profileHandle = await page.isVisible('.profile-wrapper');

    expect(profileHandle).toBeTruthy();
  });

  it('As a user, I should be able to view a single book', async () => {
    await page.route('**/BookStore/v1/Books', (route) =>
      route.fulfill({
        path: './data/books.json'
      }),
    );
    await page.goto(`${baseUrl}/books`);

    const book = await page.isVisible('a >> text="Designing Evolvable Web APIs with ASP.NET"');
    expect(book).toBeTruthy();
  });
});

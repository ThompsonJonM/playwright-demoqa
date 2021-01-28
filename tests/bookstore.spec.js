const { chromium } = require('playwright');
const requestify = require('requestify');
const bookstoreUser = require('../user.json');

let browser, context, page;
const baseUrl = 'https://www.demoqa.com';

beforeEach(async () => {
  browser = await chromium.launch();
  context = await browser.newContext();

  requestify
    .request(`${baseUrl}/Account/v1/Login`, {
      method: 'POST',
      body: {
        userName: bookstoreUser.username,
        password: bookstoreUser.password,
      },
    })
    .then(async (response) => {
      const body = response.getBody();
      const token = body.token;
      const userName = body.username;
      const userID = body.userId;
      const expires = body.expires;

      await context.addCookies([
        { name: 'token', value: token, path: '/', domain: 'www.demoqa.com' },
        { name: 'userName', value: userName, path: '/', domain: 'www.demoqa.com' },
        { name: 'userID', value: userID, path: '/', domain: 'www.demoqa.com' },
        { name: 'expires', value: expires, path: '/', domain: 'www.demoqa.com' },
      ]);
    });

  page = await context.newPage();
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
        path: './data/books.json',
      }),
    );
    await page.goto(`${baseUrl}/books`);

    const book = await page.isVisible('a >> text="Designing Evolvable Web APIs with ASP.NET"');
    expect(book).toBeTruthy();
  });
});

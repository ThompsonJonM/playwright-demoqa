# Playwright Demoqa Project
A testing repository using Microsoft Playwright, Javascript, and Jest to test the DemoQA website.

1. [Tools Used](#tools-used)
2. [Installation](#installation)
3. [Running Tests](#running-tests)
4. [Test Plan](#test-plan)

### Tools Used
- Playwright
- Prettier
- Eslint
- Fishery (Planned)
- Faker (Planned)

### Installation
Simply input the following once cloned:

`npm install`

### Running Tests

To run:

`npm run test`

Tests are headless by default. I intend on adding headless/headful as a command line selection.

### Test Plan
- Navigation
  - Iterate through each menu selection and verify correct page load
- Elements
- Forms
- Alerts
  - Windows can be automated
  - Frames can be automated
  - Nested Frames should be able to be automated
- Widgets
- Interactions
- Book store app
  - Login
    - Successfully login, logout
    - Create command for API login
  - User Register not automatable due to CAPTCHA
    - Consider API
    - POST https://www.demoqa.com/Account/v1/User
      - Request:
      - { userName: {USERNAME}, password: {PASSWORD} }
      - Response:
      - { "userID":{ID},"username":{USERNAME},"books":[] }
  - Add a book
    - UI and API
  - Delete a book
    - UI and API
  - Delete all books
    - UI and API
  - Delete account
    - UI and API

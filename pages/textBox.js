const baseUrl = 'https://www.demoqa.com';

class TextBoxPage {
  constructor(page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto(`${baseUrl}/text-box`);
  }

  async fillForm(user) {
    await this.page.fill('#userName', user.name);
    await this.page.fill('#userEmail', user.email);
    await this.page.fill('#currentAddress', user.currentAddress);
    await this.page.fill('#permanentAddress', user.permanentAddress);
  }
}

module.exports = { TextBoxPage };

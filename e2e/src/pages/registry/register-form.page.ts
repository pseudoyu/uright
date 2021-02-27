import { element, by, browser, ElementFinder, ExpectedConditions } from 'protractor';

const path = require('path');

export class RegisterFormPage {

  public form; author; title; hash; file; button: ElementFinder;

  constructor() {
    this.form = element(by.id('manifest-form'));
    this.author = this.form.element(by.id('inputAuthor'));
    this.title = this.form.element(by.id('inputTitle'));
    this.hash = this.form.element(by.id('inputHash'));
    this.file = this.form.element(by.id('inputFile'));
    this.button = this.form.element(by.id('manifest'));
  }

  async fillFileRegisterForm(title: string, relativePath: string) {
    await this.title.sendKeys(title);
    const absolutePath = path.resolve(__dirname, relativePath);
    await this.file.sendKeys(absolutePath);
    await browser.waitForAngular();
  }

  async fillHashRegisterForm(title: string, hash: string) {
    await this.title.sendKeys(title);
    // Hack to set hash instead of generating it though IPFS because slow for testing
    browser.executeScript('arguments[0].readOnly = false;', this.hash);
    await this.hash.sendKeys(hash);
    await browser.waitForAngular();
  }

  async getInputValidationFeedback(input: ElementFinder): Promise<string> {
    const feedback = await input.element(by.xpath('..')).all(by.css('.invalid-feedback')).last();
    browser.wait(ExpectedConditions.visibilityOf(feedback));
    return feedback.getText();
  }

  async uncheck(id: string) {
    const checkbox = await this.form.element(by.id(id));
    await checkbox.click();
    await browser.waitForAngular();
  }
}

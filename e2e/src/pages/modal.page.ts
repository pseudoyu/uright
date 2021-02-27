import { element, by, ElementFinder, browser, ExpectedConditions } from 'protractor';

export class ModalPage {

  private modal: ElementFinder;
  private header: ElementFinder;
  private body: ElementFinder;
  private closeBtn: ElementFinder;

  constructor() {
    this.modal = element(by.css('div.modal-content'));
    this.header = this.modal.element(by.css('.modal-header'));
    this.body = this.modal.element(by.css('.modal-body'));
    this.closeBtn = this.modal.element(by.css('button.close'));
  }

  async getModalHeader(): Promise<string> {
    browser.wait(ExpectedConditions.presenceOf(this.modal));
    return await this.header.getText();
  }

  async getModalBody(): Promise<string> {
    browser.wait(ExpectedConditions.presenceOf(this.modal));
    return await this.body.getText();
  }

  async closeModal() {
    browser.wait(ExpectedConditions.presenceOf(this.modal));
    await this.closeBtn.click();
  }
}

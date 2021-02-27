import { element, by, ElementFinder, browser, ExpectedConditions } from 'protractor';

export class AlertPage {

  private alerts: ElementFinder;

  constructor() {
    this.alerts = element(by.id('alerts'));
  }

  async getLastAlertMessage(): Promise<string> {
    const lastAlert = this.alerts.all(by.css('.alert')).first();
    browser.wait(ExpectedConditions.presenceOf(lastAlert));
    return await lastAlert.getText();
  }

  async closeLastAlert() {
    await this.alerts.all(by.css('.alert')).first().element(by.css('button.close')).click();
  }
}

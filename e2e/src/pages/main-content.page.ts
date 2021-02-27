import { element, by, browser, ExpectedConditions, ElementFinder } from 'protractor';
import { expect } from 'chai';

export class MainContentPage {

  private mainContainer: ElementFinder;

  constructor() {
    this.mainContainer = element(by.css('main.container'));
  }

  async clickLinkWithText(text: string) {
    await this.mainContainer.element(by.partialLinkText(text)).click();
    browser.waitForAngular();
  }

  async clickButtonWithText(text: string) {
    const button = this.mainContainer.element(by.partialButtonText(text));
    browser.wait(ExpectedConditions.elementToBeClickable(button));
    await button.click();
    browser.waitForAngular();
  }

  async getButtonWithText(text: string): Promise<ElementFinder> {
    return await this.mainContainer.element(by.partialButtonText(text));
  }
}

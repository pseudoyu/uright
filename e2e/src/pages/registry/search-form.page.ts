import { element, by, browser, ElementFinder } from 'protractor';

export class SearchFormPage {

  private form: ElementFinder;
  private hash: ElementFinder;

  constructor() {
    this.form = element(by.id('search-form'));
    this.hash = this.form.element(by.id('inputHash'));
  }

  async fillSearchForm(hash: string) {
    await this.hash.sendKeys(hash);
  }
}

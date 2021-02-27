import { Given, When, Then } from 'cucumber';
import { expect } from 'chai';
import { browser, ExpectedConditions } from 'protractor';
import { NavigationBar } from '../pages/navbar.page';
import { MainContentPage } from '../pages/main-content.page';

const navBar = new NavigationBar();
const mainContent = new MainContentPage();

Given(/^I'm on the home page and authenticated$/, async () => {
  await browser.get('http://localhost:4200');
  expect(await navBar.getSelectedAccount()).to.have.lengthOf.at.least(1);
});

When(/^I go to the home page$/, async () => {
  await navBar.goToHome();
});

When(/^I click menu option "([^"]*)"$/, async (option: string) => {
  await navBar.goToMenuOption(option);
});

When(/^I click submenu option "([^"]*)" in menu "([^"]*)"$/,
  async (option: string, menu: string) => {
  await navBar.goToMenuOption(menu);
  await navBar.goToMenuOption(option);
});

When(/^I click the "([^"]*)" button$/, async (text: string) => {
  await mainContent.clickButtonWithText(text);
});

Then(/^The "([^"]*)" button is disabled$/, async (text: string) => {
  const button = await mainContent.getButtonWithText(text);
  expect(await button.isEnabled(), 'Button with text "' + text + '" should be disabled')
    .to.equal(false);
});

Then(/^The "([^"]*)" button is enabled/, async (text: string) => {
  const button = await mainContent.getButtonWithText(text);
  expect(await button.isEnabled(), 'Button with text "' + text + '" should be enabled')
    .to.equal(true);
});

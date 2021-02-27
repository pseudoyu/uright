import { Given, When, Then } from 'cucumber';
import { expect } from 'chai';
import { AlertPage } from '../pages/alert.page';
import { ModalPage } from '../pages/modal.page';

const alert = new AlertPage();
const modal = new ModalPage();

Then(/^I see alert with text "([^"]*)" and close it$/, async (fragment: string) => {
  expect(await alert.getLastAlertMessage()).to.contain(fragment);
  await alert.closeLastAlert();
});

Then(/^I see alert with text "([^"]*)"$/, async (fragment: string) => {
  expect(await alert.getLastAlertMessage()).to.contain(fragment);
});

Then(/^I see modal with text "([^"]*)" and close it$/, async (fragment: string) => {
  expect(await modal.getModalBody()).to.contain(fragment);
  await modal.closeModal();
});

Then(/^I see modal with text "([^"]*)"$/, async (fragment: string) => {
  expect(await modal.getModalBody()).to.contain(fragment);
});

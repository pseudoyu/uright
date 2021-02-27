import { Given, When, Then } from 'cucumber';
import { RegisterFormPage } from '../pages/registry/register-form.page';
import { expect } from 'chai';
import { browser, by, element, ExpectedConditions } from 'protractor';

const registerForm = new RegisterFormPage();

When(/^I fill the register form with title "([^"]*)" and content file "([^"]*)"$/,
  async (title: string, path: string) => {
  await registerForm.fillFileRegisterForm(title, path);
});

When(/^I fill the register form with title "([^"]*)" and content hash "([^"]*)"$/,
  async (title: string, hash: string) => {
    await registerForm.fillHashRegisterForm(title, hash);
});

When(/^I uncheck the "([^"]*)" option$/,
  async (id: string) => {
    await registerForm.uncheck(id);
});

Then(/^I see validation feedback for hash input with text '([^']*)'$/,
  async (text: string) => {
  expect(await registerForm.getInputValidationFeedback(registerForm.hash)).to.contain(text);
});

When(/^I wait till finished uploading$/,
  async () => {
  browser.wait(ExpectedConditions.textToBePresentInElement(element(by.id('manifest')), 'Register'));
});

Then(/^The Register button is disabled$/, async () => {
  expect(await element(by.id('manifest')).isEnabled(), 'Button Register should be disabled')
    .to.equal(false);
});



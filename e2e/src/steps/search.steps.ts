import { Given, When, Then } from 'cucumber';
import { SearchFormPage } from '../pages/registry/search-form.page';
import { ResultsPage } from '../pages/registry/results.page';
import { expect } from 'chai';

const searchForm = new SearchFormPage();
const results = new ResultsPage();

When(/^I fill the search form with content hash "([^"]*)"$/,
  async (hash: string) => {
  await searchForm.fillSearchForm(hash);
});

Then(/^I see a result with "([^"]*)" "([^"]*)"$/,
  async (attribute: string, value: string) => {
  expect(await results.getResultsCount()).to.equal(1);
  expect(await results.getResultAttributeValue(attribute)).to.include(value);
});

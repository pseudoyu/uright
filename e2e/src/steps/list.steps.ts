import { Given, When, Then } from 'cucumber';
import { ResultsPage } from '../pages/registry/results.page';
import { expect } from 'chai';

const results = new ResultsPage();

Then('I see {int} result', async (count: number) => {
  await expect(await results.getResultsCount()).to.equal(count);
});

'use strict';

const reporter = require('cucumber-html-reporter');

const options = {
    theme: 'bootstrap',
    jsonFile: 'e2e/protractor-cucumber-report.json',
    output: 'e2e/protractor-cucumber_report.html',
    reportSuiteAsScenarios: true,
    launchReport: true
  };

reporter.generate(options);

process.exit();

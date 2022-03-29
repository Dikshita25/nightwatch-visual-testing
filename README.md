### Visual testing using NightwatchJS
This package allows you to perform visual testing using NightwatchJS, it internally extends [nightwatch.js](https://nightwatchjs.org/).

### Details and high-level working
* Perform visual testing using NightwatchJS
* Uses NightwatchJS provided built-in assertions and commands
* Uses assertions to capture screenshot of the page (DOM) and compares the screenshot against the reference (baseline) screenshot.
* If the baseline does not exists, it will be created the very first time you run the test and assertion will pass
* If the baseline does exists, the comparision of screenshot will be performed pixel to pixel and the difference would be shown in red.

### Configuration
1. Install the package using command: 
```
npm install nightwatch-visual-testing
```

2. Add custom command and assertion configuration to your `nightwatch.conf.js`. You can refer the [link](https://nightwatchjs.org/guide/configuration/)

```
  custom_commands_path: [
    './node_modules/nightwatch-visual-testing/commands'
  ],
  custom_assertions_path: [
    './node_modules/nightwatch-visual-testing/assertions'
  ]
```

3. Lastly pass the visual configuration, under the `test_settings` within the `nightwatch.conf.js` to be
```
default: {
  globals: {
    visual_regression_settings: {
      outputDir: './tests_output',
      threshold: 0.5
    },
  },
```      
* outputDir : Refers to directory path, where the reports needs to be generated **(Default: set to 'reports' directory)**
* threshold: Refers to the matching threshold, which ranges from 0 - 1. Smaller the values makes the comparison sensitive **(Default: set to 0.5)**

### Usage
To use the above, we simply need to use the custom assertion `compareScreenshot`. The `compareScreenshot` currently accepts 2 paramater 
1. Name of the test (string)
2. Message for the test (string)

```
module.exports = {
  'Test crunch.io main content is correct': (browser) => {
    browser
      .url('https://dikshitashirodkar.com')
      .assert.compareScreenshot('First test', 'Screenshot captured!');
      .end()
  }
}
```

### Output
A baseline screenshots will be created for the very first time, under `tests_output` directory. 


**Note:** This package works with NightwatchJS & NightwatchJS with CucumberJS integration too :) 

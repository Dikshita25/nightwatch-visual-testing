### Visual testing using NightwatchJS
This package allows you to perform visual testing using NightwatchJS, it internally extends [nightwatch.js](https://nightwatchjs.org/).

### Whats new?
Just launched a new v2 of this package.
* Supports Nightwatch v2
* Additional feature of taking and comparing screenshot of any element, by passing the locator
* Removed dependency from `nightwatch-api`


### Details and high-level working
* Perform visual testing using NightwatchJS
* Uses NightwatchJS provided built-in assertions and commands
* Uses assertions to capture screenshot of the page (DOM) and compares the screenshot against the reference (baseline) screenshot.
* If the baseline does not exists, it will be created the very first time you run the test and assertion will pass
* If the baseline does exists, the comparision of screenshot will be performed pixel to pixel and the difference would be shown in red.

### Installation
- **If using nightwatch v1, be sure to install using command:**
```
npm install nightwatch-visual-testing@1
```
- For nightwatch v2, install:
```
npm install nightwatch-visual-testing
```

### Configuration
1. Add custom command and assertion configuration to your `nightwatch.conf.js`. You can refer the [link](https://nightwatchjs.org/guide/configuration/)

```
  custom_commands_path: [
    './node_modules/nightwatch-visual-testing/commands'
  ],
  custom_assertions_path: [
    './node_modules/nightwatch-visual-testing/assertions'
  ]
```

2. Lastly pass the visual configuration, under the `test_settings` within the `nightwatch.conf.js` to be
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
To use the above, we simply need to use the custom assertion `compareScreenshot` or `compareElementScreenshot`.

1. The `compareScreenshot` currently accepts 2 parameter

|  Name                |  Type   |  Description                  |
| -------------------- | ------- | ----------------------------  |
| `name` (mandatory)   | string  | name of the test              |
| `message` (mandatory) | string  | message on sucess of the test |

```
module.exports = {
  'Test dikshitashirodkar.com main content is correct': (browser) => {
    browser
      .url('https://dikshitashirodkar.com')
      .assert.compareScreenshot('First test', 'Screenshot captured!')
      .end()
  }
}
```

**Note:** Only available in the v2 of this package along with Nightwatchjs v2

2. The `compareElementScreenshot` accepts below parameters

|  Name                 |  Type   |  Description                  |
| --------------------- | ------- | ----------------------------  |
| `using` (optional)    | string  | The locator strategy to use. See [W3C Webdriver - locator strategies](https://www.w3.org/TR/webdriver/#locator-strategies) - default accepts `css selector`|
| `selector` (mandatory) | string  | The CSS/Xpath selector used to locate the element.|
| `name` (mandatory)   | string  | name of the test              |
| `message` (mandatory) | string  | message on sucess of the test |

#### Uses default css selector
```
module.exports = {
  'Test dikshitashirodkar.com main content is correct': (browser) => {
    browser
      .url('https://dikshitashirodkar.com')
      .assert.compareElementScreenshot('span[title="GitHub"]', 'Testing github logo', 'Captured screenshot OK!')
      .end()
  }
}
```

#### Uses any other locate strategy
```
module.exports = {
  'Test dikshitashirodkar.com main content is correct': (browser) => {
    browser
      .url('https://dikshitashirodkar.com')
      .assert.compareElementScreenshot('xpath', '//span[@title="GitHub"]', 'Testing github logo', 'Captured screenshot OK!')
      .end()
  }
}
```

### Output
A baseline screenshots will be created for the very first time, under `tests_output` directory. 


**Note:** This package works with NightwatchJS & NightwatchJS with CucumberJS integration too :) 


const tmp = require('tmp');
const path = require('path');

const { compare, imagePath } = require('../utils/image-diff');
const defaultConfig = require('../defaultVisualConfig');

/**
 * @param {String} name name of the screenshot;
 * @param {String} message Optional message for `nightwatch` to log upon completion
 */
exports.assertion = function compareElementScreenshot() {
  const args = [...arguments];

  if (args.length === 3) {
    args.unshift('css selector');
  }

  const [using, element, name = element, message] = args;

  this.message = message || `Visual regression test results for page <${name}>.`;
  this.expected = true
  this.errorMsg = '';

  this.evaluate = function(value) {
    return value === this.expected
  };

  this.failure = function(result) {
    return result === false || result && result.status === -1;
  };

  this.value = function value(result) {
    return result
  };

  this.command = function command(callback) {
    const visualSettings = browser.globals?.visual_regression_settings || defaultConfig;
    // Reference screenshots are saved in this directory
    // you absolutely should add this directory to version control.
    const referenceDirectory = path.resolve(process.cwd(), visualSettings.outputDir || 'reports', 'visual-reference');

    let currentImage;
    let matched = null;
    let error = '';

    const referenceImage = imagePath({ base: referenceDirectory, name });

    this.api.captureElementScreenshot(using, element, name, (screenshotPath, errorMsg) => {
      if (errorMsg) {
        error = errorMsg;
      };

      currentImage = screenshotPath;
    }).perform(async (done) => {
      // Moving to next block if there is an error.
      if (!error) {
        try {
          const result = await compare({ currentImage, name, referenceImage })
          matched = result;
        } catch (err) {
          error = err.message;
        }
      }

      done();
    }).perform(() => {
      if (error) {
        this.message = error;
      }

      callback(error ? false : matched);
    })
  }
}

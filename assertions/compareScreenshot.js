
const tmp = require('tmp');
const path = require('path');
const { client } = require('nightwatch-api');

const { compare, imagePath } = require('../utils/image-diff');
const defaultConfig = require('../defaultVisualConfig');

/**
 * @param {String} name name of the screenshot;
 * @param {String} message Optional message for `nightwatch` to log upon completion
 */
exports.assertion = function compareScreenshot(
  name,
  message
) {

  this.message = message || `Visual regression test results for page <${name}>.`;
  this.expected = true
  this.errorMsg = '';

  this.pass = function pass(value) {
    this.message = message;
    return value === this.expected
  }

  this.failure = function(result) {
    return result === false || result && result.status === -1;
  };

  // this.formatMessage = function() {
  //   const message = !this.negate ? this.message : this.errorMsg;

  //   return {
  //     message
  //   };
  // };

  this.value = function value(result) {
    return result
  }

  this.command = function command(callback) {
    const visualSettings = client.globals?.visual_regression_settings || defaultConfig;
    // Reference screenshots are saved in this directory
    // you absolutely should add this directory to version control.
    const referenceDirectory = path.resolve(process.cwd(), visualSettings.outputDir, 'visual-reference');

    let currentImage;
    let result;

    const referenceImage = imagePath({ base: referenceDirectory, name });

    this.api
      .captureScreenshot(name, (screenshotPath) => {
          currentImage = screenshotPath;
      })
      .perform(async (done) => {
        try {
          result = await compare({ currentImage, name, referenceImage })
          callback(result);
          done();
        } catch(e) {
          this.message = e.message;
          callback(false);
          done();
        }
      })
      return this;
  }
}


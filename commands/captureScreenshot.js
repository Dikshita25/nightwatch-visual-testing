const tmp = require('tmp');
const path = require('path');
const fs = require('fs');

const { imagePath } = require('../utils/image-diff');
const defaultConfig = require('../defaultVisualConfig');

const currentDirectory = tmp.dirSync().name;

module.exports = class CaptureScreenshot {
  async command(name, cb) {
    try {
      const visualSettings = browser.globals?.visual_regression_settings || defaultConfig;
      const referenceDirectory = path.resolve(process.cwd(), visualSettings.outputDir || 'reports', 'visual-reference');

      const currentImage = imagePath({ base: currentDirectory, name });
      const referenceImage = imagePath({ base: referenceDirectory, name });

      // If no reference image exists yet, a new one is created.
      if (!fs.existsSync(referenceImage)) {
        // eslint-disable-next-line no-console
        console.info(`INFO: Reference image successfully created: ${referenceImage}`);
        browser.saveScreenshot(referenceImage)
      }

      browser.saveScreenshot(currentImage)
      cb(currentImage);
    } catch (err) {
      cb(null, err.message);
    }
  }
}

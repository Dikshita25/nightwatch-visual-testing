const tmp = require('tmp');
const path = require('path');
const fs = require('fs');

const { imagePath } = require('../utils/image-diff');
const defaultConfig = require('../defaultVisualConfig');

const currentDirectory = tmp.dirSync().name;

const saveElementScreenshot = (using, element, path) => {
  return new Promise((resolve, reject) => {
    browser.takeElementScreenshot(using, element, (imageData) => {
      if (imageData.status !== 0) {
        return reject(new Error('Error: Element not found, ensure you have used correct locate strategy or correct element path'));
      };

      fs.writeFile(path, imageData.value, 'base64', function(err) {
        if (err) {
          reject();
          return;
        }

        resolve();
      });
    });
  })
};

module.exports = class CaptureElementScreenshot {
  async command(using, element, name = element, cb) {
    try {
      const visualSettings = browser.globals?.visual_regression_settings || defaultConfig;
      const referenceDirectory = path.resolve(process.cwd(), visualSettings.outputDir || 'reports', 'visual-reference');

      // Creating the reference directory path if not exists.
      if (!fs.existsSync(referenceDirectory)) {
        fs.mkdirSync(referenceDirectory);
      };

      const currentImage = imagePath({ base: currentDirectory, name });      
      const referenceImage = imagePath({ base: referenceDirectory, name });

      // If no reference element image exists yet, a new one is created.
      if (!fs.existsSync(referenceImage)) {
        // eslint-disable-next-line no-console
        await saveElementScreenshot(using, element, referenceImage);

        console.info(`INFO: Element reference image successfully created: ${referenceImage}`);
      };

      // Saving the current image element screenshot.
      await saveElementScreenshot(using, element, currentImage);
      cb(currentImage);
    } catch (err) {
      cb(null, err.message);
    }
  }
}

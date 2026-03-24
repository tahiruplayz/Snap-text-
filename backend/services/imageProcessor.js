const sharp = require('sharp');

/**
 * Preprocess image for OCR.
 * Avoids aggressive transforms that destroy decorative/colored text.
 */
async function preprocessImage(inputPath) {
  const outputPath = inputPath.replace(/(\.[\w]+)$/, '_processed.png');

  const meta = await sharp(inputPath).metadata();
  const width = meta.width || 800;

  // Only upscale if image is small — don't crop or distort
  const targetWidth = width < 1200 ? 1600 : width;

  await sharp(inputPath)
    .resize({ width: targetWidth, withoutEnlargement: true })
    .sharpen({ sigma: 0.8 })
    .png({ quality: 100 })
    .toFile(outputPath);

  return outputPath;
}

module.exports = { preprocessImage };

const sharp = require('sharp');

/**
 * Preprocess image for OCR.
 * For images with side-by-side text+photo layouts, we crop to the left ~65%
 * to avoid OCR picking up noise from embedded photos.
 */
async function preprocessImage(inputPath) {
  const outputPath = inputPath.replace(/(\.[\w]+)$/, '_processed.png');

  const meta = await sharp(inputPath).metadata();
  const width = meta.width || 800;
  const height = meta.height || 600;

  // Crop to left 65% to exclude product images on the right side
  const cropWidth = Math.floor(width * 0.65);

  await sharp(inputPath)
    .extract({ left: 0, top: 0, width: cropWidth, height })
    .resize({ width: 2000, withoutEnlargement: false })
    .grayscale()
    .normalise()
    .linear(1.8, -(128 * 1.8) + 128) // strong contrast boost
    .sharpen({ sigma: 1 })
    .median(1)
    .png({ quality: 100 })
    .toFile(outputPath);

  return outputPath;
}

module.exports = { preprocessImage };

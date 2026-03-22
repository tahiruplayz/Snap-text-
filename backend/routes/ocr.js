const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const upload = require('../middleware/upload');
const { preprocessImage } = require('../services/imageProcessor');
const { extractText, SUPPORTED_LANGS } = require('../services/ocrService');
const { detectLanguage, LANG_NAMES } = require('../services/langDetect');

// GET /api/languages
router.get('/languages', (req, res) => {
  res.json(SUPPORTED_LANGS);
});

// POST /api/upload-image
router.post('/upload-image', upload.array('images', 10), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ error: 'No images uploaded' });

    const files = req.files.map((f) => ({
      filename: f.filename,
      originalname: f.originalname,
      path: f.path,
      size: f.size,
      url: `/uploads/${f.filename}`,
    }));

    res.json({ files });
  } catch (err) {
    next(err);
  }
});

// POST /api/extract-text
// body: { filename, language }  — language='auto' triggers auto-detect
router.post('/extract-text', async (req, res, next) => {
  try {
    const { filename, language = 'auto' } = req.body;
    if (!filename) return res.status(400).json({ error: 'filename required' });

    const imagePath = path.join(__dirname, '../uploads', filename);
    if (!fs.existsSync(imagePath))
      return res.status(404).json({ error: 'Image not found' });

    const processedPath = await preprocessImage(imagePath);

    let detectedLang = language;

    if (language === 'auto') {
      // First pass with eng to get a text sample for script detection
      const sample = await extractText(processedPath, 'eng');
      detectedLang = detectLanguage(sample);
    }

    // Full extraction with detected/chosen language
    const text = await extractText(processedPath, detectedLang);

    fs.unlink(processedPath, () => {});

    res.json({
      text,
      language: detectedLang,
      languageName: LANG_NAMES[detectedLang] || detectedLang,
      autoDetected: language === 'auto',
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

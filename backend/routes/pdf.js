const router = require('express').Router();
const { generatePDF } = require('../services/pdfService');

// POST /api/generate-pdf
router.post('/generate-pdf', async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!content) return res.status(400).json({ error: 'content required' });

    const pdfBuffer = await generatePDF(title || 'Extracted Text', content);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="snaptext-${Date.now()}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });
    res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

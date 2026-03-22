const router = require('express').Router();
const { cleanText, generateNotes, translateText, summarizeText } = require('../services/aiService');

// POST /api/clean-text
router.post('/clean-text', async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'text required' });
    const cleaned = await cleanText(text);
    res.json({ cleaned });
  } catch (err) { next(err); }
});

// POST /api/generate-notes
router.post('/generate-notes', async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'text required' });
    const notes = await generateNotes(text);
    res.json({ notes });
  } catch (err) { next(err); }
});

// POST /api/translate
router.post('/translate', async (req, res, next) => {
  try {
    const { text, targetLanguage } = req.body;
    if (!text || !targetLanguage) return res.status(400).json({ error: 'text and targetLanguage required' });
    const translated = await translateText(text, targetLanguage);
    res.json({ translated });
  } catch (err) { next(err); }
});

// POST /api/summarize
router.post('/summarize', async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'text required' });
    const summary = await summarizeText(text);
    res.json({ summary });
  } catch (err) { next(err); }
});

module.exports = router;

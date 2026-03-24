const Tesseract = require('tesseract.js');

const SUPPORTED_LANGS = {
  eng: 'English',
  urd: 'Urdu',
  hin: 'Hindi',
  ara: 'Arabic',
  chi_sim: 'Chinese Simplified',
  chi_tra: 'Chinese Traditional',
  jpn: 'Japanese',
  spa: 'Spanish',
};

/**
 * Rebuild clean text from word-level confidence data.
 * Groups words into lines by Y position, drops low-confidence words.
 */
function rebuildFromWords(data, minConfidence = 50) {
  const lines = {};

  for (const word of data.words) {
    if (word.confidence < minConfidence) continue;
    const text = word.text.trim();
    if (!text || text.length < 1) continue;

    const lineKey = Math.round(word.bbox.y0 / 20);
    if (!lines[lineKey]) lines[lineKey] = [];
    lines[lineKey].push({ x: word.bbox.x0, text });
  }

  return Object.keys(lines)
    .sort((a, b) => Number(a) - Number(b))
    .map(key =>
      lines[key]
        .sort((a, b) => a.x - b.x)
        .map(w => w.text)
        .join(' ')
    )
    .filter(line => line.trim().length > 0)
    .join('\n')
    .trim();
}

/**
 * Final cleanup — remove lines with no real alphanumeric content.
 */
function cleanOcrOutput(text) {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line =>
      /[a-zA-Z0-9\u0600-\u06FF\u0900-\u097F\u4E00-\u9FFF\u3040-\u30FF]/.test(line)
    )
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Extract text from image using Tesseract.js v5.
 * Uses PSM 11 (sparse text) for poster/mixed-layout images.
 */
async function extractText(imagePath, lang = 'eng') {
  const validLang = SUPPORTED_LANGS[lang] ? lang : 'eng';

  const worker = await Tesseract.createWorker(validLang);

  // PSM 11 = sparse text, finds as much text as possible regardless of layout
  await worker.setParameters({ tessedit_pageseg_mode: '11' });

  const result = await worker.recognize(imagePath);
  await worker.terminate();

  const rebuilt = rebuildFromWords(result.data, 50);
  return cleanOcrOutput(rebuilt) || result.data.text.trim();
}

module.exports = { extractText, SUPPORTED_LANGS };

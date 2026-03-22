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
 * Rebuild text from Tesseract word data using confidence threshold.
 * Words below the threshold are dropped entirely.
 */
function rebuildFromWords(data, minConfidence = 60) {
  const lines = {};

  for (const word of data.words) {
    if (word.confidence < minConfidence) continue;
    const text = word.text.trim();
    if (!text) continue;

    // Group words by their approximate line (using bbox top position)
    const lineKey = Math.round(word.bbox.y0 / 15); // ~15px tolerance per line
    if (!lines[lineKey]) lines[lineKey] = [];
    lines[lineKey].push({ x: word.bbox.x0, text });
  }

  return Object.keys(lines)
    .sort((a, b) => Number(a) - Number(b))
    .map((key) =>
      lines[key]
        .sort((a, b) => a.x - b.x)
        .map((w) => w.text)
        .join(' ')
    )
    .filter((line) => line.trim().length > 0)
    .join('\n');
}

/**
 * Final cleanup pass — remove leftover stray symbols.
 */
function cleanOcrOutput(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) =>
      // Must contain at least one letter or digit
      /[a-zA-Z0-9\u0600-\u06FF\u0900-\u097F\u4E00-\u9FFF\u3040-\u30FF]/.test(line)
    )
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Extract text from image using Tesseract.js v5
 */
async function extractText(imagePath, lang = 'eng') {
  const validLang = SUPPORTED_LANGS[lang] ? lang : 'eng';

  const worker = await Tesseract.createWorker(validLang);
  const result = await worker.recognize(imagePath);
  await worker.terminate();

  // Use confidence-based word filtering instead of raw text
  const rebuilt = rebuildFromWords(result.data, 60);
  return cleanOcrOutput(rebuilt);
}

module.exports = { extractText, SUPPORTED_LANGS };

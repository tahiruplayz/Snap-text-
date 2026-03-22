/**
 * Detect script/language from a text sample.
 * Returns a Tesseract language code.
 */
function detectLanguage(sample = '') {
  const s = sample.slice(0, 500);

  const counts = {
    ara: (s.match(/[\u0600-\u06FF]/g) || []).length,
    urd: (s.match(/[\u0600-\u06FF\u0750-\u077F]/g) || []).length,
    hin: (s.match(/[\u0900-\u097F]/g) || []).length,
    chi_sim: (s.match(/[\u4E00-\u9FFF]/g) || []).length,
    jpn: (s.match(/[\u3040-\u30FF]/g) || []).length,
  };

  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  if (top[1] > 5) return top[0];
  return 'eng'; // default
}

/**
 * Map detected lang code to Tesseract lang code for multi-pass if needed.
 */
const LANG_NAMES = {
  eng: 'English',
  urd: 'Urdu',
  hin: 'Hindi',
  ara: 'Arabic',
  chi_sim: 'Chinese (Simplified)',
  jpn: 'Japanese',
};

module.exports = { detectLanguage, LANG_NAMES };

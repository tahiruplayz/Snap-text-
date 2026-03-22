const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    imageName: { type: String },
    language: { type: String, default: 'eng' },
    rawText: { type: String },
    cleanedText: { type: String },
    notes: { type: String },
    translatedText: { type: String },
    translationLang: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Scan', scanSchema);

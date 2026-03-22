const fetch = require('node-fetch');

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

async function callOpenRouter(systemPrompt, userContent) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY not set');

  const model = process.env.OPENROUTER_MODEL || 'openai/gpt-3.5-turbo';

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'Snaplix',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter error: ${err}`);
  }

  const data = await res.json();
  return data.choices[0].message.content.trim();
}

async function cleanText(rawText) {
  return callOpenRouter(
    `You are an expert OCR text corrector. Your task:
- Fix OCR character recognition errors (e.g. "rn" misread as "m", "0" vs "O")
- Correct grammar and punctuation
- Fix broken word spacing and line breaks
- Remove noise characters and artifacts
- Preserve the original meaning and structure exactly
- Return ONLY the corrected text, no explanations`,
    rawText
  );
}

async function generateNotes(text) {
  return callOpenRouter(
    `You are an expert note-taker. Convert the provided text into well-structured notes:
- Use clear ## headings for main topics
- Use bullet points (- ) for key details
- Use **bold** for important terms
- Keep each point concise and clear
- Organize logically by topic
- Use markdown formatting throughout`,
    text
  );
}

async function translateText(text, targetLanguage) {
  return callOpenRouter(
    `You are a professional translator. Translate the following text accurately into ${targetLanguage}.
Rules:
- Preserve the original meaning and tone
- Maintain formatting (line breaks, lists, etc.)
- Do not add explanations or notes
- Return ONLY the translated text`,
    text
  );
}

async function summarizeText(text) {
  return callOpenRouter(
    `You are a study assistant. Summarize the following text for a student:
- Start with a 2-3 sentence overview
- List the ## Key Points using bullet points
- Highlight **important terms** in bold
- Keep it concise and easy to understand
- Use markdown formatting`,
    text
  );
}

module.exports = { cleanText, generateNotes, translateText, summarizeText };

const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

/**
 * Generate a clean PDF from text content
 * @param {string} title
 * @param {string} content
 * @returns {Buffer} PDF bytes
 */
async function generatePDF(title, content) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const margin = 50;
  const pageWidth = 595;
  const pageHeight = 842;
  const contentWidth = pageWidth - margin * 2;
  const lineHeight = 16;
  const titleSize = 20;
  const bodySize = 11;

  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  // Title
  page.drawText(title || 'Extracted Text', {
    x: margin,
    y,
    size: titleSize,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });
  y -= titleSize + 20;

  // Divider
  page.drawLine({
    start: { x: margin, y },
    end: { x: pageWidth - margin, y },
    thickness: 1,
    color: rgb(0.7, 0.7, 0.7),
  });
  y -= 20;

  // Body text - wrap lines
  const lines = wrapText(content, contentWidth, bodySize, font);

  for (const line of lines) {
    if (y < margin + lineHeight) {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
    }
    page.drawText(line, {
      x: margin,
      y,
      size: bodySize,
      font,
      color: rgb(0.15, 0.15, 0.15),
    });
    y -= lineHeight;
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

function wrapText(text, maxWidth, fontSize, font) {
  const paragraphs = text.split('\n');
  const result = [];

  for (const para of paragraphs) {
    if (!para.trim()) {
      result.push('');
      continue;
    }
    const words = para.split(' ');
    let current = '';

    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      const width = font.widthOfTextAtSize(test, fontSize);
      if (width > maxWidth && current) {
        result.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) result.push(current);
  }

  return result;
}

module.exports = { generatePDF };

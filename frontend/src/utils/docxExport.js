import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

export async function generateDocx(title, content) {
  const paragraphs = [
    new Paragraph({
      text: title,
      heading: HeadingLevel.HEADING_1,
    }),
    ...content.split('\n').map(
      (line) =>
        new Paragraph({
          children: [new TextRun({ text: line, size: 24 })],
          spacing: { after: 100 },
        })
    ),
  ];

  const doc = new Document({ sections: [{ children: paragraphs }] });
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `snaptext-${Date.now()}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function parsePdfBuffer(buffer: Buffer): Promise<string> {
  const { extractText } = await import('unpdf');
  
  const uint8Array = new Uint8Array(buffer);
  const { text } = await extractText(uint8Array, {
    mergePages: true,
  });

  return text;
}
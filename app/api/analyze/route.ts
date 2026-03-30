import { NextRequest, NextResponse } from 'next/server';
import { parsePdfBuffer } from '@/lib/parsePdf';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('resume') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be under 5MB' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log('Buffer size:', buffer.length);
    console.log('File type:', file.type);

    const resumeText = await parsePdfBuffer(buffer);

    console.log('Extracted text length:', resumeText?.length);
    console.log('First 200 chars:', resumeText?.slice(0, 200));

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Could not extract text from PDF. Please try a different file.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      text: resumeText.trim(),
      wordCount: resumeText.trim().split(/\s+/).length,
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const stack = error instanceof Error ? error.stack : '';
    console.error('PDF parse error message:', message);
    console.error('PDF parse error stack:', stack);
    return NextResponse.json(
      { error: 'Failed to process PDF. Please try again.' },
      { status: 500 }
    );
  }
}
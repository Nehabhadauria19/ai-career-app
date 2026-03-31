import { NextRequest, NextResponse } from 'next/server';
import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    console.log('=== LINKEDIN API CALLED ===');

    const body = await req.json();
    console.log('Resume text length:', body.resumeText?.length);

    if (!body.resumeText) {
      return NextResponse.json(
        { error: 'Resume text is required' },
        { status: 400 }
      );
    }

    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      temperature: 0,
      prompt: `
You are a LinkedIn personal branding expert.
Based on this resume, generate an optimised LinkedIn headline and summary.
Respond ONLY with a valid JSON object — no markdown, no backticks, no extra text whatsoever.

Resume:
"""
${body.resumeText.slice(0, 3000)}
"""

Respond with EXACTLY this JSON structure and nothing else:
{
  "headline": "LinkedIn headline under 220 characters",
  "summary": "LinkedIn About section 3 paragraphs professional ends with call to action under 2000 characters"
}`,
    });

    console.log('Groq raw response:', text.slice(0, 200));

    const cleaned = text
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error('JSON parse failed, raw text:', text);
      return NextResponse.json(
        { error: 'AI returned invalid response. Please try again.' },
        { status: 500 }
      );
    }

    console.log('Parsed keys:', Object.keys(parsed));

    return NextResponse.json({ success: true, linkedin: parsed });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const stack = error instanceof Error ? error.stack : '';
    console.error('=== LINKEDIN ERROR ===');
    console.error('Message:', message);
    console.error('Stack:', stack);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
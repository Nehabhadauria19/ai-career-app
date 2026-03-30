import { NextRequest, NextResponse } from 'next/server';
import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { resumeText } = await req.json();

    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      prompt: `
You are a LinkedIn personal branding expert.
Based on this resume, generate an optimised LinkedIn headline and summary.
Respond ONLY with a valid JSON object — no markdown, no backticks, no extra text.

Resume:
"""
${resumeText.slice(0, 3000)}
"""

Respond with exactly this JSON structure:
{
  "headline": "<LinkedIn headline under 220 characters>",
  "summary": "<LinkedIn About section — 3 paragraphs, professional, ends with call to action, under 2000 characters>"
}`,
    });

    const cleaned = text
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: 'AI returned invalid response. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, linkedin: parsed });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('LinkedIn error:', message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
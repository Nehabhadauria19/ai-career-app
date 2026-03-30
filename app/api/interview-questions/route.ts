import { NextRequest, NextResponse } from 'next/server';
import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { resumeText, role } = await req.json();

    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      prompt: `
You are an expert interview coach.
Generate 8 interview questions for a "${role}" position based on this resume.
Respond ONLY with a valid JSON array — no markdown, no backticks, no extra text.

Resume:
"""
${resumeText.slice(0, 3000)}
"""

Respond with exactly this JSON structure:
[
  {
    "question": "<interview question>",
    "category": "<Behavioural | Technical | Situational | HR>",
    "tips": "<1 sentence tip on how to answer>"
  }
]

Return exactly 8 questions — 2 from each category.`,
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

    return NextResponse.json({ success: true, questions: parsed });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Interview questions error:', message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
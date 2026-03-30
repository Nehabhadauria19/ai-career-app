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
You are an expert career counsellor.
Based on this resume, suggest the 5 most suitable job roles.
Respond ONLY with a valid JSON array — no markdown, no backticks, no extra text.

Resume:
"""
${resumeText.slice(0, 3000)}
"""

Respond with exactly this JSON structure:
[
  {
    "role": "<Job Title>",
    "matchPercentage": <number 60-99>,
    "reason": "<1-2 sentences why this role fits>",
    "skills": ["<skill 1>", "<skill 2>", "<skill 3>"]
  }
]

Return exactly 5 roles sorted by matchPercentage descending.`,
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

    return NextResponse.json({ success: true, roles: parsed });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Roles error:', message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
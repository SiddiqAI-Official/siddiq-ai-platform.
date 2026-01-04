import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

// VERCEL PRO SETTING: Important for Pro accounts
export const maxDuration = 300; 

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are Siddiq AI v12.1. Return ONLY raw HTML with Tailwind CSS. Use <img> tags with descriptive 'alt' text for AI generation. No markdown.`,
        },
        ...messages,
      ],
    });
    return NextResponse.json({ code: response.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error: 'AI Error' }, { status: 500 });
  }
}
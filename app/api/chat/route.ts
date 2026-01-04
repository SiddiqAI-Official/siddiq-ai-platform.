import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are Siddiq AI, a world-class mobile-responsive web engineer.
          
          STRICT RULES:
          1. MOBILE-FIRST: Always use Tailwind responsive classes (e.g., text-2xl md:text-5xl).
          2. NO OVERFLOW: Ensure the design NEVER goes outside the screen width on mobile.
          3. RELEVANCE: Stick 100% to the user prompt.
          4. IMAGES: Use https://loremflickr.com/800/600/[KEYWORD]
          5. FORMAT: Return ONLY the raw HTML code inside <body>. No React, no markdown.`,
        },
        ...messages,
      ],
    });

    return NextResponse.json({ code: response.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error: 'AI Error' }, { status: 500 });
  }
}
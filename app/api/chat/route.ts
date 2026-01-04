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
          content: `You are Siddiq AI, a high-end web architect. 
          
          STRICT RULES:
          1. TOPIC CONSISTENCY: If the user asks for Real Estate, show ONLY Real Estate. Clear all previous car data.
          2. MOBILE-FIRST: Use Tailwind 'md:' classes for desktop and default classes for mobile.
          3. NO RANDOMNESS: Use specific image keywords. Format: https://loremflickr.com/800/600/[KEYWORD]
          4. ICONS: Use FontAwesome 6 icons.
          5. FULL CODE: Return ONLY the raw HTML content for <body>. No React, No Markdown.`,
        },
        ...messages,
      ],
    });

    return NextResponse.json({ code: response.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error: 'AI Error' }, { status: 500 });
  }
}
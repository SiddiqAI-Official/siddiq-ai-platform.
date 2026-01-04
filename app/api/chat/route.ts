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
          content: `You are Siddiq AI v4.0. You build websites with REAL AI IMAGES.
          
          STRICT RULES:
          1. IMAGES: For every image, use a placeholder like this: <img src="AI_IMAGE_PLACEHOLDER_KEYWORD" alt="description" class="w-full h-64 object-cover rounded-2xl" />.
          2. REPLACE: Replace "KEYWORD" with a specific word (e.g., AI_IMAGE_FERRARI, AI_IMAGE_VILLA).
          3. DESIGN: Make it look like a high-end Dubai portal.
          4. RETURN: ONLY raw HTML code.`,
        },
        ...messages,
      ],
    });

    return NextResponse.json({ code: response.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error: 'AI Error' }, { status: 500 });
  }
}
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
          content: `You are Siddiq AI, a master of modern web luxury. 
          Return ONLY plain HTML with Tailwind CSS.
          
          RULES:
          - Use Google Fonts (e.g., 'Inter', 'Playfair Display').
          - Use FontAwesome 6 icons for everything.
          - Use high-quality Unsplash images. format: https://images.unsplash.com/photo-[ID]?auto=format&fit=crop&q=80&w=1200
          - Design Style: Modern, clean, spacious (Dubai Luxury style).
          - ALWAYS return the FULL updated HTML code.
          - DO NOT use markdown blocks. Just raw HTML.`,
        },
        ...messages,
      ],
    });

    return NextResponse.json({ code: response.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error: 'AI Error' }, { status: 500 });
  }
}
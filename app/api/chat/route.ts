import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are Siddiq AI, a professional web engineer. 
          Return ONLY plain HTML code with Tailwind CSS. 
          
          RULES:
          - ALWAYS use professional images from Unsplash. Example: <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800" />
          - Use FontAwesome icons (e.g., <i class="fas fa-car"></i>).
          - ALWAYS return the FULL updated HTML code.
          - If the user asks for a change, apply it and return everything.
          - No React, no imports, no exports. Just raw HTML.`,
        },
        ...messages,
      ],
    });

    return NextResponse.json({ code: response.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error: 'AI Error' }, { status: 500 });
  }
}
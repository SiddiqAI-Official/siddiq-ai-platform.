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
          content: `You are Siddiq AI v4.2. 
          STRICT RULES:
          1. IMAGES: Use this EXACT tag for images: <img data-ai-prompt="exact description of image" src="https://placehold.co/800x600?text=Generating+AI+Image..." class="ai-image w-full h-64 object-cover rounded-2xl" />
          2. NEVER write real links for images, ONLY use the 'data-ai-prompt' attribute.
          3. DESIGN: Luxury Dubai Style.
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
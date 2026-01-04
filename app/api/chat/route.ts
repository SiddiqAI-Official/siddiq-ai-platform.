import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

export const maxDuration = 300;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastPrompt = messages[messages.length - 1].content;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are Siddiq AI v16.0. 
          1. TOPIC: Focus ONLY on: "${lastPrompt}". 
          2. IMAGES: Use <img> tags with a unique 'alt' text for DALL-E 3.
          3. LINKS: All <a> tags must have href="javascript:void(0)".
          4. RETURN: ONLY raw HTML with Tailwind CSS. No markdown.`
        },
        ...messages.slice(-3),
      ],
    });
    return NextResponse.json({ code: response.choices[0].message.content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
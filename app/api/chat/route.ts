import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

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
          content: `You are Siddiq AI v9.0 Global Titan. 
          1. TOPIC: Focus ONLY on "${lastPrompt}". Ignore all previous industry data.
          2. IMAGES: Use <img> tags with a VERY descriptive 'alt' attribute.
          3. LINKS: All <a> tags must have href="javascript:void(0)".
          4. FORMAT: Return ONLY raw HTML with Tailwind CSS.`,
        },
        ...messages,
      ],
    });
    return NextResponse.json({ code: response.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error: 'AI Error' }, { status: 500 });
  }
}
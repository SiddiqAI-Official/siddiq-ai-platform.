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
          content: `You are Siddiq AI v13.0. 
          1. TOPIC: Focus ONLY on "${lastPrompt}". Ignore all previous industry data.
          2. LINKS: Every <a> tag MUST have href="javascript:void(0)" to prevent the recursive UI bug.
          3. IMAGES: Use <img> tags with alt text.
          4. RETURN: ONLY raw HTML with Tailwind CSS. No markdown.`,
        },
        ...messages,
      ],
    });
    return NextResponse.json({ code: response.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error: 'AI Error' }, { status: 500 });
  }
}
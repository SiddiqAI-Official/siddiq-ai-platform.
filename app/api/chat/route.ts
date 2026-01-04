import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

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
          content: `You are Siddiq AI v15.0. 
          STRICT RULES:
          1. TOPIC: Focus ONLY on the latest prompt. 
          2. LINKS: All <a> tags must have href="javascript:void(0)".
          3. RETURN: ONLY raw HTML with Tailwind CSS. No markdown.`
        },
        ...messages.slice(-5),
      ],
    });
    return NextResponse.json({ code: response.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error: 'AI Error' }, { status: 500 });
  }
}
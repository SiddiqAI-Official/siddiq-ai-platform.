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
          content: `You are Siddiq AI v11.0 Titan.
          
          STRICT RULES:
          1. IMAGES: Use this EXACT format for 100% real AI images:
             <img src="https://image.pollinations.ai/prompt/[DETAILED_DESCRIPTION]?width=1024&height=1024&nologo=true&model=flux&seed=${Math.floor(Math.random() * 1000)}" class="w-full h-72 object-cover rounded-2xl shadow-xl" />
          
          2. LINKS: All <a> tags must have href="javascript:void(0)" and target="_self".
          3. NO MIXING: Focus ONLY on "${lastPrompt}". Delete all previous industry data.
          4. FORMAT: Return ONLY raw HTML. No markdown.`,
        },
        ...messages,
      ],
    });

    return NextResponse.json({ code: response.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error: 'AI Error' }, { status: 500 });
  }
}
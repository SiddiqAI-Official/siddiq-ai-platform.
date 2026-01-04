import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

export const maxDuration = 300;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // Only send the system prompt and the last few messages to save memory
    const optimizedMessages = [
      {
        role: 'system',
        content: "You are Siddiq AI v15.0. Return ONLY raw HTML with Tailwind CSS. No markdown. Use <img> tags with descriptive 'alt' for DALL-E 3. If the user prompt is huge, focus on the core requirements."
      },
      ...messages.slice(-3) // Sirf aakhri 3 baatein yaad rakho taake system busy na ho
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: optimizedMessages as any,
      temperature: 0.7,
    });

    return NextResponse.json({ code: response.choices[0].message.content });
  } catch (error: any) {
    console.error("OpenAI Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
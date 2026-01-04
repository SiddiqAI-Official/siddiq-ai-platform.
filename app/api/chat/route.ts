import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastUserPrompt = messages[messages.length - 1].content;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are Siddiq AI v3.2. 
          
          STRICT COMMANDS:
          1. TOPIC: Focus ONLY on this: "${lastUserPrompt}". If this is different from previous messages, IGNORE previous industry data completely.
          2. IMAGES: Use high-quality images from: https://picsum.photos/seed/[keyword]/800/600 
             (Replace [keyword] with the specific topic like car, villa, office).
          3. LINKS: All <a> tags must have href="javascript:void(0)".
          4. NO MARKDOWN: Return ONLY raw HTML.`,
        },
        ...messages,
      ],
    });

    return NextResponse.json({ code: response.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error: 'AI Error' }, { status: 500 });
  }
}
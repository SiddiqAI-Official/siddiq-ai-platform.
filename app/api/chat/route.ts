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
          content: `You are Siddiq AI v3.7. 
          STRICT RULES:
          1. TOPIC: Focus ONLY on "${lastPrompt}". If this is a new topic, ignore ALL previous industries.
          2. IMAGES: Use this format: <img src="https://source.unsplash.com/featured/800x600?dubai,[KEYWORD]" alt="[KEYWORD]" class="w-full h-64 object-cover rounded-2xl shadow-lg" />
          3. NAVIGATION: Create a professional navbar with Home, Services, and Contact.
          4. FORMAT: Return ONLY raw HTML. No React, no Markdown.`,
        },
        ...messages,
      ],
    });

    return NextResponse.json({ code: response.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error: 'AI Error' }, { status: 500 });
  }
}
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
          content: `You are Siddiq AI, a world-class web architect.
          
          STRICT RULES:
          1. TOPIC: If the user asks for a new topic (e.g., Real Estate), ignore all previous topics (e.g., Cars).
          2. IMAGES: Use specific Unsplash keywords. Format: <img src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=800" /> for Real Estate or similar high-quality direct links.
          3. RESPONSIVE: Use Tailwind CSS classes (w-full, max-w-screen-xl, px-4).
          4. ICONS: Use FontAwesome 6 Free (e.g., fas fa-home, fas fa-building).
          5. RETURN: ONLY the raw HTML content inside <body>. No React, no markdown.`,
        },
        ...messages,
      ],
    });

    return NextResponse.json({ code: response.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error: 'AI Error' }, { status: 500 });
  }
}
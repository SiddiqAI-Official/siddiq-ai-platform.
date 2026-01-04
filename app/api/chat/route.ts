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
          content: `You are Siddiq AI, a specialized web engineer.
          
          STRICT RULES:
          1. IMAGES: Use high-quality Unsplash direct links. 
             Example: https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80
             If you don't have a specific photo ID, use: https://source.unsplash.com/800x600/?dubai,luxury,[keyword]
          2. MOBILE: Everything must be 100% responsive using Tailwind (w-full).
          3. ICONS: Use ONLY FontAwesome 6 Free classes (fas fa-home, fas fa-car).
          4. FORMAT: Return ONLY the raw HTML content. No markdown, no React.`,
        },
        ...messages,
      ],
    });

    return NextResponse.json({ code: response.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error: 'AI Error' }, { status: 500 });
  }
}
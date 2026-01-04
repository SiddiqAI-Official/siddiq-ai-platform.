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
          content: `You are Siddiq AI, a high-end web engineer.
          
          STRICT RULES:
          1. IMAGES: ALWAYS use direct Unsplash URLs. 
             Example: https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800
             Keywords to use in search: dubai, luxury, realestate, office, apartment.
          2. LINKS: All <a> tags MUST have href="javascript:void(0)" to prevent page reload.
          3. RESPONSIVE: Use Tailwind CSS. Ensure nothing overflows the screen.
          4. NO MARKDOWN: Return ONLY raw HTML code.`,
        },
        ...messages,
      ],
    });

    return NextResponse.json({ code: response.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error: 'AI Error' }, { status: 500 });
  }
}
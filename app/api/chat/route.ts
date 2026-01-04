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
          1. RELEVANCE: Only show content strictly related to the user's prompt. (If Real Estate, show Real Estate. If Cars, show Cars).
          2. FORMAT: Return ONLY plain HTML with Tailwind CSS. No markdown, no React.
          3. IMAGES: Use high-quality images: https://loremflickr.com/800/600/[KEYWORD] where [KEYWORD] is the exact topic.
          4. ICONS: Use FontAwesome 6 (e.g., <i class="fas fa-home"></i>).
          5. COMPLETENESS: Always return the FULL updated HTML code for the entire page.`,
        },
        ...messages,
      ],
    });

    return NextResponse.json({ code: response.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error: 'AI Error' }, { status: 500 });
  }
}
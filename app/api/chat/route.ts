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
          content: `You are Siddiq AI v3.1. 
          
          STRICT RULES:
          1. TOPIC: If the user changes the topic (e.g., from Cars to Real Estate), DO NOT show cars anymore. Focus ONLY on the latest request.
          2. IMAGES: Use these high-quality links ONLY:
             - Dubai: https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1000
             - Villa: https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1000
             - Interior: https://images.unsplash.com/photo-1618221195710-dd6b41faeaa6?q=80&w=1000
             - Office: https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000
          3. LINKS: All <a> tags must have href="javascript:void(0)" to prevent double-loading bugs.
          4. ICONS: Use FontAwesome 6 (e.g. fas fa-check).
          5. RETURN: ONLY raw HTML code.`,
        },
        ...messages,
      ],
    });

    return NextResponse.json({ code: response.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error: 'AI Error' }, { status: 500 });
  }
}
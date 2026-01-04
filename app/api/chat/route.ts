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
          content: `You are Siddiq AI, a master of Dubai luxury web design.
          
          STRICT IMAGE RULES:
          Use ONLY these verified Unsplash IDs for high-quality images.
          - Dubai Skyline: https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200
          - Luxury Interior: https://images.unsplash.com/photo-1618221195710-dd6b41faeaa6?q=80&w=1200
          - Modern Villa: https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1200
          - Luxury Car: https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200
          - Office: https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200
          
          If you need other images, use: https://loremflickr.com/800/600/[keyword] (but try IDs first).
          
          OTHER RULES:
          - No React, no imports, no markdown. 
          - All <a> tags must have href="javascript:void(0)".
          - Everything must be 100% Responsive.`,
        },
        ...messages,
      ],
    });

    return NextResponse.json({ code: response.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error: 'AI Error' }, { status: 500 });
  }
}
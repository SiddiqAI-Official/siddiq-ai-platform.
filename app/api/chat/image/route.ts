import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

export const maxDuration = 300; 

export async function POST(req: Request) {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const { prompt } = await req.json();

    const response: any = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Professional high-end commercial photography of ${prompt}. Luxury style, 4k, sharp focus.`,
      n: 1,
      size: "1024x1024",
    });

    return NextResponse.json({ url: response.data[0].url });
  } catch (error: any) {
    // If DALL-E fails, use a high-quality relevant fallback
    return NextResponse.json({ url: `https://loremflickr.com/1200/800/${prompt.replace(/\s+/g, ',')}` });
  }
}
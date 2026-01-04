import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

export const maxDuration = 60; // Vercel timeout protection

export async function POST(req: Request) {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const { prompt } = await req.json();

    const response: any = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Professional commercial website photography of ${prompt}. Luxury style, 4k, high resolution.`,
      n: 1,
      size: "1024x1024",
    });

    return NextResponse.json({ url: response.data[0].url });
  } catch (error: any) {
    console.error("DALL-E Error:", error.message);
    // Backup image in case DALL-E fails
    return NextResponse.json({ url: `https://loremflickr.com/800/600/${prompt.split(' ')[0]}` });
  }
}
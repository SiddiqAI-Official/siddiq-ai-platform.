import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

export const maxDuration = 60; // Vercel ko hukum ke 60 second tak intezar kare

export async function POST(req: Request) {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const { prompt } = await req.json();

    const response: any = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Professional high-end website photography of ${prompt}. Luxury Dubai style, 4k resolution, sharp focus.`,
      n: 1,
      size: "1024x1024",
    });

    return NextResponse.json({ url: response.data[0].url });
  } catch (error: any) {
    console.error("DALL-E Error:", error.message);
    // Agar DALL-E fail ho jaye toh sirf tab ye backup use kare
    return NextResponse.json({ url: `https://loremflickr.com/800/600/${prompt.split(' ')[0]}` });
  }
}
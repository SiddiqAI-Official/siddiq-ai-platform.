import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

// VERCEL PRO SETTING (300 seconds timeout)
export const maxDuration = 300; 

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const response: any = await openai.images.generate({
      model: "dall-e-3", // Using the best model in the world
      prompt: `Extreme high-quality, professional commercial photography for a luxury website. Subject: ${prompt}. Cinematic lighting, 8k resolution, photorealistic, Dubai luxury style.`,
      n: 1,
      size: "1024x1024",
      quality: "hd"
    });

    return NextResponse.json({ url: response.data[0].url });
  } catch (error: any) {
    console.error("DALL-E Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
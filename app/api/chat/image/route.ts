import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

export const maxDuration = 60; 

export async function POST(req: Request) {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const { prompt } = await req.json();

    const response: any = await openai.images.generate({
      model: "dall-e-3",
      prompt: `High-end professional website photo: ${prompt}. Luxury, 4k, cinematic.`,
      n: 1,
      size: "1024x1024",
    });

    return NextResponse.json({ url: response.data[0].url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
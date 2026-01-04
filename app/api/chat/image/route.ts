import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

export const maxDuration = 60; 

export async function POST(req: Request) {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const { prompt } = await req.json();
    const response: any = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Professional website photo of ${prompt}. Luxury, 4k.`,
      n: 1,
      size: "1024x1024",
    });
    return NextResponse.json({ url: response.data[0].url });
  } catch (error) {
    return NextResponse.json({ url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800" });
  }
}
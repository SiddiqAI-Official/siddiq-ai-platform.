import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

export const maxDuration = 300; 

export async function POST(req: Request) {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const { prompt } = await req.json();
    const response: any = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Extreme luxury photography of ${prompt}, Dubai style, 4k resolution.`,
      n: 1,
      size: "1024x1024",
    });
    return NextResponse.json({ url: response.data[0].url });
  } catch (error) {
    return NextResponse.json({ url: "https://placehold.co/800x600?text=Generating+Photo..." });
  }
}
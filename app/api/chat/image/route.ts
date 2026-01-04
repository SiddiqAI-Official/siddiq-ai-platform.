import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // DALL-E 3 se photo generate karna
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Professional high-quality web design photo of: ${prompt}. Luxury, modern, 4k.`,
      n: 1,
      size: "1024x1024",
    });

    return NextResponse.json({ url: response.data[0].url });
  } catch (error) {
    return NextResponse.json({ error: 'Image Generation Failed' }, { status: 500 });
  }
}
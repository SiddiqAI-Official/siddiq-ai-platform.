import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

// Initialize OpenAI inside the POST to avoid environment issues
export async function POST(req: Request) {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const { prompt } = await req.json();

    const response: any = await openai.images.generate({
      model: "dall-e-3",
      prompt: `High-quality professional web photo of ${prompt}, luxury style, 4k.`,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = response.data[0].url;
    return NextResponse.json({ url: imageUrl });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'Image Failed' }, { status: 500 });
  }
}
import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const { prompt } = await req.json();

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `High-quality professional web photo of ${prompt}, luxury style, 4k.`,
      n: 1,
      size: "1024x1024",
    });

    return NextResponse.json({ url: response.data[0].url });
  } catch (error: any) {
    console.error("DALL-E Error:", error.message);
    // Agar DALL-E fail ho jaye toh backup image bhej do taake website crash na ho
    return NextResponse.json({ url: `https://loremflickr.com/800/600/${prompt.split(' ')[0]}` });
  }
}
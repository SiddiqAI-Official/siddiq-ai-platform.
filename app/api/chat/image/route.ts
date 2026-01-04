import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

export const maxDuration = 300; 

export async function POST(req: Request) {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const data = await req.json();
    const prompt = data.prompt || "luxury dubai";

    const response: any = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Professional high-end commercial photography: ${prompt}. Luxury, 4k, photorealistic.`,
      n: 1,
      size: "1024x1024",
    });

    return NextResponse.json({ url: response.data[0].url });
  } catch (error) {
    // Agar DALL-E fail ho jaye toh backup image bina error ke bhej do
    const data = await req.json().catch(() => ({ prompt: "luxury" }));
    const fallbackTerm = (data.prompt || "luxury").toString().replace(/\s+/g, ',');
    return NextResponse.json({ url: `https://loremflickr.com/1200/800/${fallbackTerm}` });
  }
}
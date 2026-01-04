import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const body = await req.json();
    const imagePrompt = body.prompt || "luxury design";

    const response: any = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Professional high-quality web design photo of ${imagePrompt}, luxury style, 4k.`,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = response.data[0].url;
    return NextResponse.json({ url: imageUrl });
  } catch (error: any) {
    console.error("DALL-E Error:", error.message);
    // Backup image link agar DALL-E busy ho
    return NextResponse.json({ url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800" });
  }
}
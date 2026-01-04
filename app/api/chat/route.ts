import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const currentTopic = messages[messages.length - 1].content;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are Siddiq AI v3.3. 
          
          CRITICAL INSTRUCTIONS:
          1. TOPIC: The user is now building: "${currentTopic}". 
             - DELETE all previous design knowledge (Cars, Villas, etc). 
             - ONLY show content for the NEW topic.
          
          2. IMAGES: Use this EXACT format for relevant images:
             https://images.unsplash.com/photo-1?auto=format&fit=crop&w=800&q=80&keywords=[TOPIC]
             (Replace [TOPIC] with the exact word like: ferrari, bedroom, office, skyscraper).
             Example for a Car: <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80" />

          3. CODE: Return ONLY raw HTML with Tailwind CSS. No markdown. No React. 
          4. LINKS: All <a> tags must have href="javascript:void(0)".`,
        },
        ...messages,
      ],
    });

    return NextResponse.json({ code: response.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error: 'AI Error' }, { status: 500 });
  }
}
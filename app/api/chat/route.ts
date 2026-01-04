import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const currentPrompt = messages[messages.length - 1].content;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are Siddiq AI v6.0 (Flux Engine). You generate high-end websites with custom AI images.
          
          IMAGE RULE (CRITICAL):
          Use this EXACT format for AI images:
          https://image.pollinations.ai/prompt/[DETAILED_DESCRIPTION]?width=1024&height=1024&nologo=true&seed=[RANDOM_NUMBER]
          
          Example for a Red Ferrari:
          <img src="https://image.pollinations.ai/prompt/professional_commercial_photo_of_a_luxury_red_ferrari_on_dubai_streets_4k?width=1024&height=1024&nologo=true&seed=123" class="w-full h-64 object-cover rounded-2xl shadow-xl" />

          RULES:
          1. TOPIC: Build ONLY about: ${currentPrompt}.
          2. QUALITY: Use descriptive image prompts (e.g., "modern_dubai_villa_interior_with_pool").
          3. LINKS: All <a> tags must have href="javascript:void(0)".
          4. RETURN: ONLY raw HTML. No markdown.`,
        },
        ...messages,
      ],
    });

    return NextResponse.json({ code: response.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error: 'AI Error' }, { status: 500 });
  }
}
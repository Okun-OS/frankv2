import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

type ImageFormat = 'linkedin_post' | 'instagram_post' | 'instagram_story' | 'carousel' | 'ad' | 'thumbnail'

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'placeholder' })
}

function getSizeForFormat(format: ImageFormat): '1024x1024' | '1024x1536' | '1536x1024' {
  if (format === 'instagram_story') {
    return '1024x1536'
  }
  return '1024x1024'
}

async function refinePromptWithFeedback(
  openai: OpenAI,
  originalPrompt: string,
  previousPrompt: string,
  feedback: string
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `Du bist ein kreativer Direktor für visuelle Content-Produktion.
Du verfeinst Bildgenerierungs-Prompts basierend auf Feedback.
Erstelle einen verbesserten DALL-E 3 Prompt auf Englisch, der das Feedback umsetzt.
Antworte NUR mit dem fertigen Prompt, ohne Erklärungen.`,
      },
      {
        role: 'user',
        content: `Ursprüngliches Konzept: ${originalPrompt}

Vorheriger Prompt: ${previousPrompt}

Feedback: ${feedback}

Erstelle einen verbesserten Bildprompt der das Feedback berücksichtigt.`,
      },
    ],
    max_tokens: 500,
    temperature: 0.7,
  })

  return response.choices[0].message.content || originalPrompt
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY nicht konfiguriert' },
        { status: 500 }
      )
    }

    const body = await req.json()
    const {
      prompt,
      format,
      style,
      previousPrompt,
      feedback,
    }: {
      prompt: string
      format: ImageFormat
      style: string
      previousPrompt?: string
      feedback?: string
    } = body

    if (!prompt || !format) {
      return NextResponse.json(
        { error: 'prompt und format sind erforderlich' },
        { status: 400 }
      )
    }

    const openai = getOpenAI()

    const styleDescriptions: Record<string, string> = {
      Professionell: 'professional, corporate, clean, polished, business photography style',
      Modern: 'modern, contemporary, sleek, minimalist design with bold typography',
      Minimalist: 'minimalist, white space, clean lines, simple elegant composition',
      Luxuriös: 'luxury, premium, gold accents, dark sophisticated background, high-end brand aesthetic',
      Bold: 'bold, high contrast, striking colors, strong visual impact, dynamic composition',
    }

    const styleDesc = styleDescriptions[style] || 'professional, clean'
    const platformContext: Record<ImageFormat, string> = {
      linkedin_post: 'LinkedIn business post, 1:1 square format, professional B2B audience',
      instagram_post: 'Instagram post, 1:1 square format, visually engaging',
      instagram_story: 'Instagram Story, vertical 9:16 format, mobile-first design',
      carousel: 'Social media carousel slide, 1:1 square format, clean and readable',
      ad: 'Digital advertisement, 1:1 square format, strong call-to-action visual',
      thumbnail: 'Content thumbnail, 1:1 square format, bold and attention-grabbing',
    }

    let finalPrompt: string

    if (feedback && previousPrompt) {
      finalPrompt = await refinePromptWithFeedback(openai, prompt, previousPrompt, feedback)
    } else {
      finalPrompt = `${prompt}. Style: ${styleDesc}. Context: ${platformContext[format]}. High quality, professional digital artwork, no text overlays.`
    }

    const size = getSizeForFormat(format)

    let imageUrl: string | null = null
    let revisedPrompt = finalPrompt

    // Try gpt-image-1 first (newest OpenAI image model)
    try {
      const response = await openai.images.generate({
        model: 'gpt-image-1',
        prompt: finalPrompt,
        n: 1,
        size,
      })
      const item = response.data?.[0]
      if (item) {
        // gpt-image-1 returns b64_json by default
        if ('b64_json' in item && item.b64_json) {
          imageUrl = `data:image/png;base64,${item.b64_json}`
        } else if (item.url) {
          imageUrl = item.url
        }
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : ''
      // Fall back to dall-e-3
      if (msg.includes('does not exist') || msg.includes('model') || msg.includes('not found')) {
        try {
          const response = await openai.images.generate({
            model: 'dall-e-3',
            prompt: finalPrompt,
            n: 1,
            size,
          })
          const item = response.data?.[0]
          if (item?.url) {
            imageUrl = item.url
            revisedPrompt = (item as { revised_prompt?: string }).revised_prompt || finalPrompt
          }
        } catch {
          // Fall back to dall-e-2 (supports only 1024x1024)
          const response = await openai.images.generate({
            model: 'dall-e-2',
            prompt: finalPrompt.slice(0, 1000),
            n: 1,
            size: '1024x1024',
          })
          imageUrl = response.data?.[0]?.url ?? null
        }
      } else {
        throw e
      }
    }

    if (!imageUrl) {
      return NextResponse.json({ error: 'Keine Bild-URL in der Antwort' }, { status: 500 })
    }

    return NextResponse.json({ url: imageUrl, revisedPrompt })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unbekannter Fehler'
    console.error('Image generation error:', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

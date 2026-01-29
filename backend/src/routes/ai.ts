import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma.js';
import { z } from 'zod';

const chatSchema = z.object({
  articleId: z.number(),
  message: z.string().min(1).max(1000),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'model']),
    parts: z.array(z.object({ text: z.string() })),
  })).optional(),
});

const ttsSchema = z.object({
  text: z.string().min(1).max(5000),
  voiceName: z.string().optional().default('Charon'),
});

// Rate limiting map: IP -> { count, resetTime }
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20; // 20 requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

export async function aiRoutes(fastify: FastifyInstance) {
  // POST /api/ai/chat - Chat with context about the article
  fastify.post('/chat', async (request: FastifyRequest, reply: FastifyReply) => {
    const ip = request.ip;

    // Rate limiting
    if (!checkRateLimit(ip)) {
      return reply.status(429).send({ 
        error: 'Too many requests. Please try again in a minute.' 
      });
    }

    const body = chatSchema.parse(request.body);
    const { articleId, message, conversationHistory = [] } = body;

    // Load article for context
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: { 
        translations: true,
        category: { include: { translations: true } }
      },
    });

    if (!article) {
      return reply.status(404).send({ error: 'Article not found' });
    }

    // Build context
    const translation = article.translations[0];
    const categoryTranslation = article.category?.translations?.[0];
    
    // Strip HTML tags from content
    const contentText = (translation?.contentHtml || '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Truncate to avoid token limits (keep ~3000 chars)
    const contentPreview = contentText.substring(0, 3000);

    // Determine country name for better context
    const countryNames: Record<string, { fr: string; en: string }> = {
      'ET': { fr: "l'Éthiopie", en: 'Ethiopia' },
      'SN': { fr: 'le Sénégal', en: 'Senegal' },
      'MA': { fr: 'le Maroc', en: 'Morocco' },
      'KE': { fr: 'le Kenya', en: 'Kenya' },
      'GH': { fr: 'le Ghana', en: 'Ghana' },
      'NG': { fr: 'le Nigeria', en: 'Nigeria' },
      'ZA': { fr: "l'Afrique du Sud", en: 'South Africa' },
      'EG': { fr: "l'Égypte", en: 'Egypt' },
    };

    const countryName = article.countryCode 
      ? countryNames[article.countryCode]?.fr || article.countryCode
      : 'ce pays africain';

    // Practical info from metadata
    const practicalInfo = article.metadata?.practicalInfo || {};

    // Build system prompt
    const systemPrompt = `Tu es un guide expert de voyage pour ${countryName}.
Tu as accès au dossier complet "${translation?.title}" du blog Sagesses d'Afrique.

Contexte de l'article (extraits) :
${contentPreview}

Informations pratiques disponibles :
${JSON.stringify(practicalInfo, null, 2)}

Ta mission :
- Répondre aux questions sur ${countryName} avec expertise et passion
- Utiliser les informations de l'article quand pertinent
- Être concis (maximum 3-4 phrases, sauf si demandé autrement)
- Rester culturellement respectueux et nuancé
- Proposer des recommandations personnalisées
- Partager des anecdotes intéressantes

Réponds en français de manière chaleureuse, professionnelle et engageante.
Si on te pose une question hors sujet (non liée à l'Afrique ou au voyage), redirige poliment vers le sujet du dossier.`;

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        return reply.status(500).send({ 
          error: 'API configuration error' 
        });
      }

      // Call Gemini API
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              ...conversationHistory,
              { role: 'user', parts: [{ text: message }] }
            ],
            systemInstruction: { 
              parts: [{ text: systemPrompt }] 
            },
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500,
            },
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API error:', errorText);
        return reply.status(500).send({ 
          error: 'Failed to generate response' 
        });
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
        return reply.status(500).send({ 
          error: 'Invalid response from AI' 
        });
      }

      const replyText = data.candidates[0].content.parts[0].text;

      return { 
        reply: replyText,
        conversationHistory: [
          ...conversationHistory,
          { role: 'user', parts: [{ text: message }] },
          { role: 'model', parts: [{ text: replyText }] },
        ]
      };

    } catch (error) {
      console.error('AI Chat error:', error);
      return reply.status(500).send({ 
        error: 'An error occurred while processing your request' 
      });
    }
  });

  // POST /api/ai/tts - Text-to-Speech
  fastify.post('/tts', async (request: FastifyRequest, reply: FastifyReply) => {
    const ip = request.ip;

    // Rate limiting (stricter for TTS - costs more)
    if (!checkRateLimit(ip)) {
      return reply.status(429).send({ 
        error: 'Too many requests. Please try again in a minute.' 
      });
    }

    const body = ttsSchema.parse(request.body);
    const { text, voiceName } = body;

    // Limit text length for TTS (costs and processing time)
    const textToRead = text.substring(0, 1000);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        return reply.status(500).send({ 
          error: 'API configuration error' 
        });
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-tts:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: textToRead }] }],
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { 
                    voiceName: voiceName 
                  }
                }
              }
            }
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini TTS API error:', errorText);
        return reply.status(500).send({ 
          error: 'Failed to generate audio' 
        });
      }

      const data = await response.json();
      
      if (!data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
        return reply.status(500).send({ 
          error: 'Invalid audio response' 
        });
      }

      const audioData = data.candidates[0].content.parts[0].inlineData.data;

      return { 
        audio: audioData,
        mimeType: 'audio/wav'
      };

    } catch (error) {
      console.error('TTS error:', error);
      return reply.status(500).send({ 
        error: 'An error occurred while generating audio' 
      });
    }
  });
}

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

// Lazy initialized Gemini client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// Search Grounding API using gemini-3.5-flash and googleSearch tool
app.post('/api/research', async (req, res) => {
  try {
    const { prompt, chapterContext } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required and must be a string.' });
    }

    const ai = getAIClient();

    const systemInstruction = `You are an elite Principal Distributed Systems Architect and Infrastructure Researcher.
You provide accurate, up-to-date, technical answers grounded in real-world benchmarks, incident reports, engineering blog posts, and current distributed systems architecture standards.
Always include specific latency numbers, throughput metrics, failover mechanics, and real-world production trade-offs.
Provide your response in cleanly formatted Markdown with clear headings, bullet points, and code/config snippets when appropriate.`;

    const fullPrompt = chapterContext 
      ? `System Design Topic / Chapter: ${chapterContext}\n\nResearch Query:\n${prompt}`
      : prompt;

    // Use gemini-3.5-flash with googleSearch tool for real-time search grounding
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }]
      }
    });

    const answer = response.text || '';
    const candidate = response.candidates?.[0];
    const groundingMetadata = candidate?.groundingMetadata || null;

    // Extract sources and search queries if available
    const searchQueries: string[] = groundingMetadata?.webSearchQueries || [];
    const rawChunks = groundingMetadata?.groundingChunks || [];
    const sources = rawChunks
      .filter((chunk: any) => chunk.web?.uri)
      .map((chunk: any) => ({
        title: chunk.web.title || 'Web Source',
        url: chunk.web.uri
      }));

    // Deduplicate sources by URL
    const uniqueSources = sources.filter((v, i, a) => a.findIndex(t => t.url === v.url) === i);

    return res.json({
      answer,
      searchQueries,
      sources: uniqueSources,
      groundingMetadata
    });
  } catch (error: any) {
    console.error('Error in /api/research:', error);
    let message = error?.message || 'An unexpected error occurred during search grounding.';
    
    // Parse nested Gemini JSON errors if present
    if (typeof message === 'string' && message.includes('{')) {
      try {
        const jsonMatch = message.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed?.error?.message) {
            message = parsed.error.message;
          }
        }
      } catch {
        // use raw message
      }
    }

    if (message.includes('exceeded your current quota') || message.includes('RESOURCE_EXHAUSTED')) {
      message = 'Gemini API quota exceeded (Rate Limit / Quota Exhausted). Please check your Gemini API billing tier or retry in a few moments.';
    }

    return res.status(500).json({
      error: message,
      details: process.env.NODE_ENV !== 'production' ? String(error) : undefined
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

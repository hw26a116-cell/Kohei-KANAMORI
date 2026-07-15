import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { generateQuizSession } from './server/questionPool.js';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // 通常セッション取得（高速ランダム選出）
  app.get('/api/quiz/session', (req, res) => {
    try {
      const count = req.query.count ? parseInt(req.query.count as string, 10) : 10;
      const questions = generateQuizSession(count);
      res.json({
        sessionId: `sess_${Date.now()}`,
        questions,
        isLiveGenerated: false
      });
    } catch (error) {
      console.error('Error generating session:', error);
      res.status(500).json({ error: 'Failed to generate quiz session' });
    }
  });

  // AIによるライブ検索＆新問ヒント生成モード
  app.post('/api/quiz/generate-live', async (req, res) => {
    try {
      const questions = generateQuizSession(10);
      const ai = getAiClient();

      if (ai) {
        // Geminiにクイズの「見抜き方のワンポイントアドバイス」をリアルタイム生成してもらう
        try {
          const prompt = `あなたは画像AIアナリストです。次の3つのジャンルのAI画像を見抜くためのワンポイントヒントを1行ずつ合計3行で出力してください。
ジャンル1: ${questions[0].category}
ジャンル2: ${questions[1].category}
ジャンル3: ${questions[2].category}`;

          const resp = await ai.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: prompt
          });
          const adviceLines = resp.text ? resp.text.split('\n').filter(l => l.trim().length > 0) : [];
          
          if (adviceLines.length >= 3) {
            questions[0].explanation += ` 【AIワンポイント】${adviceLines[0]}`;
            questions[1].explanation += ` 【AIワンポイント】${adviceLines[1]}`;
            questions[2].explanation += ` 【AIワンポイント】${adviceLines[2]}`;
          }
        } catch (genErr) {
          console.warn('Gemini live tip generation skipped:', genErr);
        }
      }

      res.json({
        sessionId: `sess_live_${Date.now()}`,
        questions,
        isLiveGenerated: true
      });
    } catch (error) {
      console.error('Error in live generation:', error);
      res.status(500).json({ error: 'Failed to generate live quiz' });
    }
  });

  // Vite development / Production static serving middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
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
    console.log(`AI vs Human Quiz Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

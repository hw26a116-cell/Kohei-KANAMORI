/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface QuizQuestion {
  id: string;
  title: string;
  promptText: string; // e.g. "この絵はどちらがAIでしょうか？"
  category: string; // e.g. "風景", "動物", "建築・街並み", "料理・カフェ", "人物・肖像"
  imageA: string;
  imageB: string;
  aiTarget: 'A' | 'B'; // どちらがAIか
  explanation: string;
  sourceHuman: string;
  sourceAI: string;
}

export interface QuizSessionResponse {
  sessionId: string;
  questions: QuizQuestion[];
  isLiveGenerated?: boolean;
}

export type GameScreenState = 'title' | 'playing' | 'question_result' | 'game_over';

export interface UserAnswerRecord {
  question: QuizQuestion;
  selected: 'A' | 'B' | 'timeout';
  isCorrect: boolean;
  timeSpentSeconds: number;
}

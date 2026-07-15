/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { QuizQuestion, GameScreenState, UserAnswerRecord } from './types.js';
import { TitleScreen } from './components/TitleScreen.tsx';
import { QuizScreen } from './components/QuizScreen.tsx';
import { GameOverScreen } from './components/GameOverScreen.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { AlertCircle } from 'lucide-react';
import { generateGameQuestions } from '../server/questionPool.ts';

export default function App() {
  const [screenState, setScreenState] = useState<GameScreenState>('title');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [records, setRecords] = useState<UserAnswerRecord[]>([]);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastLiveMode, setLastLiveMode] = useState<boolean>(false);

  // ゲーム開始処理
  const handleStartGame = async (isLiveMode: boolean) => {
    setIsLoading(true);
    setErrorMsg(null);
    setLastLiveMode(isLiveMode);

    try {
      const endpoint = isLiveMode ? '/api/quiz/generate-live' : '/api/quiz/session?count=10';
      const method = isLiveMode ? 'POST' : 'GET';
      const headers = isLiveMode ? { 'Content-Type': 'application/json' } : undefined;

      let fetchedQuestions: QuizQuestion[] | null = null;

      try {
        const res = await fetch(endpoint, { method, headers });
        if (res.ok) {
          const data = await res.json();
          if (data.questions && data.questions.length > 0) {
            fetchedQuestions = data.questions;
          }
        } else {
          console.warn('Backend API returned non-ok status, using fallback.');
        }
      } catch (fetchErr) {
        console.warn('Backend API fetch failed, falling back to client-side generation:', fetchErr);
      }

      // サーバーレス環境（GitHub Pages等）用のオフラインフォールバック
      if (!fetchedQuestions) {
        console.log('GitHub Pages or offline mode detected. Generating quiz questions on client-side.');
        // クライアント側で問題プールからランダム生成
        fetchedQuestions = generateGameQuestions(3); // 3問全問正解でクリアを目指すという仕様に合わせて3問を生成
      }

      setQuestions(fetchedQuestions);
      setCurrentQIndex(0);
      setRecords([]);
      setScreenState('playing');
    } catch (err: any) {
      console.error('Start game error:', err);
      setErrorMsg(err.message || 'ゲームの初期化中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  // 問題回答完了
  const handleAnswerComplete = (
    selected: 'A' | 'B' | 'timeout',
    isCorrect: boolean,
    timeSpentSeconds: number
  ) => {
    const currentQ = questions[currentQIndex];
    if (!currentQ) return;

    setRecords((prev) => [
      ...prev,
      {
        question: currentQ,
        selected,
        isCorrect,
        timeSpentSeconds
      }
    ]);
  };

  // 次の問題へ進む（または終了画面）
  const handleNextQuestion = () => {
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      setScreenState('game_over');
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
        {/* エラーアラート */}
        {errorMsg && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-rose-600 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center space-x-3 text-sm font-bold animate-bounce">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg(null)} className="ml-2 text-xs opacity-80 underline cursor-pointer">
              閉じる
            </button>
          </div>
        )}

        {/* 画面切り替え */}
        {screenState === 'title' && (
          <TitleScreen onStartGame={handleStartGame} isLoading={isLoading} />
        )}

        {screenState === 'playing' && (
          questions[currentQIndex] ? (
            <QuizScreen
              question={questions[currentQIndex]}
              questionIndex={currentQIndex}
              totalQuestions={questions.length}
              onAnswerComplete={handleAnswerComplete}
              onNextQuestion={handleNextQuestion}
            />
          ) : (
            <div className="min-h-screen flex items-center justify-center p-6">
              <div className="text-center p-8 bg-white rounded-2xl shadow border border-slate-200">
                <p className="text-slate-600 mb-4">問題データの読み込みに問題が発生しました。</p>
                <button onClick={() => setScreenState('title')} className="py-2 px-6 bg-emerald-600 text-white font-bold rounded-xl cursor-pointer">
                  タイトルへ戻る
                </button>
              </div>
            </div>
          )
        )}

        {screenState === 'game_over' && (
          <GameOverScreen
            records={records}
            onPlayAgain={() => handleStartGame(lastLiveMode)}
            onReturnTitle={() => setScreenState('title')}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

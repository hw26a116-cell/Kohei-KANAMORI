/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { UserAnswerRecord } from '../types.js';
import { Trophy, RefreshCw, Home, CheckCircle2, XCircle, Clock, AlertCircle, Bot } from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

interface GameOverScreenProps {
  records: UserAnswerRecord[];
  onPlayAgain: () => void;
  onReturnTitle: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  records,
  onPlayAgain,
  onReturnTitle
}) => {
  const correctCount = records.filter(r => r.isCorrect).length;
  const isPerfectWin = correctCount === records.length && records.length > 0;

  useEffect(() => {
    if (isPerfectWin) {
      // 全問正解時の華やかな紙吹雪演出
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: number = window.setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isPerfectWin]);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 font-sans text-slate-800 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-12 flex flex-col items-center text-center"
      >
        {/* Result Header Badge */}
        <div className={`w-24 h-24 rounded-3xl flex items-center justify-center shadow-lg mb-6 ${
          isPerfectWin 
            ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-white shadow-amber-500/30'
            : 'bg-gradient-to-tr from-slate-700 to-slate-600 text-slate-200 shadow-slate-700/20'
        }`}>
          {isPerfectWin ? <Trophy className="w-12 h-12 animate-bounce" /> : <AlertCircle className="w-12 h-12" />}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 mb-3">
          {isPerfectWin ? (
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-emerald-600">
              🏆 完全クリア！全問正解！
            </span>
          ) : (
            <span>惜しい！{records.length}問全問正解ならず...</span>
          )}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 font-medium max-w-xl mb-8">
          {isPerfectWin ? (
            `素晴らしい眼力です！あなたは全${records.length}問すべてでAI生成画像を正確に見抜きました。人工知能の違和感を瞬時に見分ける完璧なセンスを持っています！`
          ) : (
            `今回の結果は ${records.length}問中 「${correctCount}問正解」 でした。このゲームは全${records.length}問すべて正解しなければクリアになりません！もう一度挑戦してパーフェクトを目指しましょう。`
          )}
        </p>

        {/* Action Buttons (Top Placement for Scannability) */}
        <div className="w-full max-w-md flex flex-col sm:flex-row gap-4 mb-12">
          <button
            id="play-again-btn"
            onClick={onPlayAgain}
            className="flex-1 py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center space-x-2 transition-all active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-5 h-5" />
            <span>もう一度挑戦する</span>
          </button>

          <button
            id="return-title-btn"
            onClick={onReturnTitle}
            className="py-4 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center justify-center space-x-2 transition-all active:scale-95 cursor-pointer"
          >
            <Home className="w-5 h-5" />
            <span>タイトルへ</span>
          </button>
        </div>


        {/* Question Review Section */}
        <div className="w-full text-left border-t border-slate-200 pt-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center space-x-2">
            <span>📋 出題された問題の振り返り</span>
          </h2>

          <div className="space-y-6">
            {records.map((rec, idx) => {
              const q = rec.question;
              return (
                <div
                  key={q.id || idx}
                  className={`rounded-2xl border p-4 sm:p-6 transition-all ${
                    rec.isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'
                  }`}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-bold text-slate-800 text-sm sm:text-base">第 {idx + 1} 問：{q.category}</span>
                        {rec.isCorrect ? (
                          <span className="px-2.5 py-0.5 bg-emerald-600 text-white font-bold rounded-full text-xs flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>正解</span>
                          </span>
                        ) : rec.selected === 'timeout' ? (
                          <span className="px-2.5 py-0.5 bg-amber-600 text-white font-bold rounded-full text-xs flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>時間切れ</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 bg-rose-600 text-white font-bold rounded-full text-xs flex items-center space-x-1">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>不正解</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500">
                        あなたの回答: <strong className="text-slate-800">{rec.selected === 'timeout' ? '未選択 (時間切れ)' : `画像 ${rec.selected}`}</strong> &bull; 正解: <strong className="text-emerald-700">画像 {q.aiTarget}</strong> (AI生成)
                      </p>
                    </div>

                    <div className="text-xs font-mono text-slate-400">
                      解答時間: {rec.timeSpentSeconds.toFixed(1)}s
                    </div>
                  </div>

                  {/* Thumbnail Comparison */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="relative rounded-xl overflow-hidden aspect-4/3 bg-slate-100 border border-slate-300 flex items-center justify-center">
                      <div className="absolute top-2 left-2 z-10 px-2 py-1 bg-black/70 text-white rounded font-bold text-xs">
                        A {q.aiTarget === 'A' ? '(AI)' : '(実写)'}
                      </div>
                      <img
                        src={q.imageA}
                        alt="問題A"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="relative rounded-xl overflow-hidden aspect-4/3 bg-slate-100 border border-slate-300 flex items-center justify-center">
                      <div className="absolute top-2 left-2 z-10 px-2 py-1 bg-black/70 text-white rounded font-bold text-xs">
                        B {q.aiTarget === 'B' ? '(AI)' : '(実写)'}
                      </div>
                      <img
                        src={q.imageB}
                        alt="問題B"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="text-xs sm:text-sm text-slate-600 bg-white/80 p-3.5 rounded-xl border border-slate-200/60 leading-relaxed">
                    <strong className="text-slate-800 flex items-center gap-1 mb-1">
                      <Bot className="w-3.5 h-3.5 text-emerald-600 inline" />
                      <span>解説ノート:</span>
                    </strong>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { QuizQuestion } from '../types.js';
import { Clock, CheckCircle2, XCircle, AlertTriangle, ArrowRight, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuizScreenProps {
  question: QuizQuestion;
  questionIndex: number;
  totalQuestions: number;
  onAnswerComplete: (selected: 'A' | 'B' | 'timeout', isCorrect: boolean, timeSpentSeconds: number) => void;
  onNextQuestion: () => void;
}

const TIME_LIMIT_SECONDS = 5.0;
const AUTO_NEXT_SECONDS = 3.5;

/**
 * ネットワーク制限やCDNエラーを検知して自動的にPicsum安定ソースやグラフィックアートへ切り替えるスマート画像コンポーネント
 */
interface SmartImageProps {
  primarySrc: string;
  seed: string;
  alt: string;
  title: string;
  category: string;
  choiceLabel: 'A' | 'B';
  className?: string;
  onReady: () => void;
}

const SmartImage: React.FC<SmartImageProps> = ({
  primarySrc,
  seed,
  alt,
  title,
  category,
  choiceLabel,
  className,
  onReady
}) => {
  const [currentSrc, setCurrentSrc] = useState(primarySrc);
  const [errorStage, setErrorStage] = useState(0); // 0: primary, 1: picsum fallback, 2: svg simulated
  const isMountedRef = useRef(true);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  useEffect(() => {
    isMountedRef.current = true;
    setCurrentSrc(primarySrc);
    setErrorStage(0);

    // 通信環境が極端に悪い・ブロックされている場合に3.2秒で自動的にPicsumバックアップへ切り替え
    const timer = setTimeout(() => {
      if (isMountedRef.current && errorStage === 0) {
        console.warn(`[Image Timeout] ${choiceLabel} slow, switching to backup CDN...`);
        setErrorStage(1);
        setCurrentSrc(`https://picsum.photos/seed/${encodeURIComponent(seed)}/800/600`);
      }
    }, 3200);

    return () => {
      isMountedRef.current = false;
      clearTimeout(timer);
    };
  }, [primarySrc, seed, choiceLabel]);

  const handleLoad = () => {
    onReadyRef.current();
  };

  const handleError = () => {
    if (errorStage === 0) {
      console.warn(`[Image Error] ${choiceLabel} failed, switching to backup CDN...`);
      setErrorStage(1);
      setCurrentSrc(`https://picsum.photos/seed/${encodeURIComponent(seed)}/800/600`);
    } else if (errorStage === 1) {
      console.warn(`[Backup Error] ${choiceLabel} failed, switching to SVG Simulation...`);
      setErrorStage(2);
      onReadyRef.current();
    }
  };

  if (errorStage === 2) {
    return (
      <div className={`w-full h-full bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center rounded-xl relative overflow-hidden select-none ${className}`}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center mb-3 shadow-inner">
          <Sparkles className="w-6 h-6 text-indigo-300 animate-pulse" />
        </div>
        <span className="text-[10px] tracking-widest text-indigo-400 font-mono uppercase mb-1">{category}</span>
        <h4 className="text-sm sm:text-base font-bold max-w-xs text-slate-100 leading-snug mb-3">{title}</h4>
        <div className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] text-slate-400 font-mono">
          Visual Archive [{choiceLabel}]
        </div>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      onLoad={handleLoad}
      onError={handleError}
      className={className}
    />
  );
};

export const QuizScreen: React.FC<QuizScreenProps> = ({
  question,
  questionIndex,
  totalQuestions,
  onAnswerComplete,
  onNextQuestion
}) => {
  // 画像読み込み完了ステータス
  const [loadedA, setLoadedA] = useState(false);
  const [loadedB, setLoadedB] = useState(false);
  const [imagesReady, setImagesReady] = useState(false);

  // クイズ回答状態
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | 'timeout' | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_SECONDS);
  const [autoNextTimeLeft, setAutoNextTimeLeft] = useState(AUTO_NEXT_SECONDS);

  const timerIntervalRef = useRef<number | null>(null);
  const autoNextIntervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const isAnsweredRef = useRef<boolean>(false);
  const isNextCalledRef = useRef<boolean>(false);

  // 問題が変わったときの初期化
  useEffect(() => {
    isAnsweredRef.current = false;
    isNextCalledRef.current = false;

    setLoadedA(false);
    setLoadedB(false);
    setImagesReady(false);
    setSelectedAnswer(null);
    setTimeLeft(TIME_LIMIT_SECONDS);
    setAutoNextTimeLeft(AUTO_NEXT_SECONDS);

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (autoNextIntervalRef.current) {
      clearInterval(autoNextIntervalRef.current);
      autoNextIntervalRef.current = null;
    }

    // 万が一の通信遅延時セーフティ（4.0秒経過で強制的にプレイ解禁）
    const safetyTimer = setTimeout(() => {
      if (!isAnsweredRef.current) {
        setLoadedA(true);
        setLoadedB(true);
        setImagesReady(true);
      }
    }, 4000);

    return () => {
      clearTimeout(safetyTimer);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (autoNextIntervalRef.current) clearInterval(autoNextIntervalRef.current);
    };
  }, [question.id]);

  // 両方の画像が確実にロード完了したタイミングでタイマー解禁
  useEffect(() => {
    if (loadedA && loadedB && !imagesReady) {
      setImagesReady(true);
    }
  }, [loadedA, loadedB, imagesReady]);

  // 選択処理（コンポーネント内から呼ぶ関数）
  const doSelectAnswer = (choice: 'A' | 'B' | 'timeout') => {
    if (isAnsweredRef.current) return;
    isAnsweredRef.current = true;

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    setSelectedAnswer(choice);
    const timeSpent = Math.min(TIME_LIMIT_SECONDS, (Date.now() - startTimeRef.current) / 1000 || TIME_LIMIT_SECONDS);
    const isCorrect = choice === question.aiTarget;

    onAnswerComplete(choice, isCorrect, timeSpent);
  };

  // 画像が読み込まれたら5秒カウントダウン開始
  useEffect(() => {
    if (!imagesReady || selectedAnswer !== null) return;

    startTimeRef.current = Date.now();
    const endTime = startTimeRef.current + TIME_LIMIT_SECONDS * 1000;

    timerIntervalRef.current = window.setInterval(() => {
      if (isAnsweredRef.current) {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        return;
      }

      const remainingMs = endTime - Date.now();
      if (remainingMs <= 0) {
        setTimeLeft(0);
        doSelectAnswer('timeout');
      } else {
        setTimeLeft(remainingMs / 1000);
      }
    }, 40);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [imagesReady, selectedAnswer]);

  // 回答後の自動次へ進むタイマー
  useEffect(() => {
    if (selectedAnswer === null) return;

    autoNextIntervalRef.current = window.setInterval(() => {
      setAutoNextTimeLeft((prev) => {
        if (prev <= 0.1) {
          if (autoNextIntervalRef.current) clearInterval(autoNextIntervalRef.current);
          if (!isNextCalledRef.current) {
            isNextCalledRef.current = true;
            onNextQuestion();
          }
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => {
      if (autoNextIntervalRef.current) {
        clearInterval(autoNextIntervalRef.current);
        autoNextIntervalRef.current = null;
      }
    };
  }, [selectedAnswer, onNextQuestion]);

  const handleManualNext = () => {
    if (isNextCalledRef.current) return;
    isNextCalledRef.current = true;
    if (autoNextIntervalRef.current) clearInterval(autoNextIntervalRef.current);
    onNextQuestion();
  };

  const isAnswered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === question.aiTarget;
  const progressPercent = (timeLeft / TIME_LIMIT_SECONDS) * 100;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-start p-3 sm:p-6 font-sans text-slate-800">
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
        {/* Top Header Bar */}
        <div className="w-full flex items-center justify-between bg-white px-5 py-3.5 rounded-2xl shadow-sm border border-slate-200 mb-5">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-slate-100 text-slate-700 font-bold rounded-lg text-xs sm:text-sm">
              第 {questionIndex + 1} 問 / 全 {totalQuestions} 問
            </span>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-lg text-xs sm:text-sm hidden sm:inline-block">
              ジャンル: {question.category}
            </span>
          </div>

          {/* Countdown Clock Display */}
          <div className="flex items-center space-x-2">
            <Clock className={`w-5 h-5 ${timeLeft <= 2.0 && !isAnswered && imagesReady ? 'text-rose-500 animate-pulse' : 'text-slate-600'}`} />
            <span className={`font-mono font-black text-lg sm:text-2xl ${timeLeft <= 2.0 && !isAnswered && imagesReady ? 'text-rose-600' : 'text-slate-800'}`}>
              {imagesReady ? `${timeLeft.toFixed(1)}s` : '5.0s'}
            </span>
          </div>
        </div>

        {/* Timer Progress Bar */}
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden mb-5 shadow-inner">
          <motion.div
            className={`h-full transition-colors duration-200 ${
              !imagesReady ? 'bg-slate-300' : timeLeft > 3.0 ? 'bg-emerald-500' : timeLeft > 1.5 ? 'bg-amber-500' : 'bg-rose-500'
            }`}
            style={{ width: `${imagesReady ? progressPercent : 100}%` }}
          />
        </div>

        {/* Question Prompt */}
        <div className="text-center mb-5">
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
            この絵はどちらが<span className="text-emerald-600">AI</span>でしょうか？
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {imagesReady 
              ? '画像が完全に読み込まれました！ 制限時間5秒以内にAI生成画像（AまたはB）をクリックしてください。' 
              : '問題を準備しています。両方の画像が読み込まれてから5秒タイマーが作動します...'}
          </p>
        </div>

        {!imagesReady && (
          <div className="w-full bg-amber-50 border border-amber-300 rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 text-amber-900 text-sm font-bold shadow-sm animate-pulse">
            <Loader2 className="w-6 h-6 animate-spin text-amber-600 shrink-0" />
            <span>問題の画像を完全に読み込んでいます。タイマーはまだ開始されていません...</span>
          </div>
        )}

        {/* Two Image Comparison Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* IMAGE CARD A */}
          <motion.div
            whileHover={!isAnswered && imagesReady ? { scale: 1.012, y: -3 } : {}}
            whileTap={!isAnswered && imagesReady ? { scale: 0.98 } : {}}
            onClick={() => imagesReady && !isAnswered && doSelectAnswer('A')}
            id="choice-card-a"
            className={`relative rounded-3xl overflow-hidden bg-white border-4 transition-all duration-300 shadow-md flex flex-col group ${
              !imagesReady
                ? 'border-slate-200 opacity-60 cursor-wait'
                : !isAnswered
                ? 'border-slate-200 hover:border-emerald-400 hover:shadow-xl cursor-pointer'
                : selectedAnswer === 'A'
                ? isCorrect
                  ? 'border-emerald-500 ring-4 ring-emerald-500/30'
                  : 'border-rose-500 ring-4 ring-rose-500/30'
                : question.aiTarget === 'A'
                ? 'border-emerald-500 opacity-90'
                : 'border-slate-200 opacity-60'
            }`}
          >
            {/* Card Header Badge */}
            <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
              <span className="w-10 h-10 rounded-xl bg-slate-900/80 backdrop-blur-md text-white font-black text-lg flex items-center justify-center shadow-lg">
                A
              </span>
            </div>

            {/* Answer Reveal Badge on Image */}
            {isAnswered && (
              <div className="absolute top-4 right-4 z-10 animate-fade-in">
                {question.aiTarget === 'A' ? (
                  <span className="px-3 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center space-x-1.5 shadow-lg">
                    <Bot className="w-4 h-4" />
                    <span>AI 生成画像 (正解ターゲット)</span>
                  </span>
                ) : (
                  <span className="px-3 py-2 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs sm:text-sm flex items-center space-x-1.5 shadow-lg">
                    <User className="w-4 h-4" />
                    <span>人間作成・実写</span>
                  </span>
                )}
              </div>
            )}

            {/* Image Box (見切れ対策：十分な高さ枠内でobject-contain) */}
            <div className="w-full h-64 sm:h-80 md:h-96 bg-slate-900/5 relative flex items-center justify-center p-3">
              {!loadedA && (
                <div className="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center text-slate-400 text-xs font-semibold space-y-2">
                  <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                  <span>画像Aをプリロード中...</span>
                </div>
              )}
              <img
                src={question.imageA}
                alt="選択肢A"
                referrerPolicy="no-referrer"
                onLoad={() => setLoadedA(true)}
                onError={() => setLoadedA(true)}
                className={`max-w-full max-h-full object-contain rounded-xl transition-transform duration-500 ${
                  !isAnswered && imagesReady && 'group-hover:scale-105'
                } ${!loadedA ? 'opacity-0' : 'opacity-100'}`}
              />
            </div>

            <div className="p-4 bg-white flex items-center justify-between border-t border-slate-100">
              <span className="font-bold text-slate-700 text-sm sm:text-base">画像 A を選択する</span>
              <span className="text-xs text-slate-400">{imagesReady ? 'クリックで判定' : '読み込み待ち'}</span>
            </div>
          </motion.div>


          {/* IMAGE CARD B */}
          <motion.div
            whileHover={!isAnswered && imagesReady ? { scale: 1.012, y: -3 } : {}}
            whileTap={!isAnswered && imagesReady ? { scale: 0.98 } : {}}
            onClick={() => imagesReady && !isAnswered && doSelectAnswer('B')}
            id="choice-card-b"
            className={`relative rounded-3xl overflow-hidden bg-white border-4 transition-all duration-300 shadow-md flex flex-col group ${
              !imagesReady
                ? 'border-slate-200 opacity-60 cursor-wait'
                : !isAnswered
                ? 'border-slate-200 hover:border-emerald-400 hover:shadow-xl cursor-pointer'
                : selectedAnswer === 'B'
                ? isCorrect
                  ? 'border-emerald-500 ring-4 ring-emerald-500/30'
                  : 'border-rose-500 ring-4 ring-rose-500/30'
                : question.aiTarget === 'B'
                ? 'border-emerald-500 opacity-90'
                : 'border-slate-200 opacity-60'
            }`}
          >
            {/* Card Header Badge */}
            <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
              <span className="w-10 h-10 rounded-xl bg-slate-900/80 backdrop-blur-md text-white font-black text-lg flex items-center justify-center shadow-lg">
                B
              </span>
            </div>

            {/* Answer Reveal Badge on Image */}
            {isAnswered && (
              <div className="absolute top-4 right-4 z-10 animate-fade-in">
                {question.aiTarget === 'B' ? (
                  <span className="px-3 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center space-x-1.5 shadow-lg">
                    <Bot className="w-4 h-4" />
                    <span>AI 生成画像 (正解ターゲット)</span>
                  </span>
                ) : (
                  <span className="px-3 py-2 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs sm:text-sm flex items-center space-x-1.5 shadow-lg">
                    <User className="w-4 h-4" />
                    <span>人間作成・実写</span>
                  </span>
                )}
              </div>
            )}

            {/* Image Box (見切れ対策：十分な高さ枠内でobject-contain) */}
            <div className="w-full h-64 sm:h-80 md:h-96 bg-slate-900/5 relative flex items-center justify-center p-3">
              {!loadedB && (
                <div className="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center text-slate-400 text-xs font-semibold space-y-2">
                  <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                  <span>画像Bをプリロード中...</span>
                </div>
              )}
              <img
                src={question.imageB}
                alt="選択肢B"
                referrerPolicy="no-referrer"
                onLoad={() => setLoadedB(true)}
                onError={() => setLoadedB(true)}
                className={`max-w-full max-h-full object-contain rounded-xl transition-transform duration-500 ${
                  !isAnswered && imagesReady && 'group-hover:scale-105'
                } ${!loadedB ? 'opacity-0' : 'opacity-100'}`}
              />
            </div>

            <div className="p-4 bg-white flex items-center justify-between border-t border-slate-100">
              <span className="font-bold text-slate-700 text-sm sm:text-base">画像 B を選択する</span>
              <span className="text-xs text-slate-400">{imagesReady ? 'クリックで判定' : '読み込み待ち'}</span>
            </div>
          </motion.div>
        </div>


        {/* Immediate Result Reveal Panel (Appears right after selection) */}
        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 flex flex-col mb-10 overflow-hidden relative"
            >
              {/* Status Banner */}
              <div className={`w-full py-4 px-6 rounded-2xl flex items-center justify-between mb-6 text-white ${
                selectedAnswer === 'timeout'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600'
                  : isCorrect
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600'
                  : 'bg-gradient-to-r from-rose-600 to-red-600'
              }`}>
                <div className="flex items-center space-x-3">
                  {selectedAnswer === 'timeout' ? (
                    <AlertTriangle className="w-8 h-8 shrink-0" />
                  ) : isCorrect ? (
                    <CheckCircle2 className="w-8 h-8 shrink-0" />
                  ) : (
                    <XCircle className="w-8 h-8 shrink-0" />
                  )}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black">
                      {selectedAnswer === 'timeout'
                        ? '時間切れ！タイムアップ'
                        : isCorrect
                        ? 'お見事！大正解です！'
                        : '残念！不正解です...'}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium opacity-90">
                      正解は 「画像 {question.aiTarget}」 （AI生成画像）でした
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center space-x-2 bg-black/20 px-4 py-2 rounded-xl text-xs font-bold font-mono">
                  <span>NEXT IN</span>
                  <span className="text-lg text-amber-300">{Math.ceil(autoNextTimeLeft)}s</span>
                </div>
              </div>

              {/* Explanation Content */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-6 text-left">
                <div className="flex items-center space-x-2 text-slate-800 font-bold mb-2 text-sm sm:text-base">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>見抜き方の解説ノート</span>
                </div>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {question.explanation}
                </p>
                <div className="mt-4 pt-3 border-t border-slate-200/60 flex flex-wrap gap-4 text-xs text-slate-400 font-mono">
                  <span>人間素材: {question.sourceHuman}</span>
                  <span>AIモデル: {question.sourceAI}</span>
                </div>
              </div>

              {/* Manual Next Button */}
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-slate-400 font-medium">
                  {Math.ceil(autoNextTimeLeft)}秒後に自動的に{questionIndex + 1 === totalQuestions ? '最終結果画面' : '次の問題'}へ進みます
                </span>

                <button
                  id="next-question-btn"
                  onClick={handleManualNext}
                  className="py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md flex items-center space-x-2 transition-all active:scale-95 cursor-pointer text-sm"
                >
                  <span>{questionIndex + 1 === totalQuestions ? '結果を見る' : '次の問題へ急ぐ'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

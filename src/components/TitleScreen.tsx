/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Zap, Globe, ShieldCheck, Clock, Award, Eye } from 'lucide-react';
import { motion } from 'motion/react';

interface TitleScreenProps {
  onStartGame: (isLiveMode: boolean) => void;
  isLoading: boolean;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStartGame, isLoading }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans text-slate-800">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-10 flex flex-col items-center text-center relative overflow-hidden"
      >
        {/* Decorative Background Accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Icon Badge */}
        <div className="w-20 h-20 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-6 text-white transform rotate-3 hover:rotate-0 transition-transform">
          <Eye className="w-10 h-10" />
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 mb-3">
          AI vs Human <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Quiz</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 font-medium mb-8 max-w-lg">
          2枚の画像から「AIが作った画像」を直感で見抜く5秒決断クイズ！あなたは人間の魂とAIの技術を見分けられますか？
        </p>

        {/* Rules Box */}
        <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-8 text-left grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-xl shrink-0 mt-0.5">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">1問5秒のタイムリミット</h3>
              <p className="text-xs text-slate-500 mt-0.5">じっくり見る時間はありません。直感とフィーリングで選択！</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl shrink-0 mt-0.5">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">全10問・完全パーフェクト制</h3>
              <p className="text-xs text-slate-500 mt-0.5">スコア計算はなし。10問すべて連続正解しなければクリアになりません。</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">著作権に配慮した厳選素材</h3>
              <p className="text-xs text-slate-500 mt-0.5">ネット上のパブリックドメイン＆高品質フリー素材から随時出題。</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2 bg-teal-100 text-teal-700 rounded-xl shrink-0 mt-0.5">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">その場で即座に結果判明</h3>
              <p className="text-xs text-slate-500 mt-0.5">回答後すぐ正解・解説が表示され、自動で次の問題に進みます。</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row gap-4 justify-center">
          <button
            id="start-quick-btn"
            disabled={isLoading}
            onClick={() => onStartGame(false)}
            className="flex-1 py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
          >
            <Zap className="w-5 h-5 fill-current" />
            <span>{isLoading ? '準備中...' : 'ゲームスタート (クイック出題)'}</span>
          </button>

          <button
            id="start-live-btn"
            disabled={isLoading}
            onClick={() => onStartGame(true)}
            className="py-4 px-6 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-60 cursor-pointer text-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AIライブ生成で挑戦</span>
          </button>
        </div>

        <p className="text-xs text-slate-400 mt-6 font-mono">
          SYSTEM: EXPRESS + VITE SERVER &bull; GEMINI CAPABLE
        </p>
      </motion.div>
    </div>
  );
};

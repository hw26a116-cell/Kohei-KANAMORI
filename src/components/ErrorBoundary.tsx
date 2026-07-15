/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    (this as any).state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error in application:', error, errorInfo);
  }

  public render(): ReactNode {
    const state = (this as any).state;
    const props = (this as any).props;
    if (state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md bg-slate-800 border border-rose-500/30 p-8 rounded-3xl shadow-2xl flex flex-col items-center">
            <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mb-4">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold mb-2">予期せぬエラーが発生しました</h2>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              画面の再描画中に問題が発生しました。ブラウザの再読み込みボタンを押すか、以下のボタンから最初に戻ってください。
            </p>
            <button
              onClick={() => window.location.reload()}
              className="py-3 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl flex items-center space-x-2 active:scale-95 transition-all cursor-pointer shadow-lg"
            >
              <RefreshCw className="w-4 h-4" />
              <span>アプリを再起動する</span>
            </button>
          </div>
        </div>
      );
    }

    return props.children;
  }
}

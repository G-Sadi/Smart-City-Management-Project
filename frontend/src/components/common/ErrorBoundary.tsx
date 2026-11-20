import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null, showDetails: false };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('CivicGrid Uncaught Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  private handleHardReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] w-full flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-md w-full p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center ring-4 ring-rose-50 dark:ring-rose-950/20">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Something unexpected occurred
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {this.props.fallbackMessage ||
                  'The operational view encountered a rendering issue. Your cached data and drafts remain safe.'}
              </p>
            </div>

            <div className="flex items-center justify-center space-x-2 pt-2">
              <button
                onClick={this.handleReload}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition flex items-center space-x-1.5 shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Recover View</span>
              </button>

              <button
                onClick={this.handleHardReload}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center space-x-1.5 border border-slate-200 dark:border-slate-700"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Full Reload</span>
              </button>
            </div>

            {this.state.error && (
              <div className="text-left pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => this.setState({ showDetails: !this.state.showDetails })}
                  className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-mono underline"
                >
                  {this.state.showDetails ? 'Hide technical details' : 'Show technical details'}
                </button>
                {this.state.showDetails && (
                  <pre className="mt-2 p-2.5 rounded-lg bg-slate-950 text-rose-400 text-[10px] font-mono overflow-x-auto max-h-36 border border-slate-800">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

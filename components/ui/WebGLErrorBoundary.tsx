'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class WebGLErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('WebGL Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-black text-white p-8">
          <div className="max-w-md text-center space-y-4 bg-zinc-900 p-8 rounded-2xl border border-red-500/20">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold">Graphic Error</h2>
            <p className="text-zinc-400">
              Your browser does not support WebGL or hardware acceleration is disabled. 
              The 3D museum cannot be displayed.
            </p>
            <div className="text-xs text-zinc-600 font-mono bg-black/50 p-2 rounded">
                 {this.state.error?.message || "Unknown WebGL Error"}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  name: string;
  children: ReactNode;
}
interface State {
  error: Error | null;
}

/** Keeps a misbehaving app from taking down the whole desktop. */
export default class AppBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn(`[macOS Web] ${this.props.name} crashed`, error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-3 bg-zinc-100 p-8 text-center text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
          <div className="text-4xl">⚠️</div>
          <div className="text-[15px] font-semibold">{this.props.name} quit unexpectedly</div>
          <p className="max-w-sm text-[12.5px] opacity-60">{String(this.state.error.message)}</p>
          <button
            onClick={() => this.setState({ error: null })}
            className="rounded-md bg-blue-500 px-3 py-1 text-[12.5px] font-medium text-white"
          >
            Reopen
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// global.d.ts
export {};

declare global {
  interface Window {
    fbq: {
      (...args: unknown[]): void;
      callMethod?: (...args: unknown[]) => void;
      queue: unknown[];
      loaded: boolean;
      version: string;
    };
    _fbq?: typeof window.fbq;
  }
}

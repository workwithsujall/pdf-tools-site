declare namespace NodeJS {
  interface Timeout {
    ref(): this;
    unref(): this;
  }
  
  interface Timer {
    hasRef(): boolean;
    refresh(): this;
    [Symbol.toPrimitive](): number;
  }
  
  interface Global {
    clearTimeout(timeoutId: Timeout): void;
    setTimeout(callback: (...args: any[]) => void, ms?: number, ...args: any[]): Timeout;
    clearInterval(intervalId: Timeout): void;
    setInterval(callback: (...args: any[]) => void, ms?: number, ...args: any[]): Timeout;
  }
} 
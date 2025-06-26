
export class PerformanceMonitor {
  private static timers: Map<string, number> = new Map();

  static start(label: string): void {
    console.log(`⏱️ Starting timer: ${label}`);
    this.timers.set(label, performance.now());
  }

  static end(label: string): number {
    const startTime = this.timers.get(label);
    if (!startTime) {
      console.warn(`Timer ${label} was not started`);
      return 0;
    }

    const duration = performance.now() - startTime;
    console.log(`⏱️ Timer ${label}: ${duration.toFixed(2)}ms`);
    this.timers.delete(label);
    
    // Log slow operations
    if (duration > 1000) {
      console.warn(`🐌 Slow operation detected: ${label} took ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }

  static measure<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.start(label);
    return fn().finally(() => this.end(label));
  }

  static logNetworkStatus(): void {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      console.log('📶 Network Info:', {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt
      });
    }
  }
}

// Initialize network monitoring
PerformanceMonitor.logNetworkStatus();

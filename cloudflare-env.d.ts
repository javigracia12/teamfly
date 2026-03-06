/** D1 binding type for Cloudflare Workers (used by getPrisma in lib/prisma.ts). */
declare global {
  interface D1Database {
    prepare(query: string): D1PreparedStatement;
    dump(): Promise<ArrayBuffer>;
    batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
    exec(query: string): Promise<D1ExecResult>;
  }
  interface D1PreparedStatement {
    bind(...values: unknown[]): D1PreparedStatement;
    first<T = unknown>(col?: string): Promise<T | null>;
    run<T = unknown>(): Promise<D1Result<T>>;
    all<T = unknown>(): Promise<D1Result<T>>;
  }
  interface D1Result<T = unknown> {
    results?: T[];
    success: boolean;
    meta: { duration: number; size?: number; changes?: number };
    error?: string;
  }
  interface D1ExecResult {
    count: number;
    duration: number;
  }
}
export {};

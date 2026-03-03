import Link from "next/link";
import { ClearStaleProjectCookie } from "@/components/ClearStaleProjectCookie";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <ClearStaleProjectCookie />
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-[rgb(var(--text))]">
          Not found
        </h1>
        <p className="mt-2 text-[rgb(var(--text-secondary))]">
          This page doesn’t exist or was removed.
        </p>
        <Link
          href="/projects"
          className="mt-6 inline-block px-4 py-2 rounded-lg btn-primary text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Back to projects
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "./ThemeProvider";

type Theme = "light" | "dark" | "system";

function getEffectiveTheme(theme: Theme): "light" | "dark" {
  if (theme === "system") {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  }
  return theme;
}

function applyTheme(effective: "light" | "dark") {
  document.documentElement.setAttribute("data-theme", effective);
}

export function ThemeToggle() {
  const initialTheme = useTheme();
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const effective = getEffectiveTheme(theme);
    applyTheme(effective);
  }, [theme, mounted]);

  useEffect(() => {
    if (theme !== "system" || !mounted) return;
    const m = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme(getEffectiveTheme("system"));
    m.addEventListener("change", onChange);
    return () => m.removeEventListener("change", onChange);
  }, [theme, mounted]);

  const handleSelect = async (next: Theme) => {
    setTheme(next);
    try {
      await fetch("/api/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: next }),
      });
    } catch {
      // ignore
    }
  };

  if (!mounted) {
    return (
      <div className="flex flex-col gap-1 w-full">
        <div className="h-9 rounded-lg bg-surface-muted" />
        <div className="h-9 rounded-lg bg-surface-muted" />
        <div className="h-9 rounded-lg bg-surface-muted" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={() => handleSelect("light")}
        className={`flex items-center gap-2 w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors text-left ${
          theme === "light"
            ? "bg-surface-elevated text-[rgb(var(--text))] shadow-card"
            : "text-[rgb(var(--text-tertiary))] hover:bg-surface-muted hover:text-[rgb(var(--text))]"
        }`}
        title="Light"
      >
        <Sun className="w-4 h-4 shrink-0" />
        Light
      </button>
      <button
        type="button"
        onClick={() => handleSelect("dark")}
        className={`flex items-center gap-2 w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors text-left ${
          theme === "dark"
            ? "bg-surface-elevated text-[rgb(var(--text))] shadow-card"
            : "text-[rgb(var(--text-tertiary))] hover:bg-surface-muted hover:text-[rgb(var(--text))]"
        }`}
        title="Dark"
      >
        <Moon className="w-4 h-4 shrink-0" />
        Dark
      </button>
      <button
        type="button"
        onClick={() => handleSelect("system")}
        className={`flex items-center gap-2 w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors text-left ${
          theme === "system"
            ? "bg-surface-elevated text-[rgb(var(--text))] shadow-card"
            : "text-[rgb(var(--text-tertiary))] hover:bg-surface-muted hover:text-[rgb(var(--text))]"
        }`}
        title="Use system setting"
      >
        <Monitor className="w-4 h-4 shrink-0" />
        System
      </button>
    </div>
  );
}

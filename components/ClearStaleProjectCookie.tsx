"use client";

import { useEffect } from "react";

const CURRENT_PROJECT_COOKIE = "currentProjectId";

export function ClearStaleProjectCookie() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.pathname.startsWith("/project/")) {
      document.cookie = `${CURRENT_PROJECT_COOKIE}=; path=/; max-age=0`;
    }
  }, []);
  return null;
}

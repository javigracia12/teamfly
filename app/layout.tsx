import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "Teamfly",
  description: "Project ERP for project leaders",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = (cookieStore.get("theme")?.value as "light" | "dark" | "system") || "system";
  const dataTheme = theme === "system" ? "light" : theme;

  return (
    <html lang="en" data-theme={dataTheme} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var c=document.cookie;var sys=!c.match(/theme=/)||c.includes('theme=system');var t=document.documentElement.getAttribute('data-theme');if(t==='light'&&sys){var d=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.setAttribute('data-theme',d?'dark':'light');}})();`,
          }}
        />
      </head>
      <body className="theme-transition min-h-screen font-sans bg-[rgb(var(--surface))] text-[rgb(var(--text))]">
        <ThemeProvider initialTheme={theme}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

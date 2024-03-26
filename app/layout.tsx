import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Fuzzie",
  description: "Automate your work with Fuzzie.",
};

const font = DM_Sans({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={font.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <footer className="min-h-12 bg-black/30 w-full border border-gray-900 mt-6">
          <div className="max-w-5xl mx-auto p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-400">
                  © {new Date().getFullYear()} Fuzzie. All rights reserved.
                </p>
              </div>
              <div>
                <a
                  href="#"
                  className="text-sm text-gray-400 hover:text-gray-300"
                >
                  Privacy Policy
                </a>
                <span className="text-sm text-gray-400 mx-2">•</span>
                <a
                  href="#"
                  className="text-sm text-gray-400 hover:text-gray-300"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

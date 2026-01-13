
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const appName = "TaskFlow";

export const metadata: Metadata = {
  title: "TaskFlow",
  description: "Task management made easy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-background text-foreground text-xl`}
      >
        {children}
      </body>
    </html>
  );
}

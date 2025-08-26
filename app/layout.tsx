
import type { Metadata } from "next";
import "./globals.css";

// Temporary workaround for network issues
const inter = { className: "font-sans" };


export const metadata: Metadata = {
  title: "TaskFlow",
  description: "Task management made easy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // createDummyTasks()
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

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PlanGuard",
  description: "Control de proyectos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className="bg-gray-100 min-h-screen">{children}</body>
    </html>
  );
} 
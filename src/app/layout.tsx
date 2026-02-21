import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Miki Command Center",
  description: "Dashboard de control para Miki - Tu langosta analista-programadora",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

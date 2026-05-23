import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Alouma",
    template: "%s | Alouma",
  },
  description:
    "Alouma helps you build a clear CV with guided structure and clean PDF export.",
  openGraph: {
    title: "Alouma",
    description:
      "Guided CV building with recruiter-grade structure and clean PDF export.",
    siteName: "Alouma",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

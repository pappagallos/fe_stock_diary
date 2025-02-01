import type { Metadata } from "next";
import { IBM_Plex_Sans_KR } from "next/font/google";

import "./globals.scss";

const ibmPlexSansKr = IBM_Plex_Sans_KR({
  variable: "--font-ibm-plex-sans-kr",
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "블루밍그레이스 투자 일지",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className={`${ibmPlexSansKr.variable}`}>{children}</body>
    </html>
  );
}

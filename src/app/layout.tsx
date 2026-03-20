import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '../context/LanguageContext';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Cosmic Aura & Vibe Check',
  description: 'Global MBTI & Aura Color Personality Test',
  openGraph: {
    title: 'What is your Cosmic Aura? (Top 1% Rarity)',
    description: 'Take the ultimate global vibe check and find your match.',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-YOUR_MEASUREMENT_ID`} // 구글 애널리틱스 측정 ID로 교체하세요!
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-YOUR_MEASUREMENT_ID');
            `,
          }}
        />
      </head>
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

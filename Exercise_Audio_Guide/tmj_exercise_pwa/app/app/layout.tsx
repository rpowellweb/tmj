
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TMJ Exercise Guide',
  description: 'Interactive TMJ exercise guide with audio cues and timers for jaw pain relief',
  keywords: ['TMJ', 'jaw exercises', 'jaw pain', 'temporomandibular joint', 'physical therapy'],
  authors: [{ name: 'TMJ Exercise Guide' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TMJ Exercises'
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#3B82F6'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="https://cdn.abacus.ai/images/dbb2f102-ea4b-460d-bc3a-368a4e268bf4.png" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TMJ Exercises" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body className={cn(inter.className, "min-h-screen bg-gray-50 antialiased")}>
        <div className="min-h-screen flex flex-col">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-md mx-auto px-4 py-3">
              <h1 className="text-lg font-semibold text-gray-800">TMJ Exercise Guide</h1>
            </div>
          </header>
          <main className="flex-1 p-4">
            {children}
          </main>
          <footer className="bg-white border-t">
            <div className="max-w-md mx-auto px-4 py-3 text-center">
              <p className="text-xs text-gray-500">
                Professional TMJ exercise program - Perform 6 times daily
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

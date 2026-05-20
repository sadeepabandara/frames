import type { Metadata, Viewport } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { QueryProvider } from '@/providers/QueryProvider';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'FRAMES — Premium Streaming', template: '%s | FRAMES' },
  description: 'Discover and explore thousands of movies and TV series. FRAMES — Cinema lives here.',
  keywords: ['streaming', 'movies', 'tv shows', 'cinema', 'watch online'],
  authors: [{ name: 'FRAMES' }],
  openGraph: {
    title: 'FRAMES — Premium Streaming',
    description: 'Cinema lives here.',
    url: 'https://watchframes.vercel.app',
    siteName: 'FRAMES',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'FRAMES' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      afterSignOutUrl="/home"
      appearance={{
        variables: {
          colorPrimary:          '#3b82f6',
          colorBackground:       '#141414',
          colorInputBackground:  'rgba(255,255,255,0.06)',
          colorInputText:        '#ffffff',
          colorText:             '#ffffff',
          colorTextSecondary:    'rgba(255,255,255,0.45)',
          colorTextOnPrimaryBackground: '#000000',
          colorNeutral:          '#ffffff',
          colorDanger:           '#ef4444',
          borderRadius:          '0.75rem',
          fontFamily:            'Outfit, sans-serif',
          fontSize:              '0.88rem',
          spacingUnit:           '1rem',
        },
        elements: {
          modalBackdrop:            'backdrop-blur-sm bg-black/70',
          modalContent:             'bg-[#141414] border border-white/[0.08] shadow-2xl',
          card:                     'bg-[#141414] border border-white/[0.08] shadow-2xl rounded-2xl',
          cardBox:                  'shadow-none',
          headerTitle:              'text-white font-extrabold text-[1.25rem] tracking-tight',
          headerSubtitle:           'text-white/40 text-[0.8rem]',
          logoBox:                  'hidden',
          tabButton:                'text-white/50 hover:text-white',
          tabButtonActive:          'text-[#3b82f6] border-b-2 border-[#3b82f6]',
          formFieldLabel:           'text-white/60 text-[0.78rem] font-medium',
          formFieldInput:           'bg-white/[0.06] border border-white/[0.1] text-white placeholder:text-white/25 rounded-lg focus:border-[#3b82f6]/60 focus:bg-white/[0.09] transition-all',
          formFieldInputShowPasswordButton: 'text-white/40 hover:text-white/70',
          formFieldErrorText:       'text-red-400 text-[0.75rem]',
          formFieldWarningText:     'text-yellow-400 text-[0.75rem]',
          formButtonPrimary:        'bg-[#3b82f6] hover:bg-[#2563eb] text-black font-bold rounded-lg transition-all',
          formButtonReset:          'text-[#3b82f6] hover:text-[#93c5fd] text-[0.8rem]',
          socialButtonsBlockButton:       'border border-white/[0.1] bg-white/[0.04] text-white hover:bg-white/[0.08] rounded-lg transition-all',
          socialButtonsBlockButtonText:   'text-white/80 font-medium',
          socialButtonsBlockButtonArrow:  'text-white/30',
          dividerLine:              'bg-white/[0.08]',
          dividerText:              'text-white/30 text-[0.75rem]',
          footerActionLink:         'text-[#3b82f6] hover:text-[#93c5fd] font-semibold',
          footerActionText:         'text-white/40',
          footer:                   'bg-transparent border-t border-white/[0.06]',
          identityPreviewText:      'text-white/70',
          identityPreviewEditButton:'text-[#3b82f6] hover:text-[#93c5fd]',
          otpCodeFieldInput:        'bg-white/[0.06] border border-white/[0.1] text-white rounded-lg',
          navbar:                   'bg-[#111] border-r border-white/[0.06]',
          navbarButton:             'text-white/60 hover:text-white hover:bg-white/[0.06]',
          navbarButtonActive:       'text-[#3b82f6] bg-[rgba(59,130,246,0.08)]',
          pageScrollBox:            'bg-[#141414]',
          badge:                    'bg-[rgba(59,130,246,0.1)] text-[#3b82f6] border border-[rgba(59,130,246,0.2)]',
          avatarBox:                'border-2 border-white/20',
          userButtonPopoverCard:    'bg-[#1a1a1a] border border-white/[0.08] shadow-2xl',
          userButtonPopoverActionButton: 'text-white/70 hover:text-white hover:bg-white/[0.06]',
          userButtonPopoverActionButtonText: 'text-white/70',
          userButtonPopoverFooter:  'border-t border-white/[0.06]',
        },
      }}
    >
      <html lang="en" data-scroll-behavior="smooth">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        </head>
        <body className="bg-background text-foreground antialiased">
          <QueryProvider>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#1a1a1a',
                  color: '#f5f5f5',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                },
              }}
            />
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

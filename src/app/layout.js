// Import necessary modules from Next.js
"use client"
import Head from 'next/head';
import { ThemeProvider } from '@emotion/react';

// Import your custom theme
import themeDefault from '../themes/theme';

// Import the StoreProvider and CSS
import Providers from './StoreProvider';
import './index.css';

export default function RootLayout({ children }) {
  return (
    <>
      <html lang="en">
        <Head>

          <title>Anudesh</title>
          <meta name="description" content="An Initiative to source better data by AI4Bharat" />
          <meta name="robots" content="index, follow" /> {/* ✅ Allow indexing */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta http-equiv="Cache-Control" content="public, max-age=3600, must-revalidate"/>
        <meta name="robots" content="index, follow"/>
        <link rel="preconnect" href="https://backend.anudesh.ai4bharat.org" crossorigin="anonymous"/>

          <link rel="icon" href="/favicon.ico" />
          {/* ✅ Preconnect for faster Google Fonts loading */}
          <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
          {/* ✅ Preload both fonts in a single request */}
          <link
            rel="preload"
            as="style"
            href="https://fonts.googleapis.com/css2?family=Rowdies:wght@400;700&family=Roboto:wght@400;700&display=swap"
          />

          {/* ✅ Load fonts asynchronously to prevent render blocking */}
          <link
            href="https://fonts.googleapis.com/css2?family=Rowdies:wght@400;700&family=Roboto:wght@400;700&display=swap"
            rel="stylesheet"
            media="print"
            onLoad="this.onload=null;this.removeAttribute('media');"
          />


          <link rel="preload" href="https://i.imgur.com/56Ut9oz.png" />

        </Head>

        <body>
          <Providers>
            <ThemeProvider theme={themeDefault}>
              {children}
            </ThemeProvider>
          </Providers>
        </body>
      </html>
    </>
  );
}

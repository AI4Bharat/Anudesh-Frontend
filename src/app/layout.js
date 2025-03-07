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
          <link rel="icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

          <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
          as="style"
        />
          <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Rowdies:wght@400;700&display=swap"
          as="style"
        />
         <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Rowdies:wght@400;700&display=swap"
          rel="stylesheet"
        />

          <link rel="preload" href="https://i.postimg.cc/nz91fDCL/undefined-Imgur.webp" />

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
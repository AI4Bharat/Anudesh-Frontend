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
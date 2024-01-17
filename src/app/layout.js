'use client';
import themeDefault from "../themes/theme"
import { ThemeProvider } from "@emotion/react"
<<<<<<< HEAD
import StoreProvider from "./StoreProvider"
=======
import Providers from "./StoreProvider";
>>>>>>> efficiency
import "./index.css";
// export const metadata = {
//   title: 'Anudesh',
//   description: 'anudesh-frontend',
// }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
        <ThemeProvider theme={themeDefault}>
          <StoreProvider>{children}</StoreProvider>
        </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
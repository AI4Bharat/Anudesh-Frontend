'use client';
import themeDefault from "../themes/theme"
import { ThemeProvider } from "@emotion/react"
import StoreProvider from "./StoreProvider"
import "./index.css";
// export const metadata = {
//   title: 'Anudesh',
//   description: 'anudesh-frontend',
// }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={themeDefault}>
          <StoreProvider>{children}</StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

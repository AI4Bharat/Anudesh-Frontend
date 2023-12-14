'use client';
import themeDefault from "@/themes/theme"
import { ThemeProvider } from "@emotion/react"
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
        {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

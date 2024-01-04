'use client';
import themeDefault from "../themes/theme"
import { ThemeProvider } from "@emotion/react"
import {Provider} from 'react-redux';
import store from "./redux/store/store";
import "./index.css";
// export const metadata = {
//   title: 'Anudesh',
//   description: 'anudesh-frontend',
// }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
        <ThemeProvider theme={themeDefault}>
        {children}
        </ThemeProvider>
        </Provider>
      </body>
    </html>
  )
}

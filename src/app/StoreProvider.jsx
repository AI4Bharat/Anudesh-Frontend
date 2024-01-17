'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { store} from "../Lib/Store"
export default function Providers({ children }) {
    return <Provider store={store}>{children}</Provider>
}


  
import React from 'react'
import ReactDOM from 'react-dom/client'
import { WelcomeView } from './components/welcomeView'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WelcomeView />
  </React.StrictMode>,
)

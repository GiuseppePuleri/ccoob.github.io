import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { startDirector } from './simulation/director'
import { initClientPreferences } from './store/useAppStore'
import './styles/global.css'

initClientPreferences()
startDirector()

const root = document.getElementById('root')
if (!root) throw new Error('Root mancante')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

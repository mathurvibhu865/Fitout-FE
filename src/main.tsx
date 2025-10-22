import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AnnexureProvider } from './context/AnnexureContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AnnexureProvider>
    <App />
    </AnnexureProvider>
    
  </StrictMode>,
)

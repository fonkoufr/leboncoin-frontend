import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' 
import { BrowserRouter } from 'react-router-dom' // 👈 L'import magique

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* On enveloppe l'App dans le Router pour activer la navigation */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
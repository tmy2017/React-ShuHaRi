import { useState } from 'react'
import AirtableView from './components/AirtableView'
import LegacyView from './components/LegacyView'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [showLegacyView, setShowLegacyView] = useState(false);

  return (
    <main className="app-container">
      <header className="app-header">
        <div className="logo-group">
          <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1 className="app-title">Airtable-like Database</h1>
        <div className="view-toggle">
          <button
            className={`toggle-btn ${!showLegacyView ? 'active' : ''}`}
            onClick={() => setShowLegacyView(false)}
          >
            Table View
          </button>
          <button
            className={`toggle-btn ${showLegacyView ? 'active' : ''}`}
            onClick={() => setShowLegacyView(true)}
          >
            Legacy View
          </button>
        </div>
      </header>

      {showLegacyView ? (
        <LegacyView />
      ) : (
        <AirtableView />
      )}

      <footer>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </footer>
    </main>
  )
}

export default App

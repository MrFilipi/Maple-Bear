import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import './App.css'

// Contexto de idioma
import { LanguageProvider } from './contexts/LanguageContext'

// Páginas principais
import Home from './components/Home'
import Learn from './components/learn/Learn'
import Practice from './components/practice/Practice'
import Game from './components/game/Game'
import Teacher from './components/teacher/Teacher'

// Layout principal
import Layout from './components/Layout'

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="aprender" element={<Learn />} />
              <Route path="praticar" element={<Practice />} />
              <Route path="desafios" element={<Game />} />
              <Route path="professor" element={<Teacher />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  )
}

export default App

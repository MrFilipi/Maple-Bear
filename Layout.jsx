import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Globe, Volume2, VolumeX, Sun, Moon } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import useProgressStore from '../stores/progressStore'

const Layout = () => {
  const { currentLanguage, toggleLanguage, t } = useLanguage()
  const { settings, updateSettings } = useProgressStore()
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled)
  const [darkMode, setDarkMode] = useState(settings.darkMode)

  // Sincronizar com as configurações do store
  useEffect(() => {
    setSoundEnabled(settings.soundEnabled)
    setDarkMode(settings.darkMode)
  }, [settings])

  const toggleSound = () => {
    const newSoundEnabled = !soundEnabled
    setSoundEnabled(newSoundEnabled)
    updateSettings({ soundEnabled: newSoundEnabled })
  }

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    updateSettings({ darkMode: newDarkMode })
    
    // Aplicar classe dark no HTML
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Aplicar modo escuro inicial
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Header com controles globais */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">🥷</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">
              {t('home.title')}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Toggle de idioma */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center space-x-1"
              aria-label={currentLanguage === 'pt' ? 'Mudar para inglês' : 'Switch to Portuguese'}
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs font-medium">
                {t('nav.language')}
              </span>
            </Button>

            {/* Toggle de som */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSound}
              aria-label={soundEnabled ? t('nav.soundOn') : t('nav.soundOff')}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </Button>

            {/* Toggle de modo escuro */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleDarkMode}
              aria-label={darkMode ? t('nav.lightMode') : t('nav.darkMode')}
            >
              {darkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-600">
          <p>
            {t('messages.developedBy')} 🕐
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Layout

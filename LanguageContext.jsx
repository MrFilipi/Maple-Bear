import { createContext, useContext, useState, useEffect } from 'react'
import { useTranslation } from '../i18n/translations'

/**
 * Contexto para gerenciar o idioma da aplicação
 */
const LanguageContext = createContext()

/**
 * Provider do contexto de idioma
 */
export const LanguageProvider = ({ children }) => {
  // Estado do idioma atual
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Tentar carregar idioma do localStorage
    const savedLanguage = localStorage.getItem('clock-ninja-language')
    if (savedLanguage && ['pt', 'en'].includes(savedLanguage)) {
      return savedLanguage
    }
    
    // Detectar idioma do navegador
    const browserLanguage = navigator.language || navigator.userLanguage
    if (browserLanguage.startsWith('pt')) {
      return 'pt'
    } else if (browserLanguage.startsWith('en')) {
      return 'en'
    }
    
    // Fallback para português
    return 'pt'
  })

  // Hook de tradução
  const { t } = useTranslation(currentLanguage)

  // Função para alterar idioma
  const changeLanguage = (newLanguage) => {
    if (['pt', 'en'].includes(newLanguage)) {
      setCurrentLanguage(newLanguage)
      localStorage.setItem('clock-ninja-language', newLanguage)
      
      // Atualizar atributo lang do HTML
      document.documentElement.lang = newLanguage === 'pt' ? 'pt-BR' : 'en-US'
    }
  }

  // Alternar entre idiomas
  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'pt' ? 'en' : 'pt'
    changeLanguage(newLanguage)
  }

  // Efeito para definir idioma inicial no HTML
  useEffect(() => {
    document.documentElement.lang = currentLanguage === 'pt' ? 'pt-BR' : 'en-US'
  }, [currentLanguage])

  // Valor do contexto
  const contextValue = {
    currentLanguage,
    changeLanguage,
    toggleLanguage,
    t,
    isPortuguese: currentLanguage === 'pt',
    isEnglish: currentLanguage === 'en'
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}

/**
 * Hook para usar o contexto de idioma
 */
export const useLanguage = () => {
  const context = useContext(LanguageContext)
  
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  
  return context
}

/**
 * Hook simplificado para apenas obter traduções
 */
export const useT = () => {
  const { t } = useLanguage()
  return t
}

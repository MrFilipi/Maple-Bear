/**
 * Sistema de internacionalização (i18n) para Clock Ninja
 * Suporte para Português (BR) e Inglês (EN)
 */

export const translations = {
  pt: {
    // Navegação e Layout
    nav: {
      home: 'Início',
      learn: 'Aprender',
      practice: 'Praticar',
      challenges: 'Desafios',
      teacher: 'Professor',
      language: 'PT',
      soundOn: 'Desativar som',
      soundOff: 'Ativar som',
      darkMode: 'Modo escuro',
      lightMode: 'Modo claro'
    },

    // Página Inicial
    home: {
      title: 'Relógio Ninja',
      subtitle: 'Desenvolvido para aprender as horas de forma divertida!',
      welcomeMessage: 'Bem-vindo ao Clock Ninja! Escolha um modo para começar sua jornada de aprendizado.',
      learnCard: {
        title: 'Modo Aprender',
        description: 'Explore e descubra como ler horas no relógio analógico com exemplos interativos'
      },
      practiceCard: {
        title: 'Modo Praticar',
        description: 'Pratique suas habilidades com exercícios variados e feedback imediato'
      },
      challengesCard: {
        title: 'Desafios',
        description: 'Teste seus conhecimentos em missões cronometradas e desbloqueie conquistas'
      },
      teacherCard: {
        title: 'Painel do Professor',
        description: 'Acesse relatórios de progresso, configurações e ferramentas pedagógicas'
      }
    },

    // Modo Aprender
    learn: {
      title: 'Modo Aprender',
      subtitle: 'Explore como ler horas no relógio analógico',
      clockTitle: 'Relógio Interativo',
      timeRepresentations: 'Representações do Tempo',
      digital: 'DIGITAL',
      english: 'INGLÊS',
      portuguese: 'PORTUGUÊS',
      examples: 'Exemplos Predefinidos',
      showHint: 'Mostrar Dica',
      hideHint: 'Ocultar Dica',
      hints: {
        past: 'Quando os minutos são de 1 a 30, usamos "past" (depois da hora)',
        half: 'Aos 30 minutos, usamos "half past" (meia hora depois)',
        to: 'Quando os minutos são de 31 a 59, usamos "to" (para a próxima hora)',
        oclock: 'Quando são 0 minutos, usamos "o\'clock" (hora exata)'
      }
    },

    // Modo Praticar
    practice: {
      title: 'Modo Praticar',
      sessionConfig: 'Configurar Sessão de Prática',
      exerciseCount: 'Número de Exercícios',
      difficulty: 'Dificuldade',
      difficultyLevels: {
        easy: 'Fácil (múltiplos de 5)',
        medium: 'Médio (todos os minutos)',
        hard: 'Difícil (com quarter/half/to)'
      },
      startPractice: 'Iniciar Prática',
      sessionComplete: 'Sessão Completa!',
      correct: 'Acertos',
      accuracy: 'Precisão',
      stars: 'Estrelas',
      newSession: 'Nova Sessão',
      backToMenu: 'Voltar ao Menu',
      gameOver: 'Game Over!',
      noLives: 'Você ficou sem vidas. Que tal tentar novamente?',
      
      // Tipos de exercício
      exercises: {
        dragToClock: 'Arraste os ponteiros para mostrar:',
        dragInstructions: 'Arraste os ponteiros do relógio para a posição correta',
        writeVerbal: 'Como se diz este horário em inglês?',
        writeInstructions: 'Digite a forma verbal em inglês (ex: "three fifteen" ou "quarter past three")',
        multipleChoice: 'Qual é a forma verbal correta para este horário?',
        chooseCorrect: 'Escolha a opção correta',
        checkAnswer: 'Verificar Resposta',
        nextExercise: 'Próximo'
      },

      // Feedback
      feedback: {
        correct: {
          titles: ['Muito bem!', 'Excelente!', 'Perfeito!', 'Parabéns!', 'Ótimo trabalho!'],
          message: 'Você acertou! Continue assim!'
        },
        incorrect: {
          title: 'Não foi dessa vez...',
          message: 'Não se preocupe, vamos tentar novamente!',
          yourAnswer: 'Sua resposta:',
          correctAnswer: 'Resposta correta:',
          explanation: 'Explicação:',
          tryAgain: 'Tentar Novamente',
          continue: 'Continuar'
        },
        hints: {
          title: 'Dica:',
          rules: 'Lembre-se das regras:\n• 1-29 min: use "past" (ex: "ten past three")\n• 30 min: use "half past" (ex: "half past three")\n• 31-59 min: use "to" (ex: "twenty to four")'
        }
      }
    },

    // Desafios
    challenges: {
      title: 'Desafios',
      achievements: 'conquistas',
      yourAchievements: 'Suas Conquistas',
      completeToUnlock: 'Complete desafios para desbloquear conquistas! 🏆',
      
      // Desafios específicos
      speedRun: {
        title: 'Corrida Contra o Tempo',
        description: 'Acerte 8 exercícios em 60 segundos'
      },
      precisionMaster: {
        title: 'Mestre da Precisão',
        description: 'Acerte 5 exercícios difíceis consecutivos'
      },
      bossLevel: {
        title: 'Boss Level',
        description: 'Série de 10 exercícios variados - o desafio final!'
      },
      
      // Interface do desafio
      time: 'Tempo:',
      target: 'Meta:',
      reward: 'Recompensa:',
      points: 'pontos',
      startChallenge: 'Iniciar Desafio',
      progress: 'Progresso:',
      of: 'de',
      hits: 'acertos',
      
      // Resultados
      challengeComplete: 'Desafio Concluído!',
      timeUp: 'Tempo Esgotado!',
      timeUsed: 'Tempo Usado',
      precision: 'Precisão',
      congratulations: 'Parabéns! Você ganhou {points} pontos!',
      backToChallenges: 'Voltar aos Desafios',
      mainMenu: 'Menu Principal'
    },

    // Painel do Professor
    teacher: {
      title: 'Painel do Professor',
      educatorMode: 'Modo Educador',
      
      // Abas
      tabs: {
        progress: 'Progresso',
        accessibility: 'Acessibilidade',
        settings: 'Configurações',
        data: 'Dados'
      },
      
      // Progresso
      progress: {
        accuracyRate: 'Taxa de Acerto',
        currentLevel: 'Nível Atual',
        maxStreak: 'Maior Sequência',
        achievements: 'Conquistas',
        totalPoints: 'pontos totais',
        current: 'Atual:',
        starsCollected: 'estrelas coletadas',
        exercises: 'exercícios',
        performanceByType: 'Desempenho por Tipo de Exercício',
        performanceByTimeRange: 'Desempenho por Faixa de Tempo',
        dragPointers: 'Arrastar Ponteiros',
        writeVerbal: 'Escrever Verbal',
        multipleChoice: 'Múltipla Escolha'
      },
      
      // Acessibilidade
      accessibility: {
        title: 'Configurações de Acessibilidade',
        visual: 'Visual',
        audio: 'Áudio',
        interaction: 'Interação',
        darkMode: {
          title: 'Modo Escuro',
          description: 'Reduz o brilho da tela'
        },
        highContrast: {
          title: 'Alto Contraste',
          description: 'Melhora a visibilidade dos elementos'
        },
        largeText: {
          title: 'Texto Grande',
          description: 'Aumenta o tamanho dos textos'
        },
        soundEnabled: {
          title: 'Sons Habilitados',
          description: 'Efeitos sonoros e feedback auditivo'
        },
        narration: {
          title: 'Narração',
          description: 'Leitura automática das instruções'
        },
        simplifiedMode: {
          title: 'Modo Simplificado',
          description: 'Interface com menos elementos visuais'
        },
        largeTouchTargets: {
          title: 'Cliques Grandes',
          description: 'Aumenta a área de clique dos botões'
        },
        apply: 'Aplicar Configurações de Acessibilidade'
      },
      
      // Configurações
      settings: {
        title: 'Configurações Pedagógicas',
        interfaceLanguage: 'Idioma da Interface',
        defaultDifficulty: 'Nível de Dificuldade Padrão',
        enabledFeatures: 'Recursos Habilitados',
        quarterHalf: {
          title: 'Quarter e Half',
          description: 'Permitir exercícios com "quarter" e "half"'
        },
        toFormat: {
          title: 'Formato "To"',
          description: 'Permitir exercícios com "to" (31-59 min)'
        },
        saveSettings: 'Salvar Configurações'
      },
      
      // Dados
      data: {
        title: 'Gerenciamento de Dados',
        export: {
          title: 'Exportar Dados',
          description: 'Baixe um arquivo com todo o progresso e configurações do aluno',
          button: 'Exportar Progresso'
        },
        import: {
          title: 'Importar Dados',
          description: 'Carregue um arquivo de progresso previamente exportado',
          button: 'Importar Progresso'
        },
        dangerZone: 'Zona de Perigo',
        resetWarning: 'Esta ação irá apagar permanentemente todo o progresso do aluno. Use com cuidado.',
        resetButton: 'Resetar Todo o Progresso',
        resetConfirm: 'Confirmar Reset - Clique Novamente',
        resetTimer: 'Clique novamente nos próximos 5 segundos para confirmar'
      }
    },

    // Botões e ações comuns
    common: {
      back: 'Voltar',
      next: 'Próximo',
      previous: 'Anterior',
      start: 'Iniciar',
      stop: 'Parar',
      pause: 'Pausar',
      resume: 'Continuar',
      save: 'Salvar',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      close: 'Fechar',
      loading: 'Carregando...',
      error: 'Erro',
      success: 'Sucesso',
      warning: 'Aviso'
    },

    // Mensagens do sistema
    messages: {
      settingsSaved: 'Configurações salvas com sucesso!',
      progressReset: 'Progresso resetado com sucesso!',
      dataImported: 'Dados importados com sucesso!',
      importError: 'Erro ao importar dados. Verifique se o arquivo está correto.',
      developedBy: 'Desenvolvido para aprender as horas de forma divertida!'
    }
  },

  en: {
    // Navigation and Layout
    nav: {
      home: 'Home',
      learn: 'Learn',
      practice: 'Practice',
      challenges: 'Challenges',
      teacher: 'Teacher',
      language: 'EN',
      soundOn: 'Turn sound off',
      soundOff: 'Turn sound on',
      darkMode: 'Dark mode',
      lightMode: 'Light mode'
    },

    // Home Page
    home: {
      title: 'Clock Ninja',
      subtitle: 'Developed to learn time in a fun way!',
      welcomeMessage: 'Welcome to Clock Ninja! Choose a mode to start your learning journey.',
      learnCard: {
        title: 'Learn Mode',
        description: 'Explore and discover how to read time on analog clocks with interactive examples'
      },
      practiceCard: {
        title: 'Practice Mode',
        description: 'Practice your skills with varied exercises and immediate feedback'
      },
      challengesCard: {
        title: 'Challenges',
        description: 'Test your knowledge in timed missions and unlock achievements'
      },
      teacherCard: {
        title: 'Teacher Panel',
        description: 'Access progress reports, settings and pedagogical tools'
      }
    },

    // Learn Mode
    learn: {
      title: 'Learn Mode',
      subtitle: 'Explore how to read time on analog clocks',
      clockTitle: 'Interactive Clock',
      timeRepresentations: 'Time Representations',
      digital: 'DIGITAL',
      english: 'ENGLISH',
      portuguese: 'PORTUGUESE',
      examples: 'Preset Examples',
      showHint: 'Show Hint',
      hideHint: 'Hide Hint',
      hints: {
        past: 'When minutes are from 1 to 30, we use "past" (after the hour)',
        half: 'At 30 minutes, we use "half past" (half hour after)',
        to: 'When minutes are from 31 to 59, we use "to" (to the next hour)',
        oclock: 'When it\'s 0 minutes, we use "o\'clock" (exact hour)'
      }
    },

    // Practice Mode
    practice: {
      title: 'Practice Mode',
      sessionConfig: 'Configure Practice Session',
      exerciseCount: 'Number of Exercises',
      difficulty: 'Difficulty',
      difficultyLevels: {
        easy: 'Easy (multiples of 5)',
        medium: 'Medium (all minutes)',
        hard: 'Hard (with quarter/half/to)'
      },
      startPractice: 'Start Practice',
      sessionComplete: 'Session Complete!',
      correct: 'Correct',
      accuracy: 'Accuracy',
      stars: 'Stars',
      newSession: 'New Session',
      backToMenu: 'Back to Menu',
      gameOver: 'Game Over!',
      noLives: 'You ran out of lives. How about trying again?',
      
      // Exercise types
      exercises: {
        dragToClock: 'Drag the hands to show:',
        dragInstructions: 'Drag the clock hands to the correct position',
        writeVerbal: 'How do you say this time in English?',
        writeInstructions: 'Type the verbal form in English (e.g., "three fifteen" or "quarter past three")',
        multipleChoice: 'What is the correct verbal form for this time?',
        chooseCorrect: 'Choose the correct option',
        checkAnswer: 'Check Answer',
        nextExercise: 'Next'
      },

      // Feedback
      feedback: {
        correct: {
          titles: ['Great!', 'Excellent!', 'Perfect!', 'Congratulations!', 'Nice work!'],
          message: 'You got it right! Keep it up!'
        },
        incorrect: {
          title: 'Not this time...',
          message: 'Don\'t worry, let\'s try again!',
          yourAnswer: 'Your answer:',
          correctAnswer: 'Correct answer:',
          explanation: 'Explanation:',
          tryAgain: 'Try Again',
          continue: 'Continue'
        },
        hints: {
          title: 'Hint:',
          rules: 'Remember the rules:\n• 1-29 min: use "past" (e.g., "ten past three")\n• 30 min: use "half past" (e.g., "half past three")\n• 31-59 min: use "to" (e.g., "twenty to four")'
        }
      }
    },

    // Challenges
    challenges: {
      title: 'Challenges',
      achievements: 'achievements',
      yourAchievements: 'Your Achievements',
      completeToUnlock: 'Complete challenges to unlock achievements! 🏆',
      
      // Specific challenges
      speedRun: {
        title: 'Speed Run',
        description: 'Get 8 exercises right in 60 seconds'
      },
      precisionMaster: {
        title: 'Precision Master',
        description: 'Get 5 hard exercises right in a row'
      },
      bossLevel: {
        title: 'Boss Level',
        description: 'Series of 10 varied exercises - the final challenge!'
      },
      
      // Challenge interface
      time: 'Time:',
      target: 'Target:',
      reward: 'Reward:',
      points: 'points',
      startChallenge: 'Start Challenge',
      progress: 'Progress:',
      of: 'of',
      hits: 'correct',
      
      // Results
      challengeComplete: 'Challenge Complete!',
      timeUp: 'Time\'s Up!',
      timeUsed: 'Time Used',
      precision: 'Precision',
      congratulations: 'Congratulations! You earned {points} points!',
      backToChallenges: 'Back to Challenges',
      mainMenu: 'Main Menu'
    },

    // Teacher Panel
    teacher: {
      title: 'Teacher Panel',
      educatorMode: 'Educator Mode',
      
      // Tabs
      tabs: {
        progress: 'Progress',
        accessibility: 'Accessibility',
        settings: 'Settings',
        data: 'Data'
      },
      
      // Progress
      progress: {
        accuracyRate: 'Accuracy Rate',
        currentLevel: 'Current Level',
        maxStreak: 'Max Streak',
        achievements: 'Achievements',
        totalPoints: 'total points',
        current: 'Current:',
        starsCollected: 'stars collected',
        exercises: 'exercises',
        performanceByType: 'Performance by Exercise Type',
        performanceByTimeRange: 'Performance by Time Range',
        dragPointers: 'Drag Pointers',
        writeVerbal: 'Write Verbal',
        multipleChoice: 'Multiple Choice'
      },
      
      // Accessibility
      accessibility: {
        title: 'Accessibility Settings',
        visual: 'Visual',
        audio: 'Audio',
        interaction: 'Interaction',
        darkMode: {
          title: 'Dark Mode',
          description: 'Reduces screen brightness'
        },
        highContrast: {
          title: 'High Contrast',
          description: 'Improves element visibility'
        },
        largeText: {
          title: 'Large Text',
          description: 'Increases text size'
        },
        soundEnabled: {
          title: 'Sounds Enabled',
          description: 'Sound effects and audio feedback'
        },
        narration: {
          title: 'Narration',
          description: 'Automatic reading of instructions'
        },
        simplifiedMode: {
          title: 'Simplified Mode',
          description: 'Interface with fewer visual elements'
        },
        largeTouchTargets: {
          title: 'Large Touch Targets',
          description: 'Increases button click area'
        },
        apply: 'Apply Accessibility Settings'
      },
      
      // Settings
      settings: {
        title: 'Pedagogical Settings',
        interfaceLanguage: 'Interface Language',
        defaultDifficulty: 'Default Difficulty Level',
        enabledFeatures: 'Enabled Features',
        quarterHalf: {
          title: 'Quarter and Half',
          description: 'Allow exercises with "quarter" and "half"'
        },
        toFormat: {
          title: '"To" Format',
          description: 'Allow exercises with "to" (31-59 min)'
        },
        saveSettings: 'Save Settings'
      },
      
      // Data
      data: {
        title: 'Data Management',
        export: {
          title: 'Export Data',
          description: 'Download a file with all student progress and settings',
          button: 'Export Progress'
        },
        import: {
          title: 'Import Data',
          description: 'Load a previously exported progress file',
          button: 'Import Progress'
        },
        dangerZone: 'Danger Zone',
        resetWarning: 'This action will permanently delete all student progress. Use with caution.',
        resetButton: 'Reset All Progress',
        resetConfirm: 'Confirm Reset - Click Again',
        resetTimer: 'Click again within the next 5 seconds to confirm'
      }
    },

    // Common buttons and actions
    common: {
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      start: 'Start',
      stop: 'Stop',
      pause: 'Pause',
      resume: 'Resume',
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      close: 'Close',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      warning: 'Warning'
    },

    // System messages
    messages: {
      settingsSaved: 'Settings saved successfully!',
      progressReset: 'Progress reset successfully!',
      dataImported: 'Data imported successfully!',
      importError: 'Error importing data. Please check if the file is correct.',
      developedBy: 'Developed to learn time in a fun way!'
    }
  }
}

/**
 * Hook personalizado para usar traduções
 * @param {string} language - Código do idioma ('pt' ou 'en')
 * @returns {function} - Função para obter traduções
 */
export const useTranslation = (language = 'pt') => {
  const t = (key, params = {}) => {
    const keys = key.split('.')
    let value = translations[language]
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k]
      } else {
        // Fallback para português se a chave não existir
        value = translations.pt
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object') {
            value = value[fallbackKey]
          } else {
            return key // Retorna a chave se não encontrar tradução
          }
        }
        break
      }
    }
    
    // Substituir parâmetros na string
    if (typeof value === 'string' && Object.keys(params).length > 0) {
      return value.replace(/\{(\w+)\}/g, (match, param) => {
        return params[param] !== undefined ? params[param] : match
      })
    }
    
    return value || key
  }
  
  return { t }
}

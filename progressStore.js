import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Store para gerenciar o progresso do usuário
 * Utiliza Zustand com persistência no localStorage
 */

const useProgressStore = create(
  persist(
    (set, get) => ({
      // Estado inicial
      user: {
        totalPoints: 0,
        stars: 0,
        level: 1,
        achievements: [],
        streakCount: 0, // Acertos consecutivos
        maxStreak: 0,
        totalItemsAttempted: 0,
        totalItemsCorrect: 0,
        sessionStats: {
          currentSession: {
            itemsAttempted: 0,
            itemsCorrect: 0,
            lives: 3,
            startTime: null,
            endTime: null
          }
        }
      },
      
      // Configurações do usuário
      settings: {
        language: 'pt',
        soundEnabled: true,
        darkMode: false,
        difficulty: 'medium', // 'easy', 'medium', 'hard'
        allowQuarterHalf: true,
        allowTo: true,
        practiceTypes: ['drag_to_digital', 'write_verbal', 'multiple_choice']
      },
      
      // Estatísticas detalhadas
      stats: {
        timeSpent: 0, // em segundos
        averageTimePerItem: 0,
        accuracyByType: {
          drag_to_digital: { attempted: 0, correct: 0 },
          write_verbal: { attempted: 0, correct: 0 },
          multiple_choice: { attempted: 0, correct: 0 }
        },
        accuracyByTimeRange: {
          past: { attempted: 0, correct: 0 },
          half: { attempted: 0, correct: 0 },
          to: { attempted: 0, correct: 0 },
          oclock: { attempted: 0, correct: 0 }
        },
        difficultTimes: [], // Horários que o usuário mais erra
        masteredTimes: [] // Horários que o usuário domina
      },

      // Actions
      
      /**
       * Inicia uma nova sessão de prática
       */
      startPracticeSession: () => set((state) => ({
        user: {
          ...state.user,
          sessionStats: {
            ...state.user.sessionStats,
            currentSession: {
              itemsAttempted: 0,
              itemsCorrect: 0,
              lives: 3,
              startTime: Date.now(),
              endTime: null
            }
          }
        }
      })),

      /**
       * Finaliza a sessão atual
       */
      endPracticeSession: () => set((state) => {
        const session = state.user.sessionStats.currentSession
        const timeSpent = session.startTime ? (Date.now() - session.startTime) / 1000 : 0
        
        return {
          user: {
            ...state.user,
            sessionStats: {
              ...state.user.sessionStats,
              currentSession: {
                ...session,
                endTime: Date.now()
              }
            }
          },
          stats: {
            ...state.stats,
            timeSpent: state.stats.timeSpent + timeSpent,
            averageTimePerItem: state.user.totalItemsAttempted > 0 
              ? (state.stats.timeSpent + timeSpent) / state.user.totalItemsAttempted 
              : 0
          }
        }
      }),

      /**
       * Registra uma tentativa de exercício
       */
      recordAttempt: (item, isCorrect, userAnswer) => set((state) => {
        const newState = { ...state }
        const session = newState.user.sessionStats.currentSession
        
        // Atualizar estatísticas da sessão
        session.itemsAttempted += 1
        if (isCorrect) {
          session.itemsCorrect += 1
        }
        
        // Atualizar estatísticas globais
        newState.user.totalItemsAttempted += 1
        if (isCorrect) {
          newState.user.totalItemsCorrect += 1
          newState.user.streakCount += 1
          newState.user.maxStreak = Math.max(newState.user.maxStreak, newState.user.streakCount)
        } else {
          newState.user.streakCount = 0
          // Perder uma vida
          session.lives = Math.max(0, session.lives - 1)
        }
        
        // Atualizar estatísticas por tipo de exercício
        if (newState.stats.accuracyByType[item.type]) {
          newState.stats.accuracyByType[item.type].attempted += 1
          if (isCorrect) {
            newState.stats.accuracyByType[item.type].correct += 1
          }
        }
        
        // Atualizar estatísticas por faixa de tempo
        const timeRange = getTimeRange(item.targetTime.minutes)
        if (newState.stats.accuracyByTimeRange[timeRange]) {
          newState.stats.accuracyByTimeRange[timeRange].attempted += 1
          if (isCorrect) {
            newState.stats.accuracyByTimeRange[timeRange].correct += 1
          }
        }
        
        // Calcular pontos
        let points = 0
        if (isCorrect) {
          points = 10 // Pontos base por acerto
          // Bonus por streak
          if (newState.user.streakCount >= 5) {
            points += 5
          }
        }
        
        newState.user.totalPoints += points
        
        // Calcular nível baseado em pontos
        const newLevel = Math.floor(newState.user.totalPoints / 100) + 1
        if (newLevel > newState.user.level) {
          newState.user.level = newLevel
          // Trigger achievement para novo nível
          get().unlockAchievement(`level_${newLevel}`)
        }
        
        // Calcular estrelas baseado em acertos consecutivos
        if (isCorrect && newState.user.streakCount % 5 === 0) {
          newState.user.stars += 1
        }
        
        return newState
      }),

      /**
       * Desbloqueia uma conquista
       */
      unlockAchievement: (achievementId) => set((state) => {
        if (!state.user.achievements.includes(achievementId)) {
          return {
            user: {
              ...state.user,
              achievements: [...state.user.achievements, achievementId]
            }
          }
        }
        return state
      }),

      /**
       * Atualiza configurações do usuário
       */
      updateSettings: (newSettings) => set((state) => ({
        settings: {
          ...state.settings,
          ...newSettings
        }
      })),

      /**
       * Reseta o progresso do usuário
       */
      resetProgress: () => set(() => ({
        user: {
          totalPoints: 0,
          stars: 0,
          level: 1,
          achievements: [],
          streakCount: 0,
          maxStreak: 0,
          totalItemsAttempted: 0,
          totalItemsCorrect: 0,
          sessionStats: {
            currentSession: {
              itemsAttempted: 0,
              itemsCorrect: 0,
              lives: 3,
              startTime: null,
              endTime: null
            }
          }
        },
        stats: {
          timeSpent: 0,
          averageTimePerItem: 0,
          accuracyByType: {
            drag_to_digital: { attempted: 0, correct: 0 },
            write_verbal: { attempted: 0, correct: 0 },
            multiple_choice: { attempted: 0, correct: 0 }
          },
          accuracyByTimeRange: {
            past: { attempted: 0, correct: 0 },
            half: { attempted: 0, correct: 0 },
            to: { attempted: 0, correct: 0 },
            oclock: { attempted: 0, correct: 0 }
          },
          difficultTimes: [],
          masteredTimes: []
        }
      })),

      /**
       * Exporta dados do progresso
       */
      exportProgress: () => {
        const state = get()
        return {
          exportDate: new Date().toISOString(),
          user: state.user,
          settings: state.settings,
          stats: state.stats
        }
      },

      /**
       * Importa dados do progresso
       */
      importProgress: (data) => set(() => ({
        user: data.user || get().user,
        settings: data.settings || get().settings,
        stats: data.stats || get().stats
      })),

      // Getters computados
      
      /**
       * Calcula a taxa de acerto geral
       */
      getAccuracyRate: () => {
        const state = get()
        if (state.user.totalItemsAttempted === 0) return 0
        return (state.user.totalItemsCorrect / state.user.totalItemsAttempted) * 100
      },

      /**
       * Calcula a taxa de acerto por tipo
       */
      getAccuracyByType: (type) => {
        const state = get()
        const typeStats = state.stats.accuracyByType[type]
        if (!typeStats || typeStats.attempted === 0) return 0
        return (typeStats.correct / typeStats.attempted) * 100
      },

      /**
       * Calcula a taxa de acerto por faixa de tempo
       */
      getAccuracyByTimeRange: (range) => {
        const state = get()
        const rangeStats = state.stats.accuracyByTimeRange[range]
        if (!rangeStats || rangeStats.attempted === 0) return 0
        return (rangeStats.correct / rangeStats.attempted) * 100
      },

      /**
       * Verifica se tem vidas restantes
       */
      hasLivesRemaining: () => {
        const state = get()
        return state.user.sessionStats.currentSession.lives > 0
      },

      /**
       * Obtém lista de conquistas disponíveis
       */
      getAvailableAchievements: () => {
        return [
          { id: 'first_correct', name: 'Primeiro Acerto', description: 'Acerte seu primeiro exercício' },
          { id: 'streak_5', name: 'Sequência de 5', description: 'Acerte 5 exercícios seguidos' },
          { id: 'streak_10', name: 'Sequência de 10', description: 'Acerte 10 exercícios seguidos' },
          { id: 'master_past', name: 'Mestre do Past', description: 'Domine exercícios com "past"' },
          { id: 'master_half', name: 'Guardião do Half', description: 'Domine exercícios com "half past"' },
          { id: 'master_to', name: 'Ninja do To', description: 'Domine exercícios com "to"' },
          { id: 'level_5', name: 'Nível 5', description: 'Alcance o nível 5' },
          { id: 'level_10', name: 'Nível 10', description: 'Alcance o nível 10' },
          { id: '100_stars', name: 'Colecionador', description: 'Colete 100 estrelas' }
        ]
      }
    }),
    {
      name: 'clock-ninja-progress', // Nome da chave no localStorage
      version: 1
    }
  )
)

// Função auxiliar para determinar faixa de tempo
const getTimeRange = (minutes) => {
  if (minutes === 30) return 'half'
  if (minutes >= 1 && minutes <= 29) return 'past'
  if (minutes >= 31 && minutes <= 59) return 'to'
  return 'oclock'
}

export default useProgressStore

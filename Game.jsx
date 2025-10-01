import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Trophy, Timer, Play, Pause, RotateCcw, Star, Target, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import InteractiveClock from '../clock/InteractiveClock'
import TimeText from '../clock/TimeText'
import { generatePracticeSession, QUESTION_TYPES, DIFFICULTY_LEVELS } from '../practice/ItemGenerator'
import { validateTime } from '../../utils/timeUtils'
import useProgressStore from '../../stores/progressStore'

const Game = () => {
  // Estados do desafio
  const [selectedChallenge, setSelectedChallenge] = useState(null)
  const [challengeActive, setChallengeActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [challengeItems, setChallengeItems] = useState([])
  const [currentItemIndex, setCurrentItemIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [clockAnswer, setClockAnswer] = useState({ hours: 3, minutes: 15 })
  const [selectedOption, setSelectedOption] = useState(null)
  const [score, setScore] = useState(0)
  const [challengeComplete, setChallengeComplete] = useState(false)
  const [challengeResults, setChallengeResults] = useState(null)

  // Store do progresso
  const { user, unlockAchievement, getAvailableAchievements } = useProgressStore()

  // Timer do desafio
  useEffect(() => {
    let interval = null
    if (challengeActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            endChallenge()
            return 0
          }
          return time - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [challengeActive, timeRemaining])

  // Definição dos desafios
  const challenges = [
    {
      id: 'speed_run',
      title: 'Corrida Contra o Tempo',
      description: 'Acerte 8 exercícios em 60 segundos',
      icon: Timer,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      timeLimit: 60,
      targetScore: 8,
      difficulty: DIFFICULTY_LEVELS.MEDIUM,
      reward: { points: 50, achievement: 'speed_master' }
    },
    {
      id: 'precision_master',
      title: 'Mestre da Precisão',
      description: 'Acerte 5 exercícios difíceis consecutivos',
      icon: Target,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
      timeLimit: 120,
      targetScore: 5,
      difficulty: DIFFICULTY_LEVELS.HARD,
      consecutive: true,
      reward: { points: 75, achievement: 'precision_master' }
    },
    {
      id: 'boss_level',
      title: 'Boss Level',
      description: 'Série de 10 exercícios variados - o desafio final!',
      icon: Zap,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50',
      timeLimit: 180,
      targetScore: 10,
      difficulty: DIFFICULTY_LEVELS.HARD,
      mixed: true,
      reward: { points: 100, achievement: 'boss_defeated' }
    }
  ]

  // Iniciar desafio
  const startChallenge = (challenge) => {
    const items = generatePracticeSession({
      itemCount: challenge.targetScore + 5, // Gerar alguns extras
      difficulty: challenge.difficulty,
      questionTypes: challenge.mixed 
        ? [QUESTION_TYPES.DRAG_TO_DIGITAL, QUESTION_TYPES.WRITE_VERBAL, QUESTION_TYPES.MULTIPLE_CHOICE]
        : [QUESTION_TYPES.DRAG_TO_DIGITAL]
    })

    setChallengeItems(items)
    setSelectedChallenge(challenge)
    setTimeRemaining(challenge.timeLimit)
    setChallengeActive(true)
    setCurrentItemIndex(0)
    setScore(0)
    setChallengeComplete(false)
    resetCurrentAnswer()
  }

  // Finalizar desafio
  const endChallenge = () => {
    setChallengeActive(false)
    setChallengeComplete(true)
    
    const success = score >= selectedChallenge.targetScore
    const results = {
      success,
      score,
      target: selectedChallenge.targetScore,
      timeUsed: selectedChallenge.timeLimit - timeRemaining,
      accuracy: challengeItems.length > 0 ? Math.round((score / Math.min(currentItemIndex + 1, challengeItems.length)) * 100) : 0
    }
    
    setChallengeResults(results)
    
    // Desbloquear conquista se bem-sucedido
    if (success && selectedChallenge.reward.achievement) {
      unlockAchievement(selectedChallenge.reward.achievement)
    }
  }

  // Resetar resposta atual
  const resetCurrentAnswer = () => {
    setUserAnswer('')
    setClockAnswer({ hours: 3, minutes: 15 })
    setSelectedOption(null)
  }

  // Verificar resposta
  const checkAnswer = () => {
    if (!challengeItems[currentItemIndex]) return

    const currentItem = challengeItems[currentItemIndex]
    let correct = false

    switch (currentItem.type) {
      case QUESTION_TYPES.DRAG_TO_DIGITAL:
        correct = validateTime(clockAnswer, currentItem.correctAnswer, 1)
        break
      case QUESTION_TYPES.WRITE_VERBAL:
        const userResponse = userAnswer.toLowerCase().trim()
        correct = currentItem.acceptableAnswers?.includes(userResponse) || 
                 userResponse === currentItem.correctAnswer.toLowerCase()
        break
      case QUESTION_TYPES.MULTIPLE_CHOICE:
        correct = selectedOption === currentItem.correctAnswer
        break
    }

    if (correct) {
      setScore(prev => prev + 1)
      
      // Verificar se atingiu o objetivo
      if (score + 1 >= selectedChallenge.targetScore) {
        endChallenge()
        return
      }
    } else if (selectedChallenge.consecutive) {
      // Se é um desafio consecutivo e errou, termina
      endChallenge()
      return
    }

    // Próximo item
    if (currentItemIndex < challengeItems.length - 1) {
      setCurrentItemIndex(prev => prev + 1)
      resetCurrentAnswer()
    } else {
      endChallenge()
    }
  }

  // Formatar tempo
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Renderizar exercício atual
  const renderCurrentExercise = () => {
    if (!challengeItems[currentItemIndex]) return null

    const currentItem = challengeItems[currentItemIndex]

    switch (currentItem.type) {
      case QUESTION_TYPES.DRAG_TO_DIGITAL:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">
              Arraste os ponteiros para: {currentItem.displayTime}
            </h3>
            <div className="flex justify-center">
              <InteractiveClock
                hours={clockAnswer.hours}
                minutes={clockAnswer.minutes}
                onChange={setClockAnswer}
                size={240}
                interactive={true}
                showMarks={true}
              />
            </div>
          </div>
        )

      case QUESTION_TYPES.WRITE_VERBAL:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">
              Como se diz este horário em inglês?
            </h3>
            <div className="flex justify-center">
              <InteractiveClock
                hours={currentItem.clockTime.hours}
                minutes={currentItem.clockTime.minutes}
                size={200}
                interactive={false}
                showMarks={true}
              />
            </div>
            <div className="max-w-sm mx-auto">
              <input
                type="text"
                placeholder="Digite em inglês..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-full p-3 text-center border border-gray-300 rounded-lg"
                onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
              />
            </div>
          </div>
        )

      case QUESTION_TYPES.MULTIPLE_CHOICE:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">
              Qual é a forma verbal correta?
            </h3>
            <div className="flex justify-center">
              <InteractiveClock
                hours={currentItem.clockTime.hours}
                minutes={currentItem.clockTime.minutes}
                size={200}
                interactive={false}
                showMarks={true}
              />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              {currentItem.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedOption === index ? "default" : "outline"}
                  className="w-full text-left justify-start"
                  onClick={() => setSelectedOption(index)}
                >
                  {String.fromCharCode(65 + index)}. "{option}"
                </Button>
              ))}
            </div>
          </div>
        )

      default:
        return <div>Exercício não suportado</div>
    }
  }

  // Tela de seleção de desafios
  if (!selectedChallenge) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Desafios</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold">{user.achievements.length} conquistas</span>
            </div>
          </div>
        </div>

        {/* Lista de Desafios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {challenges.map((challenge) => {
            const Icon = challenge.icon
            return (
              <Card key={challenge.id} className={`${challenge.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${challenge.color} rounded-lg flex items-center justify-center shadow-md`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm">{challenge.description}</p>
                  
                  <div className="space-y-2 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>Tempo:</span>
                      <span>{formatTime(challenge.timeLimit)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Meta:</span>
                      <span>{challenge.targetScore} acertos</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Recompensa:</span>
                      <span>{challenge.reward.points} pontos</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => startChallenge(challenge)}
                    className="w-full"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Iniciar Desafio
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Conquistas */}
        <Card className="bg-white/70 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <span>Suas Conquistas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user.achievements.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {user.achievements.map((achievementId) => (
                  <div key={achievementId} className="text-center p-3 bg-yellow-50 rounded-lg">
                    <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-yellow-800">{achievementId}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Complete desafios para desbloquear conquistas! 🏆
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Tela de resultados
  if (challengeComplete && challengeResults) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/70 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              {challengeResults.success ? '🎉 Desafio Concluído!' : '⏰ Tempo Esgotado!'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`${challengeResults.success ? 'bg-green-50' : 'bg-red-50'} rounded-lg p-4`}>
                <div className={`text-2xl font-bold ${challengeResults.success ? 'text-green-600' : 'text-red-600'}`}>
                  {challengeResults.score}/{challengeResults.target}
                </div>
                <div className={`text-sm ${challengeResults.success ? 'text-green-800' : 'text-red-800'}`}>
                  Acertos
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{formatTime(challengeResults.timeUsed)}</div>
                <div className="text-sm text-blue-800">Tempo Usado</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-600">{challengeResults.accuracy}%</div>
                <div className="text-sm text-yellow-800">Precisão</div>
              </div>
            </div>
            
            {challengeResults.success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">
                  🏆 Parabéns! Você ganhou {selectedChallenge.reward.points} pontos!
                </p>
              </div>
            )}
            
            <div className="space-x-4">
              <Button onClick={() => setSelectedChallenge(null)}>
                Voltar aos Desafios
              </Button>
              <Link to="/">
                <Button variant="outline">Menu Principal</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Tela do desafio ativo
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header do desafio */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setChallengeActive(false)
              setSelectedChallenge(null)
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Sair
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">{selectedChallenge.title}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2">
            <Timer className="w-5 h-5 text-blue-500" />
            <span className="font-semibold text-blue-600">{formatTime(timeRemaining)}</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold">{score}/{selectedChallenge.targetScore}</span>
          </div>
        </div>
      </div>

      {/* Progresso */}
      <div className="mb-6">
        <Progress 
          value={(score / selectedChallenge.targetScore) * 100} 
          className="h-3"
        />
        <p className="text-center text-sm text-gray-600 mt-2">
          Progresso: {score} de {selectedChallenge.targetScore} acertos
        </p>
      </div>

      {/* Exercício atual */}
      <Card className="bg-white/70 backdrop-blur-sm shadow-lg">
        <CardContent className="p-8">
          {renderCurrentExercise()}
          
          <div className="text-center mt-6">
            <Button 
              onClick={checkAnswer}
              size="lg"
              disabled={
                (challengeItems[currentItemIndex]?.type === QUESTION_TYPES.WRITE_VERBAL && !userAnswer.trim()) ||
                (challengeItems[currentItemIndex]?.type === QUESTION_TYPES.MULTIPLE_CHOICE && selectedOption === null)
              }
            >
              Verificar Resposta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Game

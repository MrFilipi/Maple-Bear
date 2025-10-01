import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Star, Heart, Settings, Play, Pause } from 'lucide-react'
import { Link } from 'react-router-dom'
import InteractiveClock from '../clock/InteractiveClock'
import TimeText from '../clock/TimeText'
import FeedbackCard from './FeedbackCard'
import { generatePracticeSession, QUESTION_TYPES, DIFFICULTY_LEVELS } from './ItemGenerator'
import { validateTime, convertToEnglishVerbal } from '../../utils/timeUtils'
import useProgressStore from '../../stores/progressStore'

const Practice = () => {
  // Estado da sessão de prática
  const [sessionItems, setSessionItems] = useState([])
  const [currentItemIndex, setCurrentItemIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [clockAnswer, setClockAnswer] = useState({ hours: 3, minutes: 15 })
  const [selectedOption, setSelectedOption] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [sessionStarted, setSessionStarted] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)

  // Store do progresso
  const {
    user,
    settings,
    startPracticeSession,
    endPracticeSession,
    recordAttempt,
    hasLivesRemaining,
    getAccuracyRate
  } = useProgressStore()

  // Item atual
  const currentItem = sessionItems[currentItemIndex]
  const currentSession = user.sessionStats.currentSession

  // Configurações da sessão
  const [sessionConfig, setSessionConfig] = useState({
    itemCount: 20,
    difficulty: settings.difficulty,
    questionTypes: settings.practiceTypes,
    allowQuarterHalf: settings.allowQuarterHalf,
    allowTo: settings.allowTo
  })

  // Iniciar nova sessão
  const startNewSession = () => {
    const items = generatePracticeSession(sessionConfig)
    setSessionItems(items)
    setCurrentItemIndex(0)
    setSessionStarted(true)
    setSessionComplete(false)
    setShowFeedback(false)
    startPracticeSession()
    resetCurrentAnswer()
  }

  // Resetar resposta atual
  const resetCurrentAnswer = () => {
    setUserAnswer('')
    setClockAnswer({ hours: 3, minutes: 15 })
    setSelectedOption(null)
    setShowFeedback(false)
  }

  // Verificar resposta
  const checkAnswer = () => {
    if (!currentItem) return

    let correct = false
    let userResponse = null

    switch (currentItem.type) {
      case QUESTION_TYPES.DRAG_TO_DIGITAL:
        userResponse = clockAnswer
        correct = validateTime(clockAnswer, currentItem.correctAnswer, currentItem.tolerance || 1)
        break

      case QUESTION_TYPES.WRITE_VERBAL:
        userResponse = userAnswer.toLowerCase().trim()
        correct = currentItem.acceptableAnswers?.includes(userResponse) || 
                 userResponse === currentItem.correctAnswer.toLowerCase()
        break

      case QUESTION_TYPES.MULTIPLE_CHOICE:
        userResponse = selectedOption
        correct = selectedOption === currentItem.correctAnswer
        break
    }

    setIsCorrect(correct)
    setShowFeedback(true)
    
    // Registrar tentativa no store
    recordAttempt(currentItem, correct, userResponse)
  }

  // Próximo item
  const nextItem = () => {
    if (currentItemIndex < sessionItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1)
      resetCurrentAnswer()
    } else {
      // Sessão completa
      setSessionComplete(true)
      endPracticeSession()
    }
  }

  // Tentar novamente
  const tryAgain = () => {
    resetCurrentAnswer()
  }

  // Verificar se pode continuar (tem vidas)
  const canContinue = hasLivesRemaining() || isCorrect

  // Renderizar exercício baseado no tipo
  const renderExercise = () => {
    if (!currentItem) return null

    switch (currentItem.type) {
      case QUESTION_TYPES.DRAG_TO_DIGITAL:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {currentItem.question}
              </h3>
              <p className="text-gray-600">{currentItem.instructions}</p>
            </div>
            
            <div className="flex justify-center">
              <InteractiveClock
                hours={clockAnswer.hours}
                minutes={clockAnswer.minutes}
                onChange={setClockAnswer}
                size={280}
                interactive={!showFeedback}
                showMarks={true}
                easyMode={sessionConfig.difficulty === DIFFICULTY_LEVELS.EASY}
              />
            </div>
            
            <div className="text-center">
              <TimeText
                hours={clockAnswer.hours}
                minutes={clockAnswer.minutes}
                showDigital={true}
                showEnglish={false}
                showPortuguese={false}
                size="large"
              />
            </div>
          </div>
        )

      case QUESTION_TYPES.WRITE_VERBAL:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {currentItem.question}
              </h3>
              <p className="text-gray-600 mb-4">{currentItem.instructions}</p>
            </div>
            
            <div className="flex justify-center">
              <InteractiveClock
                hours={currentItem.clockTime.hours}
                minutes={currentItem.clockTime.minutes}
                size={240}
                interactive={false}
                showMarks={true}
              />
            </div>
            
            <div className="text-center">
              <TimeText
                hours={currentItem.clockTime.hours}
                minutes={currentItem.clockTime.minutes}
                showDigital={true}
                showEnglish={false}
                showPortuguese={false}
                size="medium"
              />
            </div>
            
            <div className="max-w-md mx-auto">
              <Input
                type="text"
                placeholder="Digite a forma verbal em inglês..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={showFeedback}
                className="text-center text-lg"
                onKeyPress={(e) => e.key === 'Enter' && !showFeedback && checkAnswer()}
              />
            </div>
          </div>
        )

      case QUESTION_TYPES.MULTIPLE_CHOICE:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {currentItem.question}
              </h3>
              <p className="text-gray-600 mb-4">{currentItem.instructions}</p>
            </div>
            
            <div className="flex justify-center">
              <InteractiveClock
                hours={currentItem.clockTime.hours}
                minutes={currentItem.clockTime.minutes}
                size={240}
                interactive={false}
                showMarks={true}
              />
            </div>
            
            <div className="max-w-lg mx-auto space-y-3">
              {currentItem.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedOption === index ? "default" : "outline"}
                  className="w-full text-left justify-start p-4 h-auto"
                  onClick={() => !showFeedback && setSelectedOption(index)}
                  disabled={showFeedback}
                >
                  <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                  <span>"{option}"</span>
                </Button>
              ))}
            </div>
          </div>
        )

      default:
        return <div>Tipo de exercício não suportado</div>
    }
  }

  // Tela de configuração da sessão
  if (!sessionStarted) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Modo Praticar</h1>
          </div>
        </div>

        <Card className="bg-white/70 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-6 h-6" />
              <span>Configurar Sessão de Prática</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Exercícios
                </label>
                <Input
                  type="number"
                  min="5"
                  max="50"
                  value={sessionConfig.itemCount}
                  onChange={(e) => setSessionConfig(prev => ({
                    ...prev,
                    itemCount: parseInt(e.target.value) || 20
                  }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dificuldade
                </label>
                <select
                  value={sessionConfig.difficulty}
                  onChange={(e) => setSessionConfig(prev => ({
                    ...prev,
                    difficulty: e.target.value
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value={DIFFICULTY_LEVELS.EASY}>Fácil (múltiplos de 5)</option>
                  <option value={DIFFICULTY_LEVELS.MEDIUM}>Médio (todos os minutos)</option>
                  <option value={DIFFICULTY_LEVELS.HARD}>Difícil (com quarter/half/to)</option>
                </select>
              </div>
            </div>
            
            <div className="text-center pt-4">
              <Button onClick={startNewSession} size="lg" className="px-8">
                <Play className="w-5 h-5 mr-2" />
                Iniciar Prática
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Tela de sessão completa
  if (sessionComplete) {
    const accuracy = currentSession.itemsAttempted > 0 
      ? Math.round((currentSession.itemsCorrect / currentSession.itemsAttempted) * 100)
      : 0

    return (
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/70 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl">🎉 Sessão Completa!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{currentSession.itemsCorrect}</div>
                <div className="text-sm text-blue-800">Acertos</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">{accuracy}%</div>
                <div className="text-sm text-green-800">Precisão</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-600">{user.stars}</div>
                <div className="text-sm text-yellow-800">Estrelas</div>
              </div>
            </div>
            
            <div className="space-x-4">
              <Button onClick={() => setSessionStarted(false)}>
                Nova Sessão
              </Button>
              <Link to="/">
                <Button variant="outline">Voltar ao Menu</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Tela principal da prática
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Modo Praticar</h1>
          <div className="text-sm text-gray-600">
            {currentItemIndex + 1} de {sessionItems.length}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold">{user.stars}</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2">
            <Heart className="w-5 h-5 text-red-500" />
            <span className="font-semibold">{currentSession.lives}</span>
          </div>
        </div>
      </div>

      {/* Progresso */}
      <div className="mb-6">
        <div className="bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentItemIndex + 1) / sessionItems.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Exercício */}
      <Card className="bg-white/70 backdrop-blur-sm shadow-lg mb-6">
        <CardContent className="p-8">
          {renderExercise()}
          
          {/* Botão de verificar */}
          {!showFeedback && (
            <div className="text-center mt-8">
              <Button 
                onClick={checkAnswer}
                size="lg"
                disabled={
                  (currentItem?.type === QUESTION_TYPES.WRITE_VERBAL && !userAnswer.trim()) ||
                  (currentItem?.type === QUESTION_TYPES.MULTIPLE_CHOICE && selectedOption === null)
                }
              >
                Verificar Resposta
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feedback */}
      {showFeedback && (
        <FeedbackCard
          isCorrect={isCorrect}
          userAnswer={
            currentItem?.type === QUESTION_TYPES.DRAG_TO_DIGITAL ? clockAnswer :
            currentItem?.type === QUESTION_TYPES.WRITE_VERBAL ? userAnswer :
            currentItem?.type === QUESTION_TYPES.MULTIPLE_CHOICE ? currentItem.options[selectedOption] : null
          }
          correctAnswer={
            currentItem?.type === QUESTION_TYPES.MULTIPLE_CHOICE ? 
            currentItem.correctText : currentItem?.correctAnswer
          }
          item={currentItem}
          onTryAgain={canContinue && !isCorrect ? tryAgain : null}
          onNext={canContinue ? nextItem : null}
          showExplanation={true}
        />
      )}

      {/* Game Over */}
      {!canContinue && showFeedback && (
        <Card className="bg-red-50 border-red-200 shadow-lg mt-6">
          <CardContent className="text-center p-8">
            <h3 className="text-xl font-bold text-red-800 mb-4">Game Over!</h3>
            <p className="text-red-700 mb-6">Você ficou sem vidas. Que tal tentar novamente?</p>
            <div className="space-x-4">
              <Button onClick={() => setSessionStarted(false)}>
                Nova Sessão
              </Button>
              <Link to="/">
                <Button variant="outline">Voltar ao Menu</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Practice

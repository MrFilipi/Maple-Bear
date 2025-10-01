import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Volume2, Lightbulb, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import InteractiveClock from '../clock/InteractiveClock'
import TimeText from '../clock/TimeText'

const Learn = () => {
  const [currentTime, setCurrentTime] = useState({ hours: 3, minutes: 15 })
  const [showHints, setShowHints] = useState(false)
  const [currentExample, setCurrentExample] = useState(0)
  
  // Exemplos predefinidos conforme especificação
  const examples = [
    { hours: 3, minutes: 0, description: "Hora exata - o'clock" },
    { hours: 3, minutes: 15, description: "Um quarto - quarter past" },
    { hours: 3, minutes: 30, description: "Meia hora - half past" },
    { hours: 3, minutes: 45, description: "Três quartos - quarter to" },
    { hours: 8, minutes: 40, description: "Minutos para a próxima hora - to" },
    { hours: 11, minutes: 5, description: "Minutos após a hora - past" },
    { hours: 12, minutes: 55, description: "Quase meia-noite - to" }
  ]

  const handleTimeChange = (newTime) => {
    setCurrentTime(newTime)
  }

  const loadExample = (index) => {
    setCurrentExample(index)
    setCurrentTime(examples[index])
  }

  const speakTime = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        `The time is ${TimeText.convertToEnglishVerbal ? 
          TimeText.convertToEnglishVerbal(currentTime.hours, currentTime.minutes) : 
          'three fifteen'}`
      )
      utterance.lang = 'en-US'
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

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
          <h1 className="text-3xl font-bold text-gray-800">Modo Aprender</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowHints(!showHints)}
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            {showHints ? 'Ocultar Dica' : 'Mostrar Dica'}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={speakTime}
          >
            <Volume2 className="w-4 h-4 mr-2" />
            Ouvir
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Relógio Interativo */}
        <Card className="bg-white/70 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Relógio Interativo</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <InteractiveClock
              hours={currentTime.hours}
              minutes={currentTime.minutes}
              onChange={handleTimeChange}
              size={320}
              interactive={true}
              showMarks={true}
            />
            
            {/* Exibição das três formas */}
            <TimeText
              hours={currentTime.hours}
              minutes={currentTime.minutes}
              showDigital={true}
              showEnglish={true}
              showPortuguese={true}
              highlightRange={showHints}
              size="medium"
            />
          </CardContent>
        </Card>

        {/* Painel de Explicações */}
        <Card className="bg-white/70 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle>Como Ler as Horas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Explicação dos ponteiros */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Ponteiros do Relógio</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-1 bg-gray-600 rounded"></div>
                  <span><strong>Ponteiro curto (grosso):</strong> Indica a hora atual</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-0.5 bg-red-600 rounded"></div>
                  <span><strong>Ponteiro longo (fino):</strong> Indica os minutos</span>
                </div>
              </div>
            </div>
            
            {/* Explicação das faixas */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Faixas de Tempo</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-200 rounded-full"></div>
                  <span><strong>Past (1-29 min):</strong> "fifteen past three" (3:15)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-200 rounded-full"></div>
                  <span><strong>Half past (30 min):</strong> "half past three" (3:30)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-200 rounded-full"></div>
                  <span><strong>To (31-59 min):</strong> "twenty to four" (3:40)</span>
                </div>
              </div>
            </div>

            {/* Exemplos predefinidos */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Exemplos para Praticar</h3>
              <div className="grid grid-cols-1 gap-2">
                {examples.map((example, index) => (
                  <Button
                    key={index}
                    variant={currentExample === index ? "default" : "outline"}
                    size="sm"
                    onClick={() => loadExample(index)}
                    className="justify-start text-left"
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">
                        {example.hours}:{example.minutes.toString().padStart(2, '0')}
                      </span>
                      <span className="text-xs text-gray-500">
                        {example.description}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Dicas contextuais */}
            {showHints && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">💡 Dica Atual</h4>
                <p className="text-yellow-700 text-sm">
                  {currentTime.minutes === 0 && "Quando o ponteiro dos minutos aponta para 12, dizemos 'o'clock'."}
                  {currentTime.minutes > 0 && currentTime.minutes <= 30 && "Quando os minutos são de 1 a 30, usamos 'past' (depois da hora)."}
                  {currentTime.minutes > 30 && "Quando os minutos são de 31 a 59, usamos 'to' (para a próxima hora)."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Learn

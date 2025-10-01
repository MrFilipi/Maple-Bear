import { CheckCircle, XCircle, Lightbulb, RotateCcw } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { convertToEnglishVerbal, getTimeRange } from '../../utils/timeUtils'

const FeedbackCard = ({ 
  isCorrect, 
  userAnswer, 
  correctAnswer, 
  item, 
  onTryAgain, 
  onNext,
  showExplanation = true,
  language = 'pt'
}) => {
  // Mensagens de feedback positivo
  const positiveMessages = [
    'Muito bem!', 'Excelente!', 'Perfeito!', 'Parabéns!', 'Ótimo trabalho!',
    'Nice!', 'Great job!', 'Perfect!', 'Well done!', 'Excellent!'
  ]
  
  const getRandomPositiveMessage = () => {
    return positiveMessages[Math.floor(Math.random() * positiveMessages.length)]
  }

  // Gerar explicação detalhada para erros
  const generateExplanation = () => {
    if (!item || isCorrect) return null
    
    const { targetTime } = item
    const { hours, minutes } = targetTime
    const timeRange = getTimeRange(minutes)
    const correctVerbal = convertToEnglishVerbal(hours, minutes)
    
    let explanation = ''
    
    if (minutes === 0) {
      explanation = `Quando o ponteiro dos minutos aponta para 12 (0 minutos), dizemos "${correctVerbal}".`
    } else if (minutes === 15) {
      explanation = `15 minutos = um quarto de hora. Dizemos "a quarter past ${getHourName(hours)}".`
    } else if (minutes === 30) {
      explanation = `30 minutos = meia hora. Dizemos "half past ${getHourName(hours)}".`
    } else if (minutes === 45) {
      const nextHour = hours === 12 ? 1 : hours + 1
      explanation = `45 minutos = faltam 15 minutos (um quarto) para a próxima hora. Dizemos "a quarter to ${getHourName(nextHour)}".`
    } else if (timeRange === 'past') {
      explanation = `São ${minutes} minutos após ${getHourName(hours)}. Como é de 1 a 29 minutos, usamos "past": "${correctVerbal}".`
    } else if (timeRange === 'to') {
      const nextHour = hours === 12 ? 1 : hours + 1
      const minutesToNext = 60 - minutes
      explanation = `São ${minutes} minutos = faltam ${minutesToNext} minutos para ${getHourName(nextHour)}. Como é de 31 a 59 minutos, usamos "to": "${correctVerbal}".`
    }
    
    return explanation
  }

  const getHourName = (hour) => {
    const hourNames = {
      1: 'uma', 2: 'duas', 3: 'três', 4: 'quatro', 5: 'cinco', 6: 'seis',
      7: 'sete', 8: 'oito', 9: 'nove', 10: 'dez', 11: 'onze', 12: 'doze'
    }
    return hourNames[hour] || 'doze'
  }

  const explanation = generateExplanation()

  return (
    <Card className={`border-2 ${isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'} shadow-lg`}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* Ícone de feedback */}
          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
            isCorrect ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {isCorrect ? (
              <CheckCircle className="w-8 h-8 text-white" />
            ) : (
              <XCircle className="w-8 h-8 text-white" />
            )}
          </div>
          
          {/* Conteúdo do feedback */}
          <div className="flex-1 space-y-3">
            {/* Mensagem principal */}
            <div>
              <h3 className={`text-xl font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                {isCorrect ? getRandomPositiveMessage() : 'Não foi dessa vez...'}
              </h3>
              <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {isCorrect 
                  ? 'Você acertou! Continue assim!' 
                  : 'Não se preocupe, vamos tentar novamente!'
                }
              </p>
            </div>
            
            {/* Resposta do usuário vs resposta correta */}
            {!isCorrect && (
              <div className="space-y-2">
                <div className="bg-white/70 rounded-lg p-3 border border-red-200">
                  <p className="text-sm text-gray-600 mb-1">Sua resposta:</p>
                  <p className="font-medium text-red-700">
                    {typeof userAnswer === 'object' 
                      ? `${userAnswer.hours}:${userAnswer.minutes.toString().padStart(2, '0')}`
                      : userAnswer || 'Não respondido'
                    }
                  </p>
                </div>
                
                <div className="bg-white/70 rounded-lg p-3 border border-green-200">
                  <p className="text-sm text-gray-600 mb-1">Resposta correta:</p>
                  <p className="font-medium text-green-700">
                    {typeof correctAnswer === 'object'
                      ? `${correctAnswer.hours}:${correctAnswer.minutes.toString().padStart(2, '0')}`
                      : correctAnswer
                    }
                  </p>
                </div>
              </div>
            )}
            
            {/* Explicação detalhada */}
            {showExplanation && explanation && !isCorrect && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-1">Explicação:</h4>
                    <p className="text-sm text-blue-700">{explanation}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Dica adicional para tipos específicos */}
            {!isCorrect && item?.type === 'write_verbal' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Dica:</strong> Lembre-se das regras:
                  <br />• 1-29 min: use "past" (ex: "ten past three")
                  <br />• 30 min: use "half past" (ex: "half past three")  
                  <br />• 31-59 min: use "to" (ex: "twenty to four")
                </p>
              </div>
            )}
            
            {/* Botões de ação */}
            <div className="flex space-x-3 pt-2">
              {!isCorrect && onTryAgain && (
                <Button 
                  onClick={onTryAgain}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Tentar Novamente</span>
                </Button>
              )}
              
              {onNext && (
                <Button 
                  onClick={onNext}
                  variant={isCorrect ? "default" : "secondary"}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <span>{isCorrect ? 'Próximo' : 'Continuar'}</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FeedbackCard

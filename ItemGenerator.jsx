import { generateRandomTime, convertToEnglishVerbal, formatDigitalTime } from '../../utils/timeUtils'

/**
 * Gerador de itens de exercício para o modo praticar
 * Implementa os três tipos de pergunta especificados no documento
 */

export const QUESTION_TYPES = {
  DRAG_TO_DIGITAL: 'drag_to_digital', // Arrastar ponteiros para corresponder ao horário digital
  WRITE_VERBAL: 'write_verbal', // Escrever forma verbal em inglês
  MULTIPLE_CHOICE: 'multiple_choice' // Escolher leitura correta (múltipla escolha)
}

export const DIFFICULTY_LEVELS = {
  EASY: 'easy', // Intervalos de 5 em 5 min
  MEDIUM: 'medium', // 1 em 1 min, sem '0/5' fixo
  HARD: 'hard' // Mistura com 'quarter/half' e 'to'
}

/**
 * Gera um item de exercício baseado nos parâmetros
 * @param {Object} params - Parâmetros de configuração
 * @param {string} params.questionType - Tipo de pergunta (QUESTION_TYPES)
 * @param {string} params.difficulty - Nível de dificuldade (DIFFICULTY_LEVELS)
 * @param {boolean} params.allowQuarterHalf - Permitir quarter/half
 * @param {boolean} params.allowTo - Permitir 'to'
 * @param {Object} params.minuteRange - {min, max} para intervalo de minutos
 * @returns {Object} - Item de exercício gerado
 */
export const generateExerciseItem = (params = {}) => {
  const {
    questionType = QUESTION_TYPES.DRAG_TO_DIGITAL,
    difficulty = DIFFICULTY_LEVELS.MEDIUM,
    allowQuarterHalf = true,
    allowTo = true,
    minuteRange = { min: 0, max: 59 }
  } = params

  // Gerar tempo aleatório baseado na dificuldade
  let targetTime = generateRandomTime(difficulty)
  
  // Aplicar restrições de minutos se especificado
  if (minuteRange.min !== 0 || minuteRange.max !== 59) {
    while (targetTime.minutes < minuteRange.min || targetTime.minutes > minuteRange.max) {
      targetTime = generateRandomTime(difficulty)
    }
  }
  
  // Aplicar restrições de quarter/half
  if (!allowQuarterHalf && [15, 30, 45].includes(targetTime.minutes)) {
    targetTime = generateRandomTime(difficulty)
  }
  
  // Aplicar restrições de 'to' (31-59 min)
  if (!allowTo && targetTime.minutes > 30) {
    targetTime.minutes = Math.floor(Math.random() * 30) // 0-29
  }

  const digitalTime = formatDigitalTime(targetTime.hours, targetTime.minutes)
  const verbalTime = convertToEnglishVerbal(targetTime.hours, targetTime.minutes)
  
  // Gerar item baseado no tipo de pergunta
  switch (questionType) {
    case QUESTION_TYPES.DRAG_TO_DIGITAL:
      return generateDragToDigitalItem(targetTime, digitalTime, verbalTime)
    
    case QUESTION_TYPES.WRITE_VERBAL:
      return generateWriteVerbalItem(targetTime, digitalTime, verbalTime)
    
    case QUESTION_TYPES.MULTIPLE_CHOICE:
      return generateMultipleChoiceItem(targetTime, digitalTime, verbalTime, difficulty)
    
    default:
      return generateDragToDigitalItem(targetTime, digitalTime, verbalTime)
  }
}

/**
 * Gera item do tipo "arrastar ponteiros para horário digital"
 */
const generateDragToDigitalItem = (targetTime, digitalTime, verbalTime) => {
  return {
    id: `drag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: QUESTION_TYPES.DRAG_TO_DIGITAL,
    question: `Arraste os ponteiros para mostrar: ${digitalTime}`,
    questionEn: `Drag the hands to show: ${digitalTime}`,
    targetTime,
    correctAnswer: {
      hours: targetTime.hours,
      minutes: targetTime.minutes
    },
    displayTime: digitalTime,
    verbalTime,
    instructions: 'Arraste os ponteiros do relógio para a posição correta',
    instructionsEn: 'Drag the clock hands to the correct position',
    tolerance: 1 // Tolerância de 1 minuto
  }
}

/**
 * Gera item do tipo "escrever forma verbal"
 */
const generateWriteVerbalItem = (targetTime, digitalTime, verbalTime) => {
  return {
    id: `write_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: QUESTION_TYPES.WRITE_VERBAL,
    question: `Como se diz este horário em inglês?`,
    questionEn: `How do you say this time in English?`,
    targetTime,
    correctAnswer: verbalTime.toLowerCase().trim(),
    displayTime: digitalTime,
    clockTime: targetTime,
    instructions: 'Digite a forma verbal em inglês (ex: "three fifteen" ou "quarter past three")',
    instructionsEn: 'Type the verbal form in English (e.g., "three fifteen" or "quarter past three")',
    acceptableAnswers: generateAcceptableAnswers(targetTime) // Múltiplas respostas válidas
  }
}

/**
 * Gera item do tipo "múltipla escolha"
 */
const generateMultipleChoiceItem = (targetTime, digitalTime, verbalTime, difficulty) => {
  const correctAnswer = verbalTime
  const distractors = generateDistractors(targetTime, correctAnswer, difficulty)
  
  // Embaralhar opções
  const options = [correctAnswer, ...distractors].sort(() => Math.random() - 0.5)
  const correctIndex = options.indexOf(correctAnswer)
  
  return {
    id: `choice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: QUESTION_TYPES.MULTIPLE_CHOICE,
    question: `Qual é a forma verbal correta para este horário?`,
    questionEn: `What is the correct verbal form for this time?`,
    targetTime,
    clockTime: targetTime,
    options,
    correctAnswer: correctIndex,
    correctText: correctAnswer,
    instructions: 'Escolha a opção correta',
    instructionsEn: 'Choose the correct option'
  }
}

/**
 * Gera respostas aceitáveis para exercícios de escrita
 */
const generateAcceptableAnswers = (targetTime) => {
  const answers = []
  const { hours, minutes } = targetTime
  
  // Forma principal
  const mainAnswer = convertToEnglishVerbal(hours, minutes)
  answers.push(mainAnswer.toLowerCase())
  
  // Formas alternativas
  if (minutes === 15) {
    answers.push(`fifteen past ${getHourWord(hours)}`)
    answers.push(`a quarter past ${getHourWord(hours)}`)
    answers.push(`quarter past ${getHourWord(hours)}`)
  } else if (minutes === 30) {
    answers.push(`thirty past ${getHourWord(hours)}`)
    answers.push(`half past ${getHourWord(hours)}`)
  } else if (minutes === 45) {
    const nextHour = hours === 12 ? 1 : hours + 1
    answers.push(`fifteen to ${getHourWord(nextHour)}`)
    answers.push(`a quarter to ${getHourWord(nextHour)}`)
    answers.push(`quarter to ${getHourWord(nextHour)}`)
  }
  
  // Forma numérica alternativa para minutos normais
  if (![0, 15, 30, 45].includes(minutes)) {
    if (minutes <= 30) {
      answers.push(`${minutes} past ${getHourWord(hours)}`)
    } else {
      const nextHour = hours === 12 ? 1 : hours + 1
      const minutesToNext = 60 - minutes
      answers.push(`${minutesToNext} to ${getHourWord(nextHour)}`)
    }
  }
  
  return [...new Set(answers)] // Remove duplicatas
}

/**
 * Gera distratores para múltipla escolha
 */
const generateDistractors = (targetTime, correctAnswer, difficulty) => {
  const distractors = []
  const { hours, minutes } = targetTime
  
  // Distrator 1: Hora errada (±1 hora)
  const wrongHour1 = hours === 1 ? 12 : hours - 1
  const wrongHour2 = hours === 12 ? 1 : hours + 1
  distractors.push(convertToEnglishVerbal(wrongHour1, minutes))
  distractors.push(convertToEnglishVerbal(wrongHour2, minutes))
  
  // Distrator 2: Minutos errados
  if (minutes >= 5) {
    distractors.push(convertToEnglishVerbal(hours, minutes - 5))
  }
  if (minutes <= 55) {
    distractors.push(convertToEnglishVerbal(hours, minutes + 5))
  }
  
  // Distrator 3: Confusão past/to
  if (minutes > 0 && minutes <= 30) {
    // Usar 'to' quando deveria ser 'past'
    const nextHour = hours === 12 ? 1 : hours + 1
    const minutesToNext = 60 - minutes
    if (minutesToNext <= 29) {
      distractors.push(convertToEnglishVerbal(nextHour, minutesToNext))
    }
  }
  
  // Remover duplicatas e a resposta correta
  const uniqueDistractors = [...new Set(distractors)]
    .filter(d => d !== correctAnswer)
    .slice(0, 3) // Máximo 3 distratores
  
  return uniqueDistractors
}

/**
 * Converte número da hora para palavra
 */
const getHourWord = (hour) => {
  const hourWords = {
    1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six',
    7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten', 11: 'eleven', 12: 'twelve'
  }
  return hourWords[hour] || 'twelve'
}

/**
 * Gera uma sessão de exercícios
 * @param {Object} config - Configuração da sessão
 * @param {number} config.itemCount - Número de itens (padrão: 20)
 * @param {Array} config.questionTypes - Tipos de pergunta permitidos
 * @param {string} config.difficulty - Nível de dificuldade
 * @param {Object} config.restrictions - Restrições adicionais
 * @returns {Array} - Lista de itens de exercício
 */
export const generatePracticeSession = (config = {}) => {
  const {
    itemCount = 20,
    questionTypes = [QUESTION_TYPES.DRAG_TO_DIGITAL, QUESTION_TYPES.WRITE_VERBAL, QUESTION_TYPES.MULTIPLE_CHOICE],
    difficulty = DIFFICULTY_LEVELS.MEDIUM,
    restrictions = {}
  } = config
  
  const items = []
  
  for (let i = 0; i < itemCount; i++) {
    // Alternar entre tipos de pergunta
    const questionType = questionTypes[i % questionTypes.length]
    
    const item = generateExerciseItem({
      questionType,
      difficulty,
      ...restrictions
    })
    
    items.push({
      ...item,
      sessionIndex: i + 1,
      totalItems: itemCount
    })
  }
  
  return items
}

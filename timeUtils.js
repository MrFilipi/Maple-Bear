/**
 * Utilitários para conversão e manipulação de tempo
 * Implementa as regras de conversão especificadas no documento
 */

// Números por extenso até 29 (em minúsculas)
const numberWords = {
  1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five',
  6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten',
  11: 'eleven', 12: 'twelve', 13: 'thirteen', 14: 'fourteen', 15: 'fifteen',
  16: 'sixteen', 17: 'seventeen', 18: 'eighteen', 19: 'nineteen', 20: 'twenty',
  21: 'twenty-one', 22: 'twenty-two', 23: 'twenty-three', 24: 'twenty-four', 25: 'twenty-five',
  26: 'twenty-six', 27: 'twenty-seven', 28: 'twenty-eight', 29: 'twenty-nine'
}

// Horas por extenso (1-12)
const hourWords = {
  1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six',
  7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten', 11: 'eleven', 12: 'twelve'
}

/**
 * Converte hora para formato 12h
 * @param {number} hour - Hora em formato 24h (0-23)
 * @returns {number} - Hora em formato 12h (1-12)
 */
export const convertTo12Hour = (hour) => {
  if (hour === 0) return 12
  if (hour > 12) return hour - 12
  return hour
}

/**
 * Converte minutos para ângulo do ponteiro (0-360°)
 * @param {number} minutes - Minutos (0-59)
 * @returns {number} - Ângulo em graus
 */
export const minutesToAngle = (minutes) => {
  return (minutes * 6) // 360° / 60min = 6° por minuto
}

/**
 * Converte horas e minutos para ângulo do ponteiro das horas (0-360°)
 * @param {number} hours - Horas (0-23)
 * @param {number} minutes - Minutos (0-59)
 * @returns {number} - Ângulo em graus
 */
export const hoursToAngle = (hours, minutes) => {
  const hour12 = convertTo12Hour(hours)
  // 360° / 12h = 30° por hora + movimento contínuo baseado nos minutos
  return (hour12 * 30) + (minutes * 0.5) // 0.5° por minuto
}

/**
 * Converte ângulo para minutos
 * @param {number} angle - Ângulo em graus (0-360)
 * @returns {number} - Minutos (0-59)
 */
export const angleToMinutes = (angle) => {
  return Math.round(angle / 6) % 60
}

/**
 * Converte ângulo para horas
 * @param {number} angle - Ângulo em graus (0-360)
 * @param {number} minutes - Minutos atuais para ajuste fino
 * @returns {number} - Horas (1-12)
 */
export const angleToHours = (angle, minutes = 0) => {
  // Remove o offset dos minutos para obter a hora base
  const adjustedAngle = angle - (minutes * 0.5)
  const hour = Math.round(adjustedAngle / 30) % 12
  return hour === 0 ? 12 : hour
}

/**
 * Formata tempo no formato digital HH:MM
 * @param {number} hours - Horas (0-23)
 * @param {number} minutes - Minutos (0-59)
 * @returns {string} - Tempo formatado (ex: "03:15")
 */
export const formatDigitalTime = (hours, minutes) => {
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

/**
 * Converte tempo para forma verbal em inglês
 * Implementa as regras especificadas no documento
 * @param {number} hours - Horas (0-23)
 * @param {number} minutes - Minutos (0-59)
 * @returns {string} - Tempo em forma verbal inglesa
 */
export const convertToEnglishVerbal = (hours, minutes) => {
  const hour12 = convertTo12Hour(hours)
  const hourWord = hourWords[hour12]
  
  // m == 0 → "{hour} o'clock"
  if (minutes === 0) {
    return `${hourWord} o'clock`
  }
  
  // m == 15 → "a quarter past {hour}"
  if (minutes === 15) {
    return `a quarter past ${hourWord}`
  }
  
  // m == 30 → "half past {hour}"
  if (minutes === 30) {
    return `half past ${hourWord}`
  }
  
  // m == 45 → "a quarter to {hour+1}"
  if (minutes === 45) {
    const nextHour = hour12 === 12 ? 1 : hour12 + 1
    const nextHourWord = hourWords[nextHour]
    return `a quarter to ${nextHourWord}`
  }
  
  // 1 ≤ m ≤ 29 e m ≠ 15 → "{m} past {hour}"
  if (minutes >= 1 && minutes <= 29) {
    const minuteWord = numberWords[minutes]
    return `${minuteWord} past ${hourWord}`
  }
  
  // 31 ≤ m ≤ 59 e m ≠ 45 → "{60−m} to {hour+1}"
  if (minutes >= 31 && minutes <= 59) {
    const minutesToNext = 60 - minutes
    const minuteWord = numberWords[minutesToNext]
    const nextHour = hour12 === 12 ? 1 : hour12 + 1
    const nextHourWord = hourWords[nextHour]
    return `${minuteWord} to ${nextHourWord}`
  }
  
  return `${hourWord} o'clock` // fallback
}

/**
 * Converte tempo para apoio textual em português
 * @param {number} hours - Horas (0-23)
 * @param {number} minutes - Minutos (0-59)
 * @returns {string} - Tempo em português simples
 */
export const convertToPortugueseText = (hours, minutes) => {
  const hourNames = {
    0: 'meia-noite', 1: 'uma', 2: 'duas', 3: 'três', 4: 'quatro', 5: 'cinco', 6: 'seis',
    7: 'sete', 8: 'oito', 9: 'nove', 10: 'dez', 11: 'onze', 12: 'meio-dia',
    13: 'uma', 14: 'duas', 15: 'três', 16: 'quatro', 17: 'cinco', 18: 'seis',
    19: 'sete', 20: 'oito', 21: 'nove', 22: 'dez', 23: 'onze'
  }
  
  const hourName = hourNames[hours]
  
  if (minutes === 0) {
    return hourName
  }
  
  if (minutes === 15) {
    return `${hourName} e quinze / ${hourName} e um quarto`
  }
  
  if (minutes === 30) {
    return `${hourName} e trinta / ${hourName} e meia`
  }
  
  if (minutes === 45) {
    const nextHour = hours === 23 ? 0 : hours + 1
    const nextHourName = hourNames[nextHour]
    return `quinze para ${nextHourName} / um quarto para ${nextHourName}`
  }
  
  if (minutes <= 30) {
    return `${hourName} e ${minutes}`
  } else {
    const minutesToNext = 60 - minutes
    const nextHour = hours === 23 ? 0 : hours + 1
    const nextHourName = hourNames[nextHour]
    return `${minutesToNext} para ${nextHourName}`
  }
}

/**
 * Determina a faixa de tempo (past, half, to)
 * @param {number} minutes - Minutos (0-59)
 * @returns {string} - Faixa: 'past', 'half', 'to'
 */
export const getTimeRange = (minutes) => {
  if (minutes === 30) return 'half'
  if (minutes >= 1 && minutes <= 29) return 'past'
  if (minutes >= 31 && minutes <= 59) return 'to'
  return 'oclock'
}

/**
 * Gera um tempo aleatório baseado na dificuldade
 * @param {string} difficulty - 'easy', 'medium', 'hard'
 * @returns {object} - {hours, minutes}
 */
export const generateRandomTime = (difficulty = 'medium') => {
  let minutes
  const hours = Math.floor(Math.random() * 12) + 1 // 1-12
  
  switch (difficulty) {
    case 'easy':
      // Intervalos de 5 em 5 minutos
      minutes = Math.floor(Math.random() * 12) * 5 // 0, 5, 10, ..., 55
      break
    case 'medium':
      // Qualquer minuto
      minutes = Math.floor(Math.random() * 60) // 0-59
      break
    case 'hard':
      // Foco em quarter/half e to
      const specialTimes = [0, 15, 30, 45]
      const randomTimes = Array.from({length: 56}, (_, i) => i + 1).filter(m => ![15, 30, 45].includes(m))
      const allTimes = [...specialTimes, ...randomTimes.slice(0, 10)] // Mix de especiais e aleatórios
      minutes = allTimes[Math.floor(Math.random() * allTimes.length)]
      break
    default:
      minutes = Math.floor(Math.random() * 60)
  }
  
  return { hours, minutes }
}

/**
 * Valida se um tempo está correto (para exercícios)
 * @param {object} userTime - {hours, minutes}
 * @param {object} correctTime - {hours, minutes}
 * @param {number} tolerance - Tolerância em minutos (padrão: 1)
 * @returns {boolean} - Se está correto
 */
export const validateTime = (userTime, correctTime, tolerance = 1) => {
  const hourMatch = userTime.hours === correctTime.hours
  const minuteDiff = Math.abs(userTime.minutes - correctTime.minutes)
  const minuteMatch = minuteDiff <= tolerance
  
  return hourMatch && minuteMatch
}

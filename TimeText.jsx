import { 
  formatDigitalTime, 
  convertToEnglishVerbal, 
  convertToPortugueseText,
  getTimeRange 
} from '../../utils/timeUtils'

const TimeText = ({ 
  hours, 
  minutes, 
  showDigital = true, 
  showEnglish = true, 
  showPortuguese = true,
  highlightRange = false,
  size = 'medium' // 'small', 'medium', 'large'
}) => {
  const digitalTime = formatDigitalTime(hours, minutes)
  const englishTime = convertToEnglishVerbal(hours, minutes)
  const portugueseTime = convertToPortugueseText(hours, minutes)
  const timeRange = getTimeRange(minutes)
  
  // Cores para destacar diferentes faixas de tempo
  const rangeColors = {
    'past': 'text-green-600 bg-green-50',
    'half': 'text-blue-600 bg-blue-50',
    'to': 'text-purple-600 bg-purple-50',
    'oclock': 'text-gray-600 bg-gray-50'
  }
  
  const sizeClasses = {
    small: {
      container: 'space-y-2',
      digital: 'text-2xl',
      english: 'text-lg',
      portuguese: 'text-sm',
      label: 'text-xs'
    },
    medium: {
      container: 'space-y-3',
      digital: 'text-3xl',
      english: 'text-xl',
      portuguese: 'text-base',
      label: 'text-sm'
    },
    large: {
      container: 'space-y-4',
      digital: 'text-4xl',
      english: 'text-2xl',
      portuguese: 'text-lg',
      label: 'text-base'
    }
  }
  
  const classes = sizeClasses[size]
  const rangeClass = highlightRange ? rangeColors[timeRange] : ''

  return (
    <div className={`${classes.container} text-center`}>
      {/* Formato Digital */}
      {showDigital && (
        <div className="space-y-1">
          <p className={`${classes.label} font-medium text-gray-500 uppercase tracking-wide`}>
            Digital
          </p>
          <p className={`${classes.digital} font-mono font-bold text-gray-800 ${rangeClass} rounded-lg px-3 py-2 inline-block`}>
            {digitalTime}
          </p>
        </div>
      )}
      
      {/* Forma Verbal em Inglês */}
      {showEnglish && (
        <div className="space-y-1">
          <p className={`${classes.label} font-medium text-gray-500 uppercase tracking-wide`}>
            English
          </p>
          <p className={`${classes.english} font-semibold text-gray-800 ${rangeClass} rounded-lg px-3 py-2 inline-block`}>
            "{englishTime}"
          </p>
        </div>
      )}
      
      {/* Apoio Textual em Português */}
      {showPortuguese && (
        <div className="space-y-1">
          <p className={`${classes.label} font-medium text-gray-500 uppercase tracking-wide`}>
            Português
          </p>
          <p className={`${classes.portuguese} text-gray-600 ${rangeClass} rounded-lg px-3 py-2 inline-block`}>
            {portugueseTime}
          </p>
        </div>
      )}
      
      {/* Indicador de faixa de tempo */}
      {highlightRange && (
        <div className="mt-3">
          <div className="flex justify-center space-x-2 text-xs">
            <span className={`px-2 py-1 rounded-full ${timeRange === 'past' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
              Past (1-29)
            </span>
            <span className={`px-2 py-1 rounded-full ${timeRange === 'half' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
              Half (30)
            </span>
            <span className={`px-2 py-1 rounded-full ${timeRange === 'to' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-400'}`}>
              To (31-59)
            </span>
            <span className={`px-2 py-1 rounded-full ${timeRange === 'oclock' ? 'bg-gray-100 text-gray-700' : 'bg-gray-100 text-gray-400'}`}>
              O'clock (0)
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default TimeText

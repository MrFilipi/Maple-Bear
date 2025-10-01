import { useState, useEffect, useRef } from 'react'
import { 
  minutesToAngle, 
  hoursToAngle, 
  angleToMinutes, 
  angleToHours,
  convertTo12Hour 
} from '../../utils/timeUtils'

const InteractiveClock = ({ 
  hours = 3, 
  minutes = 15, 
  onChange = () => {}, 
  interactive = true,
  size = 320,
  showMarks = true,
  snapToMinutes = true,
  easyMode = false // Trava minutos em múltiplos de 5
}) => {
  const [currentHours, setCurrentHours] = useState(hours)
  const [currentMinutes, setCurrentMinutes] = useState(minutes)
  const [isDragging, setIsDragging] = useState(null) // 'hours' | 'minutes' | null
  
  const clockRef = useRef(null)
  const center = size / 2
  const radius = size * 0.4
  const hourHandLength = radius * 0.6
  const minuteHandLength = radius * 0.8

  // Atualiza estado interno quando props mudam
  useEffect(() => {
    setCurrentHours(hours)
    setCurrentMinutes(minutes)
  }, [hours, minutes])

  // Calcula ângulos dos ponteiros
  const minuteAngle = minutesToAngle(currentMinutes)
  const hourAngle = hoursToAngle(currentHours, currentMinutes)

  // Função para calcular ângulo baseado na posição do mouse/touch
  const calculateAngle = (clientX, clientY) => {
    if (!clockRef.current) return 0
    
    const rect = clockRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const deltaX = clientX - centerX
    const deltaY = clientY - centerY
    
    // Calcular ângulo em graus (0° = 12 horas)
    let angle = Math.atan2(deltaX, -deltaY) * (180 / Math.PI)
    if (angle < 0) angle += 360
    
    return angle
  }

  // Handlers para mouse
  const handleMouseDown = (hand) => (e) => {
    if (!interactive) return
    e.preventDefault()
    setIsDragging(hand)
  }

  const handleMouseMove = (e) => {
    if (!isDragging || !interactive) return
    
    const angle = calculateAngle(e.clientX, e.clientY)
    updateTimeFromAngle(isDragging, angle)
  }

  const handleMouseUp = () => {
    setIsDragging(null)
  }

  // Handlers para touch
  const handleTouchStart = (hand) => (e) => {
    if (!interactive) return
    e.preventDefault()
    setIsDragging(hand)
  }

  const handleTouchMove = (e) => {
    if (!isDragging || !interactive) return
    
    const touch = e.touches[0]
    const angle = calculateAngle(touch.clientX, touch.clientY)
    updateTimeFromAngle(isDragging, angle)
  }

  const handleTouchEnd = () => {
    setIsDragging(null)
  }

  // Atualiza tempo baseado no ângulo
  const updateTimeFromAngle = (hand, angle) => {
    if (hand === 'minutes') {
      let newMinutes = angleToMinutes(angle)
      
      // Snap para múltiplos de 5 no modo fácil
      if (easyMode) {
        newMinutes = Math.round(newMinutes / 5) * 5
        if (newMinutes === 60) newMinutes = 0
      }
      
      setCurrentMinutes(newMinutes)
      onChange({ hours: currentHours, minutes: newMinutes })
    } else if (hand === 'hours') {
      const newHours = angleToHours(angle, currentMinutes)
      setCurrentHours(newHours)
      onChange({ hours: newHours, minutes: currentMinutes })
    }
  }

  // Handlers para teclado
  const handleKeyDown = (e) => {
    if (!interactive) return
    
    const step = e.shiftKey ? 5 : 1
    
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        adjustMinutes(step)
        break
      case 'ArrowDown':
        e.preventDefault()
        adjustMinutes(-step)
        break
      case 'ArrowRight':
        e.preventDefault()
        adjustHours(1)
        break
      case 'ArrowLeft':
        e.preventDefault()
        adjustHours(-1)
        break
    }
  }

  const adjustMinutes = (delta) => {
    let newMinutes = currentMinutes + delta
    if (newMinutes < 0) newMinutes = 60 + newMinutes
    if (newMinutes >= 60) newMinutes = newMinutes - 60
    
    if (easyMode) {
      newMinutes = Math.round(newMinutes / 5) * 5
      if (newMinutes === 60) newMinutes = 0
    }
    
    setCurrentMinutes(newMinutes)
    onChange({ hours: currentHours, minutes: newMinutes })
  }

  const adjustHours = (delta) => {
    let newHours = currentHours + delta
    if (newHours < 1) newHours = 12
    if (newHours > 12) newHours = 1
    
    setCurrentHours(newHours)
    onChange({ hours: newHours, minutes: currentMinutes })
  }

  // Event listeners globais
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove)
      document.addEventListener('touchend', handleTouchEnd)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [isDragging, currentHours, currentMinutes])

  // Renderizar marcas do relógio
  const renderMarks = () => {
    const marks = []
    
    // Marcas das horas (1-12)
    for (let i = 1; i <= 12; i++) {
      const angle = (i * 30) - 90 // -90 para começar no 12
      const x1 = center + (radius - 20) * Math.cos(angle * Math.PI / 180)
      const y1 = center + (radius - 20) * Math.sin(angle * Math.PI / 180)
      const x2 = center + (radius - 5) * Math.cos(angle * Math.PI / 180)
      const y2 = center + (radius - 5) * Math.sin(angle * Math.PI / 180)
      
      marks.push(
        <line
          key={`hour-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#374151"
          strokeWidth="3"
        />
      )
      
      // Números das horas
      const textX = center + (radius - 35) * Math.cos(angle * Math.PI / 180)
      const textY = center + (radius - 35) * Math.sin(angle * Math.PI / 180)
      
      marks.push(
        <text
          key={`hour-text-${i}`}
          x={textX}
          y={textY}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-lg font-bold fill-gray-700"
        >
          {i}
        </text>
      )
    }
    
    // Marcas dos minutos (intervalos de 5)
    for (let i = 0; i < 60; i += 5) {
      if (i % 15 === 0) continue // Pular 0, 15, 30, 45 (já marcados)
      
      const angle = (i * 6) - 90
      const x1 = center + (radius - 15) * Math.cos(angle * Math.PI / 180)
      const y1 = center + (radius - 15) * Math.sin(angle * Math.PI / 180)
      const x2 = center + (radius - 5) * Math.cos(angle * Math.PI / 180)
      const y2 = center + (radius - 5) * Math.sin(angle * Math.PI / 180)
      
      marks.push(
        <line
          key={`minute-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#9CA3AF"
          strokeWidth="1"
        />
      )
    }
    
    // Marcas especiais para quarter e half
    const specialMarks = [
      { minute: 15, color: '#10B981', label: '¼' },
      { minute: 30, color: '#3B82F6', label: '½' },
      { minute: 45, color: '#8B5CF6', label: '¾' }
    ]
    
    specialMarks.forEach(({ minute, color, label }) => {
      const angle = (minute * 6) - 90
      const x = center + (radius - 50) * Math.cos(angle * Math.PI / 180)
      const y = center + (radius - 50) * Math.sin(angle * Math.PI / 180)
      
      marks.push(
        <circle
          key={`special-${minute}`}
          cx={x}
          cy={y}
          r="8"
          fill={color}
          opacity="0.3"
        />
      )
      
      marks.push(
        <text
          key={`special-text-${minute}`}
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs font-bold"
          fill={color}
        >
          {label}
        </text>
      )
    })
    
    return marks
  }

  return (
    <div 
      className="relative inline-block"
      tabIndex={interactive ? 0 : -1}
      onKeyDown={handleKeyDown}
      role="application"
      aria-label={`Relógio interativo: ${convertTo12Hour(currentHours)} horas e ${currentMinutes} minutos`}
    >
      <svg
        ref={clockRef}
        width={size}
        height={size}
        className="border-4 border-gray-300 rounded-full bg-white shadow-lg cursor-pointer select-none"
        style={{ touchAction: 'none' }}
      >
        {/* Fundo do relógio */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="white"
          stroke="#E5E7EB"
          strokeWidth="2"
        />
        
        {/* Marcas do relógio */}
        {showMarks && renderMarks()}
        
        {/* Ponteiro das horas */}
        <line
          x1={center}
          y1={center}
          x2={center + hourHandLength * Math.cos((hourAngle - 90) * Math.PI / 180)}
          y2={center + hourHandLength * Math.sin((hourAngle - 90) * Math.PI / 180)}
          stroke="#374151"
          strokeWidth="6"
          strokeLinecap="round"
          className={`${interactive ? 'cursor-grab' : ''} ${isDragging === 'hours' ? 'cursor-grabbing stroke-blue-500' : ''}`}
          onMouseDown={handleMouseDown('hours')}
          onTouchStart={handleTouchStart('hours')}
        />
        
        {/* Ponteiro dos minutos */}
        <line
          x1={center}
          y1={center}
          x2={center + minuteHandLength * Math.cos((minuteAngle - 90) * Math.PI / 180)}
          y2={center + minuteHandLength * Math.sin((minuteAngle - 90) * Math.PI / 180)}
          stroke="#DC2626"
          strokeWidth="4"
          strokeLinecap="round"
          className={`${interactive ? 'cursor-grab' : ''} ${isDragging === 'minutes' ? 'cursor-grabbing stroke-red-400' : ''}`}
          onMouseDown={handleMouseDown('minutes')}
          onTouchStart={handleTouchStart('minutes')}
        />
        
        {/* Centro do relógio */}
        <circle
          cx={center}
          cy={center}
          r="8"
          fill="#374151"
        />
      </svg>
      
      {/* Instruções de uso */}
      {interactive && (
        <div className="mt-2 text-xs text-gray-500 text-center max-w-xs">
          <p>Arraste os ponteiros ou use as setas do teclado</p>
          <p className="text-gray-400">Shift + setas = +/- 5 minutos</p>
        </div>
      )}
    </div>
  )
}

export default InteractiveClock

import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Target, Gamepad2, GraduationCap, Clock, Star, Trophy } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import useProgressStore from '../stores/progressStore'

const Home = () => {
  const { t } = useLanguage()
  const { user } = useProgressStore()

  const menuItems = [
    {
      title: t('nav.learn'),
      description: t('home.learnCard.description'),
      icon: BookOpen,
      path: '/aprender',
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100'
    },
    {
      title: t('nav.practice'),
      description: t('home.practiceCard.description'),
      icon: Target,
      path: '/praticar',
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      title: t('nav.challenges'),
      description: t('home.challengesCard.description'),
      icon: Gamepad2,
      path: '/desafios',
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100'
    },
    {
      title: t('nav.teacher'),
      description: t('home.teacherCard.description'),
      icon: GraduationCap,
      path: '/professor',
      color: 'from-orange-400 to-orange-600',
      bgColor: 'bg-orange-50 hover:bg-orange-100'
    }
  ]

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <Clock className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-lg">🥷</span>
            </div>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          {t('home.title')}
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          {t('home.subtitle')}
        </p>

        {/* Progresso do usuário */}
        <div className="flex justify-center space-x-6 mb-8">
          <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold text-gray-700">{user.stars} estrelas</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
            <Trophy className="w-5 h-5 text-purple-500" />
            <span className="font-semibold text-gray-700">Nível {user.level}</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
            <Target className="w-5 h-5 text-blue-500" />
            <span className="font-semibold text-gray-700">{user.achievements.length} conquistas</span>
          </div>
        </div>
      </div>

      {/* Menu Principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          return (
            <Link key={index} to={item.path} className="group">
              <Card className={`${item.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-800 group-hover:text-gray-900">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 mt-1">
                        {item.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Seção de recursos */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          O que você vai aprender
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white">🕐</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Relógio Analógico</h3>
            <p className="text-gray-600 text-sm">
              Aprenda a posicionar os ponteiros e interpretar as horas no relógio tradicional
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white">🔢</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Formato Digital</h3>
            <p className="text-gray-600 text-sm">
              Converta entre o formato analógico e digital (HH:MM) com facilidade
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white">🗣️</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Inglês Verbal</h3>
            <p className="text-gray-600 text-sm">
              Domine "past", "to", "quarter past", "half past" e "quarter to" em inglês
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Users, Settings, BarChart3, Eye, Volume2, Palette, Download, Upload, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import useProgressStore from '../../stores/progressStore'

const Teacher = () => {
  // Store do progresso
  const { 
    user, 
    settings, 
    stats, 
    updateSettings, 
    resetProgress, 
    exportProgress, 
    importProgress,
    getAccuracyRate,
    getAccuracyByType,
    getAccuracyByTimeRange
  } = useProgressStore()

  // Estados locais
  const [localSettings, setLocalSettings] = useState(settings)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  // Aplicar configurações
  const applySettings = () => {
    updateSettings(localSettings)
    alert('Configurações salvas com sucesso!')
  }

  // Resetar progresso
  const handleResetProgress = () => {
    if (showResetConfirm) {
      resetProgress()
      setShowResetConfirm(false)
      alert('Progresso resetado com sucesso!')
    } else {
      setShowResetConfirm(true)
      setTimeout(() => setShowResetConfirm(false), 5000) // Auto-cancel após 5s
    }
  }

  // Exportar dados
  const handleExportData = () => {
    const data = exportProgress()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `clock-ninja-progress-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Importar dados
  const handleImportData = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        importProgress(data)
        alert('Dados importados com sucesso!')
      } catch (error) {
        alert('Erro ao importar dados. Verifique se o arquivo está correto.')
      }
    }
    reader.readAsText(file)
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
          <h1 className="text-3xl font-bold text-gray-800">Painel do Professor</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2">
            <Users className="w-5 h-5 text-blue-500" />
            <span className="font-semibold">Modo Educador</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="progress" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="progress" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Progresso</span>
          </TabsTrigger>
          <TabsTrigger value="accessibility" className="flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>Acessibilidade</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Configurações</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Dados</span>
          </TabsTrigger>
        </TabsList>

        {/* Aba de Progresso */}
        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Estatísticas Gerais */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Acerto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {getAccuracyRate().toFixed(1)}%
                </div>
                <p className="text-xs text-gray-500">
                  {user.totalItemsCorrect} de {user.totalItemsAttempted} exercícios
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Nível Atual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {user.level}
                </div>
                <p className="text-xs text-gray-500">
                  {user.totalPoints} pontos totais
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Maior Sequência</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {user.maxStreak}
                </div>
                <p className="text-xs text-gray-500">
                  Atual: {user.streakCount}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Conquistas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {user.achievements.length}
                </div>
                <p className="text-xs text-gray-500">
                  {user.stars} estrelas coletadas
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Estatísticas por Tipo de Exercício */}
          <Card>
            <CardHeader>
              <CardTitle>Desempenho por Tipo de Exercício</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium">Arrastar Ponteiros</span>
                  <span className="text-blue-600 font-bold">
                    {getAccuracyByType('drag_to_digital').toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">Escrever Verbal</span>
                  <span className="text-green-600 font-bold">
                    {getAccuracyByType('write_verbal').toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="font-medium">Múltipla Escolha</span>
                  <span className="text-purple-600 font-bold">
                    {getAccuracyByType('multiple_choice').toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas por Faixa de Tempo */}
          <Card>
            <CardHeader>
              <CardTitle>Desempenho por Faixa de Tempo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="font-bold text-blue-600">
                    {getAccuracyByTimeRange('past').toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Past (1-29 min)</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="font-bold text-green-600">
                    {getAccuracyByTimeRange('half').toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Half (30 min)</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="font-bold text-yellow-600">
                    {getAccuracyByTimeRange('to').toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">To (31-59 min)</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="font-bold text-purple-600">
                    {getAccuracyByTimeRange('oclock').toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">O'clock (0 min)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Acessibilidade */}
        <TabsContent value="accessibility" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>Configurações de Acessibilidade</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contraste e Cores */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <Palette className="w-5 h-5" />
                  <span>Visual</span>
                </h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">Modo Escuro</label>
                    <p className="text-sm text-gray-600">Reduz o brilho da tela</p>
                  </div>
                  <Switch 
                    checked={localSettings.darkMode}
                    onCheckedChange={(checked) => 
                      setLocalSettings(prev => ({ ...prev, darkMode: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">Alto Contraste</label>
                    <p className="text-sm text-gray-600">Melhora a visibilidade dos elementos</p>
                  </div>
                  <Switch 
                    checked={localSettings.highContrast || false}
                    onCheckedChange={(checked) => 
                      setLocalSettings(prev => ({ ...prev, highContrast: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">Texto Grande</label>
                    <p className="text-sm text-gray-600">Aumenta o tamanho dos textos</p>
                  </div>
                  <Switch 
                    checked={localSettings.largeText || false}
                    onCheckedChange={(checked) => 
                      setLocalSettings(prev => ({ ...prev, largeText: checked }))
                    }
                  />
                </div>
              </div>

              {/* Áudio */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <Volume2 className="w-5 h-5" />
                  <span>Áudio</span>
                </h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">Sons Habilitados</label>
                    <p className="text-sm text-gray-600">Efeitos sonoros e feedback auditivo</p>
                  </div>
                  <Switch 
                    checked={localSettings.soundEnabled}
                    onCheckedChange={(checked) => 
                      setLocalSettings(prev => ({ ...prev, soundEnabled: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">Narração</label>
                    <p className="text-sm text-gray-600">Leitura automática das instruções</p>
                  </div>
                  <Switch 
                    checked={localSettings.narration || false}
                    onCheckedChange={(checked) => 
                      setLocalSettings(prev => ({ ...prev, narration: checked }))
                    }
                  />
                </div>
              </div>

              {/* Motor */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Interação</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">Modo Simplificado</label>
                    <p className="text-sm text-gray-600">Interface com menos elementos visuais</p>
                  </div>
                  <Switch 
                    checked={localSettings.simplifiedMode || false}
                    onCheckedChange={(checked) => 
                      setLocalSettings(prev => ({ ...prev, simplifiedMode: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">Cliques Grandes</label>
                    <p className="text-sm text-gray-600">Aumenta a área de clique dos botões</p>
                  </div>
                  <Switch 
                    checked={localSettings.largeTouchTargets || false}
                    onCheckedChange={(checked) => 
                      setLocalSettings(prev => ({ ...prev, largeTouchTargets: checked }))
                    }
                  />
                </div>
              </div>

              <Button onClick={applySettings} className="w-full">
                Aplicar Configurações de Acessibilidade
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Configurações */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Pedagógicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Idioma da Interface</label>
                  <select 
                    value={localSettings.language}
                    onChange={(e) => setLocalSettings(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="pt">Português (BR)</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Nível de Dificuldade Padrão</label>
                  <select 
                    value={localSettings.difficulty}
                    onChange={(e) => setLocalSettings(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="easy">Fácil (múltiplos de 5)</option>
                    <option value="medium">Médio (todos os minutos)</option>
                    <option value="hard">Difícil (com quarter/half/to)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Recursos Habilitados</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">Quarter e Half</label>
                    <p className="text-sm text-gray-600">Permitir exercícios com "quarter" e "half"</p>
                  </div>
                  <Switch 
                    checked={localSettings.allowQuarterHalf}
                    onCheckedChange={(checked) => 
                      setLocalSettings(prev => ({ ...prev, allowQuarterHalf: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium">Formato "To"</label>
                    <p className="text-sm text-gray-600">Permitir exercícios com "to" (31-59 min)</p>
                  </div>
                  <Switch 
                    checked={localSettings.allowTo}
                    onCheckedChange={(checked) => 
                      setLocalSettings(prev => ({ ...prev, allowTo: checked }))
                    }
                  />
                </div>
              </div>

              <Button onClick={applySettings} className="w-full">
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Dados */}
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Dados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Exportar Dados</h3>
                  <p className="text-sm text-gray-600">
                    Baixe um arquivo com todo o progresso e configurações do aluno
                  </p>
                  <Button onClick={handleExportData} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Progresso
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Importar Dados</h3>
                  <p className="text-sm text-gray-600">
                    Carregue um arquivo de progresso previamente exportado
                  </p>
                  <div>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportData}
                      className="hidden"
                      id="import-file"
                    />
                    <Button asChild className="w-full">
                      <label htmlFor="import-file" className="cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" />
                        Importar Progresso
                      </label>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Zona de Perigo</h3>
                  <p className="text-sm text-red-700 mb-4">
                    Esta ação irá apagar permanentemente todo o progresso do aluno. Use com cuidado.
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={handleResetProgress}
                    className="w-full"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {showResetConfirm ? 'Confirmar Reset - Clique Novamente' : 'Resetar Todo o Progresso'}
                  </Button>
                  {showResetConfirm && (
                    <p className="text-xs text-red-600 mt-2">
                      Clique novamente nos próximos 5 segundos para confirmar
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Teacher

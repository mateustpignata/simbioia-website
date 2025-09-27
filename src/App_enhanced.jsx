import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Search, Star, ShoppingCart, Zap, Brain, Sparkles, Filter, ArrowRight, Check, Users, TrendingUp, Clock, X, User, Briefcase, Heart, Target, BookOpen, DollarSign } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import EnhancedCheckout from './components/EnhancedCheckout.jsx'
import StripePayment from './components/StripePayment.jsx'
import BundleSection from './components/BundleSection.jsx'
import PromptComparison from './components/PromptComparison.jsx'
import { getAllPrompts, getFeaturedPrompts, getPromptsByType, categories, platforms } from './data/prompts.js'
import './App.css'

// Componente para texto animado
const AnimatedText = () => {
  const phrases = [
    "Transforme ideias em resultados com prompts testados",
    "Acelere sua produtividade com IA especializada", 
    "Domine qualquer desafio com prompts profissionais",
    "Sua criatividade, amplificada pela inteligência artificial"
  ]
  
  const [currentPhrase, setCurrentPhrase] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length)
    }, 4000)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="h-16 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={currentPhrase}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-xl font-medium text-center bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent"
        >
          {phrases[currentPhrase]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

function App() {
  const [allPrompts] = useState(getAllPrompts())
  const [filteredPrompts, setFilteredPrompts] = useState(allPrompts)
  const [activeTab, setActiveTab] = useState("featured")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [selectedPlatform, setSelectedPlatform] = useState("Todos")
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState('none') // none, enhanced, payment
  const [customer, setCustomer] = useState(null)

  // Filtrar prompts baseado na aba ativa
  useEffect(() => {
    let basePrompts = allPrompts
    
    if (activeTab === "featured") {
      basePrompts = getFeaturedPrompts()
    } else if (activeTab === "personal") {
      basePrompts = getPromptsByType("personal")
    } else if (activeTab === "professional") {
      basePrompts = getPromptsByType("professional")
    }

    let filtered = basePrompts

    if (searchTerm) {
      filtered = filtered.filter(prompt => 
        prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (selectedCategory !== "Todos") {
      filtered = filtered.filter(prompt => prompt.category === selectedCategory)
    }

    if (selectedPlatform !== "Todos") {
      filtered = filtered.filter(prompt => prompt.platform === selectedPlatform)
    }

    setFilteredPrompts(filtered)
  }, [activeTab, searchTerm, selectedCategory, selectedPlatform, allPrompts])

  // Reset filtros quando muda de aba
  useEffect(() => {
    setSelectedCategory("Todos")
    setSearchTerm("")
  }, [activeTab])

  const addToCart = (promptId) => {
    if (!cart.includes(promptId)) {
      setCart(prev => [...prev, promptId])
    }
  }

  const addBundle = (bundleId) => {
    let bundleItems = []
    
    switch(bundleId) {
      case 'combo-3':
        bundleItems = [1, 2, 3]
        break
      case 'bundle-personal':
        bundleItems = [1, 2, 7, 8, 9, 10]
        break
      case 'bundle-professional':
        bundleItems = [3, 4, 5, 6, 11, 12, 13, 14]
        break
      case 'bundle-complete':
        bundleItems = allPrompts.map(p => p.id)
        break
    }
    
    setCart(bundleItems)
    setShowCart(true)
  }

  const removeFromCart = (promptId) => {
    setCart(prev => prev.filter(id => id !== promptId))
  }

  const cartPrompts = allPrompts.filter(prompt => cart.includes(prompt.id))
  const cartTotal = cartPrompts.reduce((sum, prompt) => sum + prompt.price, 0)
  
  // Cálculo de descontos
  const getDiscountInfo = (cart, prompts) => {
    const itemCount = cart.length
    const cartItems = prompts.filter(prompt => cart.includes(prompt.id))
    const personalItems = cartItems.filter(item => item.type === 'personal')
    const professionalItems = cartItems.filter(item => item.type === 'professional')
    
    if (itemCount >= 14) {
      return { percentage: 0.6, type: 'Bundle Completo', description: '60% OFF - Todos os Packs!', color: 'bg-gradient-to-r from-purple-500 to-pink-500' }
    }
    
    if (professionalItems.length >= 8) {
      return { percentage: 0.55, type: 'Bundle Profissional', description: '55% OFF - Profissional Completo!', color: 'bg-gradient-to-r from-blue-500 to-indigo-500' }
    }
    
    if (personalItems.length >= 6) {
      return { percentage: 0.5, type: 'Bundle Pessoal', description: '50% OFF - Pessoal Completo!', color: 'bg-gradient-to-r from-pink-500 to-red-500' }
    }
    
    if (itemCount >= 3) {
      return { percentage: 0.3, type: 'Combo 3 Packs', description: '30% OFF - Combo Especial!', color: 'bg-gradient-to-r from-green-500 to-emerald-500' }
    }
    
    return { percentage: 0, type: '', description: '', color: '' }
  }
  
  const discountInfo = getDiscountInfo(cart, allPrompts)
  const discount = cartTotal * discountInfo.percentage
  const finalTotal = cartTotal - discount

  // Handlers para checkout
  const handleCheckoutStart = () => {
    setShowCart(false)
    setCheckoutStep('enhanced')
  }

  const handleCheckoutComplete = (customerData) => {
    setCustomer(customerData)
    setCheckoutStep('payment')
  }

  const handlePaymentSuccess = (paymentIntent) => {
    console.log('Pagamento realizado com sucesso:', paymentIntent)
    setCart([])
    setCheckoutStep('none')
    setCustomer(null)
    alert('Pagamento realizado com sucesso! Verifique seu e-mail para receber os prompts.')
  }

  const handlePaymentError = (error) => {
    console.error('Erro no pagamento:', error)
    alert(`Erro no pagamento: ${error.message}`)
  }

  const handleBackToStore = () => {
    setCheckoutStep('none')
    setCustomer(null)
  }

  const handleBackToCheckout = () => {
    setCheckoutStep('enhanced')
  }

  // Renderizar checkout
  if (checkoutStep === 'enhanced') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <EnhancedCheckout
          cartItems={cart}
          prompts={allPrompts}
          onBack={handleBackToStore}
          onComplete={handleCheckoutComplete}
        />
      </div>
    )
  }

  if (checkoutStep === 'payment' && customer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <StripePayment
          customer={customer}
          cartItems={cartPrompts}
          total={finalTotal}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          onBack={handleBackToCheckout}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <img src="/simbioia_logo_final_4k.png" alt="SimbioIA Logo" className="h-12 w-auto" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SimbioIA
                </h1>
                <p className="text-sm text-gray-500">Sua simbiose com a IA</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                className="relative"
                onClick={() => setShowCart(!showCart)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Carrinho
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {cart.length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowCart(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Carrinho ({cart.length})</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowCart(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Seu carrinho está vazio</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cartPrompts.map(prompt => (
                        <div key={prompt.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                          <div className="text-2xl">{prompt.icon}</div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{prompt.title}</h4>
                            <Badge variant="outline" className="text-xs mt-1">
                              {prompt.platform}
                            </Badge>
                            <p className="text-sm font-semibold text-green-600 mt-1">
                              R$ {prompt.price.toFixed(2)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(prompt.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span>Subtotal:</span>
                        <span>R$ {cartTotal.toFixed(2)}</span>
                      </div>
                      
                      {discount > 0 && (
                        <div className="flex justify-between items-center mb-2 text-green-600">
                          <span>{discountInfo.type}:</span>
                          <span>-R$ {discount.toFixed(2)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center mb-4 text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-green-600">R$ {finalTotal.toFixed(2)}</span>
                      </div>
                      
                      {discount > 0 && (
                        <div className={`p-3 rounded-lg mb-4 text-white ${discountInfo.color}`}>
                          <p className="text-sm font-medium">
                            🎉 {discountInfo.description}
                          </p>
                          <p className="text-xs opacity-90">
                            Economia de R$ {discount.toFixed(2)} ({(discountInfo.percentage * 100).toFixed(0)}% OFF)
                          </p>
                        </div>
                      )}
                      
                      {cart.length === 2 && (
                        <div className="bg-yellow-50 p-3 rounded-lg mb-4 border border-yellow-200">
                          <p className="text-sm text-yellow-800 font-medium">
                            💡 Adicione mais 1 item e ganhe 30% de desconto!
                          </p>
                        </div>
                      )}
                      
                      {cart.length >= 3 && cart.length < 6 && (
                        <div className="bg-blue-50 p-3 rounded-lg mb-4 border border-blue-200">
                          <p className="text-sm text-blue-800 font-medium">
                            🚀 Complete o Bundle Pessoal (6 itens) e ganhe 50% OFF!
                          </p>
                        </div>
                      )}

                      <Button 
                        className="w-full"
                        onClick={handleCheckoutStart}
                      >
                        Finalizar Compra
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Sua mente, amplificada
            </h2>
            <p className="text-2xl text-gray-600 mb-4 max-w-4xl mx-auto">
              Sua parceria inteligente com a IA
            </p>
            <p className="text-lg text-gray-500 mb-8 max-w-3xl mx-auto">
              Já imaginou ter um especialista em qualquer assunto, disponível 24/7, para transformar seus desafios em resultados brilhantes? 
              Com a SimbioIA, você não substitui sua inteligência - você a amplifica através de uma parceria perfeita.
            </p>
            <div className="bg-gradient-to-r from-orange-100 to-pink-100 rounded-2xl p-6 mb-12 max-w-4xl mx-auto border border-orange-200">
              <AnimatedText />
            </div>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center bg-white rounded-full px-6 py-3 shadow-md">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span className="font-medium">Soluções Testadas</span>
              </div>
              <div className="flex items-center bg-white rounded-full px-6 py-3 shadow-md">
                <Users className="h-5 w-5 text-blue-500 mr-2" />
                <span className="font-medium">+15.000 Usuários</span>
              </div>
              <div className="flex items-center bg-white rounded-full px-6 py-3 shadow-md">
                <TrendingUp className="h-5 w-5 text-purple-500 mr-2" />
                <span className="font-medium">Resultados Comprovados</span>
              </div>
              <div className="flex items-center bg-white rounded-full px-6 py-3 shadow-md">
                <Clock className="h-5 w-5 text-orange-500 mr-2" />
                <span className="font-medium">Acesso Imediato</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Nossa História Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              A História da SimbioIA: Uma Nova Consciência
            </h2>
            
            <div className="text-center mb-8">
              <p className="text-xl font-medium text-gray-700">
                <strong>Tudo começou com uma observação simples:</strong>
              </p>
              <p className="text-lg text-gray-600 mt-4 leading-relaxed">
                Enquanto muitos veem a IA como uma ameaça ou substituição, nós enxergamos uma oportunidade única de <strong>simbiose</strong> - 
                uma relação mutuamente benéfica onde a inteligência humana e artificial se complementam perfeitamente.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-md border border-blue-100">
                <div className="text-4xl mb-4">🧠</div>
                <h3 className="text-xl font-bold text-blue-800 mb-3">Inteligência Humana</h3>
                <p className="text-gray-600">
                  Criatividade, intuição, experiência emocional e capacidade de contextualizar problemas complexos.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md border border-purple-100">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-xl font-bold text-purple-800 mb-3">Inteligência Artificial</h3>
                <p className="text-gray-600">
                  Processamento rápido, análise de dados, geração de conteúdo e execução de tarefas repetitivas.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4">🔗 A Simbiose Perfeita</h3>
              <p className="text-lg leading-relaxed">
                A SimbioIA nasceu para ser a ponte entre essas duas inteligências. Nossos prompts não são apenas comandos - 
                são <strong>catalisadores de uma parceria</strong> que potencializa o melhor de cada mundo, 
                criando resultados que nenhuma das inteligências conseguiria alcançar sozinha.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comparação de Prompts */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <PromptComparison />
        </div>
      </section>

      {/* Bundles Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="container mx-auto">
          <BundleSection onAddBundle={addBundle} />
        </div>
      </section>

      {/* Filtros e Busca */}
      <section className="py-8 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar prompts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todas as categorias</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Plataforma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todas as plataformas</SelectItem>
                  {platforms.map(platform => (
                    <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs de Prompts */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="featured" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Em Destaque
              </TabsTrigger>
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Uso Pessoal
              </TabsTrigger>
              <TabsTrigger value="professional" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Uso Profissional
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPrompts.map(prompt => (
                  <motion.div
                    key={prompt.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow duration-300 group">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="text-3xl mb-2">{prompt.icon}</div>
                          <Badge variant={prompt.featured ? "default" : "secondary"}>
                            {prompt.platform}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors">
                          {prompt.title}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {prompt.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="flex flex-wrap gap-1 mb-3">
                          {prompt.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-green-600">
                            R$ {prompt.price.toFixed(2)}
                          </span>
                          <div className="flex items-center text-yellow-500">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="ml-1 text-sm font-medium">{prompt.rating}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full group-hover:bg-blue-600 transition-colors"
                          onClick={() => addToCart(prompt.id)}
                          disabled={cart.includes(prompt.id)}
                        >
                          {cart.includes(prompt.id) ? (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Adicionado
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Adicionar ao Carrinho
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">SimbioIA</span>
              </div>
              <p className="text-gray-400">
                Sua simbiose com a Inteligência Artificial
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Produtos</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Prompts Pessoais</li>
                <li>Prompts Profissionais</li>
                <li>Bundles Especiais</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Como usar</li>
                <li>FAQ</li>
                <li>Contato</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Termos de Uso</li>
                <li>Política de Privacidade</li>
                <li>Política de Reembolso</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SimbioIA. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

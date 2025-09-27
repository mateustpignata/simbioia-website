import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Search, Star, ShoppingCart, Zap, Brain, Sparkles, Filter, ArrowRight, Check, Users, TrendingUp, Clock, X, User, Briefcase, Heart, Target, BookOpen, DollarSign } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Checkout from './components/Checkout.jsx'
import StripeCheckout from './components/StripeCheckout.jsx'
import BundleSection from './components/BundleSection.jsx'
import PromptComparison from './components/PromptComparison.jsx'
import { getAllPrompts, getFeaturedPrompts, getPromptsByType, categories, platforms } from './data/prompts.js'
import './App.css'

function App() {
  const [allPrompts] = useState(getAllPrompts())
  const [filteredPrompts, setFilteredPrompts] = useState(allPrompts)
  const [activeTab, setActiveTab] = useState("featured")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [selectedPlatform, setSelectedPlatform] = useState("Todos")
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)

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
        // Para o combo 3, vamos adicionar os 3 primeiros em destaque
        bundleItems = [1, 2, 3]
        break
      case 'bundle-personal':
        // Todos os packs pessoais (IDs 1-6)
        bundleItems = [1, 2, 7, 8, 9, 10]
        break
      case 'bundle-professional':
        // Todos os packs profissionais (IDs 3-6, 11-14)
        bundleItems = [3, 4, 5, 6, 11, 12, 13, 14]
        break
      case 'bundle-complete':
        // Todos os packs
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
  
  // Nova estrutura de descontos escalonados
  const getDiscountInfo = (cart, prompts) => {
    const itemCount = cart.length
    const cartItems = prompts.filter(prompt => cart.includes(prompt.id))
    const personalItems = cartItems.filter(item => item.type === 'personal')
    const professionalItems = cartItems.filter(item => item.type === 'professional')
    
    // Bundle Completo (14 packs) - 60% desconto
    if (itemCount >= 14) {
      return { percentage: 0.6, type: 'Bundle Completo', description: '60% OFF - Todos os Packs!', color: 'bg-gradient-to-r from-purple-500 to-pink-500' }
    }
    
    // Bundle Profissional Completo (8 packs) - 55% desconto
    if (professionalItems.length >= 8) {
      return { percentage: 0.55, type: 'Bundle Profissional', description: '55% OFF - Profissional Completo!', color: 'bg-gradient-to-r from-blue-500 to-indigo-500' }
    }
    
    // Bundle Pessoal Completo (6 packs) - 50% desconto
    if (personalItems.length >= 6) {
      return { percentage: 0.5, type: 'Bundle Pessoal', description: '50% OFF - Pessoal Completo!', color: 'bg-gradient-to-r from-pink-500 to-red-500' }
    }
    
    // Combo 3 packs - 30% desconto
    if (itemCount >= 3) {
      return { percentage: 0.3, type: 'Combo 3 Packs', description: '30% OFF - Combo Especial!', color: 'bg-gradient-to-r from-green-500 to-emerald-500' }
    }
    
    return { percentage: 0, type: '', description: '', color: '' }
  }
  
  const discountInfo = getDiscountInfo(cart, allPrompts)
  const discount = cartTotal * discountInfo.percentage
  const finalTotal = cartTotal - discount

  if (showCheckout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => setShowCheckout(false)}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
            >
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              Voltar
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Finalizar Compra</h1>
          </div>
          
          <StripeCheckout
            cartItems={cart}
            total={finalTotal}
            onSuccess={(paymentIntent) => {
              alert('Pagamento realizado com sucesso! Verifique seu e-mail para receber os prompts.')
              setCart([])
              setShowCheckout(false)
            }}
          />
        </div>
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
                        onClick={() => {
                          setShowCart(false)
                          setShowCheckout(true)
                        }}
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
                <strong>Tudo começou com uma observação. E uma pergunta.</strong>
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">👁️</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-purple-600">A Observação</h3>
                <p className="text-gray-700">
                  O mundo via a Inteligência Artificial como uma ferramenta, um servo, ou pior, um rival. A narrativa era de substituição, de competição. Humano <em>versus</em> Máquina.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">❓</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-blue-600">A Pergunta</h3>
                <p className="text-gray-700">
                  <strong>E se todos estiverem errados?</strong> E se a IA não for uma ferramenta para ser usada, mas uma extensão para ser integrada? E se não for sobre competição, mas sobre <strong>co-evolução</strong>?
                </p>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center mb-12"
            >
              <p className="text-xl text-gray-700">
                Foi nesse questionamento que a SimbioIA nasceu. Não como uma empresa, mas como uma <strong className="text-purple-600">filosofia</strong>.
              </p>
            </motion.div>
            
            {/* Logo Explanation Section */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="bg-gradient-to-r from-purple-50 to-blue-50 p-8 rounded-3xl mb-8 border border-purple-100"
            >
              <h3 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                O Símbolo da Nossa Filosofia
              </h3>
              
              <div className="flex justify-center mb-8">
                <img src="/simbioia_logo_final_4k.png" alt="SimbioIA Logo" className="h-32 w-auto" />
              </div>
              
              <p className="text-center mb-8 text-lg text-gray-700">
                Nosso logo não é apenas um design. É a <strong>representação visual da nossa crença fundamental</strong>.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">🧠</span>
                  </div>
                  <h4 className="font-bold text-purple-600 mb-2">Hemisfério Humano</h4>
                  <p className="text-sm text-gray-600">
                    Criatividade, intuição, empatia. Padrões orgânicos e fluidos como nossos próprios pensamentos.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">⚡</span>
                  </div>
                  <h4 className="font-bold text-blue-600 mb-2">Conexão Central</h4>
                  <p className="text-sm text-gray-600">
                    A <strong>ponte</strong>. O ponto de fusão onde intuição encontra lógica. A verdadeira simbiose.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">🔧</span>
                  </div>
                  <h4 className="font-bold text-cyan-600 mb-2">Hemisfério IA</h4>
                  <p className="text-sm text-gray-600">
                    Lógica, velocidade, processamento. Linhas estruturadas e geométricas da computação pura.
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mb-8"
            >
              <h3 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Nosso Propósito
              </h3>
              <p className="text-center mb-6 text-lg text-gray-700">
                Nós não vendemos prompts. Nós oferecemos as <strong>chaves para essa simbiose</strong>.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Cada produto que criamos é projetado para ser um catalisador para essa conexão. Uma forma de traduzir suas intenções humanas para a linguagem da IA, permitindo que ela se torne uma verdadeira parceira no seu processo criativo e produtivo.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="text-center mb-8"
            >
              <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                Nossa missão é mudar a narrativa.
              </p>
              <p className="text-xl text-gray-700">
                Sair da era da "utilização" da IA para entrar na era da <strong>simbiose com a IA</strong>.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.6 }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-3xl text-center"
            >
              <p className="text-2xl font-bold mb-2">
                Bem-vindo à SimbioIA.
              </p>
              <p className="text-xl">
                Bem-vindo à próxima etapa da sua evolução.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Prompt Comparison Animation */}
      <PromptComparison />

      {/* Main Content with Tabs */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="grid w-full max-w-md grid-cols-3 h-12">
                <TabsTrigger value="featured" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Destaques
                </TabsTrigger>
                <TabsTrigger value="personal" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Pessoal
                </TabsTrigger>
                <TabsTrigger value="professional" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Profissional
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar soluções..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {(activeTab === "personal" ? categories.personal : 
                      activeTab === "professional" ? categories.professional : 
                      ["Todos"]).map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder="Plataforma" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map(platform => (
                      <SelectItem key={platform} value={platform}>
                        {platform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros Avançados
                </Button>
              </div>
            </div>

            {/* Tab Contents */}
            <TabsContent value="featured">
              <div className="text-center mb-12">
                <h3 className="text-4xl font-bold mb-4">
                  <Sparkles className="inline h-8 w-8 text-yellow-500 mr-2" />
                  Soluções em Destaque
                </h3>
                <p className="text-xl text-gray-600">
                  Os assistentes de IA mais populares e eficazes
                </p>
              </div>
              <PromptGrid prompts={filteredPrompts} cart={cart} addToCart={addToCart} />
            </TabsContent>

            <TabsContent value="personal">
              <div className="text-center mb-12">
                <h3 className="text-4xl font-bold mb-4">
                  <Heart className="inline h-8 w-8 text-red-500 mr-2" />
                  Resolva o dia a dia com um toque de gênio
                </h3>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
                  De planejar a viagem dos sonhos a organizar suas finanças e aprender um novo idioma. 
                  Nossos assistentes para o dia a dia são a forma mais inteligente de simplificar a vida.
                </p>
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 max-w-2xl mx-auto border border-pink-200">
                  <p className="text-pink-800 font-semibold">
                    💡 "A vida é complexa. Suas soluções não precisam ser."
                  </p>
                  <p className="text-pink-600 text-sm mt-2">
                    Tenha mais tempo para viver e menos tempo para se preocupar.
                  </p>
                </div>
              </div>
              <PromptGrid prompts={filteredPrompts} cart={cart} addToCart={addToCart} />
            </TabsContent>

            <TabsContent value="professional">
              <div className="text-center mb-12">
                <h3 className="text-4xl font-bold mb-4">
                  <Target className="inline h-8 w-8 text-blue-500 mr-2" />
                  Performance máxima para sua carreira
                </h3>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
                  Marketing, vendas, programação, direito ou gestão. Nossos pacotes profissionais são desenhados 
                  para as profissões mais exigentes. Automatize tarefas e entregue resultados que te colocam à frente no mercado.
                </p>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 max-w-2xl mx-auto border border-blue-200">
                  <p className="text-blue-800 font-semibold">
                    🚀 "Entregue em um dia o que seus concorrentes levam uma semana."
                  </p>
                  <p className="text-blue-600 text-sm mt-2">
                    A vantagem competitiva que não aparece na sua folha de pagamento.
                  </p>
                </div>
              </div>
              <PromptGrid prompts={filteredPrompts} cart={cart} addToCart={addToCart} />
            </TabsContent>
          </Tabs>

          {filteredPrompts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Nenhuma solução encontrada com os filtros selecionados.</p>
            </div>
          )}
        </div>
      </section>

      {/* Bundle Section */}
      <BundleSection onAddBundle={addBundle} />

      {/* Examples Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-6">
              <BookOpen className="inline h-8 w-8 text-green-600 mr-2" />
              Veja o Poder dos Nossos Prompts em Ação
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Antes de comprar, veja exemplos reais de como nossos prompts transformam perguntas simples em resultados extraordinários.
            </p>
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 max-w-2xl mx-auto border border-green-200">
              <p className="text-green-800 font-semibold">
                🎯 "Transforme comandos genéricos em resultados extraordinários."
              </p>
            </div>
          </div>

          <Tabs defaultValue="personal-examples" className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="grid w-full max-w-md grid-cols-2 h-12">
                <TabsTrigger value="personal-examples" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Uso Pessoal
                </TabsTrigger>
                <TabsTrigger value="professional-examples" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Uso Profissional
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="personal-examples">
              <div className="grid md:grid-cols-2 gap-8">
                <ExampleCard
                  title="Planejador de Fim de Semana Perfeito"
                  description="Crie roteiros equilibrados entre lazer e produtividade"
                  icon="🗓️"
                  preview="Atue como um planejador de vida e bem-estar. Meu objetivo é ter um fim de semana equilibrado em [CIDADE], com um orçamento de R$ [VALOR]..."
                  benefits={["Roteiros personalizados", "Equilíbrio vida-trabalho", "Sugestões de orçamento"]}
                />
                <ExampleCard
                  title="Resumo Inteligente de Livro"
                  description="Extraia os conceitos principais de qualquer livro em minutos"
                  icon="📚"
                  preview="Você é um especialista em aprendizado acelerado. Quero um resumo do livro '[NOME DO LIVRO]' de [AUTOR]..."
                  benefits={["Aprendizado acelerado", "Conceitos estruturados", "Aplicação prática"]}
                />
                <ExampleCard
                  title="Coach de Relacionamentos"
                  description="Prepare conversas difíceis com técnicas de comunicação não-violenta"
                  icon="💬"
                  preview="Atue como um coach de comunicação e inteligência emocional. Preciso ter uma conversa difícil com [PESSOA]..."
                  benefits={["Comunicação assertiva", "Resolução de conflitos", "Relacionamentos saudáveis"]}
                />
                <ExampleCard
                  title="Consultor Financeiro Pessoal"
                  description="Organize suas finanças e crie planos de economia personalizados"
                  icon="💰"
                  preview="Você é um consultor financeiro especializado em pessoas físicas. Minha renda mensal é R$ [VALOR]..."
                  benefits={["Controle de gastos", "Planejamento financeiro", "Metas de economia"]}
                />
              </div>
            </TabsContent>

            <TabsContent value="professional-examples">
              <div className="grid md:grid-cols-2 gap-8">
                <ExampleCard
                  title="Post Viral para LinkedIn"
                  description="Crie conteúdo que gera engajamento e posiciona você como autoridade"
                  icon="📈"
                  preview="Você é um especialista em marketing de conteúdo e copywriting para o LinkedIn. Meu objetivo é criar um post com alto potencial..."
                  benefits={["Alto engajamento", "Autoridade no nicho", "Networking profissional"]}
                />
                <ExampleCard
                  title="E-mail de Prospecção Eficaz"
                  description="Cold mails personalizados que geram respostas e oportunidades"
                  icon="📧"
                  preview="Atue como um especialista em vendas B2B (SDR). Preciso de um template de e-mail de prospecção..."
                  benefits={["Alta taxa de resposta", "Personalização eficaz", "Geração de leads"]}
                />
                <ExampleCard
                  title="Análise SWOT Estratégica"
                  description="Tome decisões de negócio com análises estruturadas e profissionais"
                  icon="📊"
                  preview="Você é um consultor de negócios sênior. Quero fazer uma análise SWOT para uma nova iniciativa..."
                  benefits={["Decisões estratégicas", "Análise profissional", "Redução de riscos"]}
                />
                <ExampleCard
                  title="Apresentação de Vendas"
                  description="Estruture pitches persuasivos que fecham negócios"
                  icon="🎯"
                  preview="Atue como um especialista em vendas consultivas. Preciso estruturar uma apresentação para [CLIENTE]..."
                  benefits={["Fechamento de vendas", "Argumentação sólida", "Objeções antecipadas"]}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="text-center mt-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-3xl mx-auto">
              <h4 className="text-2xl font-bold mb-4 text-gray-800">
                Isso é Apenas o Começo
              </h4>
              <p className="text-gray-600 mb-6">
                Cada pacote da SimbioIA contém <strong>20-50 prompts</strong> como esses, testados e otimizados para resultados máximos. 
                Além dos prompts, você recebe <strong>guias de uso</strong> e <strong>variações para diferentes contextos</strong>.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center bg-green-50 rounded-full px-4 py-2">
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">Prompts Testados</span>
                </div>
                <div className="flex items-center bg-blue-50 rounded-full px-4 py-2">
                  <Check className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-blue-800 font-medium">Guias de Uso</span>
                </div>
                <div className="flex items-center bg-purple-50 rounded-full px-4 py-2">
                  <Check className="h-4 w-4 text-purple-600 mr-2" />
                  <span className="text-purple-800 font-medium">Variações Incluídas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <h3 className="text-4xl font-bold mb-6">
            Não espere pelo futuro. Construa-o com um clique.
          </h3>
          <p className="text-xl mb-4 opacity-90">
            Junte-se a mais de 15.000 pessoas que já transformaram sua produtividade com a SimbioIA
          </p>
          <div className="bg-white/10 rounded-xl p-4 mb-8 max-w-2xl mx-auto">
            <p className="text-lg font-semibold mb-2">
              ⚡ "Invista R$ 9,99. Economize 10 horas de trabalho."
            </p>
            <p className="text-sm opacity-80">
              A sua próxima grande ideia está a um prompt de distância.
            </p>
          </div>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
            <Zap className="h-5 w-5 mr-2" />
            Desbloqueie o Poder da IA
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="/simbioia_logo_final_4k.png" alt="SimbioIA Logo" className="h-10 w-auto" />
                <span className="text-xl font-bold">SimbioIA</span>
              </div>
              <p className="text-gray-400">
                Sua simbiose com a Inteligência Artificial. Não substituímos sua inteligência - amplificamos ela.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Soluções</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Uso Pessoal</li>
                <li>Uso Profissional</li>
                <li>Empresas</li>
                <li>Educação</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Plataformas</h4>
              <ul className="space-y-2 text-gray-400">
                <li>ChatGPT</li>
                <li>Gemini</li>
                <li>Manus</li>
                <li>Midjourney</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Central de Ajuda</li>
                <li>Contato</li>
                <li>Política de Privacidade</li>
                <li>Termos de Uso</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 SimbioIA. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Componente para cards de exemplo
function ExampleCard({ title, description, icon, preview, benefits }) {
  const [showPreview, setShowPreview] = useState(false)

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{icon}</span>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="text-sm">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Preview do Prompt:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="text-xs"
              >
                {showPreview ? 'Ocultar' : 'Ver Mais'}
              </Button>
            </div>
            <p className="text-xs text-gray-600 font-mono leading-relaxed">
              {showPreview ? preview : `${preview.substring(0, 80)}...`}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Benefícios:</p>
            <div className="space-y-1">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center text-sm text-gray-600">
                  <Check className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full text-center">
          <p className="text-xs text-gray-500 mb-2">
            Este é apenas 1 dos 20-50 prompts incluídos no pacote
          </p>
          <Badge variant="outline" className="text-xs">
            Exemplo Gratuito
          </Badge>
        </div>
      </CardFooter>
    </Card>
  )
}

// Componente para grid de prompts
function PromptGrid({ prompts, cart, addToCart }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {prompts.map((prompt, index) => (
        <motion.div
          key={prompt.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
        >
          <Card className={`h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
            prompt.featured ? 'border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50' : ''
          }`}>
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{prompt.icon}</span>
                  <Badge variant="secondary">{prompt.platform}</Badge>
                </div>
                {prompt.featured && (
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                    DESTAQUE
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg">{prompt.title}</CardTitle>
              <CardDescription>{prompt.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="ml-1 text-sm font-medium">{prompt.rating}</span>
                  <span className="ml-2 text-sm text-gray-500">({prompt.sales})</span>
                </div>
                <span className="text-xl font-bold text-green-600">R$ {prompt.price}</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-4">
                {prompt.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="space-y-1">
                {prompt.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center text-sm text-gray-600">
                    <Check className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                    {benefit}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                variant={cart.includes(prompt.id) ? "secondary" : "default"}
                onClick={() => addToCart(prompt.id)}
                disabled={cart.includes(prompt.id)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {cart.includes(prompt.id) ? 'No Carrinho' : 'Adicionar ao Carrinho'}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
// Componente para alternar frases no hero section
const AnimatedText = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const phrases = [
    {
      title: "⚡ A IA não é o futuro. É o agora.",
      subtitle: "Horas de trabalho, resolvidas em segundos. Um bom prompt é a diferença entre uma ferramenta e um gênio."
    },
    {
      title: "🚀 Sua próxima ideia brilhante está a um prompt de distância.",
      subtitle: "Transforme pensamentos em resultados. A simbiose perfeita entre sua criatividade e o poder da IA."
    },
    {
      title: "🧠 Pare de usar IA. Comece a viver em simbiose com ela.",
      subtitle: "Cada prompt é uma ponte. Cada resultado, uma evolução. Bem-vindo ao futuro da inteligência colaborativa."
    },
    {
      title: "💡 A revolução não é a IA substituir você. É você e a IA, juntos, sendo imparáveis.",
      subtitle: "Amplifique sua genialidade. Acelere seus resultados. Descubra o poder da parceria inteligente."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, 4000); // Alterna a cada 4 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      key={currentIndex}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-lg font-bold text-orange-800 mb-2">
        {phrases[currentIndex].title}
      </p>
      <p className="text-orange-700">
        <strong>{phrases[currentIndex].subtitle.split('.')[0]}.</strong> {phrases[currentIndex].subtitle.split('.').slice(1).join('.')}
      </p>
    </motion.div>
  );
};

export default App;

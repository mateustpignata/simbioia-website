import React, { useState, useEffect } from 'react'
import { ShoppingCart, Check, Users, TrendingUp, Clock, Star, Zap, Target, Brain, Lightbulb, ArrowRight, Play, ChevronDown, Menu, X, Shield, Award, Sparkles } from 'lucide-react'
import './App.css'

// Componente Button profissional
const Button = ({ children, variant = "primary", size = "md", className = "", onClick, disabled = false, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 focus:ring-blue-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
    secondary: "bg-white text-gray-900 border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 focus:ring-blue-500",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500",
    ghost: "text-gray-600 hover:text-blue-600 hover:bg-blue-50 focus:ring-blue-500"
  }
  
  const sizes = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-xl",
    lg: "px-8 py-4 text-lg rounded-xl"
  }
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

// Componente Badge profissional
const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-blue-100 text-blue-800 border border-blue-200",
    success: "bg-green-100 text-green-800 border border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    purple: "bg-purple-100 text-purple-800 border border-purple-200"
  }
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

// Componente Card profissional
const Card = ({ children, className = "", hover = true }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden ${hover ? 'hover:shadow-2xl hover:-translate-y-1 transition-all duration-300' : ''} ${className}`}>
      {children}
    </div>
  )
}

// Componente de animação de texto
const AnimatedText = () => {
  const phrases = [
    "Transforme ideias em resultados",
    "Acelere sua produtividade",
    "Domine a arte da persuasão",
    "Crie conteúdo que converte",
    "Automatize seu sucesso"
  ]
  
  const [currentPhrase, setCurrentPhrase] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentPhrase((prev) => (prev + 1) % phrases.length)
        setIsVisible(true)
      }, 300)
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <span className={`transition-all duration-300 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'}`}>
      {phrases[currentPhrase]}
    </span>
  )
}

function App() {
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Dados dos prompts expandidos
  const prompts = [
    {
      id: 1,
      title: "Pack Marketing Digital Completo",
      description: "50 prompts profissionais para criar campanhas de marketing irresistíveis que convertem",
      price: 29.99,
      originalPrice: 59.99,
      category: "Marketing",
      rating: 4.9,
      sales: 2847,
      image: "🎯",
      features: ["Campanhas de Email", "Posts para Redes Sociais", "Anúncios Pagos", "Copy Persuasivo"],
      badge: "Mais Vendido"
    },
    {
      id: 2,
      title: "SEO e Blog Content Master",
      description: "Prompts especializados para criar conteúdo otimizado que ranqueia no Google",
      price: 24.99,
      originalPrice: 49.99,
      category: "Marketing",
      rating: 4.8,
      sales: 1892,
      image: "📈",
      features: ["Artigos SEO", "Meta Descriptions", "Títulos Virais", "Palavras-chave"],
      badge: "Novo"
    },
    {
      id: 3,
      title: "Scripts de Vendas Profissionais",
      description: "Prompts para criar scripts de vendas que convertem prospects em clientes",
      price: 34.99,
      originalPrice: 69.99,
      category: "Vendas",
      rating: 4.9,
      sales: 3156,
      image: "💰",
      features: ["Scripts de Ligação", "Follow-up", "Objeções", "Fechamento"],
      badge: "Premium"
    },
    {
      id: 4,
      title: "Produtividade e Automação",
      description: "Prompts para automatizar tarefas e aumentar sua produtividade em 300%",
      price: 19.99,
      originalPrice: 39.99,
      category: "Produtividade",
      rating: 4.7,
      sales: 1654,
      image: "⚡",
      features: ["Automação de Tarefas", "Planejamento", "Relatórios", "Análises"],
      badge: "Oferta"
    },
    {
      id: 5,
      title: "E-commerce e Conversão",
      description: "Prompts especializados para aumentar vendas e conversões em lojas online",
      price: 27.99,
      originalPrice: 55.99,
      category: "E-commerce",
      rating: 4.8,
      sales: 987,
      image: "🛒",
      features: ["Descrições de Produtos", "Páginas de Vendas", "Emails de Carrinho", "Upsells"],
      badge: "Trending"
    },
    {
      id: 6,
      title: "Criação de Conteúdo Viral",
      description: "Prompts para criar conteúdo que engaja, viraliza e constrói audiência",
      price: 22.99,
      originalPrice: 45.99,
      category: "Conteúdo",
      rating: 4.6,
      sales: 756,
      image: "🚀",
      features: ["Posts Virais", "Stories", "Reels", "Threads"],
      badge: "Criativo"
    }
  ]

  const addToCart = (prompt) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === prompt.id)
      if (exists) return prev
      return [...prev, prompt]
    })
  }

  const removeFromCart = (promptId) => {
    setCart(prev => prev.filter(item => item.id !== promptId))
  }

  const getTotalPrice = () => {
    const subtotal = cart.reduce((total, item) => total + item.price, 0)
    let discount = 0
    
    if (cart.length >= 2) discount = 0.15
    if (cart.length >= 3) discount = 0.25
    if (cart.length >= 4) discount = 0.35
    if (cart.length >= 5) discount = 0.45
    if (cart.length >= 6) discount = 0.55
    
    return {
      subtotal: subtotal.toFixed(2),
      discount: (subtotal * discount).toFixed(2),
      total: (subtotal * (1 - discount)).toFixed(2),
      discountPercent: Math.round(discount * 100)
    }
  }

  const badgeColors = {
    "Mais Vendido": "bg-red-100 text-red-800 border-red-200",
    "Novo": "bg-green-100 text-green-800 border-green-200",
    "Premium": "bg-purple-100 text-purple-800 border-purple-200",
    "Oferta": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Trending": "bg-blue-100 text-blue-800 border-blue-200",
    "Criativo": "bg-pink-100 text-pink-800 border-pink-200"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header Profissional */}
      <header className="bg-white/95 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SimbioIA
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">Prompts Profissionais de IA</p>
              </div>
            </div>
            
            {/* Navigation Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#prompts" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Prompts</a>
              <a href="#sobre" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Sobre</a>
              <a href="#depoimentos" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Depoimentos</a>
              <a href="#contato" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Contato</a>
            </nav>
            
            {/* Cart & Mobile Menu */}
            <div className="flex items-center space-x-4">
              <Button 
                variant="secondary" 
                size="sm"
                className="relative"
                onClick={() => setShowCart(!showCart)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Carrinho</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Button>
              
              <button 
                className="md:hidden p-2 text-gray-600 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-1">
              <a href="#prompts" className="block px-3 py-2 text-gray-600 hover:text-blue-600 font-medium">Prompts</a>
              <a href="#sobre" className="block px-3 py-2 text-gray-600 hover:text-blue-600 font-medium">Sobre</a>
              <a href="#depoimentos" className="block px-3 py-2 text-gray-600 hover:text-blue-600 font-medium">Depoimentos</a>
              <a href="#contato" className="block px-3 py-2 text-gray-600 hover:text-blue-600 font-medium">Contato</a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section Profissional */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6">
              <Badge variant="purple" className="mb-4">
                <Sparkles className="h-3 w-3 mr-1" />
                Mais de 15.000 profissionais confiam
              </Badge>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-6">
              <span className="block">Sua mente,</span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                amplificada
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 mb-4 max-w-4xl mx-auto font-medium">
              <AnimatedText />
            </p>
            
            <p className="text-lg text-gray-500 mb-12 max-w-3xl mx-auto leading-relaxed">
              Descubra o poder dos prompts profissionais que transformam sua interação com IA em resultados extraordinários. 
              Criados por especialistas, testados por milhares de profissionais.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button size="lg" className="w-full sm:w-auto">
                <Play className="h-5 w-5 mr-2" />
                Explorar Prompts
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                <Shield className="h-5 w-5 mr-2" />
                Garantia 30 dias
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mx-auto mb-3">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">15.000+</div>
                <div className="text-sm text-gray-500">Usuários Ativos</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">300%</div>
                <div className="text-sm text-gray-500">Aumento Produtividade</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mx-auto mb-3">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">4.9/5</div>
                <div className="text-sm text-gray-500">Avaliação Média</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mx-auto mb-3">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-500">Acesso Imediato</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prompts Section */}
      <section id="prompts" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
              Prompts <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Profissionais</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cada prompt foi cuidadosamente desenvolvido e testado por especialistas para garantir resultados excepcionais
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {prompts.map((prompt) => (
              <Card key={prompt.id} className="relative group">
                {/* Badge */}
                {prompt.badge && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${badgeColors[prompt.badge]}`}>
                      {prompt.badge}
                    </span>
                  </div>
                )}
                
                <div className="p-6">
                  {/* Icon & Category */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">{prompt.image}</div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="default">{prompt.category}</Badge>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{prompt.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {prompt.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {prompt.description}
                  </p>
                  
                  {/* Features */}
                  <div className="mb-6">
                    <div className="grid grid-cols-2 gap-2">
                      {prompt.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-500">
                          <Check className="h-3 w-3 text-green-500 mr-1 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Pricing */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-blue-600">R$ {prompt.price}</span>
                        <span className="text-lg text-gray-400 line-through">R$ {prompt.originalPrice}</span>
                      </div>
                      <div className="text-sm text-gray-500">{prompt.sales} vendas</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">
                        {Math.round(((prompt.originalPrice - prompt.price) / prompt.originalPrice) * 100)}% OFF
                      </div>
                    </div>
                  </div>
                  
                  {/* Add to Cart Button */}
                  <Button 
                    className="w-full group"
                    onClick={() => addToCart(prompt)}
                    disabled={cart.some(item => item.id === prompt.id)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {cart.some(item => item.id === prompt.id) ? 'Adicionado' : 'Adicionar ao Carrinho'}
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Seu Carrinho</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowCart(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Seu carrinho está vazio</p>
                  <p className="text-gray-400 text-sm mt-2">Adicione alguns prompts incríveis!</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                        <div className="text-2xl">{item.image}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm">{item.title}</h4>
                          <p className="text-blue-600 font-bold">R$ {item.price}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  {/* Discount Info */}
                  {cart.length >= 2 && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                      <div className="flex items-center">
                        <Check className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-green-800 font-medium">
                          Desconto de {getTotalPrice().discountPercent}% aplicado!
                        </span>
                      </div>
                      {cart.length < 6 && (
                        <p className="text-green-700 text-sm mt-1">
                          Adicione mais {6 - cart.length} item(s) para 55% de desconto
                        </p>
                      )}
                    </div>
                  )}
                  
                  {/* Pricing Summary */}
                  <div className="border-t border-gray-200 pt-6">
                    {(() => {
                      const pricing = getTotalPrice()
                      return (
                        <>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-medium">R$ {pricing.subtotal}</span>
                          </div>
                          {pricing.discountPercent > 0 && (
                            <div className="flex justify-between mb-2 text-green-600">
                              <span>Desconto ({pricing.discountPercent}%):</span>
                              <span className="font-medium">-R$ {pricing.discount}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-bold text-xl border-t border-gray-200 pt-4 mb-6">
                            <span>Total:</span>
                            <span className="text-blue-600">R$ {pricing.total}</span>
                          </div>
                        </>
                      )
                    })()}
                    
                    <Button size="lg" className="w-full mb-4">
                      <Shield className="h-5 w-5 mr-2" />
                      Finalizar Compra Segura
                    </Button>
                    
                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        🔒 Pagamento 100% seguro • Garantia de 30 dias
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">SimbioIA</h3>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Transformando a forma como profissionais interagem com Inteligência Artificial através de prompts especializados e resultados comprovados.
              </p>
              <div className="flex space-x-4">
                <div className="flex items-center text-sm text-gray-400">
                  <Shield className="h-4 w-4 mr-2" />
                  Pagamento Seguro
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <Award className="h-4 w-4 mr-2" />
                  Garantia 30 dias
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produtos</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Prompts de Marketing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Scripts de Vendas</a></li>
                <li><a href="#" className="hover:text-white transition-colors">SEO & Conteúdo</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Produtividade</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 SimbioIA. Todos os direitos reservados. Feito com ❤️ para profissionais que buscam excelência.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

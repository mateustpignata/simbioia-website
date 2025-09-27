import React, { useState, useEffect } from 'react'
import { ShoppingCart, Check, User, Star, ArrowRight, Zap, Shield, Clock, Award, Play, X, Plus, Minus } from 'lucide-react'

const SimbioIA = () => {
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  // Dados dos produtos
  const products = [
    {
      id: 1,
      title: "Pack Marketing Digital Completo",
      description: "50 prompts profissionais para criar campanhas de marketing irresistíveis",
      category: "Marketing",
      platform: "ChatGPT",
      price: 9.99,
      originalPrice: 29.99,
      rating: 4.9,
      sales: 2847,
      badge: "Mais Vendido",
      badgeColor: "bg-red-500",
      features: ["50 prompts testados", "Guia de uso", "Exemplos práticos", "Suporte 30 dias"],
      image: "/api/placeholder/300/200"
    },
    {
      id: 2,
      title: "SEO e Blog Content Master",
      description: "Prompts especializados para criar conteúdo otimizado para SEO",
      category: "Conteúdo",
      platform: "ChatGPT",
      price: 9.99,
      originalPrice: 24.99,
      rating: 4.8,
      sales: 1923,
      badge: "Novo",
      badgeColor: "bg-green-500",
      features: ["40 prompts SEO", "Templates prontos", "Checklist completo", "Atualizações grátis"],
      image: "/api/placeholder/300/200"
    },
    {
      id: 3,
      title: "Scripts de Vendas Profissionais",
      description: "Prompts para criar scripts de vendas que convertem",
      category: "Vendas",
      platform: "ChatGPT",
      price: 9.99,
      originalPrice: 34.99,
      rating: 4.9,
      sales: 3156,
      badge: "Premium",
      badgeColor: "bg-purple-500",
      features: ["60 scripts testados", "Técnicas avançadas", "Casos de sucesso", "Garantia 60 dias"],
      image: "/api/placeholder/300/200"
    },
    {
      id: 4,
      title: "E-commerce Growth Hacks",
      description: "Prompts para otimizar vendas e conversões em e-commerce",
      category: "E-commerce",
      platform: "Gemini",
      price: 9.99,
      originalPrice: 27.99,
      rating: 4.7,
      sales: 1456,
      badge: "Trending",
      badgeColor: "bg-orange-500",
      features: ["35 prompts únicos", "Estratégias comprovadas", "Templates de email", "Bonus exclusivos"],
      image: "/api/placeholder/300/200"
    },
    {
      id: 5,
      title: "Criação de Conteúdo Visual",
      description: "Prompts para Midjourney e DALL-E com resultados profissionais",
      category: "Design",
      platform: "Midjourney",
      price: 9.99,
      originalPrice: 39.99,
      rating: 4.8,
      sales: 2234,
      badge: "Exclusivo",
      badgeColor: "bg-pink-500",
      features: ["80 prompts visuais", "Estilos variados", "Guia completo", "Galeria de exemplos"],
      image: "/api/placeholder/300/200"
    },
    {
      id: 6,
      title: "Automação Inteligente",
      description: "Prompts para automatizar processos e aumentar produtividade",
      category: "Automação",
      platform: "Manus",
      price: 9.99,
      originalPrice: 32.99,
      rating: 4.9,
      sales: 1789,
      badge: "Pro",
      badgeColor: "bg-blue-500",
      features: ["45 automações", "Fluxos completos", "Integração APIs", "Suporte técnico"],
      image: "/api/placeholder/300/200"
    }
  ]

  // Depoimentos
  const testimonials = [
    {
      name: "Carlos Silva",
      role: "CEO da TechStart",
      company: "TechStart",
      image: "/api/placeholder/80/80",
      text: "Os prompts da SimbioIA transformaram nossa produtividade. Economizamos mais de 20 horas por semana em criação de conteúdo."
    },
    {
      name: "Ana Costa",
      role: "Diretora de Marketing",
      company: "Growth Labs",
      image: "/api/placeholder/80/80",
      text: "Resultados incríveis! Nossas campanhas tiveram 300% mais engajamento usando os prompts profissionais."
    },
    {
      name: "Roberto Mendes",
      role: "Fundador",
      company: "E-commerce Pro",
      image: "/api/placeholder/80/80",
      text: "Investimento que se paga sozinho. Aumentamos nossas vendas em 150% no primeiro mês."
    }
  ]

  // Logos de empresas
  const companyLogos = [
    { name: "TechStart", logo: "/api/placeholder/120/40" },
    { name: "Growth Labs", logo: "/api/placeholder/120/40" },
    { name: "E-commerce Pro", logo: "/api/placeholder/120/40" },
    { name: "Digital Agency", logo: "/api/placeholder/120/40" },
    { name: "Marketing Plus", logo: "/api/placeholder/120/40" }
  ]

  // Rotação automática de depoimentos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Funções do carrinho
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId)
      return
    }
    setCart(prev => prev.map(item => 
      item.id === productId 
        ? { ...item, quantity: newQuantity }
        : item
    ))
  }

  const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0)
  const getTotalPrice = () => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const getDiscount = () => {
    const total = getTotalItems()
    if (total >= 5) return 0.20
    if (total >= 3) return 0.15
    if (total >= 2) return 0.10
    return 0
  }

  const finalPrice = getTotalPrice() * (1 - getDiscount())

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Barra Superior de Destaque */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 text-white py-2 text-center text-sm font-medium">
        <div className="flex items-center justify-center gap-2">
          <Zap className="w-4 h-4" />
          <span>🔥 OFERTA LIMITADA: 70% OFF em todos os prompts - Apenas hoje!</span>
          <Zap className="w-4 h-4" />
        </div>
      </div>

      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                  SimbioIA
                </h1>
                <p className="text-xs text-gray-400">Sua simbiose com a IA</p>
              </div>
            </div>

            {/* Navegação */}
            <nav className="hidden md:flex space-x-8">
              <a href="#produtos" className="text-gray-300 hover:text-cyan-400 transition-colors">
                Produtos
              </a>
              <a href="#sobre" className="text-gray-300 hover:text-cyan-400 transition-colors">
                Sobre
              </a>
              <a href="#depoimentos" className="text-gray-300 hover:text-cyan-400 transition-colors">
                Depoimentos
              </a>
              <a href="#contato" className="text-gray-300 hover:text-cyan-400 transition-colors">
                Contato
              </a>
            </nav>

            {/* CTAs */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-300 hover:text-white transition-colors">
                Login
              </button>
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Carrinho</span>
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20 overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-600/10"></div>
        <div className="absolute top-20 left-10 w-20 h-20 bg-cyan-500/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-600/20 rounded-full blur-xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Conteúdo */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Tudo o que você precisa de{' '}
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                    Prompts de IA
                  </span>
                  , em um só lugar
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Os melhores prompts profissionais, testados e aprovados por milhares de usuários - 
                  dentro de uma única plataforma com preço acessível.
                </p>
              </div>

              {/* Social Proof */}
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full border-2 border-gray-800"></div>
                    ))}
                  </div>
                  <span>Confiado por milhares de profissionais</span>
                </div>
                <div className="h-4 w-px bg-gray-600"></div>
                <span>15.000+ prompts vendidos</span>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => document.getElementById('produtos').scrollIntoView({ behavior: 'smooth' })}
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Ver Produtos</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="border border-gray-600 hover:border-gray-500 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-2">
                  <Play className="w-5 h-5" />
                  <span>Ver Demo</span>
                </button>
              </div>

              {/* Badges de Credibilidade */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 bg-gray-800/50 px-4 py-2 rounded-lg">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-sm">Garantia 30 dias</span>
                </div>
                <div className="flex items-center space-x-2 bg-gray-800/50 px-4 py-2 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span className="text-sm">Entrega instantânea</span>
                </div>
                <div className="flex items-center space-x-2 bg-gray-800/50 px-4 py-2 rounded-lg">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm">Prompts testados</span>
                </div>
              </div>
            </div>

            {/* Mockup */}
            <div className="relative">
              <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-2">Prompt Básico:</div>
                    <div className="text-gray-300">"Crie um anúncio para meu produto"</div>
                  </div>
                  <div className="bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-lg p-4 border border-cyan-500/30">
                    <div className="text-sm text-cyan-400 mb-2">Prompt Profissional SimbioIA:</div>
                    <div className="text-white">"Atue como um copywriter especialista em conversão. Crie um anúncio persuasivo para [produto] focando em [público-alvo], destacando [benefício principal] e incluindo gatilhos mentais de escassez e autoridade..."</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-400 font-semibold">+300% mais conversões</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos de Empresas */}
      <section className="py-12 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400 mb-8">
            Somos os criadores de prompts escolhidos por profissionais de empresas como
          </p>
          <div className="flex justify-center items-center space-x-12 opacity-60">
            {companyLogos.map((company, index) => (
              <div key={index} className="text-gray-500 font-bold text-lg">
                {company.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Produtos */}
      <section id="produtos" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Prompts <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">Profissionais</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Cada prompt foi testado e otimizado por especialistas para garantir resultados excepcionais
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200 group">
                {/* Badge */}
                <div className="flex justify-between items-start mb-4">
                  <span className={`${product.badgeColor} text-white text-xs px-3 py-1 rounded-full font-medium`}>
                    {product.badge}
                  </span>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-300">{product.rating}</span>
                    </div>
                    <div className="text-xs text-gray-500">{product.sales} vendas</div>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3">{product.description}</p>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="bg-gray-700 px-2 py-1 rounded">{product.category}</span>
                      <span className="bg-gray-700 px-2 py-1 rounded">{product.platform}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-400">
                        <Check className="w-4 h-4 text-green-400" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Preço */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-green-400">R$ {product.price}</span>
                        <span className="text-sm text-gray-500 line-through">R$ {product.originalPrice}</span>
                      </div>
                      <div className="text-xs text-gray-500">70% OFF</div>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Adicionar</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Depoimentos */}
      <section id="depoimentos" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Indicado por <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">Profissionais</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-900 rounded-2xl p-6 border border-gray-700 relative">
                {/* Aspas */}
                <div className="absolute top-4 left-4 text-6xl text-cyan-400/20 font-serif">"</div>
                
                <div className="relative z-10 space-y-4">
                  <p className="text-gray-300 leading-relaxed">{testimonial.text}</p>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-400">{testimonial.role}</div>
                      <div className="text-sm text-cyan-400">{testimonial.company}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                SimbioIA
              </h3>
            </div>
            <p className="text-gray-400 mb-4">Transformando a forma como você interage com a Inteligência Artificial</p>
            <p className="text-sm text-gray-500">© 2025 SimbioIA. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Carrinho Lateral */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsCartOpen(false)}></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-gray-800 shadow-xl">
            <div className="flex flex-col h-full">
              {/* Header do Carrinho */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h3 className="text-lg font-semibold">Seu Carrinho</h3>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Itens do Carrinho */}
              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="text-center text-gray-400 mt-8">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Seu carrinho está vazio</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="bg-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-sm">{item.title}</h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-400"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-semibold">R$ {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Resumo e Checkout */}
              {cart.length > 0 && (
                <div className="border-t border-gray-700 p-6 space-y-4">
                  {/* Desconto */}
                  {getDiscount() > 0 && (
                    <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                      <div className="text-green-400 text-sm font-medium">
                        🎉 Desconto de {(getDiscount() * 100).toFixed(0)}% aplicado!
                      </div>
                      <div className="text-xs text-green-300 mt-1">
                        {getTotalItems() >= 5 ? 'Compra de 5+ produtos' : 
                         getTotalItems() >= 3 ? 'Compra de 3+ produtos' : 
                         'Compra de 2+ produtos'}
                      </div>
                    </div>
                  )}

                  {/* Totais */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>R$ {getTotalPrice().toFixed(2)}</span>
                    </div>
                    {getDiscount() > 0 && (
                      <div className="flex justify-between text-sm text-green-400">
                        <span>Desconto:</span>
                        <span>-R$ {(getTotalPrice() * getDiscount()).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg border-t border-gray-600 pt-2">
                      <span>Total:</span>
                      <span className="text-green-400">R$ {finalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Botão de Checkout */}
                  <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 py-3 rounded-lg font-semibold transition-all duration-200">
                    Finalizar Compra
                  </button>

                  {/* Garantias */}
                  <div className="text-xs text-gray-400 text-center space-y-1">
                    <div>🔒 Pagamento 100% seguro</div>
                    <div>📱 Entrega instantânea por email</div>
                    <div>✅ Garantia de 30 dias</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SimbioIA

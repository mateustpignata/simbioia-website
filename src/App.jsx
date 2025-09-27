import React, { useState } from 'react'
import { ShoppingCart, Star, Check, X, Plus, Minus, Zap, Shield, Clock } from 'lucide-react'

const SimbioIA = () => {
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Produtos reais (você pode editar depois)
  const products = [
    {
      id: 1,
      title: "Pack Marketing Digital",
      description: "Prompts profissionais para campanhas de marketing",
      category: "Marketing",
      price: 9.99,
      originalPrice: 29.99,
      rating: 4.8,
      features: ["50+ prompts testados", "Guia de uso", "Exemplos práticos"]
    },
    {
      id: 2,
      title: "SEO e Conteúdo",
      description: "Prompts para criar conteúdo otimizado",
      category: "SEO",
      price: 9.99,
      originalPrice: 24.99,
      rating: 4.7,
      features: ["40+ prompts SEO", "Templates prontos", "Checklist"]
    },
    {
      id: 3,
      title: "Scripts de Vendas",
      description: "Prompts para scripts que convertem",
      category: "Vendas",
      price: 9.99,
      originalPrice: 34.99,
      rating: 4.9,
      features: ["60+ scripts", "Técnicas avançadas", "Casos práticos"]
    },
    {
      id: 4,
      title: "E-commerce Growth",
      description: "Prompts para otimizar vendas online",
      category: "E-commerce",
      price: 9.99,
      originalPrice: 27.99,
      rating: 4.6,
      features: ["35+ prompts únicos", "Estratégias testadas", "Templates"]
    },
    {
      id: 5,
      title: "Conteúdo Visual",
      description: "Prompts para Midjourney e DALL-E",
      category: "Design",
      price: 9.99,
      originalPrice: 39.99,
      rating: 4.8,
      features: ["80+ prompts visuais", "Estilos variados", "Exemplos"]
    },
    {
      id: 6,
      title: "Automação Inteligente",
      description: "Prompts para automatizar processos",
      category: "Automação",
      price: 9.99,
      originalPrice: 32.99,
      rating: 4.7,
      features: ["45+ automações", "Fluxos completos", "Integração"]
    }
  ]

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
  
  // Desconto progressivo
  const getDiscount = () => {
    const total = getTotalItems()
    if (total >= 3) return 0.15 // 15% para 3+
    if (total >= 2) return 0.10 // 10% para 2+
    return 0
  }

  const finalPrice = getTotalPrice() * (1 - getDiscount())

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-violet-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">SimbioIA</h1>
                <p className="text-xs text-purple-200">Prompts Profissionais</p>
              </div>
            </div>

            {/* Carrinho */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 flex items-center space-x-2 shadow-lg"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Carrinho</span>
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Prompts de IA que{' '}
              <span className="bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
                Realmente Funcionam
              </span>
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
              Economize horas de trabalho com prompts testados e otimizados para resultados profissionais
            </p>
          </div>

          {/* Badges de Credibilidade */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-white font-medium">Garantia 30 dias</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium">Entrega instantânea</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-medium">Prompts testados</span>
              </div>
            </div>
          </div>

          {/* CTA Principal */}
          <button 
            onClick={() => document.getElementById('produtos').scrollIntoView({ behavior: 'smooth' })}
            className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 px-8 py-4 rounded-xl font-bold text-lg text-white transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            Ver Produtos Disponíveis
          </button>
        </div>
      </section>

      {/* Seção de Produtos */}
      <section id="produtos" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Nossos <span className="bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">Produtos</span>
            </h2>
            <p className="text-xl text-purple-100">Escolha o pack ideal para suas necessidades</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-200 hover:transform hover:scale-105">
                {/* Header do Card */}
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-gradient-to-r from-pink-500 to-violet-500 text-white text-sm px-3 py-1 rounded-full font-medium">
                    {product.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white text-sm font-medium">{product.rating}</span>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{product.title}</h3>
                    <p className="text-purple-100 text-sm">{product.description}</p>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-purple-100 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Preço */}
                  <div className="pt-4 border-t border-white/20">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-green-400">R$ {product.price}</span>
                          <span className="text-sm text-purple-300 line-through">R$ {product.originalPrice}</span>
                        </div>
                        <div className="text-xs text-green-300">67% de desconto</div>
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 py-3 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Adicionar ao Carrinho</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-md border-t border-white/20 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-violet-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <h3 className="text-xl font-bold text-white">SimbioIA</h3>
          </div>
          <p className="text-purple-200 mb-4">Prompts profissionais para maximizar sua produtividade com IA</p>
          <p className="text-sm text-purple-300">© 2025 SimbioIA. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* Carrinho Lateral */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white/10 backdrop-blur-md shadow-xl border-l border-white/20">
            <div className="flex flex-col h-full">
              {/* Header do Carrinho */}
              <div className="flex items-center justify-between p-6 border-b border-white/20">
                <h3 className="text-lg font-semibold text-white">Seu Carrinho</h3>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-purple-200 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Itens do Carrinho */}
              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="text-center text-purple-200 mt-8">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Seu carrinho está vazio</p>
                    <p className="text-sm mt-2">Adicione alguns produtos para começar</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="bg-white/10 rounded-xl p-4 border border-white/20">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-white text-sm">{item.title}</h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-purple-300 hover:text-red-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                            >
                              <Minus className="w-4 h-4 text-white" />
                            </button>
                            <span className="w-8 text-center text-white font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                            >
                              <Plus className="w-4 h-4 text-white" />
                            </button>
                          </div>
                          <span className="font-semibold text-green-400">R$ {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Resumo e Checkout */}
              {cart.length > 0 && (
                <div className="border-t border-white/20 p-6 space-y-4">
                  {/* Desconto */}
                  {getDiscount() > 0 && (
                    <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-3">
                      <div className="text-green-300 text-sm font-medium">
                        🎉 Desconto de {(getDiscount() * 100).toFixed(0)}% aplicado!
                      </div>
                      <div className="text-xs text-green-200 mt-1">
                        {getTotalItems() >= 3 ? 'Compra de 3+ produtos' : 'Compra de 2+ produtos'}
                      </div>
                    </div>
                  )}

                  {/* Totais */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-purple-200">
                      <span>Subtotal:</span>
                      <span>R$ {getTotalPrice().toFixed(2)}</span>
                    </div>
                    {getDiscount() > 0 && (
                      <div className="flex justify-between text-sm text-green-400">
                        <span>Desconto:</span>
                        <span>-R$ {(getTotalPrice() * getDiscount()).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg text-white border-t border-white/20 pt-2">
                      <span>Total:</span>
                      <span className="text-green-400">R$ {finalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Botão de Checkout */}
                  <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 py-4 rounded-xl font-bold text-white transition-all duration-200 shadow-lg">
                    Finalizar Compra
                  </button>

                  {/* Garantias */}
                  <div className="text-xs text-purple-300 text-center space-y-1">
                    <div>🔒 Pagamento 100% seguro</div>
                    <div>📧 Entrega instantânea por email</div>
                    <div>✅ Garantia de satisfação de 30 dias</div>
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

import React from 'react'
import { ShoppingCart, Check, Users, TrendingUp, Clock, Star, Zap, Target, Brain, Lightbulb } from 'lucide-react'
import './App.css'

// Componente Button simples
const Button = ({ children, variant = "default", className = "", onClick, ...props }) => {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors"
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50"
  }
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

// Componente Badge simples
const Badge = ({ children, className = "" }) => {
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ${className}`}>
      {children}
    </span>
  )
}

// Componente Card simples
const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {children}
    </div>
  )
}

function App() {
  const [cart, setCart] = React.useState([])
  const [showCart, setShowCart] = React.useState(false)

  // Dados dos prompts
  const prompts = [
    {
      id: 1,
      title: "Pack Marketing Digital Completo",
      description: "50 prompts para criar campanhas de marketing irresistíveis",
      price: 9.99,
      category: "Marketing",
      rating: 4.9,
      sales: 1247
    },
    {
      id: 2,
      title: "SEO e Blog Content",
      description: "Prompts para criar conteúdo otimizado para SEO",
      price: 9.99,
      category: "Marketing",
      rating: 4.8,
      sales: 892
    },
    {
      id: 3,
      title: "Scripts de Vendas Profissionais",
      description: "Prompts para criar scripts de vendas que convertem",
      price: 9.99,
      category: "Vendas",
      rating: 4.9,
      sales: 1156
    }
  ]

  const addToCart = (prompt) => {
    setCart([...cart, prompt])
  }

  const removeFromCart = (promptId) => {
    setCart(cart.filter(item => item.id !== promptId))
  }

  const getTotalPrice = () => {
    const subtotal = cart.reduce((total, item) => total + item.price, 0)
    let discount = 0
    
    if (cart.length >= 3) discount = 0.3
    if (cart.length >= 6) discount = 0.5
    if (cart.length >= 8) discount = 0.55
    if (cart.length >= 14) discount = 0.6
    
    return {
      subtotal: subtotal.toFixed(2),
      discount: (subtotal * discount).toFixed(2),
      total: (subtotal * (1 - discount)).toFixed(2),
      discountPercent: Math.round(discount * 100)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
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

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
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
        </div>
      </section>

      {/* Prompts Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Prompts Profissionais
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {prompts.map((prompt) => (
              <Card key={prompt.id} className="hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <Badge>{prompt.category}</Badge>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{prompt.rating}</span>
                  </div>
                </div>
                
                <h4 className="text-xl font-bold mb-2 text-gray-800">{prompt.title}</h4>
                <p className="text-gray-600 mb-4">{prompt.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-blue-600">R$ {prompt.price}</span>
                  <span className="text-sm text-gray-500">{prompt.sales} vendas</span>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => addToCart(prompt)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Adicionar ao Carrinho
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Carrinho</h3>
              <Button variant="outline" onClick={() => setShowCart(false)}>
                ✕
              </Button>
            </div>
            
            {cart.length === 0 ? (
              <p className="text-gray-500">Seu carrinho está vazio</p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-blue-600 font-bold">R$ {item.price}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600"
                      >
                        Remover
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4">
                  {(() => {
                    const pricing = getTotalPrice()
                    return (
                      <>
                        <div className="flex justify-between mb-2">
                          <span>Subtotal:</span>
                          <span>R$ {pricing.subtotal}</span>
                        </div>
                        {pricing.discountPercent > 0 && (
                          <div className="flex justify-between mb-2 text-green-600">
                            <span>Desconto ({pricing.discountPercent}%):</span>
                            <span>-R$ {pricing.discount}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                          <span>Total:</span>
                          <span>R$ {pricing.total}</span>
                        </div>
                      </>
                    )
                  })()}
                  
                  <Button className="w-full mt-4">
                    Finalizar Compra
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <Brain className="h-8 w-8 text-blue-400 mr-3" />
            <h3 className="text-2xl font-bold">SimbioIA</h3>
          </div>
          <p className="text-gray-400 mb-4">
            Transformando a forma como você interage com a Inteligência Artificial
          </p>
          <p className="text-sm text-gray-500">
            © 2025 SimbioIA. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App

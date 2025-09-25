import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Check, Star, Zap, Heart, Briefcase, Crown } from 'lucide-react'

export default function BundleSection({ onAddBundle }) {
  const bundles = [
    {
      id: 'combo-3',
      title: 'Combo Starter',
      description: 'Escolha 3 packs e economize',
      originalPrice: 29.97,
      discountPrice: 20.98,
      discount: 30,
      icon: <Zap className="h-6 w-6" />,
      color: 'from-green-500 to-emerald-500',
      features: [
        'Escolha qualquer 3 packs',
        '30% de desconto',
        'Acesso imediato',
        'Suporte por e-mail'
      ],
      popular: false
    },
    {
      id: 'bundle-personal',
      title: 'Bundle Pessoal Completo',
      description: 'Todos os 6 packs para uso pessoal',
      originalPrice: 59.94,
      discountPrice: 29.97,
      discount: 50,
      icon: <Heart className="h-6 w-6" />,
      color: 'from-pink-500 to-red-500',
      features: [
        'Assistente de Desenvolvimento Pessoal',
        'Organizador de Vida Inteligente',
        'Mentor de Aprendizado Acelerado',
        'Consultor de Finanças Pessoais',
        'Planejador de Viagens Inteligente',
        'Coach de Relacionamentos',
        '50% de desconto',
        'Guias de uso incluídos'
      ],
      popular: true
    },
    {
      id: 'bundle-professional',
      title: 'Bundle Profissional Completo',
      description: 'Todos os 8 packs para uso profissional',
      originalPrice: 79.92,
      discountPrice: 35.96,
      discount: 55,
      icon: <Briefcase className="h-6 w-6" />,
      color: 'from-blue-500 to-indigo-500',
      features: [
        'Arsenal Completo de Marketing Digital',
        'Scripts de Vendas de Alto Impacto',
        'Criador de Conteúdo Profissional',
        'Assistente de Atendimento ao Cliente',
        'Analista de Dados e Insights',
        'Comunicador Corporativo',
        'Designer Visual com IA',
        'Educador e Criador de Cursos',
        '55% de desconto',
        'Templates exclusivos'
      ],
      popular: false
    },
    {
      id: 'bundle-complete',
      title: 'Bundle Completo',
      description: 'Todos os 14 packs - Pessoal + Profissional',
      originalPrice: 139.86,
      discountPrice: 55.94,
      discount: 60,
      icon: <Crown className="h-6 w-6" />,
      color: 'from-purple-500 to-pink-500',
      features: [
        'TODOS os 14 packs incluídos',
        'Uso pessoal + profissional',
        '60% de desconto máximo',
        'Acesso vitalício',
        'Atualizações gratuitas',
        'Suporte prioritário',
        'Comunidade exclusiva',
        'Bônus: Templates premium'
      ],
      popular: false,
      premium: true
    }
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold mb-6">
            <Star className="inline h-8 w-8 text-yellow-500 mr-2" />
            Bundles Promocionais
          </h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Economize até 60% comprando nossos bundles especiais. Quanto mais você leva, mais você economiza!
          </p>
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 max-w-2xl mx-auto border border-yellow-200">
            <p className="text-yellow-800 font-semibold">
              💰 "Invista R$ 9,99. Economize 10 horas de trabalho."
            </p>
            <p className="text-yellow-600 text-sm mt-1">
              Ou economize até R$ 83,92 com nossos bundles!
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bundles.map((bundle) => (
            <Card 
              key={bundle.id} 
              className={`relative h-full hover:shadow-xl transition-all duration-300 ${
                bundle.popular ? 'ring-2 ring-pink-500 scale-105' : ''
              } ${bundle.premium ? 'ring-2 ring-purple-500' : ''}`}
            >
              {bundle.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-pink-500 text-white px-4 py-1">
                    Mais Popular
                  </Badge>
                </div>
              )}
              
              {bundle.premium && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-500 text-white px-4 py-1">
                    Melhor Valor
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${bundle.color} flex items-center justify-center text-white mx-auto mb-4`}>
                  {bundle.icon}
                </div>
                <CardTitle className="text-xl">{bundle.title}</CardTitle>
                <CardDescription>{bundle.description}</CardDescription>
                
                <div className="mt-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-sm text-gray-500 line-through">
                      R$ {bundle.originalPrice.toFixed(2)}
                    </span>
                    <Badge variant="destructive" className="text-xs">
                      -{bundle.discount}%
                    </Badge>
                  </div>
                  <div className="text-3xl font-bold text-green-600">
                    R$ {bundle.discountPrice.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Economia de R$ {(bundle.originalPrice - bundle.discountPrice).toFixed(2)}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-2">
                  {bundle.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full mt-6 bg-gradient-to-r ${bundle.color} hover:opacity-90 text-white`}
                  onClick={() => onAddBundle(bundle.id)}
                >
                  Comprar Bundle
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h4 className="text-2xl font-bold mb-4 text-gray-800">
              Por que nossos bundles são irresistíveis?
            </h4>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h5 className="font-semibold mb-2">Economia Real</h5>
                <p className="text-sm text-gray-600">
                  Até 60% de desconto comparado à compra individual
                </p>
              </div>
              <div>
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
                <h5 className="font-semibold mb-2">Acesso Imediato</h5>
                <p className="text-sm text-gray-600">
                  Receba todos os prompts instantaneamente por e-mail
                </p>
              </div>
              <div>
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="h-8 w-8 text-purple-600" />
                </div>
                <h5 className="font-semibold mb-2">Qualidade Premium</h5>
                <p className="text-sm text-gray-600">
                  Prompts testados e otimizados por especialistas
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { CreditCard, Smartphone, QrCode, Mail, User, MapPin, Lock, CheckCircle, Download, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

const Checkout = ({ cartItems, prompts, onBack, onComplete }) => {
  const [step, setStep] = useState(1) // 1: Dados, 2: Pagamento, 3: Confirmação
  const [paymentMethod, setPaymentMethod] = useState('pix')
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    cpf: '',
    phone: ''
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)

  const cartPrompts = prompts.filter(prompt => cartItems.includes(prompt.id))
  const subtotal = cartPrompts.reduce((sum, prompt) => sum + prompt.price, 0)
  const discount = cartPrompts.length >= 3 ? subtotal * 0.1 : 0 // 10% desconto para 3+ itens
  const total = subtotal - discount

  const handleCustomerDataChange = (field, value) => {
    setCustomerData(prev => ({ ...prev, [field]: value }))
  }

  const validateStep1 = () => {
    return customerData.name && customerData.email && customerData.cpf && customerData.phone
  }

  const processPayment = async () => {
    setIsProcessing(true)
    
    // Simular processamento de pagamento
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setIsProcessing(false)
    setOrderComplete(true)
    setStep(3)
  }

  const generatePixCode = () => {
    return `00020126580014BR.GOV.BCB.PIX0136${Math.random().toString(36).substring(2, 15)}52040000530398654${total.toFixed(2).replace('.', '')}5802BR5925PROMPTSTORE LTDA6009SAO PAULO62070503***6304${Math.random().toString(36).substring(2, 6).toUpperCase()}`
  }

  if (step === 1) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h2 className="text-2xl font-bold">Finalizar Compra</h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Dados do Cliente */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Seus Dados
                </CardTitle>
                <CardDescription>
                  Precisamos dessas informações para enviar seus prompts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      value={customerData.name}
                      onChange={(e) => handleCustomerDataChange('name', e.target.value)}
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerData.email}
                      onChange={(e) => handleCustomerDataChange('email', e.target.value)}
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input
                      id="cpf"
                      value={customerData.cpf}
                      onChange={(e) => handleCustomerDataChange('cpf', e.target.value)}
                      placeholder="000.000.000-00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">WhatsApp *</Label>
                    <Input
                      id="phone"
                      value={customerData.phone}
                      onChange={(e) => handleCustomerDataChange('phone', e.target.value)}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms" className="text-sm">
                    Aceito os <a href="#" className="text-blue-600 hover:underline">termos de uso</a> e 
                    <a href="#" className="text-blue-600 hover:underline ml-1">política de privacidade</a>
                  </Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => setStep(2)}
                  disabled={!validateStep1()}
                >
                  Continuar para Pagamento
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Resumo do Pedido */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartPrompts.map(prompt => (
                  <div key={prompt.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{prompt.title}</h4>
                      <Badge variant="outline" className="text-xs mt-1">
                        {prompt.platform}
                      </Badge>
                    </div>
                    <span className="font-medium">R$ {prompt.price.toFixed(2)}</span>
                  </div>
                ))}
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto (3+ itens)</span>
                      <span>-R$ {discount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => setStep(1)} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h2 className="text-2xl font-bold">Pagamento</h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Métodos de Pagamento */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Escolha a forma de pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-4">
                    {/* PIX */}
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="pix" id="pix" />
                      <Label htmlFor="pix" className="flex items-center cursor-pointer flex-1">
                        <QrCode className="h-5 w-5 mr-3 text-green-600" />
                        <div>
                          <div className="font-medium">PIX</div>
                          <div className="text-sm text-gray-500">Aprovação instantânea</div>
                        </div>
                        <Badge className="ml-auto bg-green-100 text-green-800">Recomendado</Badge>
                      </Label>
                    </div>

                    {/* Cartão de Crédito */}
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="credit" id="credit" />
                      <Label htmlFor="credit" className="flex items-center cursor-pointer flex-1">
                        <CreditCard className="h-5 w-5 mr-3 text-blue-600" />
                        <div>
                          <div className="font-medium">Cartão de Crédito</div>
                          <div className="text-sm text-gray-500">Visa, Mastercard, Elo</div>
                        </div>
                      </Label>
                    </div>

                    {/* Boleto */}
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="boleto" id="boleto" />
                      <Label htmlFor="boleto" className="flex items-center cursor-pointer flex-1">
                        <Smartphone className="h-5 w-5 mr-3 text-orange-600" />
                        <div>
                          <div className="font-medium">Boleto Bancário</div>
                          <div className="text-sm text-gray-500">Vencimento em 3 dias úteis</div>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>

                {/* Detalhes do PIX */}
                {paymentMethod === 'pix' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200"
                  >
                    <div className="flex items-center mb-2">
                      <QrCode className="h-4 w-4 text-green-600 mr-2" />
                      <span className="font-medium text-green-800">Pagamento via PIX</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Após confirmar, você receberá o código PIX para pagamento. 
                      Seus prompts serão liberados automaticamente após a confirmação.
                    </p>
                  </motion.div>
                )}

                {/* Detalhes do Cartão */}
                {paymentMethod === 'credit' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 space-y-4"
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cardNumber">Número do Cartão</Label>
                        <Input id="cardNumber" placeholder="0000 0000 0000 0000" />
                      </div>
                      <div>
                        <Label htmlFor="cardName">Nome no Cartão</Label>
                        <Input id="cardName" placeholder="Nome como no cartão" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Validade</Label>
                        <Input id="expiry" placeholder="MM/AA" />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="000" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={processPayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processando...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Finalizar Pagamento - R$ {total.toFixed(2)}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Resumo */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumo Final</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{cartPrompts.length} prompt(s)</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto</span>
                      <span>-R$ {discount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center text-blue-800 text-sm">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="font-medium">Garantia de 7 dias</span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    Não ficou satisfeito? Devolvemos seu dinheiro.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (step === 3) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-green-800 mb-4">
            Pagamento Confirmado!
          </h2>
          
          <p className="text-gray-600 mb-8">
            Seus prompts foram enviados para <strong>{customerData.email}</strong>
          </p>

          {paymentMethod === 'pix' && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-center">
                  <QrCode className="h-5 w-5 mr-2" />
                  Código PIX
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm break-all">
                  {generatePixCode()}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Copie e cole este código no seu app do banco ou escaneie o QR Code
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <Mail className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-medium">E-mail Enviado</h3>
                <p className="text-sm text-gray-500">
                  Verifique sua caixa de entrada
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Download className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-medium">Download Liberado</h3>
                <p className="text-sm text-gray-500">
                  Links de download ativos
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Button className="w-full" onClick={() => window.location.reload()}>
              Fazer Nova Compra
            </Button>
            <Button variant="outline" className="w-full">
              Acessar Meus Prompts
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }
}

export default Checkout

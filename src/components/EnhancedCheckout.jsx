import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { 
  CreditCard, Smartphone, QrCode, Mail, User, MapPin, Lock, CheckCircle, 
  Download, ArrowLeft, Building, Briefcase, Phone, Globe, Heart, 
  Target, Users, TrendingUp, AlertCircle, Info
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const EnhancedCheckout = ({ cartItems, prompts, onBack, onComplete }) => {
  const [step, setStep] = useState(1) // 1: Tipo Cliente, 2: Dados, 3: Pagamento, 4: Confirmação
  const [customerType, setCustomerType] = useState('') // 'personal' ou 'business'
  const [paymentMethod, setPaymentMethod] = useState('pix')
  const [customerData, setCustomerData] = useState({
    // Dados básicos
    name: '',
    email: '',
    phone: '',
    
    // Documentos
    cpf: '',
    cnpj: '',
    
    // Dados empresariais
    company_name: '',
    profession: '',
    business_area: '',
    company_size: '',
    
    // Endereço
    street_address: '',
    city: '',
    state: '',
    zip_code: '',
    
    // Marketing
    how_found_us: '',
    marketing_consent: false,
    whatsapp_consent: false,
    purchase_intent: '',
    interests: []
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [errors, setErrors] = useState({})

  const cartPrompts = prompts.filter(prompt => cartItems.includes(prompt.id))
  const subtotal = cartPrompts.reduce((sum, prompt) => sum + prompt.price, 0)
  
  // Cálculo de desconto baseado na quantidade
  const getDiscountInfo = () => {
    const itemCount = cartItems.length
    if (itemCount >= 14) return { percentage: 0.6, description: '60% OFF - Bundle Completo!' }
    if (itemCount >= 8) return { percentage: 0.55, description: '55% OFF - Bundle Profissional!' }
    if (itemCount >= 6) return { percentage: 0.5, description: '50% OFF - Bundle Pessoal!' }
    if (itemCount >= 3) return { percentage: 0.3, description: '30% OFF - Combo Especial!' }
    return { percentage: 0, description: '' }
  }
  
  const discountInfo = getDiscountInfo()
  const discount = subtotal * discountInfo.percentage
  const total = subtotal - discount

  const handleCustomerDataChange = (field, value) => {
    setCustomerData(prev => ({ ...prev, [field]: value }))
    // Limpar erro do campo quando usuário digita
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const formatCNPJ = (value) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  }

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }

  const formatZipCode = (value) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2')
  }

  const validateStep1 = () => {
    return customerType !== ''
  }

  const validateStep2 = () => {
    const newErrors = {}
    
    // Validações básicas
    if (!customerData.name.trim()) newErrors.name = 'Nome é obrigatório'
    if (!customerData.email.trim()) newErrors.email = 'Email é obrigatório'
    if (!customerData.phone.trim()) newErrors.phone = 'Telefone é obrigatório'
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (customerData.email && !emailRegex.test(customerData.email)) {
      newErrors.email = 'Email inválido'
    }
    
    // Validar documentos
    if (customerType === 'personal') {
      if (!customerData.cpf.trim()) {
        newErrors.cpf = 'CPF é obrigatório'
      } else if (customerData.cpf.replace(/\D/g, '').length !== 11) {
        newErrors.cpf = 'CPF deve ter 11 dígitos'
      }
    } else {
      if (!customerData.cnpj.trim()) {
        newErrors.cnpj = 'CNPJ é obrigatório'
      } else if (customerData.cnpj.replace(/\D/g, '').length !== 14) {
        newErrors.cnpj = 'CNPJ deve ter 14 dígitos'
      }
      if (!customerData.company_name.trim()) {
        newErrors.company_name = 'Nome da empresa é obrigatório'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const processPayment = async () => {
    setIsProcessing(true)
    
    try {
      // Primeiro, criar o cliente no backend
      const customerPayload = {
        ...customerData,
        customer_type: customerType,
        interests: cartPrompts.map(p => p.category)
      }
      
      const customerResponse = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerPayload)
      })
      
      if (!customerResponse.ok) {
        const errorData = await customerResponse.json()
        throw new Error(errorData.error || 'Erro ao criar cliente')
      }
      
      const customerResult = await customerResponse.json()
      
      // Simular processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      setIsProcessing(false)
      setOrderComplete(true)
      setStep(4)
      
    } catch (error) {
      setIsProcessing(false)
      alert(`Erro: ${error.message}`)
    }
  }

  const generatePixCode = () => {
    return `00020126580014BR.GOV.BCB.PIX0136${Math.random().toString(36).substring(2, 15)}52040000530398654${total.toFixed(2).replace('.', '')}5802BR5925SIMBIOIA LTDA6009SAO PAULO62070503***6304${Math.random().toString(36).substring(2, 6).toUpperCase()}`
  }

  // Estados brasileiros
  const brazilianStates = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 
    'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ]

  const companySizes = [
    'Microempresa (até 9 funcionários)',
    'Pequena empresa (10-49 funcionários)', 
    'Média empresa (50-249 funcionários)',
    'Grande empresa (250+ funcionários)'
  ]

  const howFoundUsOptions = [
    'Google/Busca',
    'Instagram',
    'Facebook',
    'LinkedIn',
    'YouTube',
    'Indicação de amigo',
    'Blog/Artigo',
    'Podcast',
    'Outro'
  ]

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
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Tipo de Cliente
                </CardTitle>
                <CardDescription>
                  Selecione o tipo que melhor descreve você para personalizar sua experiência
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={customerType} onValueChange={setCustomerType}>
                  <div className="space-y-4">
                    {/* Pessoa Física */}
                    <div className="flex items-center space-x-2 p-6 border-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <RadioGroupItem value="personal" id="personal" />
                      <Label htmlFor="personal" className="flex items-center cursor-pointer flex-1">
                        <div className="flex items-center">
                          <User className="h-8 w-8 mr-4 text-blue-600" />
                          <div>
                            <div className="font-medium text-lg">Pessoa Física</div>
                            <div className="text-sm text-gray-500">
                              Para uso pessoal, desenvolvimento individual, estudos
                            </div>
                            <div className="flex items-center mt-2 text-xs text-blue-600">
                              <Heart className="h-3 w-3 mr-1" />
                              Prompts para crescimento pessoal, organização, aprendizado
                            </div>
                          </div>
                        </div>
                      </Label>
                    </div>

                    {/* Pessoa Jurídica */}
                    <div className="flex items-center space-x-2 p-6 border-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <RadioGroupItem value="business" id="business" />
                      <Label htmlFor="business" className="flex items-center cursor-pointer flex-1">
                        <div className="flex items-center">
                          <Building className="h-8 w-8 mr-4 text-purple-600" />
                          <div>
                            <div className="font-medium text-lg">Pessoa Jurídica</div>
                            <div className="text-sm text-gray-500">
                              Para empresas, profissionais liberais, empreendedores
                            </div>
                            <div className="flex items-center mt-2 text-xs text-purple-600">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Prompts para marketing, vendas, gestão, produtividade
                            </div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>

                {customerType && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <div className="flex items-center mb-2">
                      <Info className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="font-medium text-blue-800">
                        {customerType === 'personal' ? 'Pessoa Física Selecionada' : 'Pessoa Jurídica Selecionada'}
                      </span>
                    </div>
                    <p className="text-sm text-blue-700">
                      {customerType === 'personal' 
                        ? 'Vamos coletar seus dados pessoais (CPF) para emissão da nota fiscal.'
                        : 'Vamos coletar os dados da sua empresa (CNPJ) para emissão da nota fiscal.'
                      }
                    </p>
                  </motion.div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => setStep(2)}
                  disabled={!validateStep1()}
                >
                  Continuar para Dados Pessoais
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

                {discountInfo.percentage > 0 && (
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800 font-medium">
                      🎉 {discountInfo.description}
                    </p>
                    <p className="text-xs text-green-600">
                      Economia de R$ {discount.toFixed(2)}
                    </p>
                  </div>
                )}
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
          <h2 className="text-2xl font-bold">Seus Dados</h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
                <TabsTrigger value="address">Endereço</TabsTrigger>
                <TabsTrigger value="marketing">Marketing</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Informações {customerType === 'business' ? 'da Empresa' : 'Pessoais'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">
                          {customerType === 'business' ? 'Nome do Responsável' : 'Nome Completo'} *
                        </Label>
                        <Input
                          id="name"
                          value={customerData.name}
                          onChange={(e) => handleCustomerDataChange('name', e.target.value)}
                          placeholder="Seu nome completo"
                          className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <Label htmlFor="email">E-mail *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={customerData.email}
                          onChange={(e) => handleCustomerDataChange('email', e.target.value)}
                          placeholder="seu@email.com"
                          className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">WhatsApp *</Label>
                        <Input
                          id="phone"
                          value={customerData.phone}
                          onChange={(e) => handleCustomerDataChange('phone', formatPhone(e.target.value))}
                          placeholder="(11) 99999-9999"
                          className={errors.phone ? 'border-red-500' : ''}
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                      </div>
                      <div>
                        <Label htmlFor="document">
                          {customerType === 'business' ? 'CNPJ *' : 'CPF *'}
                        </Label>
                        <Input
                          id="document"
                          value={customerType === 'business' ? customerData.cnpj : customerData.cpf}
                          onChange={(e) => {
                            const field = customerType === 'business' ? 'cnpj' : 'cpf'
                            const formatter = customerType === 'business' ? formatCNPJ : formatCPF
                            handleCustomerDataChange(field, formatter(e.target.value))
                          }}
                          placeholder={customerType === 'business' ? '00.000.000/0000-00' : '000.000.000-00'}
                          className={errors[customerType === 'business' ? 'cnpj' : 'cpf'] ? 'border-red-500' : ''}
                        />
                        {errors[customerType === 'business' ? 'cnpj' : 'cpf'] && 
                          <p className="text-red-500 text-xs mt-1">{errors[customerType === 'business' ? 'cnpj' : 'cpf']}</p>
                        }
                      </div>
                    </div>

                    {customerType === 'business' && (
                      <>
                        <div>
                          <Label htmlFor="company_name">Nome da Empresa *</Label>
                          <Input
                            id="company_name"
                            value={customerData.company_name}
                            onChange={(e) => handleCustomerDataChange('company_name', e.target.value)}
                            placeholder="Razão social ou nome fantasia"
                            className={errors.company_name ? 'border-red-500' : ''}
                          />
                          {errors.company_name && <p className="text-red-500 text-xs mt-1">{errors.company_name}</p>}
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="business_area">Área de Atuação</Label>
                            <Input
                              id="business_area"
                              value={customerData.business_area}
                              onChange={(e) => handleCustomerDataChange('business_area', e.target.value)}
                              placeholder="Ex: Marketing, Tecnologia, Saúde"
                            />
                          </div>
                          <div>
                            <Label htmlFor="company_size">Tamanho da Empresa</Label>
                            <Select value={customerData.company_size} onValueChange={(value) => handleCustomerDataChange('company_size', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tamanho" />
                              </SelectTrigger>
                              <SelectContent>
                                {companySizes.map(size => (
                                  <SelectItem key={size} value={size}>{size}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </>
                    )}

                    {customerType === 'personal' && (
                      <div>
                        <Label htmlFor="profession">Profissão</Label>
                        <Input
                          id="profession"
                          value={customerData.profession}
                          onChange={(e) => handleCustomerDataChange('profession', e.target.value)}
                          placeholder="Ex: Designer, Advogado, Estudante"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="address" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Endereço
                    </CardTitle>
                    <CardDescription>
                      Informações para emissão da nota fiscal
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="street_address">Endereço Completo</Label>
                      <Input
                        id="street_address"
                        value={customerData.street_address}
                        onChange={(e) => handleCustomerDataChange('street_address', e.target.value)}
                        placeholder="Rua, número, complemento"
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">Cidade</Label>
                        <Input
                          id="city"
                          value={customerData.city}
                          onChange={(e) => handleCustomerDataChange('city', e.target.value)}
                          placeholder="Sua cidade"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">Estado</Label>
                        <Select value={customerData.state} onValueChange={(value) => handleCustomerDataChange('state', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="UF" />
                          </SelectTrigger>
                          <SelectContent>
                            {brazilianStates.map(state => (
                              <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="zip_code">CEP</Label>
                        <Input
                          id="zip_code"
                          value={customerData.zip_code}
                          onChange={(e) => handleCustomerDataChange('zip_code', formatZipCode(e.target.value))}
                          placeholder="00000-000"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="marketing" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Preferências de Marketing
                    </CardTitle>
                    <CardDescription>
                      Nos ajude a personalizar sua experiência
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="how_found_us">Como nos conheceu?</Label>
                      <Select value={customerData.how_found_us} onValueChange={(value) => handleCustomerDataChange('how_found_us', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma opção" />
                        </SelectTrigger>
                        <SelectContent>
                          {howFoundUsOptions.map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="purchase_intent">Principal objetivo com IA</Label>
                      <Textarea
                        id="purchase_intent"
                        value={customerData.purchase_intent}
                        onChange={(e) => handleCustomerDataChange('purchase_intent', e.target.value)}
                        placeholder="Ex: Melhorar produtividade, criar conteúdo, automatizar tarefas..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="marketing_consent"
                          checked={customerData.marketing_consent}
                          onCheckedChange={(checked) => handleCustomerDataChange('marketing_consent', checked)}
                        />
                        <Label htmlFor="marketing_consent" className="text-sm">
                          Aceito receber e-mails com dicas, novos prompts e ofertas especiais
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="whatsapp_consent"
                          checked={customerData.whatsapp_consent}
                          onCheckedChange={(checked) => handleCustomerDataChange('whatsapp_consent', checked)}
                        />
                        <Label htmlFor="whatsapp_consent" className="text-sm">
                          Aceito receber mensagens no WhatsApp com conteúdos exclusivos
                        </Label>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center mb-2">
                        <Info className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="font-medium text-blue-800">Política de Privacidade</span>
                      </div>
                      <p className="text-sm text-blue-700">
                        Seus dados são protegidos pela LGPD e usados apenas para melhorar sua experiência 
                        e enviar conteúdos relevantes. Você pode cancelar a qualquer momento.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <Button 
                className="w-full" 
                onClick={() => {
                  if (validateStep2()) {
                    setStep(3)
                  }
                }}
              >
                Continuar para Pagamento
              </Button>
            </div>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (step === 3) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => setStep(2)} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h2 className="text-2xl font-bold">Pagamento</h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
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

          {/* Resumo Final */}
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

  if (step === 4) {
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
                  Copie e cole este código no seu app do banco
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <Button variant="outline" onClick={() => window.location.reload()}>
              <Download className="h-4 w-4 mr-2" />
              Baixar Prompts
            </Button>
            <Button onClick={() => window.location.href = '/'}>
              Voltar ao Início
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }
}

export default EnhancedCheckout

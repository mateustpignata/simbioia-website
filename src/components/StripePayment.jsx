import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.jsx'
import { Label } from '@/components/ui/label.jsx'
import { 
  CreditCard, Smartphone, QrCode, Lock, CheckCircle, 
  AlertCircle, Loader2, ArrowLeft 
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Chave pública do Stripe (substitua pela sua chave real)
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890abcdef')

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    invalid: {
      color: '#9e2146',
    },
  },
  hidePostalCode: true,
}

const PaymentForm = ({ 
  customer, 
  cartItems, 
  total, 
  onSuccess, 
  onError, 
  onBack 
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [paymentMethod, setPaymentMethod] = useState('pix')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState('idle') // idle, processing, success, error
  const [errorMessage, setErrorMessage] = useState('')
  const [pixCode, setPixCode] = useState('')
  const [paymentIntentId, setPaymentIntentId] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setPaymentStatus('processing')
    setErrorMessage('')

    try {
      // Criar Payment Intent no backend
      const response = await fetch('/api/payment/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total,
          currency: 'brl',
          customer_id: customer.id,
          cart_items: cartItems,
          subtotal: cartItems.reduce((sum, item) => sum + item.price, 0),
          discount: cartItems.reduce((sum, item) => sum + item.price, 0) - total
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao criar pagamento')
      }

      const { client_secret, payment_intent_id, order_number } = await response.json()
      setPaymentIntentId(payment_intent_id)

      // Processar pagamento baseado no método escolhido
      let result

      if (paymentMethod === 'pix') {
        result = await stripe.confirmPixPayment(client_secret, {
          return_url: `${window.location.origin}/payment-success?order=${order_number}`,
        })
      } else if (paymentMethod === 'credit') {
        const cardElement = elements.getElement(CardElement)
        
        result = await stripe.confirmCardPayment(client_secret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: customer.name,
              email: customer.email,
              phone: customer.phone,
              address: {
                line1: customer.street_address || '',
                city: customer.city || '',
                state: customer.state || '',
                postal_code: customer.zip_code || '',
                country: 'BR',
              },
            },
          }
        })
      } else if (paymentMethod === 'boleto') {
        result = await stripe.confirmBoletoPayment(client_secret, {
          payment_method: {
            billing_details: {
              name: customer.name,
              email: customer.email,
              address: {
                line1: customer.street_address || '',
                city: customer.city || '',
                state: customer.state || '',
                postal_code: customer.zip_code || '',
                country: 'BR',
              },
            },
          },
          return_url: `${window.location.origin}/payment-success?order=${order_number}`,
        })
      }

      if (result.error) {
        setErrorMessage(result.error.message)
        setPaymentStatus('error')
        onError(result.error)
      } else {
        // Para PIX, mostrar código QR
        if (paymentMethod === 'pix' && result.paymentIntent.next_action?.pix_display_qr_code) {
          setPixCode(result.paymentIntent.next_action.pix_display_qr_code.data)
          setPaymentStatus('pix_pending')
          
          // Polling para verificar status do pagamento PIX
          pollPaymentStatus(payment_intent_id)
        } else if (result.paymentIntent.status === 'succeeded') {
          setPaymentStatus('success')
          onSuccess(result.paymentIntent)
        } else {
          setPaymentStatus('processing')
          // Para outros métodos, aguardar confirmação
        }
      }
    } catch (error) {
      setErrorMessage(error.message)
      setPaymentStatus('error')
      onError(error)
    } finally {
      setIsProcessing(false)
    }
  }

  const pollPaymentStatus = async (paymentIntentId) => {
    const maxAttempts = 60 // 5 minutos (5 segundos * 60)
    let attempts = 0

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/payment/confirm-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            payment_intent_id: paymentIntentId
          })
        })

        const data = await response.json()
        
        if (data.status === 'succeeded') {
          setPaymentStatus('success')
          onSuccess({ id: paymentIntentId })
          return
        }
        
        if (data.status === 'canceled' || data.status === 'failed') {
          setPaymentStatus('error')
          setErrorMessage('Pagamento não foi concluído')
          return
        }

        // Continuar polling se ainda está pendente
        attempts++
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 5000) // Verificar a cada 5 segundos
        } else {
          setPaymentStatus('error')
          setErrorMessage('Tempo limite excedido. Verifique seu app bancário.')
        }
      } catch (error) {
        console.error('Erro ao verificar status:', error)
        attempts++
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 5000)
        }
      }
    }

    checkStatus()
  }

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode)
    // Mostrar feedback visual
    const button = document.getElementById('copy-pix-button')
    const originalText = button.textContent
    button.textContent = 'Copiado!'
    setTimeout(() => {
      button.textContent = originalText
    }, 2000)
  }

  if (paymentStatus === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8"
      >
        <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        
        <h2 className="text-3xl font-bold text-green-800 mb-4">
          Pagamento Confirmado!
        </h2>
        
        <p className="text-gray-600 mb-8">
          Seus prompts foram enviados para <strong>{customer.email}</strong>
        </p>

        <Button onClick={() => window.location.href = '/'}>
          Voltar ao Início
        </Button>
      </motion.div>
    )
  }

  if (paymentStatus === 'pix_pending') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6"
      >
        <div className="text-center mb-6">
          <QrCode className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-green-800 mb-2">
            Pagamento PIX Gerado
          </h3>
          <p className="text-gray-600">
            Escaneie o QR Code ou copie o código PIX abaixo
          </p>
        </div>

        {pixCode && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-center">Código PIX</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm break-all mb-4">
                {pixCode}
              </div>
              <Button 
                id="copy-pix-button"
                onClick={copyPixCode}
                className="w-full"
                variant="outline"
              >
                Copiar Código PIX
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center mb-2">
            <Loader2 className="h-4 w-4 text-blue-600 mr-2 animate-spin" />
            <span className="font-medium text-blue-800">Aguardando Pagamento</span>
          </div>
          <p className="text-sm text-blue-700">
            Após o pagamento, você receberá os prompts automaticamente por e-mail.
            Esta página será atualizada quando o pagamento for confirmado.
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h2 className="text-2xl font-bold">Pagamento</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Escolha a forma de pagamento</CardTitle>
                <CardDescription>
                  Selecione o método de pagamento de sua preferência
                </CardDescription>
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

                {/* Detalhes do Cartão */}
                <AnimatePresence>
                  {paymentMethod === 'credit' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 p-4 border rounded-lg"
                    >
                      <Label className="block mb-2 font-medium">Dados do Cartão</Label>
                      <div className="p-3 border rounded-md">
                        <CardElement options={CARD_ELEMENT_OPTIONS} />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Seus dados são protegidos com criptografia SSL
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Informações do PIX */}
                <AnimatePresence>
                  {paymentMethod === 'pix' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
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
                </AnimatePresence>

                {/* Informações do Boleto */}
                <AnimatePresence>
                  {paymentMethod === 'boleto' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200"
                    >
                      <div className="flex items-center mb-2">
                        <Smartphone className="h-4 w-4 text-orange-600 mr-2" />
                        <span className="font-medium text-orange-800">Pagamento via Boleto</span>
                      </div>
                      <p className="text-sm text-orange-700">
                        O boleto será gerado após a confirmação e enviado por e-mail. 
                        Prazo de vencimento: 3 dias úteis.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Mensagem de Erro */}
                <AnimatePresence>
                  {errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200"
                    >
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                        <span className="text-red-800 text-sm">{errorMessage}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit"
                  className="w-full" 
                  disabled={!stripe || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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

          {/* Resumo do Pedido */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumo Final</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{cartItems.length} prompt(s)</span>
                    <span>R$ {cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
                  </div>
                  {cartItems.reduce((sum, item) => sum + item.price, 0) !== total && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto</span>
                      <span>-R$ {(cartItems.reduce((sum, item) => sum + item.price, 0) - total).toFixed(2)}</span>
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

                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center text-green-800 text-sm">
                    <Lock className="h-4 w-4 mr-2" />
                    <span className="font-medium">Pagamento Seguro</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    Processado pela Stripe com criptografia SSL.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}

const StripePayment = ({ customer, cartItems, total, onSuccess, onError, onBack }) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm 
        customer={customer}
        cartItems={cartItems}
        total={total}
        onSuccess={onSuccess}
        onError={onError}
        onBack={onBack}
      />
    </Elements>
  )
}

export default StripePayment

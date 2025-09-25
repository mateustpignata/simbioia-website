import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

// Chave pública do Stripe (substitua pela sua chave real)
const stripePromise = loadStripe('pk_test_...');

const CheckoutForm = ({ cartItems, total, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('pix');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      return;
    }

    try {
      // Criar Payment Intent no backend
      const response = await fetch('http://localhost:5001/api/payment/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(total * 100), // Stripe usa centavos
          currency: 'brl',
          payment_method_types: [paymentMethod],
          metadata: {
            cart_items: JSON.stringify(cartItems.map(item => ({
              id: item.id,
              title: item.title,
              price: item.price
            })))
          }
        }),
      });

      const { client_secret } = await response.json();

      if (paymentMethod === 'pix') {
        // Processar pagamento PIX
        const result = await stripe.confirmPixPayment(client_secret, {
          return_url: window.location.origin + '/success',
        });

        if (result.error) {
          setError(result.error.message);
        } else {
          // PIX QR Code será mostrado automaticamente
          onSuccess(result.paymentIntent);
        }
      } else {
        // Processar pagamento com cartão
        const card = elements.getElement(CardElement);
        
        const result = await stripe.confirmCardPayment(client_secret, {
          payment_method: {
            card: card,
          }
        });

        if (result.error) {
          setError(result.error.message);
        } else {
          onSuccess(result.paymentIntent);
        }
      }
    } catch (err) {
      setError('Erro ao processar pagamento. Tente novamente.');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Seleção do método de pagamento */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Método de Pagamento</h3>
        
        <div className="space-y-2">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="payment_method"
              value="pix"
              checked={paymentMethod === 'pix'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-4 h-4 text-blue-600"
            />
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white font-bold text-sm">
                PIX
              </div>
              <span>PIX - Aprovação instantânea</span>
            </div>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="payment_method"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-4 h-4 text-blue-600"
            />
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold text-sm">
                💳
              </div>
              <span>Cartão de Crédito</span>
            </div>
          </label>
        </div>
      </div>

      {/* Campo do cartão (apenas se cartão estiver selecionado) */}
      {paymentMethod === 'card' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Dados do Cartão
          </label>
          <div className="p-3 border border-gray-300 rounded-md">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      )}

      {/* Resumo do pedido */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Resumo do Pedido</h4>
        {cartItems.map((item, index) => (
          <div key={index} className="flex justify-between text-sm mb-1">
            <span>{item.title}</span>
            <span>R$ {item.price.toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t pt-2 mt-2 font-semibold">
          <div className="flex justify-between">
            <span>Total:</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Botão de pagamento */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Processando...</span>
          </div>
        ) : (
          `Pagar R$ ${total.toFixed(2)} ${paymentMethod === 'pix' ? 'com PIX' : 'com Cartão'}`
        )}
      </button>

      {/* Informações de segurança */}
      <div className="text-xs text-gray-500 text-center">
        🔒 Pagamento seguro processado pela Stripe
      </div>
    </form>
  );
};

const StripeCheckout = ({ cartItems, total, onSuccess }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm 
        cartItems={cartItems} 
        total={total} 
        onSuccess={onSuccess} 
      />
    </Elements>
  );
};

export default StripeCheckout;

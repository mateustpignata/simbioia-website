import React from 'react'
import { X } from 'lucide-react'

/**
 * Exibe um modal com o histórico de compras do usuário.
 * Recebe um array de pedidos com data, itens e total. Cada pedido é exibido
 * com a data formatada, lista de itens comprados e o total.
 *
 * Props:
 * - isOpen: controla a visibilidade do modal
 * - onClose: função chamada ao fechar o modal
 * - history: array de objetos { date: string, items: array, total: number }
 */
const PurchaseHistoryModal = ({ isOpen, onClose, history }) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Fundo escurecido */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Histórico de Compras</h3>
          <button onClick={onClose} className="text-purple-200 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        {history.length === 0 ? (
          <p className="text-purple-200 text-sm">Nenhuma compra foi realizada ainda.</p>
        ) : (
          <div className="space-y-4">
            {history.map((order, idx) => (
              <div key={idx} className="bg-white/10 rounded-lg p-4 border border-white/20">
                <div className="flex justify-between text-sm text-purple-200 mb-2">
                  <span>Pedido #{idx + 1}</span>
                  <span>{new Date(order.date).toLocaleString()}</span>
                </div>
                <ul className="space-y-1 text-purple-100 text-sm">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex justify-between">
                      <span>
                        {item.quantity}× {item.title}
                      </span>
                      <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between font-semibold text-white mt-2">
                  <span>Total:</span>
                  <span className="text-green-400">R$ {order.total.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PurchaseHistoryModal
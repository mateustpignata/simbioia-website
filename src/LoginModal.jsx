import React, { useState } from 'react';
/**
 * LoginModal exibe um modal com formulário de e-mail e senha.
 * Este componente é controlado externamente pelos props:
 * - isOpen: boolean que define se o modal está visível
 * - onClose: função chamada para fechar o modal
 * - onLogin: função chamada com os dados do usuário quando o formulário é enviado
 */
const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simula envio para backend e autenticação
    onLogin({ email });
    setEmail('');
    setPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Fundo escurecido */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 w-full max-w-md">
        <h3 className="text-lg font-semibold text-white mb-4">Entrar</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-md bg-white/20 text-white placeholder-purple-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-md bg-white/20 text-white placeholder-purple-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="••••••••"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-white/20 text-purple-200 hover:bg-white/30 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-gradient-to-r from-pink-500 to-violet-500 text-white font-semibold hover:from-pink-600 hover:to-violet-600 transition-colors"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
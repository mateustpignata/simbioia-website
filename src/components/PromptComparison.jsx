import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Zap, X, Check, ArrowRight } from 'lucide-react';

const PromptComparison = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const scenarios = [
    {
      title: "Prompt Comum (Genérico)",
      userPrompt: "Me ajude com marketing",
      aiResponse: "Claro! Marketing é importante para empresas. Você pode usar redes sociais, fazer anúncios e criar conteúdo. Precisa de mais alguma coisa?",
      responseType: "bad",
      icon: "😕",
      color: "from-red-100 to-orange-100",
      borderColor: "border-red-200"
    },
    {
      title: "Prompt SimbioIA (Específico)",
      userPrompt: "Atue como um estrategista de marketing digital especializado em pequenas empresas. Meu negócio é [consultoria em IA] com orçamento de R$ 2.000/mês. Preciso de uma estratégia completa para os próximos 3 meses focada em LinkedIn e Google Ads, incluindo métricas de acompanhamento e cronograma semanal.",
      aiResponse: "🎯 ESTRATÉGIA COMPLETA - CONSULTORIA IA\n\n📊 ANÁLISE INICIAL:\n• Orçamento: R$ 2.000/mês\n• Foco: LinkedIn (70%) + Google Ads (30%)\n• Período: 3 meses\n\n🚀 MÊS 1 - FUNDAÇÃO:\n• Semana 1-2: Otimização perfil LinkedIn\n• Semana 3-4: Criação de 12 posts educativos\n• Google Ads: R$ 600 (palavras-chave: 'consultoria IA')\n\n📈 MÉTRICAS:\n• LinkedIn: Alcance, engajamento, leads\n• Google: CTR, CPC, conversões\n• Meta: 15 leads qualificados/mês\n\n📅 CRONOGRAMA SEMANAL:\n• Segunda: Planejamento de conteúdo\n• Terça-Quinta: Criação e publicação\n• Sexta: Análise de métricas\n\nPróximo passo: Implementar semana 1?",
      responseType: "good",
      icon: "🚀",
      color: "from-green-100 to-blue-100",
      borderColor: "border-green-200"
    }
  ];

  const steps = [
    { phase: "typing", duration: 2000 },
    { phase: "thinking", duration: 1500 },
    { phase: "response", duration: 4000 },
    { phase: "comparison", duration: 3000 }
  ];

  // Iniciar automaticamente quando o componente monta
  useEffect(() => {
    const startTimer = setTimeout(() => {
      setIsPlaying(true);
    }, 1000); // Pequeno delay para dar tempo da seção aparecer

    return () => clearTimeout(startTimer);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Reiniciar animação após um tempo
        setTimeout(() => {
          setCurrentStep(0);
          // Reiniciar automaticamente após 3 segundos
          setTimeout(() => {
            setIsPlaying(true);
          }, 3000);
        }, 2000);
        setIsPlaying(false);
      }
    }, steps[currentStep]?.duration || 2000);

    return () => clearTimeout(timer);
  }, [currentStep, isPlaying]);

  const startAnimation = () => {
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const currentScenario = currentStep < 2 ? scenarios[0] : scenarios[1];
  const showComparison = currentStep === 3;

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            A Diferença Está no Prompt
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Veja como um prompt bem estruturado transforma resultados medíocres em soluções extraordinárias
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!showComparison && (
            <motion.div
              key="single-demo"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              {/* Chat Interface */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4 flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="ml-4 font-medium">ChatGPT - {currentScenario.title}</span>
                </div>

                {/* Chat Content */}
                <div className="p-6 min-h-[400px] flex flex-col">
                  {/* User Message */}
                  <div className="flex justify-end mb-4">
                    <div className="bg-blue-500 text-white rounded-2xl rounded-br-md px-4 py-3 max-w-[80%]">
                      <AnimatePresence>
                        {currentStep >= 0 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            {currentStep === 0 ? (
                              <motion.span
                                initial={{ width: 0 }}
                                animate={{ width: "auto" }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="inline-block overflow-hidden whitespace-nowrap"
                              >
                                {currentScenario.userPrompt}
                              </motion.span>
                            ) : (
                              currentScenario.userPrompt
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* AI Thinking */}
                  {currentStep === 1 && (
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <MessageCircle className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                        <motion.div
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="flex gap-1"
                        >
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </motion.div>
                      </div>
                    </div>
                  )}

                  {/* AI Response */}
                  {currentStep >= 2 && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm">{currentScenario.icon}</span>
                      </div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className={`bg-gradient-to-br ${currentScenario.color} rounded-2xl rounded-bl-md px-4 py-3 max-w-[85%] border ${currentScenario.borderColor}`}
                      >
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className="whitespace-pre-line text-gray-800"
                        >
                          {currentScenario.aiResponse}
                        </motion.div>
                      </motion.div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quality Indicator */}
              {currentStep >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="mt-6 text-center"
                >
                  <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${
                    currentScenario.responseType === 'bad' 
                      ? 'bg-red-100 text-red-800 border border-red-200' 
                      : 'bg-green-100 text-green-800 border border-green-200'
                  }`}>
                    {currentScenario.responseType === 'bad' ? (
                      <>
                        <X className="h-5 w-5" />
                        <span className="font-semibold">Resposta Genérica e Pouco Útil</span>
                      </>
                    ) : (
                      <>
                        <Check className="h-5 w-5" />
                        <span className="font-semibold">Resposta Específica e Acionável</span>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Comparison View */}
          {showComparison && (
            <motion.div
              key="comparison"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="max-w-6xl mx-auto"
            >
              <div className="grid md:grid-cols-2 gap-8">
                {scenarios.map((scenario, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200"
                  >
                    <div className={`p-4 bg-gradient-to-r ${
                      scenario.responseType === 'bad' 
                        ? 'from-red-500 to-orange-500' 
                        : 'from-green-500 to-blue-500'
                    } text-white`}>
                      <h3 className="font-bold text-lg">{scenario.title}</h3>
                    </div>
                    
                    <div className="p-6">
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-800 mb-2">Prompt:</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                          {scenario.userPrompt}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Resultado:</h4>
                        <div className={`text-sm p-3 rounded-lg bg-gradient-to-br ${scenario.color} border ${scenario.borderColor}`}>
                          {scenario.aiResponse.length > 200 
                            ? `${scenario.aiResponse.substring(0, 200)}...` 
                            : scenario.aiResponse
                          }
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Arrow and CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="text-center mt-12"
              >
                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="text-red-500 font-semibold">Prompt Comum</div>
                  <ArrowRight className="h-8 w-8 text-gray-400" />
                  <div className="text-green-500 font-semibold">Prompt SimbioIA</div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-2xl max-w-2xl mx-auto">
                  <h3 className="text-2xl font-bold mb-2">A Diferença É Transformadora</h3>
                  <p className="text-lg mb-4">
                    Nossos prompts são estruturados para extrair o máximo potencial da IA
                  </p>
                  <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300">
                    Quero Prompts Profissionais
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PromptComparison;

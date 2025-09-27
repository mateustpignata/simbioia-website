import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Play, Sparkles, Zap, ArrowRight, CheckCircle, XCircle, Star } from 'lucide-react'

const InteractivePromptDemo = () => {
  const [activeDemo, setActiveDemo] = useState('marketing')
  const [showComparison, setShowComparison] = useState(false)

  const demos = {
    marketing: {
      title: "Marketing Digital",
      icon: "📱",
      category: "Profissional",
      basic: {
        prompt: "Crie um post para Instagram sobre café",
        result: "☕ Café fresquinho para começar o dia! #cafe #bomdia",
        issues: ["Muito genérico", "Sem estratégia", "Baixo engajamento"]
      },
      professional: {
        prompt: `Atue como um especialista em marketing digital com 10 anos de experiência em redes sociais para cafeterias premium.

CONTEXTO: Cafeteria artesanal que valoriza sustentabilidade e experiência sensorial

OBJETIVO: Criar post para Instagram que gere engajamento e conversões

PÚBLICO-ALVO: Profissionais de 25-40 anos, renda média-alta, valorizam qualidade e sustentabilidade

FORMATO DESEJADO:
- Hook emocional na primeira linha
- Storytelling envolvente
- Call-to-action específico
- 3-5 hashtags estratégicas
- Tom conversacional e autêntico

ELEMENTOS OBRIGATÓRIOS:
- Mencionar origem dos grãos
- Destacar processo artesanal
- Incluir benefício emocional
- Criar senso de urgência sutil`,
        result: `🌅 Sabe aquele momento em que o aroma do café recém-torrado desperta todos os seus sentidos?

Nossos grãos chegaram direto da Fazenda Santa Clara, em Minas Gerais, onde cada pé de café é cultivado com amor e respeito pela natureza. 

O processo de torra artesanal que desenvolvemos realça notas de chocolate amargo e caramelo, criando uma experiência que vai muito além de uma simples bebida - é um ritual de autocuidado que você merece.

☕ Hoje temos apenas 20 pacotes disponíveis desta safra especial.

Que tal transformar sua pausa em um momento de verdadeira conexão consigo mesmo?

#CafeArtesanal #SustentabilidadeNaPratica #MomentosEspeciais #TorraFresquinha #MinasGerais`,
        benefits: ["Storytelling envolvente", "Público específico", "Call-to-action claro", "Senso de urgência", "Conexão emocional"]
      }
    },
    vendas: {
      title: "Estratégia de Vendas",
      icon: "💼",
      category: "Profissional", 
      basic: {
        prompt: "Como vender mais produtos?",
        result: "Faça promoções, melhore o atendimento e divulgue nas redes sociais.",
        issues: ["Muito vago", "Sem estratégia", "Não considera contexto"]
      },
      professional: {
        prompt: `Atue como um consultor de vendas sênior especializado em metodologias SPIN Selling e Challenger Sale.

SITUAÇÃO ATUAL:
- Empresa: SaaS B2B de gestão financeira
- Ticket médio: R$ 2.500/mês
- Ciclo de vendas: 45-60 dias
- Taxa de conversão: 12%
- Principais objeções: preço e implementação

DESAFIO: Aumentar taxa de conversão para 18% nos próximos 90 dias

ANÁLISE NECESSÁRIA:
1. Mapeamento da jornada do cliente atual
2. Identificação de pontos de atrito
3. Estratégias de qualificação de leads
4. Scripts para tratamento de objeções
5. Processo de follow-up estruturado

ENTREGÁVEIS ESPERADOS:
- Playbook de vendas detalhado
- Scripts de descoberta (SPIN)
- Matriz de objeções x respostas
- Cronograma de implementação
- KPIs para acompanhamento

FORMATO: Estrutura executiva com exemplos práticos e métricas específicas`,
        result: `# PLAYBOOK DE VENDAS - AUMENTO DE CONVERSÃO

## 1. DIAGNÓSTICO ATUAL
**Gargalos identificados:**
- Qualificação insuficiente (40% dos leads não são ICP)
- Descoberta superficial de dores
- Follow-up inconsistente
- Proposta genérica

## 2. ESTRATÉGIA SPIN SELLING

**Perguntas de Situação:**
"Como vocês gerenciam o fluxo de caixa atualmente?"
"Quantas pessoas estão envolvidas no processo financeiro?"

**Perguntas de Problema:**
"Qual o impacto quando há atraso na conciliação?"
"Quanto tempo a equipe gasta com relatórios manuais?"

**Perguntas de Implicação:**
"Se isso continuar, como afetará o crescimento da empresa?"
"Qual o custo de oportunidade desses retrabalhos?"

**Perguntas de Necessidade:**
"Seria valioso ter visibilidade em tempo real?"
"Uma redução de 70% no tempo de fechamento seria significativa?"

## 3. TRATAMENTO DE OBJEÇÕES

**"Está muito caro"**
→ "Entendo sua preocupação. Vamos calcular juntos: quanto vocês gastam mensalmente com retrabalho financeiro? Nossos clientes economizam em média R$ 8.000/mês em produtividade."

**"Implementação é complexa"**
→ "Essa é uma preocupação válida. Por isso desenvolvemos um processo de onboarding de 30 dias com suporte dedicado. Posso mostrar como a [Cliente Similar] implementou em 3 semanas?"

## 4. CRONOGRAMA 90 DIAS
- Semana 1-2: Treinamento da equipe
- Semana 3-4: Implementação scripts
- Semana 5-8: Teste A/B abordagens
- Semana 9-12: Otimização baseada em dados

**Meta: 18% conversão até dia 90**`,
        benefits: ["Estratégia estruturada", "Metodologia comprovada", "Scripts específicos", "Métricas claras", "Cronograma detalhado"]
      }
    },
    produtividade: {
      title: "Produtividade Pessoal",
      icon: "⚡",
      category: "Pessoal",
      basic: {
        prompt: "Como ser mais produtivo?",
        result: "Faça listas de tarefas, elimine distrações e organize seu tempo.",
        issues: ["Genérico demais", "Sem personalização", "Não considera contexto"]
      },
      professional: {
        prompt: `Atue como um coach de produtividade especializado em profissionais de tecnologia com metodologias baseadas em neurociência e psicologia comportamental.

PERFIL DO USUÁRIO:
- Desenvolvedor sênior, 32 anos
- Trabalha remoto há 3 anos
- Dificuldade com foco em tarefas longas
- Tendência à procrastinação em tarefas administrativas
- Objetivo: aumentar deep work de 2h para 6h diárias

CONTEXTO ATUAL:
- Jornada: 8h/dia
- Interrupções: 15-20 por dia
- Reuniões: 2-3h diárias
- Energia alta: manhã (8h-11h)
- Energia baixa: pós-almoço (14h-16h)

METODOLOGIAS A APLICAR:
- Time blocking baseado em energia
- Técnica Pomodoro adaptada
- Batching de tarefas similares
- Protocolo de comunicação assíncrona
- Sistema de recompensas neurológicas

ENTREGÁVEL:
Cronograma semanal detalhado com:
- Blocos de deep work otimizados
- Estratégias anti-procrastinação
- Sistema de métricas pessoais
- Protocolo de emergências
- Plano de implementação gradual (30 dias)`,
        result: `# SISTEMA DE PRODUTIVIDADE PERSONALIZADO

## 🧠 ANÁLISE NEUROCIENTÍFICA
Seu perfil indica **cronotipo matutino** com pico de cortisol às 8h. Vamos aproveitar essa janela biológica.

## 📅 CRONOGRAMA OTIMIZADO

**BLOCO 1: DEEP WORK (8h-11h)**
- 8h00-8h15: Ritual de início (café + revisão objetivos)
- 8h15-9h45: Pomodoro duplo (90min) - Tarefa mais complexa
- 9h45-10h00: Pausa ativa (caminhada)
- 10h00-11h30: Segundo bloco deep work

**BLOCO 2: COLABORAÇÃO (11h30-13h)**
- Reuniões e comunicação
- Code reviews
- Mentoria/pair programming

**BLOCO 3: TAREFAS ADMINISTRATIVAS (14h-15h)**
- Emails (batch processing)
- Documentação
- Planejamento do dia seguinte

**BLOCO 4: APRENDIZADO (15h30-17h)**
- Cursos/estudos
- Experimentação
- Side projects

## 🎯 ESTRATÉGIAS ANTI-PROCRASTINAÇÃO

**Técnica dos 2 Minutos:**
Se leva menos de 2min → Faça agora
Se leva mais → Agende no calendário

**Gamificação Pessoal:**
- ✅ Deep work 90min = 10 pontos
- ✅ Zero interrupções = 5 pontos
- ✅ Semana completa = 50 pontos bônus
- 100 pontos = Recompensa escolhida

## 📊 MÉTRICAS DE ACOMPANHAMENTO
- Horas de deep work/dia (meta: 6h)
- Número de interrupções (meta: <8)
- Tarefas importantes concluídas (meta: 3/dia)
- Nível de energia (escala 1-10)

## 🚀 IMPLEMENTAÇÃO 30 DIAS
**Semana 1:** Apenas morning routine + 1 bloco deep work
**Semana 2:** Adicionar batching de emails
**Semana 3:** Implementar sistema completo
**Semana 4:** Otimizar baseado nos dados coletados

**Protocolo de Emergência:**
Se surgir "urgência" durante deep work:
1. Anote em papel (não abra app)
2. Avalie: É realmente urgente?
3. Se sim: 5min máximo
4. Se não: Agenda para bloco apropriado`,
        benefits: ["Baseado em neurociência", "Totalmente personalizado", "Sistema de métricas", "Implementação gradual", "Protocolo de emergências"]
      }
    }
  }

  const currentDemo = demos[activeDemo]

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Veja a Diferença na Prática
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Compare prompts básicos com nossos prompts profissionais e descubra o poder da especialização
        </p>
        
        <Tabs value={activeDemo} onValueChange={setActiveDemo} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="marketing" className="flex items-center gap-2">
              📱 Marketing
            </TabsTrigger>
            <TabsTrigger value="vendas" className="flex items-center gap-2">
              💼 Vendas
            </TabsTrigger>
            <TabsTrigger value="produtividade" className="flex items-center gap-2">
              ⚡ Produtividade
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Prompt Básico */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="h-full border-red-200 bg-red-50/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-red-700 flex items-center gap-2">
                  <XCircle className="h-5 w-5" />
                  Prompt Básico
                </CardTitle>
                <Badge variant="destructive">Gratuito</Badge>
              </div>
              <CardDescription>O que você encontra em qualquer lugar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-red-200">
                <h4 className="font-medium text-gray-700 mb-2">Prompt:</h4>
                <p className="text-sm text-gray-600 italic">"{currentDemo.basic.prompt}"</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-red-200">
                <h4 className="font-medium text-gray-700 mb-2">Resultado:</h4>
                <p className="text-sm text-gray-600">{currentDemo.basic.result}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-red-700">Problemas:</h4>
                {currentDemo.basic.issues.map((issue, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-red-600">
                    <XCircle className="h-4 w-4" />
                    {issue}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Prompt Profissional */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="h-full border-green-200 bg-green-50/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-green-700 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Prompt SimbioIA
                </CardTitle>
                <Badge className="bg-green-600">R$ 9,99</Badge>
              </div>
              <CardDescription>Desenvolvido por especialistas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-green-200 max-h-40 overflow-y-auto">
                <h4 className="font-medium text-gray-700 mb-2">Prompt Profissional:</h4>
                <p className="text-xs text-gray-600 whitespace-pre-line">{currentDemo.professional.prompt}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-green-200 max-h-60 overflow-y-auto">
                <h4 className="font-medium text-gray-700 mb-2">Resultado:</h4>
                <div className="text-xs text-gray-600 whitespace-pre-line">{currentDemo.professional.result}</div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-green-700">Benefícios:</h4>
                {currentDemo.professional.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    {benefit}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl"
      >
        <h3 className="text-2xl font-bold mb-4">
          A Diferença Está nos Detalhes
        </h3>
        <p className="text-lg mb-6 opacity-90">
          Nossos prompts são desenvolvidos por especialistas com anos de experiência. 
          Cada palavra é pensada para maximizar resultados.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
            <Star className="h-4 w-4" />
            <span className="text-sm">Testados por especialistas</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
            <Zap className="h-4 w-4" />
            <span className="text-sm">Resultados comprovados</span>
          </div>
          <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm">Atualizações constantes</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default InteractivePromptDemo

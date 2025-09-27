// Dados dos prompts organizados por categoria: Pessoal vs Profissional
// Baseado na pesquisa de prompts mais demandados e profissões que mais usam IA

export const promptsData = {
  // PROMPTS PARA USO PESSOAL / DIA A DIA
  personal: [
    {
      id: 1,
      title: "Assistente de Desenvolvimento Pessoal",
      description: "Descubra seu potencial, defina metas claras e crie um plano de crescimento personalizado",
      category: "Desenvolvimento Pessoal",
      platform: "ChatGPT",
      price: 9.99,
      rating: 4.9,
      sales: 2847,
      tags: ["Autoconhecimento", "Metas", "Crescimento"],
      featured: true,
      icon: "🧠",
      benefits: ["Análise de personalidade", "Definição de objetivos", "Plano de ação personalizado"]
    },
    {
      id: 2,
      title: "Organizador de Vida Inteligente",
      description: "Rotinas otimizadas, listas de tarefas inteligentes e planejamento de tempo eficiente",
      category: "Produtividade Pessoal",
      platform: "Manus",
      price: 9.99,
      rating: 4.8,
      sales: 1923,
      tags: ["Rotina", "Organização", "Tempo"],
      featured: true,
      icon: "📅",
      benefits: ["Rotinas personalizadas", "Gestão de tempo", "Listas inteligentes"]
    },
    {
      id: 3,
      title: "Mentor de Aprendizado Acelerado",
      description: "Técnicas de estudo, resumos inteligentes e planos de aprendizado personalizados",
      category: "Educação",
      platform: "Gemini",
      price: 9.99,
      rating: 4.7,
      sales: 1654,
      tags: ["Estudo", "Aprendizado", "Resumos"],
      featured: false,
      icon: "📚",
      benefits: ["Técnicas de memorização", "Resumos automáticos", "Planos de estudo"]
    },
    {
      id: 4,
      title: "Consultor de Finanças Pessoais",
      description: "Orçamentos inteligentes, planejamento financeiro e dicas de economia personalizadas",
      category: "Finanças",
      platform: "ChatGPT",
      price: 9.99,
      rating: 4.6,
      sales: 1432,
      tags: ["Orçamento", "Economia", "Investimentos"],
      featured: false,
      icon: "💰",
      benefits: ["Controle de gastos", "Planejamento financeiro", "Dicas de economia"]
    },
    {
      id: 5,
      title: "Planejador de Viagens Inteligente",
      description: "Roteiros personalizados, dicas locais e planejamento de viagens econômicas",
      category: "Lifestyle",
      platform: "Gemini",
      price: 9.99,
      rating: 4.8,
      sales: 1876,
      tags: ["Viagem", "Roteiros", "Economia"],
      featured: false,
      icon: "✈️",
      benefits: ["Roteiros personalizados", "Dicas locais", "Orçamento de viagem"]
    },
    {
      id: 6,
      title: "Coach de Relacionamentos",
      description: "Comunicação eficaz, resolução de conflitos e fortalecimento de relacionamentos",
      category: "Relacionamentos",
      platform: "ChatGPT",
      price: 9.99,
      rating: 4.5,
      sales: 987,
      tags: ["Comunicação", "Conflitos", "Relacionamentos"],
      featured: false,
      icon: "💝",
      benefits: ["Comunicação assertiva", "Resolução de conflitos", "Relacionamentos saudáveis"]
    }
  ],

  // PROMPTS PARA USO PROFISSIONAL
  professional: [
    {
      id: 7,
      title: "Arsenal Completo de Marketing Digital",
      description: "50+ prompts para campanhas, copy persuasivo, posts para redes sociais e e-mail marketing",
      category: "Marketing & Vendas",
      platform: "ChatGPT",
      price: 9.99,
      rating: 4.9,
      sales: 3247,
      tags: ["Campanhas", "Copy", "Redes Sociais", "E-mail"],
      featured: true,
      icon: "📈",
      benefits: ["Campanhas completas", "Copy que converte", "Conteúdo para redes sociais"]
    },
    {
      id: 8,
      title: "Scripts de Vendas de Alto Impacto",
      description: "Roteiros testados para vendas por telefone, WhatsApp e presencial com tratamento de objeções",
      category: "Marketing & Vendas",
      platform: "Manus",
      price: 9.99,
      rating: 4.8,
      sales: 2156,
      tags: ["Scripts", "Vendas", "Objeções", "Conversão"],
      featured: true,
      icon: "🎯",
      benefits: ["Scripts testados", "Tratamento de objeções", "Técnicas de fechamento"]
    },
    {
      id: 9,
      title: "Criador de Conteúdo Profissional",
      description: "Artigos, posts, roteiros e conteúdo otimizado para blogs, YouTube e redes sociais",
      category: "Criação de Conteúdo",
      platform: "ChatGPT",
      price: 9.99,
      rating: 4.7,
      sales: 2834,
      tags: ["Artigos", "YouTube", "Blog", "SEO"],
      featured: true,
      icon: "✍️",
      benefits: ["Conteúdo otimizado", "Roteiros para vídeo", "Artigos de blog"]
    },
    {
      id: 10,
      title: "Assistente de Atendimento ao Cliente",
      description: "Chatbots inteligentes, respostas automáticas e fluxos de atendimento para WhatsApp e e-mail",
      category: "Atendimento",
      platform: "Manus",
      price: 9.99,
      rating: 4.6,
      sales: 1789,
      tags: ["Chatbot", "Atendimento", "WhatsApp", "Automação"],
      featured: false,
      icon: "🤖",
      benefits: ["Respostas automáticas", "Fluxos de atendimento", "Chatbots inteligentes"]
    },
    {
      id: 11,
      title: "Analista de Dados e Insights",
      description: "Relatórios profissionais, análise de dados e geração de insights estratégicos",
      category: "Análise & Estratégia",
      platform: "Gemini",
      price: 9.99,
      rating: 4.8,
      sales: 1543,
      tags: ["Relatórios", "Dados", "Insights", "Estratégia"],
      featured: false,
      icon: "📊",
      benefits: ["Relatórios profissionais", "Análise de dados", "Insights estratégicos"]
    },
    {
      id: 12,
      title: "Comunicador Corporativo",
      description: "E-mails profissionais, apresentações impactantes e documentos corporativos",
      category: "Comunicação",
      platform: "ChatGPT",
      price: 9.99,
      rating: 4.5,
      sales: 1234,
      tags: ["E-mails", "Apresentações", "Documentos", "Corporativo"],
      featured: false,
      icon: "📧",
      benefits: ["E-mails profissionais", "Apresentações impactantes", "Documentos corporativos"]
    },
    {
      id: 13,
      title: "Designer Visual com IA",
      description: "Prompts para Midjourney e DALL-E: logos, ilustrações, designs para marketing",
      category: "Design & Criatividade",
      platform: "Midjourney",
      price: 9.99,
      rating: 4.9,
      sales: 2567,
      tags: ["Logo", "Design", "Ilustração", "Marketing"],
      featured: false,
      icon: "🎨",
      benefits: ["Logos profissionais", "Ilustrações únicas", "Designs para marketing"]
    },
    {
      id: 14,
      title: "Educador e Criador de Cursos",
      description: "Material didático, planos de aula e conteúdo educacional envolvente",
      category: "Educação",
      platform: "ChatGPT",
      price: 9.99,
      rating: 4.7,
      sales: 1876,
      tags: ["Educação", "Cursos", "Material Didático", "Aulas"],
      featured: false,
      icon: "🎓",
      benefits: ["Material didático", "Planos de aula", "Conteúdo educacional"]
    }
  ]
}

// Categorias para filtros
export const categories = {
  personal: [
    "Todos",
    "Desenvolvimento Pessoal",
    "Produtividade Pessoal", 
    "Educação",
    "Finanças",
    "Lifestyle",
    "Relacionamentos"
  ],
  professional: [
    "Todos",
    "Marketing & Vendas",
    "Criação de Conteúdo",
    "Atendimento",
    "Análise & Estratégia",
    "Comunicação",
    "Design & Criatividade",
    "Educação"
  ]
}

// Plataformas disponíveis
export const platforms = ["Todos", "ChatGPT", "Gemini", "Manus", "Midjourney"]

// Função para obter todos os prompts
export const getAllPrompts = () => {
  return [...promptsData.personal, ...promptsData.professional]
}

// Função para obter prompts em destaque
export const getFeaturedPrompts = () => {
  return getAllPrompts().filter(prompt => prompt.featured)
}

// Função para obter prompts por tipo (personal/professional)
export const getPromptsByType = (type) => {
  return promptsData[type] || []
}

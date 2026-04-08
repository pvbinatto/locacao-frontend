import React from 'react';
import Layout from '../components/Layout';

const Documentation: React.FC = () => {
  const sections = [
    {
      title: 'Painel de Controle (Dashboard)',
      icon: 'dashboard',
      description: 'A central de inteligência da LocaCar. Aqui você visualiza os principais indicadores de desempenho (KPIs) em tempo real.',
      features: [
        'Totalizador de clientes e veículos ativos.',
        'Receita mensal e valor total da frota em circulação.',
        'Alertas de veículos em manutenção.',
        'Lista de devoluções pendentes para o dia atual.',
        'Gráfico de tendências de novas locações.'
      ]
    },
    {
      title: 'Gestão de Frota',
      icon: 'directions_car',
      description: 'Módulo completo para gerenciar seus ativos móveis. Cada veículo possui um ciclo de vida monitorado.',
      features: [
        'Cadastro detalhado com marca, modelo, placa e ano.',
        'Status automático (Disponível, Locado, Manutenção).',
        'Pesquisa rápida por placa.',
        'Histórico de utilização por cada veículo.'
      ]
    },
    {
      title: 'Gestão de Clientes',
      icon: 'group',
      description: 'Base de dados centralizada para gestão de locatários e empresas.',
      features: [
        'Cadastro rápido com busca automática de endereço via CEP.',
        'Máscaras dinâmicas para telefone e documentos.',
        'Indicadores de tempo de parceria e status de atividade.',
        'Edição ágil de dados de contato.'
      ]
    },
    {
      title: 'Operação de Locações',
      icon: 'key',
      description: 'Onde o faturamento acontece. Gerencie contratos e movimentações de forma simplificada.',
      features: [
        'Interface simplificada para abertura de novos contratos.',
        'Cálculo dinâmico de datas de devolução.',
        'Controle de status de entrega e check-in.',
        'Associação inteligente entre Clientes e Veículos disponíveis.'
      ]
    },
    {
      title: 'Manutenção Preventiva e Corretiva',
      icon: 'build',
      description: 'Preserve o valor da sua frota e garanta a segurança dos seus clientes.',
      features: [
        'Registro de custos por cada intervenção rercuperando a lucratividade.',
        'Descritivo detalhado de peças e serviços realizados.',
        'Atualização automática do status do veículo ao entrar na oficina.',
        'Métricas de custo mensal com manutenção.'
      ]
    },
  ];

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header className="border-b border-outline-variant pb-8">
          <h1 className="text-4xl font-extrabold font-headline mb-4">Documentação do Sistema</h1>
          <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
            Bem-vindo ao guia oficial da LocaCar Management. Este documento detalha o funcionamento de cada módulo da plataforma para maximizar sua eficiência operacional.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-primary/5 p-8 rounded-2xl border border-primary/20">
            <h2 className="text-xl font-bold font-headline mb-4 flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined">info</span>
              Filosofia do Sistema
            </h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              A LocaCar foi projetada sobre os pilares da **Alta Performance** e **Multi-tenancy**. Cada unidade de negócio opera em um ambiente isolado (Tenant), garantindo total integridade e segurança dos dados, enquanto desfruta de uma interface ultra-responsiva e adaptável (Light/Dark).
            </p>
          </section>

          <section className="bg-secondary/5 p-8 rounded-2xl border border-secondary/20">
            <h2 className="text-xl font-bold font-headline mb-4 flex items-center gap-2 text-secondary">
              <span className="material-symbols-outlined">palette</span>
              Sistema de Temas
            </h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              O sistema suporta alternância de temas em tempo real. O **Modo Escuro** é otimizado para ambientes de baixa luminosidade, reduzindo a fadiga visual. O **Modo Claro** oferece contraste máximo para operações diurnas sob luz intensa. Suas preferências são salvas automaticamente.
            </p>
          </section>
        </div>

        <div className="space-y-8">
          <h2 className="text-2xl font-black font-headline tracking-tighter uppercase px-2">Exploração de Telas</h2>
          {sections.map((section, idx) => (
            <div key={idx} className="bg-surface-container rounded-2xl p-8 border border-outline-variant hover:border-primary/30 transition-all group">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary text-3xl">{section.icon}</span>
                </div>
                <div className="space-y-4 flex-1">
                  <div>
                    <h3 className="text-2xl font-bold font-headline mb-2">{section.title}</h3>
                    <p className="text-on-surface-variant leading-relaxed">{section.description}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {section.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-sm text-on-surface/80 bg-background/50 p-3 rounded-lg border border-outline-variant/50">
                        <span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <footer className="pt-12 border-t border-outline-variant text-center pb-20">
          <p className="text-on-surface-variant italic mb-6">"Software é a tradução da eficiência em linhas de código."</p>
          <div className="flex justify-center gap-4">
            <div className="px-6 py-2 bg-surface-container-high rounded-full text-xs font-bold font-label uppercase tracking-widest border border-outline-variant">Versão 1.5.0-PRO</div>
            <div className="px-6 py-2 bg-surface-container-high rounded-full text-xs font-bold font-label uppercase tracking-widest border border-outline-variant">Release: Abr 2026</div>
          </div>
        </footer>
      </div>
    </Layout>
  );
};

export default Documentation;

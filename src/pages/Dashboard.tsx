import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { dashboardApi } from '../services/api';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardApi.getStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <Layout><div className="flex items-center justify-center h-[60vh]"><span className="animate-pulse text-primary font-bold">Carregando painel de comando...</span></div></Layout>;
  }

  const kpis = [
    { label: 'Total Clientes', value: stats?.totalCustomers || '0', change: '+12%', icon: 'group', color: 'primary' },
    { label: 'Total Veículos', value: stats?.totalVehicles || '0', change: '98% Ativo', icon: 'directions_car', color: 'tertiary' },
    { label: 'Mensal (Receita)', value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats?.revenue?.monthly || 0), change: 'Revenue', icon: 'payments', color: 'primary' },
    { label: 'Valor da Frota', value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(stats?.totalStockValue || 0), change: 'Asset Value', icon: 'inventory_2', color: 'tertiary' },
    { label: 'Manutenção (Mês)', value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats?.maintenance?.monthlyValue || 0), change: 'Maintenance', icon: 'build', color: 'error', path: '/maintenance' },
  ];

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-700">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold font-headline text-on-surface">Visão Geral</h1>
            <p className="text-on-surface-variant">Central de comando operacional da sua locadora.</p>
          </div>
          <button 
            onClick={() => navigate('/rentals')}
            className="bg-primary hover:bg-primary-container text-on-primary font-bold px-6 py-2.5 rounded-xl transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            Nova Locação
          </button>
        </header>

        {/* KPI Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {kpis.map((kpi, idx) => (
            <div 
              key={idx} 
              onClick={() => kpi.path ? navigate(kpi.path) : null}
              className={`bg-surface-container-low p-6 rounded-xl transition-all hover:bg-surface-container-high translate-y-0 hover:-translate-y-1 group ${kpi.path ? 'cursor-pointer' : ''}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${
                  kpi.color === 'primary' ? 'bg-primary/10 text-primary' : 
                  kpi.color === 'error' ? 'bg-error/10 text-error' : 
                  'bg-tertiary/10 text-tertiary'
                }`}>
                  <span className="material-symbols-outlined">{kpi.icon}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${idx === 0 ? 'bg-emerald-400/10 text-emerald-400' : 'text-slate-400'}`}>
                  {kpi.change}
                </span>
              </div>
              <p className="text-slate-400 text-xs font-medium font-label uppercase tracking-widest">{kpi.label}</p>
              <h3 className="text-2xl font-extrabold font-headline mt-1 text-on-surface truncate">{kpi.value}</h3>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Últimas Locações */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-end px-2">
              <h2 className="text-xl font-extrabold font-headline text-on-surface">Últimas Locações</h2>
              <button className="text-xs font-bold text-primary hover:underline">Ver todas</button>
            </div>
            <div className="bg-surface-container rounded-xl overflow-hidden shadow-xl border border-slate-800/30">
              <table className="w-full text-left">
                <thead className="bg-surface-container-highest/30">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Data Locação</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nome Cliente</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Veículo</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Valor</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/20">
                  {stats?.lastRentals?.map((rental: any, i: number) => (
                    <tr key={i} className="hover:bg-surface-container-low transition-colors group">
                      <td className="px-6 py-4 text-sm font-medium">{new Date(rental.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="px-6 py-4 text-sm">{rental.customer}</td>
                      <td className="px-6 py-4 text-sm flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center ring-1 ring-white/10 uppercase text-[10px] font-bold">
                          {rental.vehicle.substring(0, 2)}
                        </div>
                        {rental.vehicle}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-primary">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(rental.value)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${rental.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'}`}>
                          {rental.status === 'active' ? 'Ativa' : 'Finalizada'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-surface-container-highest rounded">
                          <span className="material-symbols-outlined text-sm">more_vert</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(!stats?.lastRentals || stats.lastRentals.length === 0) && (
                    <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-500 text-sm italic">Nenhuma locação recente encontrada.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Devoluções do Dia */}
          <div className="space-y-4">
            <div className="flex justify-between items-end px-2">
              <h2 className="text-xl font-extrabold font-headline text-on-surface">Devoluções</h2>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-tertiary animate-pulse"></span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stats?.todaysReturns?.length || 0} Pendentes</span>
              </div>
            </div>
            <div className="space-y-3">
              {stats?.todaysReturns?.map((ret: any, i: number) => (
                <div 
                  key={i} 
                  className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between border-l-4 transition-all hover:bg-surface-container-high border-tertiary"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center">
                      <span className="material-symbols-outlined text-tertiary">key</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">{ret.vehicle}</p>
                      <p className="text-xs text-slate-500">{ret.customer}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="material-symbols-outlined text-[12px] text-slate-500">calendar_today</span>
                        <p className={`text-[10px] font-bold uppercase ${ret.isOverdue ? 'text-error animate-pulse' : 'text-slate-400'}`}>
                          {new Date(ret.returnDate).toLocaleDateString('pt-BR')} {ret.isOverdue && '(Atrasado)'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <button className="text-[10px] font-bold text-tertiary uppercase tracking-tighter hover:underline">Check-in</button>
                  </div>
                </div>
              ))}
              {(!stats?.todaysReturns || stats.todaysReturns.length === 0) && (
                <div className="p-8 text-center bg-surface-container/20 rounded-xl border-2 border-dashed border-slate-800/10">
                  <p className="text-xs text-slate-600 font-medium italic">Sem devoluções pendentes para hoje.</p>
                </div>
              )}
              <button className="w-full py-4 border-2 border-dashed border-slate-800 rounded-xl text-slate-500 text-xs font-bold hover:border-slate-700 transition-colors uppercase tracking-widest flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">event</span>
                Agendar Nova Devolução
              </button>
            </div>

            {/* Veículos em Manutenção */}
            <div className="space-y-4">
              <div className="flex justify-between items-end px-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold font-headline text-on-surface">Em Manutenção</h2>
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] rounded-full font-bold">ALPHA</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stats?.maintenance?.vehiclesInMaintenance?.length || 0} Veículos</span>
                </div>
              </div>
              <div className="space-y-3">
                {stats?.maintenance?.vehiclesInMaintenance?.map((v: any, i: number) => (
                  <div 
                    key={i} 
                    className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between border-l-4 transition-all hover:bg-surface-container-high border-primary"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">build</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-surface">{v.model}</p>
                        <p className="text-xs text-slate-500">{v.plate}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <button 
                        onClick={() => navigate('/maintenance')}
                        className="text-[10px] font-bold text-primary uppercase tracking-tighter hover:underline"
                      >
                        Ver Ficha
                      </button>
                    </div>
                  </div>
                ))}
                {(!stats?.maintenance?.vehiclesInMaintenance || stats.maintenance.vehiclesInMaintenance.length === 0) && (
                  <div className="p-8 text-center bg-surface-container/20 rounded-xl border-2 border-dashed border-slate-800/10">
                    <p className="text-xs text-slate-600 font-medium italic">Nenhum veículo em manutenção.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

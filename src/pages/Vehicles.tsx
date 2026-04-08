import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { vehicleApi } from '../services/api';
import { maskPlate, maskCurrency, parseCurrencyToNumber } from '../utils/masks';
import StatusDialog from '../components/StatusDialog';

const Vehicles: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const highlightPlate = location.state?.highlightPlate;

  const [vehicles, setVehicles] = useState<any[]>([]);
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  const filteredVehicles = React.useMemo(() => {
    let result = vehicles;
    
    // Header search highlight
    if (highlightPlate && !localSearchQuery) {
      result = result.filter(v => v.plate === highlightPlate);
    }

    // Local table search
    if (localSearchQuery) {
      const q = localSearchQuery.toLowerCase();
      result = result.filter(v => 
        v.plate.toLowerCase().includes(q) || 
        v.model.toLowerCase().includes(q) || 
        v.brand.toLowerCase().includes(q)
      );
    }
    
    return result;
  }, [vehicles, highlightPlate, localSearchQuery]);
  const [dialog, setDialog] = useState<{ isOpen: boolean; type: 'success' | 'error' | 'warning'; title: string; message: string }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  const fetchVehicles = async () => {
    try {
      const data = await vehicleApi.list();
      setVehicles(data);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      // Done
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleCreateVehicle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      brand: formData.get('brand'),
      model: formData.get('model'),
      plate: formData.get('plate'),
      color: formData.get('color'),
      km: Number(formData.get('km')),
      vehicleValue: parseCurrencyToNumber(formData.get('vehicleValue') as string),
      dailyRentalValue: parseCurrencyToNumber(formData.get('dailyRentalValue') as string),
      isAvailable: true,
    };

    try {
      await vehicleApi.create(data);
      setIsModalOpen(false);
      setDialog({
        isOpen: true,
        type: 'success',
        title: 'Sucesso!',
        message: `${data.brand} ${data.model} foi cadastrado com sucesso na frota.`
      });
      fetchVehicles();
    } catch (err: any) {
      setDialog({
        isOpen: true,
        type: 'error',
        title: 'Oops!',
        message: err.message
      });
    }
  };

  const handleUpdateVehicle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedVehicle) return;
    const formData = new FormData(e.currentTarget);
    const data = {
      brand: formData.get('brand'),
      model: formData.get('model'),
      plate: formData.get('plate'),
      color: formData.get('color'),
      km: Number(formData.get('km')),
      vehicleValue: parseCurrencyToNumber(formData.get('vehicleValue') as string),
      dailyRentalValue: parseCurrencyToNumber(formData.get('dailyRentalValue') as string),
    };

    try {
      await vehicleApi.update(selectedVehicle.id, data);
      setIsEditModalOpen(false);
      setSelectedVehicle(null);
      setDialog({
        isOpen: true,
        type: 'success',
        title: 'Atualizado!',
        message: `As informações do veículo foram salvas com sucesso.`
      });
      fetchVehicles();
    } catch (err: any) {
      setDialog({
        isOpen: true,
        type: 'error',
        title: 'Erro na Atualização',
        message: err.message
      });
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedVehicle) return;
    try {
      await vehicleApi.update(selectedVehicle.id, { status });
      setIsStatusModalOpen(false);
      setSelectedVehicle(null);
      setDialog({
        isOpen: true,
        type: 'success',
        title: 'Status Alterado!',
        message: `O status do veículo foi atualizado para ${status === 'available' ? 'Disponível' : status === 'rented' ? 'Locado' : 'Manutenção'}.`
      });
      fetchVehicles();
    } catch (err: any) {
      setDialog({
        isOpen: true,
        type: 'error',
        title: 'Erro no Status',
        message: err.message
      });
    }
  };

  const stats = [
    { label: 'Frota Total', value: vehicles.length.toString(), change: '+12%', color: 'primary' },
    { label: 'Disponível', value: vehicles.filter(v => v.status === 'available').length.toString(), icon: 'check_circle', color: 'emerald' },
    { label: 'Locado', value: vehicles.filter(v => v.status === 'rented').length.toString(), icon: 'key', color: 'tertiary' },
    { label: 'Em Manutenção', value: vehicles.filter(v => v.status === 'maintenance').length.toString(), icon: 'build', color: 'error' },
  ];

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2 uppercase tracking-widest font-semibold">
              <span>Frota</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-primary">Gestão de Inventário</span>
            </nav>
            <h2 className="text-4xl font-extrabold text-on-surface font-headline tracking-tight">Veículos</h2>
            <p className="text-on-surface-variant mt-1">Gerencie, rastreie e cadastre os ativos da sua frota.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all group"
          >
            <span className="material-symbols-outlined font-bold group-hover:rotate-90 transition-transform">add</span>
            Novo Veículo
          </button>
        </div>

        {/* Bento Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-surface-container-low p-6 rounded-xl border-none">
              <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-4">{stat.label}</p>
              <div className="flex items-end justify-between">
                <h3 className="text-3xl font-black font-headline tracking-tighter">{stat.value}</h3>
                {stat.change && (
                  <span className={`text-xs font-bold px-2 py-1 rounded ${stat.color === 'emerald' ? 'text-emerald-400 bg-emerald-400/10' : 'text-error bg-error/10'}`}>
                    {stat.change}
                  </span>
                )}
                {stat.icon && (
                  <span className={`material-symbols-outlined ${stat.color === 'emerald' ? 'text-emerald-400' : 'text-tertiary'}`}>
                    {stat.icon}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Vehicle List Container */}
        <div className="bg-surface-container-low rounded-2xl shadow-2xl shadow-black/20 border border-slate-800/30">
          <div className="p-6 border-b border-slate-800/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <h3 className="font-headline font-bold text-lg w-full sm:w-auto">Lista de Inventário</h3>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[18px]">search</span>
                <input 
                  type="text"
                  placeholder="Buscar marca, modelo ou placa..."
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  className="w-full bg-surface-container-high/40 border border-slate-800/50 rounded-lg py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-primary/50 text-on-surface-variant outline-none transition-all placeholder:text-slate-500"
                />
              </div>
            </div>
          </div>
          <div>
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-surface-container/50">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant opacity-60">Marca</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant opacity-60">Modelo</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant opacity-60">Placa</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant opacity-60">Cor</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant opacity-60 text-right">KM</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant opacity-60 text-right">Valor</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant opacity-60 text-center">Status</th>
                  <th className="px-6 py-4 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/20">
                {highlightPlate && (
                  <tr>
                    <td colSpan={8} className="px-6 py-2 bg-primary/10 text-xs font-bold text-primary flex items-center justify-between">
                      <span>Exibindo veículo filtrado por placa: {highlightPlate}</span>
                      <button onClick={() => navigate('/vehicles', { replace: true, state: {} })} className="underline">Limpar Filtro</button>
                    </td>
                  </tr>
                )}
                {filteredVehicles.map((v, i) => (
                  <tr key={i} className="hover:bg-surface-container-high/40 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="font-bold text-primary">{v.brand}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-sm">{v.model}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-slate-400 text-sm">{v.plate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-500 ring-2 ring-white/10"></div>
                        <span>{v.color}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-sm">
                      {new Intl.NumberFormat('pt-BR').format(v.km)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-sm">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v.vehicleValue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        v.status === 'available' ? 'bg-emerald-500/10 text-emerald-400' : 
                        v.status === 'rented' ? 'bg-tertiary/10 text-tertiary' : 'bg-error/10 text-error'
                      }`}>
                        {v.status === 'available' ? 'Disponível' : v.status === 'rented' ? 'Locado' : 'Manutenção'}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-center relative ${activeMenuId === v.id ? 'z-[50]' : ''}`}>
                      <button 
                        onClick={() => setActiveMenuId(activeMenuId === v.id ? null : v.id)}
                        className="text-slate-500 hover:text-white transition-colors"
                      >
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                      
                      {activeMenuId === v.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)}></div>
                          <div className="absolute right-0 mt-2 w-48 bg-surface-container-high rounded-xl shadow-2xl border border-slate-700/50 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <button 
                              onClick={() => {
                                setSelectedVehicle(v);
                                setIsEditModalOpen(true);
                                setActiveMenuId(null);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-200 hover:bg-primary/20 hover:text-primary transition-colors text-left"
                            >
                              <span className="material-symbols-outlined text-sm">edit</span>
                              Editar Dados
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedVehicle(v);
                                setIsStatusModalOpen(true);
                                setActiveMenuId(null);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-200 hover:bg-tertiary/20 hover:text-tertiary transition-colors text-left border-t border-slate-700/30"
                            >
                              <span className="material-symbols-outlined text-sm">sync_alt</span>
                              Alterar Status
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-surface-container/30 flex items-center justify-between text-xs text-slate-500 font-medium font-headline uppercase tracking-widest">
            <p>Mostrando {vehicles.length} veículos</p>
          </div>
        </div>

        {/* New Vehicle Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center animate-in fade-in duration-300">
            <div className="bg-surface-container-low w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-slate-800/50 m-4">
              <div className="p-8 flex items-center justify-between bg-surface-container">
                <div>
                  <h3 className="text-2xl font-black font-headline tracking-tight">Novo Veículo</h3>
                  <p className="text-on-surface-variant text-sm">Adicione um novo ativo à sua frota.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 rounded-full hover:bg-surface-bright flex items-center justify-center transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <form className="p-8 space-y-6" onSubmit={handleCreateVehicle}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-60">Marca</label>
                    <input name="brand" required className="w-full bg-surface-container border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 transition-all text-sm shadow-inner" placeholder="Ex: Porsche" type="text"/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-60">Modelo</label>
                    <input name="model" required className="w-full bg-surface-container border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 transition-all text-sm shadow-inner" placeholder="Ex: 911 Carrera S" type="text"/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-60">Placa</label>
                    <input 
                      name="plate" 
                      required 
                      className="w-full bg-surface-container border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 transition-all text-sm font-mono shadow-inner uppercase" 
                      placeholder="ABC-1234" 
                      type="text"
                      maxLength={8}
                      onChange={(e) => {
                        e.target.value = maskPlate(e.target.value);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-60">Cor</label>
                    <input name="color" required className="w-full bg-surface-container border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 transition-all text-sm shadow-inner" placeholder="Branco" type="text"/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-60">KM Atual</label>
                    <div className="relative">
                      <input name="km" required className="w-full bg-surface-container border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 transition-all text-sm pr-12 shadow-inner" placeholder="0" type="number"/>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-600">KM</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-60">Valor do Veículo</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">R$</span>
                      <input 
                        name="vehicleValue" 
                        required 
                        className="w-full bg-surface-container border-none rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary/50 transition-all text-sm font-bold shadow-inner" 
                        placeholder="R$ 0,00" 
                        type="text"
                        onChange={(e) => {
                          e.target.value = maskCurrency(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-tertiary opacity-80">Valor da Diária (Locação)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-tertiary">R$</span>
                      <input 
                        name="dailyRentalValue" 
                        required 
                        className="w-full bg-tertiary/5 border border-tertiary/20 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-tertiary/50 transition-all text-sm font-bold shadow-inner text-tertiary" 
                        placeholder="R$ 0,00" 
                        type="text"
                        onChange={(e) => {
                          e.target.value = maskCurrency(e.target.value);
                        }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">Defina o preço base para cobrança diária.</p>
                  </div>
                </div>
                <div className="pt-6 flex justify-end gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                  <button className="bg-gradient-to-br from-primary to-primary-container text-on-primary font-black px-10 py-3 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all" type="submit">
                    Salvar Veículo
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Edit Vehicle Modal */}
        {isEditModalOpen && selectedVehicle && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center animate-in fade-in duration-300">
            <div className="bg-surface-container-low w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-slate-800/50 m-4">
              <div className="p-8 flex items-center justify-between bg-surface-container">
                <div>
                  <h3 className="text-2xl font-black font-headline tracking-tight text-primary">Editar Veículo</h3>
                  <p className="text-on-surface-variant text-sm">Atualize as informações do ativo <span className="font-mono text-slate-100">{selectedVehicle.plate}</span>.</p>
                </div>
                <button 
                  onClick={() => { setIsEditModalOpen(false); setSelectedVehicle(null); }}
                  className="w-10 h-10 rounded-full hover:bg-surface-bright flex items-center justify-center transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <form className="p-8 space-y-6" onSubmit={handleUpdateVehicle}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-60">Marca</label>
                    <input name="brand" required defaultValue={selectedVehicle.brand} className="w-full bg-surface-container border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 transition-all text-sm shadow-inner" type="text"/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-60">Modelo</label>
                    <input name="model" required defaultValue={selectedVehicle.model} className="w-full bg-surface-container border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 transition-all text-sm shadow-inner" type="text"/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-60">Placa</label>
                    <input name="plate" required defaultValue={selectedVehicle.plate} className="w-full bg-surface-container border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 transition-all text-sm font-mono shadow-inner uppercase" title="Placa do Veículo" maxLength={8} onChange={(e) => e.target.value = maskPlate(e.target.value)} type="text"/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-60">Cor</label>
                    <input name="color" required defaultValue={selectedVehicle.color} className="w-full bg-surface-container border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 transition-all text-sm shadow-inner" type="text"/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-60">KM Atual</label>
                    <input name="km" required defaultValue={selectedVehicle.km || selectedVehicle.kilometers} className="w-full bg-surface-container border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 transition-all text-sm shadow-inner" type="number"/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-60">Valor do Veículo</label>
                    <input name="vehicleValue" required defaultValue={maskCurrency(String(selectedVehicle.vehicleValue * 100))} className="w-full bg-surface-container border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 transition-all text-sm font-bold shadow-inner" onChange={(e) => e.target.value = maskCurrency(e.target.value)} type="text"/>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-tertiary opacity-80">Valor da Diária (Locação)</label>
                    <input name="dailyRentalValue" required defaultValue={maskCurrency(String(selectedVehicle.dailyRentalValue * 100))} className="w-full bg-tertiary/5 border border-tertiary/20 rounded-xl py-3 px-4 focus:ring-2 focus:ring-tertiary/50 transition-all text-sm font-bold shadow-inner text-tertiary" onChange={(e) => e.target.value = maskCurrency(e.target.value)} type="text"/>
                  </div>
                </div>
                <div className="pt-6 flex justify-end gap-4">
                  <button type="button" onClick={() => { setIsEditModalOpen(false); setSelectedVehicle(null); }} className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white transition-colors">Cancelar</button>
                  <button className="bg-primary text-on-primary font-black px-10 py-3 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all" type="submit">Salvar Alterações</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Change Status Modal */}
        {isStatusModalOpen && selectedVehicle && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center animate-in fade-in duration-300">
            <div className="bg-surface-container-low w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-slate-800/50 m-4">
              <div className="p-8 flex items-center justify-between bg-surface-container">
                <h3 className="text-xl font-black font-headline tracking-tight text-tertiary">Alterar Status</h3>
                <button onClick={() => { setIsStatusModalOpen(false); setSelectedVehicle(null); }} className="w-10 h-10 rounded-full hover:bg-surface-bright flex items-center justify-center transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="p-8 space-y-6 text-center">
                <div className="flex justify-center flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary mb-4">
                    <span className="material-symbols-outlined text-4xl">sync_alt</span>
                  </div>
                  <h4 className="font-bold text-slate-100">{selectedVehicle.brand} {selectedVehicle.model}</h4>
                  <p className="text-xs text-slate-500 font-mono">{selectedVehicle.plate}</p>
                </div>
                <div className="grid grid-cols-1 gap-3 pt-4">
                  {[
                    { id: 'available', label: 'Disponível', color: 'emerald' },
                    { id: 'rented', label: 'Locado', color: 'tertiary' },
                    { id: 'maintenance', label: 'Manutenção', color: 'error' }
                  ].map((s) => (
                    <button 
                      key={s.id}
                      onClick={() => handleUpdateStatus(s.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${
                        selectedVehicle.status === s.id 
                          ? `border-${s.color === 'emerald' ? 'emerald' : s.color === 'tertiary' ? 'sky' : 'red'}-500 bg-${s.color === 'emerald' ? 'emerald' : s.color === 'tertiary' ? 'sky' : 'red'}-500/10` 
                          : 'border-slate-800 hover:border-slate-600 bg-surface-container'
                      }`}
                    >
                      <span className={`font-bold ${selectedVehicle.status === s.id ? 'text-white' : 'text-slate-400'}`}>{s.label}</span>
                      {selectedVehicle.status === s.id && (
                        <span className="material-symbols-outlined text-white">check_circle</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <StatusDialog 
          {...dialog}
          onClose={() => setDialog({ ...dialog, isOpen: false })}
        />
      </div>
    </Layout>
  );
};

export default Vehicles;

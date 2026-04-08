import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useForm } from 'react-hook-form';
import { rentalApi, customerApi, vehicleApi } from '../services/api';
import { maskPlate, maskCurrency, parseCurrencyToNumber } from '../utils/masks';
import StatusDialog from '../components/StatusDialog';

const Rentals: React.FC = () => {
  const [activeRentals, setActiveRentals] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [dialog, setDialog] = useState<{ isOpen: boolean; type: 'success' | 'error' | 'warning'; title: string; message: string }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  const { register, handleSubmit, reset, setValue, watch } = useForm();
  
  const selectedVehicleId = watch('vehicleId');
  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const fetchData = async () => {
    try {
      const [rentalsData, customersData, vehiclesData] = await Promise.all([
        rentalApi.list(),
        customerApi.list(),
        vehicleApi.list()
      ]);
      setActiveRentals(rentalsData.filter((r: any) => r.isActive));
      setCustomers(customersData);
      setVehicles(vehiclesData.filter((v: any) => v.status === 'available'));
    } catch (err) {
      console.error('Error fetching rentals data:', err);
    } finally {
      // Done
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedVehicleId && startDate && endDate) {
      const vehicle = vehicles.find(v => v.id === selectedVehicleId);
      if (vehicle) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
        
        const totalValue = diffDays * Number(vehicle.dailyRentalValue);
        setValue('value', maskCurrency((totalValue * 100).toFixed(0).toString()));
      }
    }
  }, [selectedVehicleId, startDate, endDate, vehicles, setValue]);

  const onRentalSubmit = async (data: any) => {
    try {
      await rentalApi.create({
        customerId: data.customerId,
        vehicleId: data.vehicleId,
        rentalDate: new Date(data.startDate).toISOString(),
        expectedReturnDate: new Date(data.endDate).toISOString(),
        rentalValue: parseCurrencyToNumber(data.value),
        paymentMethod: data.paymentMethod,
        observation: data.observation,
      });

      setDialog({
        isOpen: true,
        type: 'success',
        title: 'Contrato Gerado!',
        message: 'A locação foi registrada com sucesso no sistema.'
      });

      reset();
      fetchData();
    } catch (err: any) {
      setDialog({
        isOpen: true,
        type: 'error',
        title: 'Erro na Locação',
        message: err.message
      });
    }
  };

  const handleReturn = async (plate: string) => {
    try {
      await rentalApi.returnByPlate(plate);
      setDialog({
        isOpen: true,
        type: 'success',
        title: 'Veículo Devolvido!',
        message: `O veículo de placa ${plate} foi retornado à frota com sucesso.`
      });
      fetchData();
    } catch (err: any) {
      setDialog({
        isOpen: true,
        type: 'error',
        title: 'Erro na Devolução',
        message: err.message
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-10 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-100 font-headline">Operações de Locação</h2>
            <p className="text-slate-400 mt-1">Gerencie contratos ativos e novas reservas.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-surface-container-high rounded-xl flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-slate-300">84 Veículos Disponíveis</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Nova Locação Form */}
          <section className="lg:col-span-7 space-y-6">
            <div className="bg-surface-container-low p-8 rounded-xl relative overflow-hidden border border-slate-800/30">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-8xl">edit_note</span>
              </div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg auth-gradient flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary">add_circle</span>
                </div>
                <h3 className="text-xl font-bold text-slate-100 font-headline">Nova Locação</h3>
              </div>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit(onRentalSubmit)}>
                {/* Cliente */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Cliente</label>
                  <div className="relative group">
                    <select {...register('customerId')} required className="w-full bg-surface-container border-none rounded-xl px-4 py-3 text-slate-100 focus:ring-2 focus:ring-primary/50 appearance-none text-sm shadow-inner cursor-pointer">
                      <option value="">Selecione um cliente...</option>
                      {customers.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-3 text-slate-500 pointer-events-none">expand_more</span>
                  </div>
                </div>
                {/* Veículo */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Veículo Disponível</label>
                  <div className="relative">
                    <select {...register('vehicleId')} required className="w-full bg-surface-container border-none rounded-xl px-4 py-3 text-slate-100 focus:ring-2 focus:ring-primary/50 appearance-none text-sm shadow-inner cursor-pointer">
                      <option value="">Selecione o veículo...</option>
                      {vehicles.map(v => (
                        <option key={v.id} value={v.id}>{v.brand} {v.model} - [{v.plate}]</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-3 text-slate-500 pointer-events-none">directions_car</span>
                  </div>
                </div>
                {/* Datas */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Data Retirada</label>
                  <input {...register('startDate')} required className="w-full bg-surface-container border-none rounded-xl px-4 py-3 text-slate-100 focus:ring-2 focus:ring-primary/50 text-sm shadow-inner" type="datetime-local"/>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Data Devolução</label>
                  <input {...register('endDate')} required className="w-full bg-surface-container border-none rounded-xl px-4 py-3 text-slate-100 focus:ring-2 focus:ring-primary/50 text-sm shadow-inner" type="datetime-local"/>
                </div>
                {/* Valor e Pagamento */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Valor (R$)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-slate-500 text-sm">R$</span>
                    <input 
                      {...register('value')} 
                      required 
                      className="w-full bg-surface-container border-none rounded-xl pl-10 pr-4 py-3 text-slate-100 focus:ring-2 focus:ring-primary/50 text-sm shadow-inner" 
                      placeholder="R$ 0,00" 
                      type="text"
                      onChange={(e) => {
                        const masked = maskCurrency(e.target.value);
                        e.target.value = masked;
                        setValue('value', masked);
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Forma de Pagamento</label>
                  <div className="relative">
                    <select {...register('paymentMethod')} required className="w-full bg-surface-container border-none rounded-xl px-4 py-3 text-slate-100 focus:ring-2 focus:ring-primary/50 appearance-none text-sm shadow-inner cursor-pointer">
                      <option value="Cartão de Crédito">Cartão de Crédito</option>
                      <option value="PIX">PIX Immediate</option>
                      <option value="Boleto">Boleto Bancário</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-3 text-slate-500 pointer-events-none">payments</span>
                  </div>
                </div>
                {/* Observação */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Observação</label>
                  <textarea {...register('observation')} className="w-full bg-surface-container border-none rounded-xl px-4 py-3 text-slate-100 focus:ring-2 focus:ring-primary/50 text-sm shadow-inner" placeholder="Detalhes adicionais do contrato..." rows={3}></textarea>
                </div>
                <div className="md:col-span-2 pt-4">
                  <button className="w-full auth-gradient text-on-primary font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity active:scale-[0.98] shadow-lg shadow-primary/20 font-headline uppercase tracking-widest text-xs" type="submit">
                    <span className="material-symbols-outlined">task_alt</span>
                    Confirmar Nova Locação
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* Right Column: Devolução Rápida */}
          <section className="lg:col-span-5 space-y-6">
            <div className="bg-surface-container-low p-8 rounded-xl h-full border-l-4 border-tertiary border-y border-r border-slate-800/30">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-tertiary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-tertiary">flash_on</span>
                </div>
                <h3 className="text-xl font-bold text-slate-100 font-headline">Devolução Rápida</h3>
              </div>
              <div className="space-y-6">
                <div className="relative group">
                  <input 
                    className="w-full bg-surface-container border-none rounded-xl pl-12 pr-4 py-4 text-slate-100 focus:ring-2 focus:ring-tertiary/50 text-lg font-mono tracking-widest shadow-inner shadow-black/20 uppercase" 
                    placeholder="Placa (Ex: ABC-1234)" 
                    type="text"
                    onChange={(e) => {
                      e.target.value = maskPlate(e.target.value);
                    }}
                  />
                  <span className="material-symbols-outlined absolute left-4 top-4 text-slate-500 group-focus-within:text-tertiary">search</span>
                </div>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Resultados Ativos</p>
                
                {/* Quick Action Result Cards */}
                <div className="space-y-4">
                  {activeRentals.map((rental) => (
                    <div key={rental.id} className="bg-surface-container p-4 rounded-xl flex items-center justify-between group hover:bg-surface-container-high transition-all border border-slate-800/50">
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-lg bg-surface-dim flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined">directions_car</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-100">{rental.vehicle.brand} {rental.vehicle.model} - <span className="text-tertiary font-mono">{rental.vehicle.plate}</span></p>
                          <p className="text-xs text-slate-400">Cliente: {rental.customer.name}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleReturn(rental.vehicle.plate)}
                        className="bg-tertiary/10 text-tertiary hover:bg-tertiary hover:text-on-tertiary px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 uppercase tracking-tighter"
                      >
                        Devolver <span className="material-symbols-outlined text-sm">flash_on</span>
                      </button>
                    </div>
                  ))}
                  {activeRentals.length === 0 && (
                    <div className="p-8 text-center text-slate-500 text-xs italic">Nenhuma locação ativa no momento.</div>
                  )}
                </div>

                {/* Analytics/Info Section */}
                <div className="mt-8 pt-8 border-t border-slate-800/50">
                  <div className="bg-surface-container-highest/40 p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-slate-400">Status da Frota</span>
                      <span className="text-xs font-bold text-emerald-400 font-headline">12 Hoje</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-[65%]"></div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">65% das devoluções previstas para hoje foram concluídas.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <StatusDialog 
          {...dialog}
          onClose={() => setDialog({ ...dialog, isOpen: false })}
        />
      </div>
    </Layout>
  );
};

export default Rentals;

import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useForm } from 'react-hook-form';
import { maintenanceApi, vehicleApi } from '../services/api';
import { maskCurrency, parseCurrencyToNumber } from '../utils/masks';
import StatusDialog from '../components/StatusDialog';

const Maintenance: React.FC = () => {
  const [maintenances, setMaintenances] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialog, setDialog] = useState<{ isOpen: boolean; type: 'success' | 'error' | 'warning'; title: string; message: string }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  const { register, handleSubmit, reset, setValue } = useForm();

  const fetchData = async () => {
    try {
      const [maintenanceData, vehiclesData] = await Promise.all([
        maintenanceApi.list(),
        vehicleApi.list()
      ]);
      setMaintenances(maintenanceData);
      // For new maintenance, only show available or already in maintenance vehicles
      setVehicles(vehiclesData);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        value: parseCurrencyToNumber(data.value),
        date: new Date(data.date).toISOString(),
        returnDate: data.returnDate ? new Date(data.returnDate).toISOString() : null,
      };

      let response;
      if (editingId) {
        response = await maintenanceApi.update(editingId, payload);
        
        setDialog({
          isOpen: true,
          type: 'success',
          title: 'Manutenção Atualizada!',
          message: 'Os dados da manutenção foram atualizados com sucesso.'
        });
      } else {
        response = await maintenanceApi.create(payload);
        
        setDialog({
          isOpen: true,
          type: 'success',
          title: 'Manutenção Registrada!',
          message: 'A manutenção foi lançada com sucesso no sistema.'
        });
      }

      fetchData();
      setShowForm(false);
      setEditingId(null);
      reset();
    } catch (err: any) {
      setDialog({
        isOpen: true,
        type: 'error',
        title: 'Erro na Operação',
        message: err.message
      });
    }
  };

  const handleEdit = (m: any) => {
    setEditingId(m.id);
    setShowForm(true);
    reset({
      vehicleId: m.vehicleId,
      date: new Date(m.date).toISOString().slice(0, 16),
      returnDate: m.returnDate ? new Date(m.returnDate).toISOString().slice(0, 16) : '',
      description: m.description,
      status: m.status,
      value: maskCurrency((m.value * 100).toFixed(0).toString()),
    });
  };

  const handleDelete = async () => {
    if (!editingId) return;
    
    if (window.confirm('Tem certeza que deseja excluir este lançamento? O veículo voltará ao status Disponível.')) {
      try {
        await maintenanceApi.delete(editingId);
        setDialog({
          isOpen: true,
          type: 'success',
          title: 'Manutenção Excluída!',
          message: 'O lançamento foi removido e o veículo está disponível.'
        });
        setShowForm(false);
        setEditingId(null);
        reset();
        fetchData();
      } catch (err: any) {
        setDialog({
          isOpen: true,
          type: 'error',
          title: 'Erro na Exclusão',
          message: err.message
        });
      }
    }
  };

  const handleNew = () => {
    setEditingId(null);
    setShowForm(true);
    reset({
      date: new Date().toISOString().slice(0, 16),
      status: 'In Maintenance',
      value: 'R$ 0,00',
    });
  };

  return (
    <Layout>
      <div className="space-y-6 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-100 font-headline">Controle de Manutenção</h2>
            <p className="text-slate-400 mt-1">Gerencie reparos e revisões da frota.</p>
          </div>
          {!showForm && (
            <button 
              onClick={handleNew}
              className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined">add</span>
              Nova Manutenção
            </button>
          )}
        </header>

        {showForm ? (
          <section className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-surface-container-low p-8 rounded-xl border border-slate-800/30 overflow-hidden relative">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg auth-gradient flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-primary">
                      {editingId ? 'edit' : 'add_circle'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-100 font-headline">
                    {editingId ? 'Editar Manutenção' : 'Novo Lançamento'}
                  </h3>
                </div>
                <div className="flex gap-3">
                  {editingId && (
                    <button 
                      onClick={handleDelete}
                      type="button" 
                      className="text-error border border-error/30 hover:bg-error/10 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                      Excluir
                    </button>
                  )}
                  <button 
                    onClick={() => { setShowForm(false); setEditingId(null); }}
                    className="text-slate-400 hover:text-white px-4 py-2 text-sm font-medium transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                    Cancelar
                  </button>
                </div>
              </div>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Veículo</label>
                  <div className="relative">
                    <select 
                      {...register('vehicleId')} 
                      required 
                      disabled={!!editingId} // Cannot change vehicle once maintenance started?
                      className="w-full bg-surface-container border-none rounded-xl px-4 py-3 text-slate-100 focus:ring-2 focus:ring-primary/50 appearance-none text-sm shadow-inner disabled:opacity-50"
                    >
                      <option value="">Selecione o veículo...</option>
                      {vehicles.filter(v => editingId || v.status === 'available').map(v => (
                        <option key={v.id} value={v.id}>{v.brand} {v.model} - [{v.plate}]</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-3 text-slate-500 pointer-events-none">directions_car</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Data de Entrada</label>
                  <input {...register('date')} required className="w-full bg-surface-container border-none rounded-xl px-4 py-3 text-slate-100 focus:ring-2 focus:ring-primary/50 text-sm shadow-inner" type="datetime-local"/>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Previsão Retorno</label>
                  <input {...register('returnDate')} className="w-full bg-surface-container border-none rounded-xl px-4 py-3 text-slate-100 focus:ring-2 focus:ring-primary/50 text-sm shadow-inner" type="datetime-local"/>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Valor Gasto (R$)</label>
                  <input 
                    {...register('value')} 
                    required 
                    className="w-full bg-surface-container border-none rounded-xl px-4 py-3 text-slate-100 focus:ring-2 focus:ring-primary/50 text-sm shadow-inner" 
                    placeholder="R$ 0,00" 
                    onChange={(e) => {
                      const masked = maskCurrency(e.target.value);
                      e.target.value = masked;
                      setValue('value', masked);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Status</label>
                  <div className="relative">
                    <select {...register('status')} required className="w-full bg-surface-container border-none rounded-xl px-4 py-3 text-slate-100 focus:ring-2 focus:ring-primary/50 appearance-none text-sm shadow-inner cursor-pointer">
                      <option value="In Maintenance">Em Manutenção</option>
                      <option value="Waiting for Parts">Espera de peças</option>
                      <option value="Waiting for External Service">Espera de serviço externo</option>
                      <option value="Finished">Finalizada</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-3 text-slate-500 pointer-events-none">expand_more</span>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Observação</label>
                  <textarea {...register('description')} className="w-full bg-surface-container border-none rounded-xl px-4 py-3 text-slate-100 focus:ring-2 focus:ring-primary/50 text-sm shadow-inner" placeholder="Detalhes do serviço realizado..." rows={4}></textarea>
                </div>

                <div className="md:col-span-2 pt-4">
                  <button className="w-full auth-gradient text-on-primary font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity active:scale-[0.98] shadow-lg shadow-primary/20 font-headline uppercase tracking-widest text-xs" type="submit">
                    <span className="material-symbols-outlined">save</span>
                    {editingId ? 'Salvar Alterações' : 'Lançar Manutenção'}
                  </button>
                </div>
              </form>
            </div>
          </section>
        ) : (
          <section className="bg-surface-container-low rounded-xl border border-slate-800/30 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800/50 bg-surface-container-high/30">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Veículo</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Data Entrada</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Status</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-right">Valor</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/30">
                  {maintenances.map((m) => (
                    <tr key={m.id} className="hover:bg-surface-container-high transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-surface-dim flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-xl">directions_car</span>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-100">{m.vehicle.brand} {m.vehicle.model}</p>
                            <p className="text-[10px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded inline-block mt-0.5">{m.vehicle.plate}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-300">{new Date(m.date).toLocaleDateString()}</p>
                        <p className="text-xs text-slate-500">{new Date(m.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          m.status === 'Finished' 
                            ? 'bg-emerald-400/10 text-emerald-400' 
                            : m.status === 'In Maintenance'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-amber-400/10 text-amber-400'
                        }`}>
                          {m.status === 'Finished' ? 'Finalizada' : 
                           m.status === 'In Maintenance' ? 'Em Manutenção' : 
                           m.status === 'Waiting for Parts' ? 'Aguardando Peças' : 
                           'Aguardando Serviço'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="text-sm font-bold text-slate-100">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(m.value)}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => handleEdit(m)}
                          className="p-2 hover:bg-primary/10 text-slate-400 hover:text-primary rounded-lg transition-all"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {maintenances.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                        Nenhum registro de manutenção encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
        
        <StatusDialog 
          {...dialog}
          onClose={() => setDialog({ ...dialog, isOpen: false })}
        />
      </div>
    </Layout>
  );
};

export default Maintenance;

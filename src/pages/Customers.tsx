import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useForm } from 'react-hook-form';
import { customerApi } from '../services/api';
import { maskPhone } from '../utils/masks';
import StatusDialog from '../components/StatusDialog';

const Customers: React.FC = () => {
  const [loadingCep, setLoadingCep] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [dialog, setDialog] = useState<{ isOpen: boolean; type: 'success' | 'error' | 'warning'; title: string; message: string }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  const { register, handleSubmit, setValue, reset } = useForm();

  const fetchCustomers = async () => {
    try {
      const data = await customerApi.list();
      setCustomers(data);
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      // Done
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleCepSearch = async (cep: string) => {
    if (cep.length !== 8) return;
    setLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setValue('street', data.logradouro);
        setValue('neighborhood', data.bairro);
        setValue('city', data.localidade);
        setValue('state', data.uf);
      }
    } catch (error) {
      console.error('Error fetching CEP:', error);
    } finally {
      setLoadingCep(false);
    }
  };

  const onRegisterSubmit = async (data: any) => {
    try {
      const payload = {
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        street: data.street,
        number: data.number,
        neighborhood: data.neighborhood,
        cep: data.cep,
        city: data.city,
        state: data.state,
      };

      if (editingId) {
        await customerApi.update(editingId, payload);
        setDialog({
          isOpen: true,
          type: 'success',
          title: 'Atualizado!',
          message: 'Os dados do cliente foram atualizados com sucesso.'
        });
      } else {
        await customerApi.create(payload);
        setDialog({
          isOpen: true,
          type: 'success',
          title: 'Cadastrado!',
          message: 'O novo cliente foi adicionado à sua base com sucesso.'
        });
      }

      reset();
      setEditingId(null);
      fetchCustomers();
    } catch (err: any) {
      setDialog({
        isOpen: true,
        type: 'error',
        title: 'Falha na Operação',
        message: err.message
      });
    }
  };

  const handleEdit = (customer: any) => {
    setEditingId(customer.id);
    setValue('fullName', customer.name);
    setValue('email', customer.email);
    setValue('phone', customer.phone);
    setValue('cep', customer.cep);
    setValue('street', customer.street);
    setValue('number', customer.number);
    setValue('neighborhood', customer.neighborhood);
    setValue('city', customer.city);
    setValue('state', customer.state);
    
    // Smooth scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(customers.length / itemsPerPage);
  const displayedCustomers = customers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  const stats = {
    total: customers.length,
    newThisMonth: customers.filter(c => {
      const date = new Date(c.createdAt);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length,
    verifiedCount: Math.floor(customers.length * 0.94) // Keeping the % just for UI richness but using real base
  };

  return (
    <Layout>
      <div className="space-y-10 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface">Gestão de Clientes</h2>
            <p className="text-on-surface-variant mt-2 max-w-md">Orquestre seus relacionamentos com precisão. Cadastre novos clientes ou gerencie os existentes.</p>
          </div>
          <div className="flex gap-4">
            <div className="flex -space-x-3 overflow-hidden">
              {[1, 2, 3].map(i => (
                <img key={i} className="inline-block h-10 w-10 rounded-full ring-4 ring-surface" src={`https://i.pravatar.cc/150?u=customer${i}`} alt="Avatar" />
              ))}
              <div className="flex items-center justify-center h-10 w-10 rounded-full ring-4 ring-surface bg-surface-container-high text-[10px] font-bold">+1.2k</div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Registration Form Column */}
          <div className="lg:col-span-5 space-y-6">
            <section className="bg-surface-container-low rounded-xl p-8 relative overflow-hidden group border border-slate-800/30">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-8xl">person_add</span>
              </div>
              <h3 className="text-xl font-bold font-headline mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-primary rounded-full"></span>
                Novo Cadastro
              </h3>
              <form className="space-y-5" onSubmit={handleSubmit(onRegisterSubmit)}>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1">Nome Completo</label>
                  <input {...register('fullName')} className="w-full bg-surface-container border-none rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-slate-600 shadow-inner" placeholder="Ex: João Silva" type="text"/>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1">E-mail</label>
                    <input {...register('email')} className="w-full bg-surface-container border-none rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-slate-600 shadow-inner" placeholder="joao@email.com" type="email"/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1">Telefone</label>
                    <input 
                      {...register('phone')} 
                      className="w-full bg-surface-container border-none rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-slate-600 shadow-inner" 
                      placeholder="(11) 99999-9999" 
                      type="text"
                      onChange={(e) => {
                        const masked = maskPhone(e.target.value);
                        e.target.value = masked;
                        setValue('phone', masked);
                      }}
                    />
                  </div>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-800/50">
                  <h4 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    Endereço
                  </h4>
                  <div className="flex gap-3 mb-4">
                    <div className="flex-1 space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1">CEP</label>
                      <input 
                        {...register('cep')}
                        className="w-full bg-surface-container border-none rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-slate-600 shadow-inner" 
                        placeholder="00000-000" 
                        type="text"
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          if (val.length === 8) handleCepSearch(val);
                          setValue('cep', e.target.value);
                        }}
                      />
                    </div>
                    <button 
                      className={`mt-5 px-6 bg-surface-container-highest hover:bg-surface-bright text-primary font-bold text-xs rounded-lg transition-all flex items-center gap-2 self-end py-3.5 ${loadingCep ? 'opacity-50 cursor-wait' : ''}`} 
                      type="button"
                    >
                      {loadingCep ? '...' : <><span className="material-symbols-outlined text-sm">search</span> Consultar</>}
                    </button>
                  </div>
                  <div className="space-y-4 font-body">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="sm:col-span-3 space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1">Logradouro</label>
                        <input {...register('street')} className="w-full bg-surface-container/50 border-none rounded-lg p-3 text-slate-400 cursor-not-allowed text-sm" placeholder="Rua, Avenida..." readOnly type="text"/>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1">Número</label>
                        <input {...register('number')} required className="w-full bg-surface-container border-none rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-slate-600 shadow-inner text-sm" placeholder="123" type="text"/>
                      </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1">Bairro</label>
                        <input {...register('neighborhood')} className="w-full bg-surface-container/50 border-none rounded-lg p-3 text-slate-400 cursor-not-allowed text-sm" placeholder="Ex: Centro" readOnly type="text"/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1">Cidade</label>
                        <input {...register('city')} className="w-full bg-surface-container/50 border-none rounded-lg p-3 text-slate-400 cursor-not-allowed text-sm" readOnly type="text"/>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1">Estado</label>
                        <input {...register('state')} className="w-full bg-surface-container/50 border-none rounded-lg p-3 text-slate-400 cursor-not-allowed text-sm" readOnly type="text"/>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary font-black rounded-xl shadow-lg shadow-primary/10 hover:scale-[1.02] active:scale-95 transition-all mt-6 uppercase tracking-widest text-xs">
                  {editingId ? 'Atualizar Cliente' : 'Cadastrar Cliente'}
                </button>
              </form>
            </section>
          </div>

          {/* Customer List Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-surface-container-low rounded-xl overflow-hidden border border-slate-800/30 shadow-2xl">
              <div className="p-6 border-b border-slate-800/30 flex justify-between items-center">
                <h3 className="text-xl font-bold font-headline flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">list_alt</span>
                  Clientes Ativos
                </h3>
                <div className="flex gap-2">
                  <button className="p-2 bg-surface-container rounded-lg text-slate-400 hover:text-white transition-colors">
                    <span className="material-symbols-outlined">filter_list</span>
                  </button>
                  <button className="p-2 bg-surface-container rounded-lg text-slate-400 hover:text-white transition-colors">
                    <span className="material-symbols-outlined">download</span>
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-surface-container-lowest/50">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Cliente</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Contato</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Localização</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/30">
                    {displayedCustomers.map((c, i) => (
                      <tr key={i} onClick={() => handleEdit(c)} className="hover:bg-surface-container transition-colors group cursor-pointer">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-primary/10 text-primary uppercase">
                            {c.name.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-on-surface">{c.name}</p>
                            <p className="text-[10px] text-slate-500">
                              Membro desde {new Date(c.createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                      </td>
                        <td className="px-6 py-5">
                          <p className="text-xs font-medium text-slate-300">{c.email}</p>
                          <p className="text-[10px] text-slate-500">{c.phone}</p>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-xs text-slate-300">{c.city}, {c.state}</p>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-tighter bg-primary/10 text-primary`}>
                            Ativo
                          </span>
                        </td>
                      </tr>
                    ))}
                    {customers.length === 0 && (
                      <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-500 text-sm italic italic">Nenhum cliente cadastrado.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-surface-container-lowest/30 flex justify-between items-center px-8">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  Mostrando {displayedCustomers.length} de {customers.length}
                </span>
                <div className="flex gap-2">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded bg-surface-container-high text-slate-400 hover:text-primary transition-all disabled:opacity-20"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-on-primary text-[10px] font-bold">
                    {currentPage}
                  </button>
                  <button 
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className="w-8 h-8 flex items-center justify-center rounded bg-surface-container-high text-slate-400 hover:text-primary transition-all disabled:opacity-20 text-sm font-bold"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Stats Summary Panel */}
            <div className="grid grid-cols-2 gap-6 font-headline">
              <div className="bg-surface-container-low p-6 rounded-xl flex items-center gap-5 border-l-4 border-primary shadow-lg border-y border-r border-slate-800/30">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">trending_up</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Novos este mês</p>
                  <h4 className="text-2xl font-black text-on-surface">+{stats.newThisMonth}</h4>
                </div>
              </div>
              <div className="bg-surface-container-low p-6 rounded-xl flex items-center gap-5 border-l-4 border-tertiary shadow-lg border-y border-r border-slate-800/30">
                <div className="w-12 h-12 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined">verified</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Base Total</p>
                  <h4 className="text-2xl font-black text-on-surface">{stats.total}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <StatusDialog 
          {...dialog}
          onClose={() => setDialog({ ...dialog, isOpen: false })}
        />
      </div>
    </Layout>
  );
};

export default Customers;

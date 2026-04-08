import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().email('E-mail corporativo inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

const registerSchema = z.object({
  fullName: z.string().min(3, 'Nome completo é obrigatório'),
  email: z.string().email('E-mail profissional inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  companyName: z.string().min(2, 'Nome da empresa é obrigatório'),
  terms: z.boolean().refine(val => val === true, 'Você deve aceitar os termos'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

import { authApi } from '../services/api';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { register: loginRegister, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { register: registerForm, handleSubmit: handleRegisterSubmit, formState: { errors: registerErrors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      const response = await authApi.login(data);
      localStorage.setItem('locacar_token', response.access_token);
      localStorage.setItem('locacar_user', JSON.stringify(response.user));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao entrar. Verifique suas credenciais.');
    }
  };

  const onRegisterSubmit = async (data: any) => {
    setError(null);
    try {
      const payload = {
        userName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password, // Adicionei password no payload
        companyName: data.companyName,
      };
      const response = await authApi.register(payload);
      localStorage.setItem('locacar_token', response.access_token);
      localStorage.setItem('locacar_user', JSON.stringify(response.user));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar empresa.');
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex items-center justify-center overflow-hidden selection:bg-primary/30 relative">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-tertiary/5 blur-[120px] rounded-full"></div>
      </div>

      {/* Main Auth Container */}
      <main className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 h-[921px] md:h-[800px] overflow-hidden rounded-xl shadow-2xl shadow-black/50 mx-4 md:mx-10 bg-surface-container-low relative z-10">
        {/* Left Side: Visual/Branding */}
        <section className="hidden md:flex flex-col justify-between p-12 relative overflow-hidden bg-surface-container">
          <div className="absolute inset-0 z-0">
            <img 
              alt="Luxury sports car" 
              className="w-full h-full object-cover opacity-40 mix-blend-luminosity" 
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-dim via-transparent to-transparent"></div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary font-bold">speed</span>
              </div>
              <h1 className="font-headline text-2xl font-black tracking-tighter text-on-surface">LocaCar</h1>
            </div>
          </div>
          <div className="relative z-10">
            <h2 className="font-headline text-4xl font-extrabold tracking-tight mb-4 leading-tight">
              Gestão de Frotas de <br/>
              <span className="text-primary italic">Alta Performance.</span>
            </h2>
            <p className="text-on-surface-variant max-w-md leading-relaxed">
              A plataforma multitenant definitiva para locadoras que buscam precisão, escala e controle total sobre cada ativo em movimento.
            </p>
            <div className="mt-8 flex gap-4 items-center">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <img 
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-surface-container" 
                    src={`https://i.pravatar.cc/150?u=${i}`}
                    alt="User"
                  />
                ))}
              </div>
              <span className="text-xs font-label tracking-wide text-on-surface/60">+500 Empresas gerenciadas hoje</span>
            </div>
          </div>
        </section>

        {/* Right Side: Auth Forms */}
        <section className="flex flex-col p-8 md:p-16 justify-center bg-surface relative">
          {/* Mobile Brand Header */}
          <div className="md:hidden flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-sm">speed</span>
            </div>
            <h1 className="font-headline text-xl font-black tracking-tighter text-on-surface">LocaCar</h1>
          </div>

          {/* Toggle Switch */}
          <div className="flex bg-surface-container-highest p-1 rounded-xl mb-10 w-full md:w-fit self-center">
            <button 
              className={`px-8 py-2.5 rounded-lg text-sm font-label font-semibold transition-all duration-300 ${isLogin ? 'bg-surface text-on-surface shadow-lg' : 'text-on-surface-variant'}`}
              onClick={() => setIsLogin(true)}
            >
              Entrar
            </button>
            <button 
              className={`px-8 py-2.5 rounded-lg text-sm font-label font-semibold transition-all duration-300 ${!isLogin ? 'bg-surface text-on-surface shadow-lg' : 'text-on-surface-variant'}`}
              onClick={() => setIsLogin(false)}
            >
              Criar Conta
            </button>
          </div>

          {isLogin ? (
            /* Login Form */
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header>
                <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">Bem-vindo de volta</h3>
                <p className="text-on-surface-variant text-sm">Acesse sua central de comando para gerenciar sua frota.</p>
              </header>
              <form className="space-y-4" onSubmit={handleLoginSubmit(onLoginSubmit)}>
                {error && (
                  <div className="bg-error/10 border border-error/20 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <span className="material-symbols-outlined text-error">error_outline</span>
                    <p className="text-xs font-bold text-error">{error}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-xs font-label font-medium text-on-surface-variant uppercase tracking-widest ml-1">Email Corporativo</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">mail</span>
                    <input 
                      {...loginRegister('email')}
                      className="w-full bg-surface-container-low border-none rounded-xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-on-surface/20" 
                      placeholder="exemplo@empresa.com" 
                      type="email"
                    />
                  </div>
                  {loginErrors.email && <p className="text-[10px] text-error ml-1">{loginErrors.email.message}</p>}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-label font-medium text-on-surface-variant uppercase tracking-widest ml-1">Senha</label>
                    <a className="text-[10px] text-primary/80 hover:text-primary font-semibold uppercase tracking-wider" href="#">Esqueceu?</a>
                  </div>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">lock</span>
                    <input 
                      {...loginRegister('password')}
                      className="w-full bg-surface-container-low border-none rounded-xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-on-surface/20" 
                      placeholder="••••••••" 
                      type="password"
                    />
                  </div>
                  {loginErrors.password && <p className="text-[10px] text-error ml-1">{loginErrors.password.message}</p>}
                </div>
                <button type="submit" className="w-full auth-gradient text-on-primary font-headline font-bold py-4 rounded-xl shadow-lg shadow-primary/10 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group">
                  <span>Acessar Dashboard</span>
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </form>
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-surface-container-highest"></div></div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-surface px-4 text-on-surface/30">ou continue com SSO</span></div>
              </div>
            </div>
          ) : (
            /* Registration Form */
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header>
                <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">Configure sua Unidade</h3>
                <p className="text-on-surface-variant text-sm">Crie seu novo ambiente <span className="text-primary font-semibold">Tenant</span> em segundos.</p>
              </header>
              <form className="space-y-4" onSubmit={handleRegisterSubmit(onRegisterSubmit)}>
                {error && (
                  <div className="bg-error/10 border border-error/20 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <span className="material-symbols-outlined text-error">error</span>
                    <p className="text-xs font-bold text-error">{error}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-label font-medium text-on-surface-variant uppercase tracking-widest ml-1">Nome Completo</label>
                    <input 
                      {...registerForm('fullName')}
                      className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-on-surface/20 shadow-inner" 
                      placeholder="Seu nome" 
                      type="text"
                    />
                    {registerErrors.fullName && <p className="text-[10px] text-error ml-1">{registerErrors.fullName.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-label font-medium text-on-surface-variant uppercase tracking-widest ml-1">Email Profissional</label>
                    <input 
                      {...registerForm('email')}
                      className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-on-surface/20 shadow-inner" 
                      placeholder="email@empresa.com" 
                      type="email"
                    />
                    {registerErrors.email && <p className="text-[10px] text-error ml-1">{registerErrors.email.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-label font-medium text-on-surface-variant uppercase tracking-widest ml-1">Telefone</label>
                    <input 
                      {...registerForm('phone')}
                      className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-on-surface/20 shadow-inner" 
                      placeholder="(11) 99999-9999" 
                      type="tel"
                    />
                    {registerErrors.phone && <p className="text-[10px] text-error ml-1">{registerErrors.phone.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-label font-medium text-on-surface-variant uppercase tracking-widest ml-1">Senha</label>
                    <input 
                      {...registerForm('password')}
                      className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-on-surface/20 shadow-inner" 
                      placeholder="••••••••" 
                      type="password"
                    />
                    {registerErrors.password && <p className="text-[10px] text-error ml-1">{registerErrors.password.message}</p>}
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-label font-medium text-primary uppercase tracking-widest ml-1">Nome da Empresa</label>
                    <input 
                      {...registerForm('companyName')}
                      className="w-full bg-primary/5 border border-primary/20 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-primary/20 ring-1 ring-primary/10 shadow-inner" 
                      placeholder="Ex: Fleet Solutions Ltda" 
                      type="text"
                    />
                    {registerErrors.companyName && <p className="text-[10px] text-error ml-1">{registerErrors.companyName.message}</p>}
                  </div>
                </div>
                {/* Tenant Creation Visualizer */}
                <div className="bg-surface-container-highest/40 p-4 rounded-xl border border-primary/10 flex items-start gap-3">
                  <div className="mt-1 bg-tertiary/20 p-2 rounded-lg">
                    <span className="material-symbols-outlined text-tertiary text-lg">domain_add</span>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-tertiary uppercase tracking-wider mb-1">Criação de Tenant Ativa</p>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">Ao prosseguir, você criará um ambiente isolado de dados para sua empresa. Você será o <strong>Administrador Global</strong> deste tenant.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input 
                    {...registerForm('terms')}
                    className="rounded bg-surface-container-low border-surface-container-highest text-primary focus:ring-primary/40" 
                    id="terms" 
                    type="checkbox"
                  />
                  <label className="text-[10px] text-on-surface-variant" htmlFor="terms">Concordo com os <a className="underline text-primary" href="#">Termos de Serviço</a> e <a className="underline text-primary" href="#">Privacidade</a>.</label>
                </div>
                {registerErrors.terms && <p className="text-[10px] text-error ml-1">{registerErrors.terms.message}</p>}
                <button type="submit" className="w-full auth-gradient text-on-primary font-headline font-bold py-4 rounded-xl shadow-lg shadow-primary/10 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                  <span>Criar Minha Empresa</span>
                  <span className="material-symbols-outlined">rocket_launch</span>
                </button>
              </form>
            </div>
          )}

          {/* Footer Meta */}
          <footer className="mt-auto pt-8 flex justify-between items-center text-[10px] text-on-surface-variant/40 font-label uppercase tracking-widest">
            <span>© {new Date().getFullYear()} LocaCar</span>
            <div className="flex gap-4">
              <a className="hover:text-primary transition-colors" href="#">Suporte</a>
              <a className="hover:text-primary transition-colors" href="#">API</a>
            </div>
          </footer>
        </section>
      </main>
      {/* Global Layout Decorative Blur */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[819px] bg-primary/5 blur-[180px] -z-20 pointer-events-none"></div>
    </div>
  );
};

export default Login;

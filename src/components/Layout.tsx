import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const user = JSON.parse(localStorage.getItem('locacar_user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('locacar_token');
    localStorage.removeItem('locacar_user');
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { name: 'Veículos', icon: 'directions_car', path: '/vehicles' },
    { name: 'Clientes', icon: 'group', path: '/customers' },
    { name: 'Locações', icon: 'key', path: '/rentals' },
    { name: 'Manutenção', icon: 'build', path: '/maintenance' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-surface font-body selection:bg-primary/30">
      {/* SideNavBar */}
      <aside className="w-64 h-screen hidden md:flex flex-col sticky left-0 top-0 bg-surface-container-low border-r border-slate-800/30 z-40">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">speed</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tighter text-primary font-headline">LocaCar</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">Enterprise Management</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-headline tracking-tight text-sm font-medium transition-all ${
                isActive(item.path)
                  ? 'bg-surface-container-high text-primary border-l-4 border-primary'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-surface-container transition-colors'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="mt-auto p-4 space-y-1">
          <a className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-100 hover:bg-surface-container transition-colors font-headline tracking-tight text-sm font-medium" href="#">
            <span className="material-symbols-outlined">help</span>
            Suporte
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-100 hover:bg-surface-container transition-colors font-headline tracking-tight text-sm font-medium" href="#">
            <span className="material-symbols-outlined">description</span>
            Documentação
          </a>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        {/* TopNavBar */}
        <header className="flex justify-between items-center w-full px-6 py-3 z-50 bg-surface/80 backdrop-blur-xl sticky top-0 shadow-sm shadow-indigo-500/5 border-b border-slate-800/30">
          <div className="flex items-center flex-1">
            <div className="relative w-full max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">search</span>
              <input 
                className="w-full bg-surface-container-highest/40 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50 text-on-surface-variant placeholder:text-slate-500" 
                placeholder="Pesquisar frota, clientes ou contratos..." 
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleTheme}
              className="hover:text-primary hover:bg-surface-container rounded-full p-2 transition-all"
              title={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
            >
              <span className="material-symbols-outlined">
                {theme === 'light' ? 'dark_mode' : 'light_mode'}
              </span>
            </button>
            <button className="hover:text-primary hover:bg-surface-container rounded-full p-2 transition-all relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-tertiary rounded-full"></span>
            </button>
            <button onClick={handleLogout} className="hover:text-error hover:bg-surface-container rounded-full p-2 transition-all" title="Sair">
              <span className="material-symbols-outlined">logout</span>
            </button>
            <div className="h-8 w-px bg-slate-800 mx-2"></div>
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-100">{user.name || 'Usuário'}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">ID #{user.id || '---'}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 text-primary font-bold text-sm">
                {user.name ? user.name[0] : 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>

        {/* Footer */}
        <footer className="w-full py-8 mt-auto flex flex-col md:flex-row justify-between items-center px-10 gap-4 bg-surface border-t border-slate-800/30 font-body">
          <p className="text-xs text-slate-500">© 2024 LocaCar Management. Projeto Acadêmico: Demonstração de IA.</p>
          <div className="flex gap-6">
            <a className="text-slate-500 hover:text-white transition-colors text-xs" href="#">Privacidade</a>
            <a className="text-slate-500 hover:text-white transition-colors text-xs" href="#">Termos</a>
            <a className="text-slate-500 hover:text-white transition-colors text-xs" href="#">API</a>
          </div>
        </footer>
      </main>

      {/* Mobile BottomNavBar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center p-3 pb-6 bg-surface-container-lowest z-50 rounded-t-2xl border-t border-slate-800/50 shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
        <Link to="/dashboard" className={`flex flex-col items-center justify-center px-4 py-1.5 text-[10px] uppercase font-medium tracking-widest ${isActive('/dashboard') ? 'text-primary' : 'text-slate-500'}`}>
          <span className="material-symbols-outlined">home</span>
          <span>Home</span>
        </Link>
        <Link to="/vehicles" className={`flex flex-col items-center justify-center px-4 py-1.5 text-[10px] uppercase font-medium tracking-widest ${isActive('/vehicles') ? 'text-primary' : 'text-slate-500'}`}>
          <span className="material-symbols-outlined">directions_car</span>
          <span>Frota</span>
        </Link>
        <Link to="/rentals" className={`flex flex-col items-center justify-center px-4 py-1.5 text-[10px] uppercase font-medium tracking-widest ${isActive('/rentals') ? 'text-primary' : 'text-slate-500'}`}>
          <span className="material-symbols-outlined">event_note</span>
          <span>Locações</span>
        </Link>
        <button className="flex flex-col items-center justify-center text-slate-500 px-4 py-1.5 text-[10px] uppercase font-medium tracking-widest">
          <span className="material-symbols-outlined">menu</span>
          <span>Menu</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;

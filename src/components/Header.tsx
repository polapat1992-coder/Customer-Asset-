import { Bell, Search, Menu, Landmark } from 'lucide-react';
import { Notification } from '../types';

interface HeaderProps {
  notifications: Notification[];
  onSearch: (query: string) => void;
  onOpenNotifications: () => void;
  onMenuClick?: () => void;
}

export function Header({ notifications, onSearch, onOpenNotifications, onMenuClick }: HeaderProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={onMenuClick}
            className="p-2 -ml-2 lg:hidden hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200/50">
              <Landmark className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 hidden sm:block tracking-tight">
              Broker<span className="text-blue-600">CRM</span>
            </h1>
          </div>
        </div>
        
        <div className="flex-1 max-w-xl">
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text"
              placeholder="Search customers, properties, or appointments..."
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-2xl bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenNotifications}
            className="p-2.5 hover:bg-slate-100 rounded-2xl relative transition-all group"
          >
            <Bell className="w-5 h-5 text-slate-500 group-hover:text-slate-700" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-brand-gold rounded-full border-2 border-white animate-pulse"></span>
            )}
          </button>
          <div className="h-9 w-px bg-slate-200 mx-1 hidden sm:block"></div>
          <div className="flex items-center gap-3 pl-1">
            <div className="hidden md:block text-right">
              <p className="text-xs font-bold text-slate-900">Polapat R.</p>
              <p className="text-[10px] font-medium text-slate-500">Senior Broker</p>
            </div>
            <div className="w-9 h-9 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-bold text-xs shadow-lg shadow-slate-200">
              PR
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

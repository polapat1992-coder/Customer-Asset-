import { Home, Users, Building, Calculator, Settings, LogOut, X, LayoutDashboard, Landmark, Calendar, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export type ViewType = 'DASHBOARD' | 'CUSTOMERS' | 'PROPERTIES' | 'PARTNERS' | 'BANK_OFFICERS' | 'OWNERS' | 'CALCULATOR' | 'CALENDAR' | 'SETTINGS';

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ activeView, onViewChange, isOpen, onClose }: SidebarProps) {
  const menuItems = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'CALENDAR', label: 'Calendar', icon: Calendar },
    { id: 'CUSTOMERS', label: 'Customers', icon: Users },
    { id: 'PROPERTIES', label: 'Properties', icon: Home },
    { id: 'OWNERS', label: 'Owners', icon: UserCheck },
    { id: 'BANK_OFFICERS', label: 'Bank Officers', icon: Landmark },
    { id: 'PARTNERS', label: 'Partners', icon: Building },
    { id: 'CALCULATOR', label: 'Loan Calculator', icon: Calculator },
  ] as const;

  const SidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-100">
      <div className="p-4 border-b border-slate-50 flex items-center justify-between lg:hidden">
        <span className="font-bold text-blue-600">Main Menu</span>
        <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <nav className="flex-1 p-4 space-y-1.5">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onViewChange(item.id);
              onClose?.();
            }}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200",
              activeView === item.id
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <item.icon className={cn("w-5 h-5 transition-colors", activeView === item.id ? "text-white" : "text-slate-400")} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-50 space-y-1.5">
        <button 
          onClick={() => {
            onViewChange('SETTINGS');
            onClose?.();
          }}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200",
            activeView === 'SETTINGS'
              ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          )}
        >
          <Settings className={cn("w-5 h-5 transition-colors", activeView === 'SETTINGS' ? "text-white" : "text-slate-400")} />
          Settings
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all">
          <LogOut className="w-5 h-5 text-red-400" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-[calc(100vh-64px)] sticky top-16">
        {SidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 z-50 lg:hidden"
            >
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

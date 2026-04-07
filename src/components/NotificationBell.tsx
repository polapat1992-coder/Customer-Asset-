import { Dialog } from './ui/Dialog';
import { Notification } from '../types';
import { Bell } from 'lucide-react';

interface NotificationBellProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
}

export function NotificationBell({ isOpen, onClose, notifications }: NotificationBellProps) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Notifications" maxWidth="max-w-sm">
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-slate-500 flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-4 border border-slate-100">
              <Bell className="w-8 h-8 text-slate-200" />
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No new notifications</p>
          </div>
        ) : (
          notifications.map(n => (
            <div 
              key={n.id} 
              className={`p-4 rounded-2xl border transition-all relative overflow-hidden ${
                n.read 
                  ? 'bg-white border-slate-100 hover:border-slate-200' 
                  : 'bg-blue-50/50 border-blue-100 shadow-sm shadow-blue-100/50'
              }`}
            >
              {!n.read && <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>}
              <p className={`text-sm leading-relaxed ${n.read ? 'text-slate-600 font-medium' : 'text-slate-900 font-bold'}`}>
                {n.message}
              </p>
              <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-widest">
                {new Date(n.createdAt).toLocaleString('en-US')}
              </p>
            </div>
          ))
        )}
      </div>
    </Dialog>
  );
}

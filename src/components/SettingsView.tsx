import { useState } from 'react';
import { 
  Settings, 
  Bell, 
  Globe, 
  Shield, 
  User, 
  CreditCard, 
  Mail, 
  Smartphone, 
  Check,
  ChevronRight,
  Database,
  Cloud
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function SettingsView() {
  const [activeTab, setActiveTab] = useState('GENERAL');

  const tabs = [
    { id: 'GENERAL', label: 'General Info', icon: Globe },
    { id: 'NOTIFICATIONS', label: 'Notifications', icon: Bell },
    { id: 'SECURITY', label: 'Security', icon: Shield },
    { id: 'ROLES', label: 'User Roles', icon: User },
    { id: 'INTEGRATIONS', label: 'Integrations', icon: Cloud },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Settings</h2>
        <p className="text-slate-500 font-medium">Manage application settings and access permissions</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Tabs Sidebar */}
        <div className="w-full lg:w-64 space-y-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200",
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                  : "text-slate-500 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-100"
              )}
            >
              <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "text-white" : "text-slate-400")} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1 space-y-6">
          {activeTab === 'GENERAL' && (
            <div className="glass-card rounded-3xl p-8 space-y-8">
              <section className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                  Basic Settings
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Default Currency</label>
                    <select className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-bold">
                      <option value="THB">Baht (THB)</option>
                      <option value="USD">US Dollar (USD)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Date Format</label>
                    <select className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-bold">
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </section>

              <section className="space-y-6 pt-8 border-t border-slate-50">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-brand-gold rounded-full"></div>
                  Company Information
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Company Name</label>
                    <input 
                      type="text" 
                      defaultValue="BrokerCRM Real Estate"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Contact Email</label>
                      <input 
                        type="email" 
                        defaultValue="contact@brokercrm.com"
                        className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                      <input 
                        type="tel" 
                        defaultValue="02-123-4567"
                        className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-bold"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <div className="flex justify-end pt-4">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'NOTIFICATIONS' && (
            <div className="glass-card rounded-3xl p-8 space-y-8">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                Notification Settings
              </h3>

              <div className="space-y-4">
                {[
                  { id: 'email', label: 'Email Notifications', desc: 'Send email for new appointments or changes', icon: Mail },
                  { id: 'push', label: 'Browser Push Notifications', desc: 'Show instant notifications on screen', icon: Bell },
                  { id: 'sms', label: 'Customer SMS Alerts', desc: 'Automatically send confirmation SMS to customers', icon: Smartphone },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:border-slate-100 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{item.label}</p>
                        <p className="text-xs font-medium text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={item.id !== 'sms'} />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ROLES' && (
            <div className="glass-card rounded-3xl p-8 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                  Manage User Roles
                </h3>
                <button className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">
                  + Add New Role
                </button>
              </div>

              <div className="overflow-hidden border border-slate-100 rounded-2xl">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Users</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Access</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {[
                      { role: 'Administrator', users: 2, access: 'Full Access' },
                      { role: 'Senior Broker', users: 5, access: 'View & Edit' },
                      { role: 'Junior Broker', users: 12, access: 'View Only' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-slate-900">{row.role}</td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-500">{row.users} users</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                            {row.access}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

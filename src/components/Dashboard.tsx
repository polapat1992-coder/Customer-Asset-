import { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Customer, Appointment } from '../types';
import { Users, CheckCircle, Clock, AlertCircle, TrendingUp, Wallet, Calendar, MapPin } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { isAfter, isSameDay, parseISO } from 'date-fns';
import { th } from 'date-fns/locale';
import { format } from 'date-fns';

interface DashboardProps {
  customers: Customer[];
  appointments: Appointment[];
}

export function Dashboard({ customers, appointments }: DashboardProps) {
  const stats = useMemo(() => {
    const total = customers.length;
    const approved = customers.filter(c => c.loanStatus === 'APPROVED' || c.loanStatus === 'TRANSFERRED').length;
    const pending = customers.filter(c => ['NEW', 'PENDING', 'DOCUMENT_COLLECTION', 'PRE_APPROVE', 'SUBMITTED'].includes(c.loanStatus)).length;
    const rejected = customers.filter(c => c.loanStatus === 'REJECTED').length;
    const totalIncome = customers.reduce((sum, c) => sum + c.income, 0);
    const avgIncome = total > 0 ? totalIncome / total : 0;

    return { total, approved, pending, rejected, avgIncome };
  }, [customers]);

  const upcomingAppointments = useMemo(() => {
    const now = new Date();
    return appointments
      .filter(app => {
        const appDate = parseISO(app.date);
        return isAfter(appDate, now) || isSameDay(appDate, now);
      })
      .sort((a, b) => {
        const dateA = parseISO(a.date);
        const dateB = parseISO(b.date);
        if (isSameDay(dateA, dateB)) {
          return a.startTime.localeCompare(b.startTime);
        }
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 4);
  }, [appointments]);

  const statusData = useMemo(() => [
    { name: 'อนุมัติแล้ว', value: stats.approved, color: '#10b981' },
    { name: 'รอดำเนินการ', value: stats.pending, color: '#f59e0b' },
    { name: 'ไม่ผ่าน', value: stats.rejected, color: '#ef4444' },
  ], [stats]);

  const occupationData = useMemo(() => {
    const counts: Record<string, number> = {};
    customers.forEach(c => {
      counts[c.occupation] = (counts[c.occupation] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [customers]);

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#10b981'];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">ภาพรวมระบบ (Dashboard)</h2>
        <p className="text-slate-500 font-medium">สรุปข้อมูลลูกค้าและสถานะการยื่นกู้</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">+12%</span>
          </div>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">ลูกค้าทั้งหมด</p>
          <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.total} <span className="text-sm font-bold text-slate-400">ราย</span></h3>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-100">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">85%</span>
          </div>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">อนุมัติแล้ว</p>
          <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.approved} <span className="text-sm font-bold text-slate-400">ราย</span></h3>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-brand-gold rounded-xl flex items-center justify-center shadow-lg shadow-amber-100">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-bold text-brand-gold bg-amber-50 px-2.5 py-1 rounded-lg">รอดำเนินการ</span>
          </div>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">อยู่ระหว่างดำเนินการ</p>
          <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.pending} <span className="text-sm font-bold text-slate-400">ราย</span></h3>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">รายได้เฉลี่ยลูกค้า</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(Math.round(stats.avgIncome))}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
            สัดส่วนสถานะการยื่นกู้
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Occupation Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-brand-gold rounded-full"></div>
            อาชีพลูกค้า (5 อันดับแรก)
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupationData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#1e3a8a" radius={[0, 8, 8, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Appointments */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
              นัดหมายที่จะถึง
            </h3>
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          
          {upcomingAppointments.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-slate-500">ไม่มีนัดหมายใหม่</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((app) => (
                <div key={app.id} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                  <div className="flex flex-col items-center justify-center min-w-[56px] py-2.5 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <span className="text-[10px] font-bold uppercase tracking-wider">{format(parseISO(app.date), 'MMM', { locale: th })}</span>
                    <span className="text-xl font-black leading-none">{format(parseISO(app.date), 'd')}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{app.title}</h4>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                      <div className="flex items-center text-[11px] text-slate-500 font-bold">
                        <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                        {app.startTime} - {app.endTime}
                      </div>
                      {app.location && (
                        <div className="flex items-center text-[11px] text-slate-500 font-bold">
                          <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                          <span className="truncate">{app.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-slate-900 rounded-full"></div>
            กิจกรรมล่าสุด
          </h3>
          <div className="space-y-4">
            {customers.slice(0, 4).map((c, i) => (
              <div key={i} className="flex items-center justify-between py-4 border-b last:border-0 border-slate-50 group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 font-black text-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{c.name}</p>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">อัปเดตเมื่อ {new Date(c.updatedAt).toLocaleDateString('th-TH')}</p>
                  </div>
                </div>
                <span className={cn(
                  "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm",
                  c.loanStatus === 'APPROVED' ? "bg-emerald-50 text-emerald-600" :
                  c.loanStatus === 'REJECTED' ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                )}>
                  {c.loanStatus === 'APPROVED' ? 'อนุมัติแล้ว' : 
                   c.loanStatus === 'REJECTED' ? 'ไม่ผ่าน' : 'รอดำเนินการ'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

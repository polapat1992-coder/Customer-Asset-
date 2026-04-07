import { useState, useMemo } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  isToday
} from 'date-fns';
import { enUS } from 'date-fns/locale';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  MapPin, 
  User, 
  Phone,
  Video,
  PhoneCall,
  Eye,
  FileCheck,
  MoreHorizontal
} from 'lucide-react';
import { Appointment, Customer, PartnerDetails, BankOfficer } from '../types';
import { cn } from '../lib/utils';

interface CalendarViewProps {
  appointments: Appointment[];
  customers: Customer[];
  partners: PartnerDetails[];
  bankOfficers: BankOfficer[];
  onAddAppointment: () => void;
  onEditAppointment: (appointment: Appointment) => void;
  onDeleteAppointment: (id: string) => void;
}

const appointmentTypeIcons = {
  MEETING: <User className="w-4 h-4" />,
  CALL: <PhoneCall className="w-4 h-4" />,
  SITE_VISIT: <Eye className="w-4 h-4" />,
  DOCUMENT_SIGNING: <FileCheck className="w-4 h-4" />,
  OTHER: <MoreHorizontal className="w-4 h-4" />,
};

const appointmentTypeColors = {
  MEETING: 'bg-blue-50 text-blue-700 border-blue-100',
  CALL: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  SITE_VISIT: 'bg-purple-50 text-purple-700 border-purple-100',
  DOCUMENT_SIGNING: 'bg-amber-50 text-amber-700 border-amber-100',
  OTHER: 'bg-slate-50 text-slate-700 border-slate-100',
};

export function CalendarView({ 
  appointments, 
  customers, 
  partners, 
  bankOfficers,
  onAddAppointment,
  onEditAppointment,
  onDeleteAppointment
}: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentMonth]);

  const selectedDateAppointments = useMemo(() => {
    return appointments.filter(app => isSameDay(new Date(app.date), selectedDate))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [appointments, selectedDate]);

  const getDayAppointments = (day: Date) => {
    return appointments.filter(app => isSameDay(new Date(app.date), day));
  };

  const getEntityName = (app: Appointment) => {
    if (app.customerId) return customers.find(c => c.id === app.customerId)?.name;
    if (app.partnerId) return partners.find(p => p.id === app.partnerId)?.name;
    if (app.bankOfficerId) return bankOfficers.find(b => b.id === app.bankOfficerId)?.name;
    return null;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full">
      {/* Calendar Grid */}
      <div className="flex-1 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {format(currentMonth, 'MMMM yyyy', { locale: enUS })}
            </h2>
            <div className="flex items-center bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100">
              <button onClick={prevMonth} className="p-2 hover:bg-slate-50 rounded-xl transition-all">
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
              <button 
                onClick={() => setCurrentMonth(new Date())} 
                className="px-4 py-1.5 text-xs font-black text-slate-500 hover:text-blue-600 uppercase tracking-widest"
              >
                Today
              </button>
              <button onClick={nextMonth} className="p-2 hover:bg-slate-50 rounded-xl transition-all">
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
          <button 
            onClick={onAddAppointment}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2.5 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            <Plus className="w-4 h-4" /> New Appointment
          </button>
        </div>

        <div className="grid grid-cols-7 border-b border-slate-50 bg-slate-50/30">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              {day}
            </div>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-7 auto-rows-fr">
          {days.map((day, idx) => {
            const dayApps = getDayAppointments(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isSelected = isSameDay(day, selectedDate);
            const isTodayDay = isToday(day);

            return (
              <div 
                key={idx}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "min-h-[120px] p-3 border-r border-b border-slate-50 cursor-pointer transition-all relative group",
                  !isCurrentMonth && "bg-slate-50/30",
                  isSelected && "bg-blue-50/40 ring-2 ring-inset ring-blue-100",
                  "hover:bg-slate-50/50"
                )}
              >
                <div className="flex justify-between items-start">
                  <span className={cn(
                    "text-xs font-black w-8 h-8 flex items-center justify-center rounded-2xl transition-all",
                    !isCurrentMonth && "text-slate-300",
                    isCurrentMonth && "text-slate-700",
                    isTodayDay && "bg-blue-600 text-white shadow-lg shadow-blue-200",
                    isSelected && !isTodayDay && "bg-blue-100 text-blue-700"
                  )}>
                    {format(day, 'd')}
                  </span>
                  {dayApps.length > 0 && (
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                      {dayApps.length}
                    </span>
                  )}
                </div>
                
                <div className="mt-2 space-y-1.5 overflow-hidden">
                  {dayApps.slice(0, 3).map(app => (
                    <div 
                      key={app.id}
                      className={cn(
                        "text-[9px] px-2 py-1 rounded-lg border truncate font-bold uppercase tracking-wider",
                        appointmentTypeColors[app.type]
                      )}
                    >
                      {app.startTime} {app.title}
                    </div>
                  ))}
                  {dayApps.length > 3 && (
                    <div className="text-[9px] text-slate-400 pl-1 font-bold uppercase tracking-widest">
                      + {dayApps.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Side Panel: Selected Day Details */}
      <div className="w-full lg:w-96 flex flex-col gap-6">
        <div className="glass-card rounded-3xl p-6 flex flex-col h-full">
          <div className="mb-8">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
              {format(selectedDate, 'EEEE', { locale: enUS })}
            </p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">
              {format(selectedDate, 'd MMMM yyyy', { locale: enUS })}
            </h3>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
              Today's Appointments
            </h4>
            
            {selectedDateAppointments.length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                  <Clock className="w-8 h-8 text-slate-200" />
                </div>
                <p className="text-sm font-bold text-slate-400">No appointments today</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDateAppointments.map(app => (
                  <div 
                    key={app.id}
                    onClick={() => onEditAppointment(app)}
                    className="group p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer bg-white relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex items-start justify-between mb-3">
                      <div className={cn(
                        "p-2 rounded-xl border transition-colors",
                        appointmentTypeColors[app.type]
                      )}>
                        {appointmentTypeIcons[app.type]}
                      </div>
                      <span className="text-[10px] font-black text-slate-400 group-hover:text-blue-600 transition-colors uppercase tracking-widest">
                        {app.startTime} - {app.endTime}
                      </span>
                    </div>
                    
                    <h5 className="font-bold text-slate-900 mb-1.5 group-hover:text-blue-600 transition-colors leading-tight">
                      {app.title}
                    </h5>
                    
                    {app.description && (
                      <p className="text-[11px] font-medium text-slate-500 mb-3 line-clamp-2 leading-relaxed">
                        {app.description}
                      </p>
                    )}

                    <div className="space-y-2 pt-3 border-t border-slate-50">
                      {getEntityName(app) && (
                        <div className="flex items-center text-[10px] font-bold text-slate-600">
                          <User className="w-3.5 h-3.5 mr-2 text-slate-300" />
                          <span>{getEntityName(app)}</span>
                        </div>
                      )}
                      {app.location && (
                        <div className="flex items-center text-[10px] font-bold text-slate-600">
                          <MapPin className="w-3.5 h-3.5 mr-2 text-slate-300" />
                          <span className="truncate">{app.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Monthly Summary</h4>
          <div className="grid grid-cols-2 gap-8 relative z-10">
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Appointments</p>
              <p className="text-3xl font-black tracking-tight">
                {appointments.filter(app => isSameMonth(new Date(app.date), currentMonth)).length}
              </p>
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">This Week</p>
              <p className="text-3xl font-black tracking-tight text-blue-400">
                {appointments.filter(app => {
                  const date = new Date(app.date);
                  const start = startOfWeek(new Date());
                  const end = endOfWeek(new Date());
                  return date >= start && date <= end;
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

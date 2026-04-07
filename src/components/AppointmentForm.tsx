import { useState, useEffect } from 'react';
import { Dialog } from './ui/Dialog';
import { Appointment, Customer, PartnerDetails, BankOfficer } from '../types';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  FileText, 
  ChevronDown, 
  PhoneCall, 
  Eye, 
  FileCheck, 
  MoreHorizontal,
  Trash2
} from 'lucide-react';
import { cn } from '../lib/utils';

interface AppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: Appointment) => void;
  onDelete?: (id: string) => void;
  appointment?: Appointment | null;
  customers: Customer[];
  partners: PartnerDetails[];
  bankOfficers: BankOfficer[];
}

const appointmentTypes = [
  { id: 'MEETING', label: 'Meeting', icon: <User className="w-4 h-4" /> },
  { id: 'CALL', label: 'Call', icon: <PhoneCall className="w-4 h-4" /> },
  { id: 'SITE_VISIT', label: 'Site Visit', icon: <Eye className="w-4 h-4" /> },
  { id: 'DOCUMENT_SIGNING', label: 'Signing', icon: <FileCheck className="w-4 h-4" /> },
  { id: 'OTHER', label: 'Other', icon: <MoreHorizontal className="w-4 h-4" /> },
];

export function AppointmentForm({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete,
  appointment, 
  customers, 
  partners, 
  bankOfficers 
}: AppointmentFormProps) {
  const [formData, setFormData] = useState<Partial<Appointment>>({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '11:00',
    type: 'MEETING',
    location: '',
  });

  useEffect(() => {
    if (appointment) {
      setFormData({
        ...appointment,
        date: new Date(appointment.date).toISOString().split('T')[0],
      });
    } else {
      setFormData({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '10:00',
        endTime: '11:00',
        type: 'MEETING',
        location: '',
      });
    }
  }, [appointment, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: appointment?.id || Math.random().toString(36).substr(2, 9),
    } as Appointment);
    onClose();
  };

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose} 
      title={appointment ? "Edit Appointment" : "Add New Appointment"}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Appointment Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., House viewing, Loan discussion"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Start</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full pl-10 pr-2 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">End</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full pl-10 pr-2 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Appointment Type</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {appointmentTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: type.id as any })}
                  className={cn(
                    "flex flex-col items-center justify-center p-2 rounded-xl border transition-all gap-1",
                    formData.type === type.id 
                      ? "bg-blue-50 border-blue-500 text-blue-600 shadow-sm" 
                      : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                  )}
                >
                  {type.icon}
                  <span className="text-[10px] font-bold">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Related To</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={formData.customerId || formData.partnerId || formData.bankOfficerId || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val.startsWith('c:')) setFormData({ ...formData, customerId: val.replace('c:', ''), partnerId: undefined, bankOfficerId: undefined });
                    else if (val.startsWith('p:')) setFormData({ ...formData, partnerId: val.replace('p:', ''), customerId: undefined, bankOfficerId: undefined });
                    else if (val.startsWith('b:')) setFormData({ ...formData, bankOfficerId: val.replace('b:', ''), customerId: undefined, partnerId: undefined });
                    else setFormData({ ...formData, customerId: undefined, partnerId: undefined, bankOfficerId: undefined });
                  }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                >
                  <option value="">Not Specified</option>
                  <optgroup label="Customers">
                    {customers.map(c => <option key={c.id} value={`c:${c.id}`}>{c.name}</option>)}
                  </optgroup>
                  <optgroup label="Partners">
                    {partners.map(p => <option key={p.id} value={`p:${p.id}`}>{p.name}</option>)}
                  </optgroup>
                  <optgroup label="Bank Officers">
                    {bankOfficers.map(b => <option key={b.id} value={`b:${b.id}`}>{b.name}</option>)}
                  </optgroup>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., Office, Project Site"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Additional Details</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[100px]"
                placeholder="Enter appointment details..."
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          {appointment && onDelete ? (
            <button
              type="button"
              onClick={() => {
                if (confirm('Are you sure you want to delete this appointment?')) {
                  onDelete(appointment.id);
                  onClose();
                }
              }}
              className="text-red-600 hover:text-red-700 font-bold flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-red-50 transition-all"
            >
              <Trash2 className="w-4 h-4" /> Delete Appointment
            </button>
          ) : (
            <div />
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </Dialog>
  );
}

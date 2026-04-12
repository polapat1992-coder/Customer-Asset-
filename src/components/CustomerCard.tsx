import { Customer } from '../types';
import { formatCurrency } from '../lib/utils';
import { Building2, Phone, Briefcase, Wallet, ChevronRight, MessageSquare, User } from 'lucide-react';

const statusColors = {
  NEW: 'bg-blue-50 text-blue-700 border-blue-100',
  DOCUMENT_COLLECTION: 'bg-amber-50 text-amber-700 border-amber-100',
  PRE_APPROVE: 'bg-purple-50 text-purple-700 border-purple-100',
  SUBMITTED: 'bg-orange-50 text-orange-700 border-orange-100',
  APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  REJECTED: 'bg-rose-50 text-rose-700 border-rose-100',
  TRANSFERRED: 'bg-slate-900 text-white border-slate-900',
};

const statusLabels = {
  NEW: 'ลูกค้าใหม่',
  DOCUMENT_COLLECTION: 'เก็บเอกสาร',
  PRE_APPROVE: 'Pre-Approve',
  SUBMITTED: 'ยื่นกู้แล้ว',
  APPROVED: 'อนุมัติแล้ว',
  REJECTED: 'ไม่ผ่าน',
  TRANSFERRED: 'โอนกรรมสิทธิ์',
};

interface CustomerCardProps {
  customer: Customer;
  onClick: () => void;
}

export function CustomerCard({ customer, onClick }: CustomerCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 cursor-pointer group relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100 group-hover:border-blue-100 transition-colors">
            {customer.avatar ? (
              <img src={customer.avatar} alt={customer.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <User className="w-7 h-7 text-slate-300 group-hover:text-blue-600 transition-colors" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
              {customer.name}
            </h3>
            <div className="flex items-center text-xs font-bold text-slate-400 mt-1.5 uppercase tracking-wider">
              <Phone className="w-3.5 h-3.5 mr-2 text-slate-300" />
              {customer.phone}
            </div>
          </div>
        </div>
        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${statusColors[customer.loanStatus]}`}>
          {statusLabels[customer.loanStatus]}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-slate-50">
        <div className="flex items-center text-xs font-bold text-slate-600">
          <Briefcase className="w-4 h-4 mr-2.5 text-slate-300" />
          <span className="truncate">{customer.occupation}</span>
        </div>
        <div className="flex items-center text-xs font-bold text-slate-600">
          <Wallet className="w-4 h-4 mr-2.5 text-slate-300" />
          <span>{formatCurrency(customer.income)}</span>
        </div>
      </div>
      
      <div className="mt-5 flex items-center justify-between text-[11px] font-bold">
        <div className="flex items-center gap-5">
          <div className="flex items-center text-slate-400 group-hover:text-blue-600 transition-colors">
            {customer.propertyIds && customer.propertyIds.length > 0 ? (
              <><Building2 className="w-4 h-4 mr-2 text-blue-500" /> ทรัพย์สิน ({customer.propertyIds.length})</>
            ) : (
              <><Building2 className="w-4 h-4 mr-2 text-slate-200" /> ไม่มีข้อมูลทรัพย์สิน</>
            )}
          </div>
          {customer.notes && customer.notes.length > 0 && (
            <div className="flex items-center text-slate-400">
              <MessageSquare className="w-4 h-4 mr-2 text-slate-200" />
              {customer.notes.length}
            </div>
          )}
        </div>
        <div className="text-blue-600 flex items-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
          รายละเอียด <ChevronRight className="w-4 h-4 ml-1" />
        </div>
      </div>
    </div>
  );
}

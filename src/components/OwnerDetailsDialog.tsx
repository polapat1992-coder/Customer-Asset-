import { Dialog } from './ui/Dialog';
import { Owner, PropertyDetails } from '../types';
import { Phone, MessageCircle, Facebook, FileText, Home, User, X, Calendar, Mail, MapPin, CreditCard, Building } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

interface OwnerDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  owner: Owner | null;
  properties: PropertyDetails[];
  onViewProperty: (property: PropertyDetails) => void;
}

export function OwnerDetailsDialog({ isOpen, onClose, owner, properties, onViewProperty }: OwnerDetailsDialogProps) {
  if (!owner) return null;

  const ownerProperties = properties.filter(p => p.ownerId === owner.id);

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="รายละเอียดเจ้าของทรัพย์" maxWidth="max-w-xl">
      <div className="p-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
            <User className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-900">{owner.name}</h2>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
                {owner.ownerType === 'COMPANY' ? 'นิติบุคคล' : 'บุคคลธรรมดา'}
              </span>
            </div>
            <p className="text-sm text-slate-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> เป็นสมาชิกเมื่อ {new Date(owner.createdAt).toLocaleDateString('th-TH')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-500 mb-1">เบอร์โทรศัพท์</p>
            <p className="font-bold text-slate-900 flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-500" /> {owner.phone}
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-500 mb-1">อีเมล</p>
            <p className="font-bold text-slate-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-500" /> {owner.email || 'ไม่ระบุ'}
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-500 mb-1">Line ID</p>
            <p className="font-bold text-slate-900 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-green-500" /> {owner.lineId || 'ไม่ระบุ'}
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-500 mb-1">Facebook</p>
            {owner.facebookUrl ? (
              <a 
                href={owner.facebookUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-bold text-blue-600 hover:underline flex items-center gap-2 truncate"
              >
                <Facebook className="w-4 h-4" /> ดูโปรไฟล์
              </a>
            ) : (
              <p className="font-bold text-slate-400">ไม่ระบุ</p>
            )}
          </div>
          {owner.address && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 col-span-2">
              <p className="text-xs text-slate-500 mb-1">ที่อยู่ / สถานที่ติดต่อ</p>
              <p className="text-sm text-slate-700 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" /> {owner.address}
              </p>
            </div>
          )}
        </div>

        {owner.bankAccount && (owner.bankAccount.bankName || owner.bankAccount.accountNumber) && (
          <div className="mb-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
            <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-2">
              <CreditCard className="w-3.5 h-3.5" /> ข้อมูลบัญชีธนาคาร
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-slate-500">ธนาคาร</p>
                <p className="text-sm font-bold text-slate-900">{owner.bankAccount.bankName || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500">เลขที่บัญชี</p>
                <p className="text-sm font-bold text-slate-900">{owner.bankAccount.accountNumber || '-'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] text-slate-500">ชื่อบัญชี</p>
                <p className="text-sm font-bold text-slate-900">{owner.bankAccount.accountName || '-'}</p>
              </div>
            </div>
          </div>
        )}

        {owner.notes && (
          <div className="mb-8">
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" /> หมายเหตุ
            </h3>
            <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl text-sm text-slate-700 italic">
              {owner.notes}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Home className="w-4 h-4 text-blue-500" /> ทรัพย์สินในครอบครอง ({ownerProperties.length})
          </h3>
          <div className="space-y-3">
            {ownerProperties.map(property => (
              <div 
                key={property.id}
                onClick={() => onViewProperty(property)}
                className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-colors">
                    <Home className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{property.name}</p>
                    <p className="text-xs text-blue-600 font-semibold">{formatCurrency(property.price)}</p>
                  </div>
                </div>
                <div className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                  {property.location}
                </div>
              </div>
            ))}
            {ownerProperties.length === 0 && (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-sm text-slate-400 italic">ไม่มีทรัพย์สินที่เชื่อมโยง</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}

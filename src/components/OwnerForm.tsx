import { useState, useEffect, useRef } from 'react';
import { Dialog } from './ui/Dialog';
import { Owner } from '../types';
import { User, Phone, MessageCircle, Facebook, FileText, X, Mail, MapPin, CreditCard, Building, ClipboardPaste } from 'lucide-react';
import { cn } from '../lib/utils';
import { parseContactString, isClipboardReadSupported } from '../lib/contacts';

interface OwnerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (owner: Partial<Owner>) => void;
  initialData?: Owner | null;
}

export function OwnerForm({ isOpen, onClose, onSubmit, initialData }: OwnerFormProps) {
  const [formData, setFormData] = useState<Partial<Owner>>({
    name: '',
    phone: '',
    email: '',
    lineId: '',
    facebookUrl: '',
    address: '',
    ownerType: 'INDIVIDUAL',
    bankAccount: {
      bankName: '',
      accountName: '',
      accountNumber: '',
    },
    notes: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        bankAccount: initialData.bankAccount || { bankName: '', accountName: '', accountNumber: '' }
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
        lineId: '',
        facebookUrl: '',
        address: '',
        ownerType: 'INDIVIDUAL',
        bankAccount: {
          bankName: '',
          accountName: '',
          accountNumber: '',
        },
        notes: '',
      });
    }
  }, [initialData, isOpen]);

  const [quickPaste, setQuickPaste] = useState('');
  const [pasteError, setPasteError] = useState<string | null>(null);

  const handleQuickPaste = (val: string) => {
    setQuickPaste(val);
    if (val.trim()) {
      const parsed = parseContactString(val);
      setFormData(prev => ({
        ...prev,
        name: parsed.name || prev.name,
        phone: parsed.phone || prev.phone
      }));
    }
  };

  const handlePasteFromClipboard = async () => {
    setPasteError(null);
    try {
      if (!navigator.clipboard) {
        throw new Error('Clipboard API not available');
      }
      const text = await navigator.clipboard.readText();
      handleQuickPaste(text);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
      setPasteError('ไม่สามารถเข้าถึงคลิปบอร์ดได้ กรุณาวางข้อความด้วยตัวเอง (Ctrl+V)');
      setTimeout(() => setPasteError(null), 5000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={initialData ? 'แก้ไขข้อมูลเจ้าของ' : 'เพิ่มเจ้าของทรัพย์ใหม่'}>
      <div className="p-6">
        <div className="mb-6 bg-blue-50/50 border border-blue-100 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-blue-700 flex items-center">
              <ClipboardPaste className="w-4 h-4 mr-2 text-blue-500" /> 
              วางข้อมูลเจ้าของ (ชื่อและเบอร์โทร)
            </label>
            <span className="text-[10px] text-blue-500 font-medium bg-blue-100 px-2 py-0.5 rounded-full">
              Quick Paste
            </span>
          </div>
          <div className="relative">
            <textarea
              value={quickPaste}
              onChange={(e) => handleQuickPaste(e.target.value)}
              placeholder="วางชื่อและเบอร์โทรที่นี่ (Ctrl+V) (เช่น สมชาย 0812345678)..."
              className="w-full h-24 px-3 py-2 text-sm border border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none resize-none bg-white/80"
            />
            <div className="absolute bottom-3 right-3 flex gap-2">
              {quickPaste && (
                <button
                  type="button"
                  onClick={() => setQuickPaste('')}
                  className="bg-white text-slate-500 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 hover:bg-slate-50 transition-all"
                >
                  ล้าง
                </button>
              )}
              {isClipboardReadSupported() && (
                <button
                  type="button"
                  onClick={handlePasteFromClipboard}
                  className="bg-white text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-blue-200 hover:bg-blue-50 transition-all flex items-center"
                >
                  <ClipboardPaste className="w-3.5 h-3.5 mr-1.5" />
                  วาง
                </button>
              )}
            </div>
          </div>
          {pasteError && (
            <p className="text-[10px] text-red-500 mt-1 animate-pulse">{pasteError}</p>
          )}
          <p className="text-[10px] text-blue-400 mt-1 italic">* ระบบจะแยกชื่อและเบอร์โทรให้อัตโนมัติ</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, ownerType: 'INDIVIDUAL' })}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all",
                  formData.ownerType === 'INDIVIDUAL' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:bg-slate-200"
                )}
              >
                <User className="w-4 h-4" /> บุคคลธรรมดา
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, ownerType: 'COMPANY' })}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all",
                  formData.ownerType === 'COMPANY' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:bg-slate-200"
                )}
              >
                <Building className="w-4 h-4" /> นิติบุคคล
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" /> {formData.ownerType === 'COMPANY' ? 'ชื่อบริษัท / นิติบุคคล' : 'ชื่อ-นามสกุล'}
              </label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder={formData.ownerType === 'COMPANY' ? "ระบุชื่อบริษัท" : "ระบุชื่อเจ้าของทรัพย์"}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-500" /> เบอร์โทรศัพท์
                </label>
                <input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="08x-xxx-xxxx"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-500" /> อีเมล
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-green-500" /> Line ID
                </label>
                <input
                  type="text"
                  value={formData.lineId}
                  onChange={(e) => setFormData({ ...formData, lineId: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Line ID"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Facebook className="w-4 h-4 text-blue-600" /> Facebook Link
                </label>
                <input
                  type="url"
                  value={formData.facebookUrl}
                  onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="https://facebook.com/..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" /> ที่อยู่ / สถานที่ติดต่อ
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all h-20 resize-none"
                placeholder="ระบุที่อยู่สำหรับติดต่อ..."
              />
            </div>

            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-4">
              <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5" /> ข้อมูลบัญชีธนาคาร (สำหรับรับเงิน)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500">ธนาคาร</label>
                  <input
                    type="text"
                    value={formData.bankAccount?.bankName}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      bankAccount: { ...formData.bankAccount!, bankName: e.target.value } 
                    })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="เช่น กสิกรไทย"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500">เลขที่บัญชี</label>
                  <input
                    type="text"
                    value={formData.bankAccount?.accountNumber}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      bankAccount: { ...formData.bankAccount!, accountNumber: e.target.value } 
                    })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="xxx-x-xxxxx-x"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-500">ชื่อบัญชี</label>
                  <input
                    type="text"
                    value={formData.bankAccount?.accountName}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      bankAccount: { ...formData.bankAccount!, accountName: e.target.value } 
                    })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ชื่อ-นามสกุล เจ้าของบัญชี"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" /> หมายเหตุเพิ่มเติม
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24 resize-none"
                placeholder="ข้อมูลเพิ่มเติมอื่นๆ..."
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
            >
              {initialData ? 'บันทึกการแก้ไข' : 'เพิ่มเจ้าของ'}
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}

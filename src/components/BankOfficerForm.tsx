import { useState, useEffect } from 'react';
import { Dialog } from './ui/Dialog';
import { BankOfficer } from '../types';
import { User, Phone, Landmark, MessageCircle, Facebook, FileText } from 'lucide-react';

interface BankOfficerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<BankOfficer>) => void;
  initialData?: BankOfficer | null;
}

export function BankOfficerForm({ isOpen, onClose, onSubmit, initialData }: BankOfficerFormProps) {
  const [formData, setFormData] = useState<Partial<BankOfficer>>({
    name: '',
    bankName: '',
    phone: '',
    lineId: '',
    facebookUrl: '',
    notes: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        bankName: '',
        phone: '',
        lineId: '',
        facebookUrl: '',
        notes: '',
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? "แก้ไขข้อมูลเจ้าหน้าที่ธนาคาร" : "เพิ่มเจ้าหน้าที่ธนาคารใหม่"}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <User className="w-4 h-4 mr-2 text-gray-400" /> ชื่อ-นามสกุล
          </label>
          <input
            required
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="เช่น คุณกิตติศักดิ์ สินเชื่อ"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <Landmark className="w-4 h-4 mr-2 text-gray-400" /> ธนาคาร
          </label>
          <input
            required
            type="text"
            value={formData.bankName}
            onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="เช่น SCB, KBank"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <Phone className="w-4 h-4 mr-2 text-gray-400" /> เบอร์โทรศัพท์
          </label>
          <input
            required
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="เช่น 081-XXX-XXXX"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <MessageCircle className="w-4 h-4 mr-2 text-green-500" /> Line ID
            </label>
            <input
              type="text"
              value={formData.lineId || ''}
              onChange={(e) => setFormData({ ...formData, lineId: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Line ID"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <Facebook className="w-4 h-4 mr-2 text-blue-600" /> Facebook
            </label>
            <input
              type="url"
              value={formData.facebookUrl || ''}
              onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Facebook URL"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <FileText className="w-4 h-4 mr-2 text-gray-400" /> หมายเหตุ
          </label>
          <textarea
            value={formData.notes || ''}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px]"
            placeholder="ข้อมูลเพิ่มเติม..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
          >
            {initialData ? "บันทึกการแก้ไข" : "เพิ่มเจ้าหน้าที่"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}

import { useState, useEffect } from 'react';
import { Dialog } from './ui/Dialog';
import { PartnerDetails } from '../types';
import { User, Phone, Landmark, MessageCircle, Facebook, FileText, Percent, Wallet, Contact, ClipboardPaste } from 'lucide-react';
import { selectContact, isContactPickerSupported, isBrowserSupportedButInIframe, parseContactString } from '../lib/contacts';

interface PartnerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<PartnerDetails>) => void;
  initialData?: PartnerDetails | null;
}

export function PartnerForm({ isOpen, onClose, onSubmit, initialData }: PartnerFormProps) {
  const [formData, setFormData] = useState<Partial<PartnerDetails>>({
    name: '',
    phone: '',
    lineId: '',
    facebookUrl: '',
    bankName: '',
    commissionRate: 0,
    referralFee: 0,
    notes: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        phone: '',
        lineId: '',
        facebookUrl: '',
        bankName: '',
        commissionRate: 0,
        referralFee: 0,
        notes: '',
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const [quickPaste, setQuickPaste] = useState('');

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

  const handleSelectContact = async () => {
    const contact = await selectContact();
    if (contact) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || contact.name || '',
        phone: contact.phone || prev.phone || ''
      }));
    }
  };

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? "Edit Partner Info" : "Add New Partner"}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="w-full mb-4">
          <div className="relative">
            <ClipboardPaste className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
            <input
              type="text"
              value={quickPaste}
              onChange={(e) => handleQuickPaste(e.target.value)}
              placeholder="Paste name and phone here (e.g., John Doe 0812345678)"
              className="w-full pl-10 pr-4 py-2 bg-blue-50 border border-blue-100 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-blue-300"
            />
          </div>
          <p className="text-[10px] text-blue-400 mt-1 ml-1 italic">* Paste copied info to auto-split name and phone</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2 text-gray-400" /> Partner / Broker Name
            </div>
            {isContactPickerSupported() ? (
              <button
                type="button"
                onClick={handleSelectContact}
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center font-normal"
              >
                <Contact className="w-3 h-3 mr-1" /> Select from Contacts
              </button>
            ) : isBrowserSupportedButInIframe() ? (
              <span className="text-[10px] text-gray-400 font-normal italic">
                Open in new tab to select from contacts
              </span>
            ) : null}
          </label>
          <input
            required
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g., Mr. Somchai Broker"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <Phone className="w-4 h-4 mr-2 text-gray-400" /> Phone Number
          </label>
          <input
            required
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g., 085-XXX-XXXX"
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
            <Landmark className="w-4 h-4 mr-2 text-gray-400" /> Recommended Bank
          </label>
          <input
            type="text"
            value={formData.bankName || ''}
            onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g., SCB, KBank"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <Percent className="w-4 h-4 mr-2 text-gray-400" /> Commission (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.commissionRate || ''}
              onChange={(e) => setFormData({ ...formData, commissionRate: Number(e.target.value) })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., 1.5"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <Wallet className="w-4 h-4 mr-2 text-gray-400" /> Referral Fee (THB)
            </label>
            <input
              type="number"
              value={formData.referralFee || ''}
              onChange={(e) => setFormData({ ...formData, referralFee: Number(e.target.value) })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., 10000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <FileText className="w-4 h-4 mr-2 text-gray-400" /> Notes
          </label>
          <textarea
            value={formData.notes || ''}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px]"
            placeholder="Additional information..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
          >
            {initialData ? "Save Changes" : "Add Partner"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}

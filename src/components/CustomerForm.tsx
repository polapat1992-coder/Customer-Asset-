import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from './ui/Dialog';
import { Customer, PropertyDetails, PartnerDetails, BankOfficer, CoBorrower } from '../types';
import { getNcbDescription } from '../lib/ncb';
import { User, Camera, Trash2, Landmark, Plus, Users, Contact, ClipboardPaste } from 'lucide-react';
import { selectContact, isContactPickerSupported, isBrowserSupportedButInIframe, parseContactString, isClipboardReadSupported } from '../lib/contacts';

interface CustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customer: Partial<Customer>) => void;
  initialData?: Customer | null;
  properties: PropertyDetails[];
  partners: PartnerDetails[];
  bankOfficers: BankOfficer[];
}

export function CustomerForm({ isOpen, onClose, onSubmit, initialData, properties, partners, bankOfficers }: CustomerFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Partial<Customer>>({
    name: '',
    phone: '',
    avatar: '',
    occupation: '',
    income: 0,
    additionalIncome: 0,
    debtBurden: 0,
    creditScore: 'Good',
    ncbCode: '',
    loanStatus: 'NEW',
    propertyIds: [],
    partnerId: '',
    bankOfficerId: '',
    lineId: '',
    facebookUrl: '',
    coBorrowers: [],
    documentChecklist: {
      personal: { idCard: false, houseRegistration: false, nameChangeCertificate: false, marriageCertificate: false },
      income: { salarySlip: false, bankStatement: false, employmentCertificate: false, taxReturn: false }
    }
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        phone: '',
        avatar: '',
        occupation: '',
        income: 0,
        additionalIncome: 0,
        debtBurden: 0,
        creditScore: 'Good',
        ncbCode: '',
        loanStatus: 'NEW',
        propertyIds: [],
        partnerId: '',
        bankOfficerId: '',
        lineId: '',
        facebookUrl: '',
        coBorrowers: [],
        documentChecklist: {
          personal: { idCard: false, houseRegistration: false, nameChangeCertificate: false, marriageCertificate: false },
          income: { salarySlip: false, bankStatement: false, employmentCertificate: false, taxReturn: false }
        }
      });
    }
  }, [initialData, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, avatar: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['income', 'additionalIncome', 'debtBurden'].includes(name) ? Number(value) : value
    }));
  };

  const addCoBorrower = () => {
    const newCoBorrower: CoBorrower = {
      id: `cb${Date.now()}`,
      name: '',
      phone: '',
      occupation: '',
      income: 0,
      creditScore: 'Good',
      relation: ''
    };
    setFormData(prev => ({
      ...prev,
      coBorrowers: [...(prev.coBorrowers || []), newCoBorrower]
    }));
  };

  const removeCoBorrower = (id: string) => {
    setFormData(prev => ({
      ...prev,
      coBorrowers: (prev.coBorrowers || []).filter(cb => cb.id !== id)
    }));
  };

  const handleCoBorrowerChange = (id: string, field: keyof CoBorrower, value: any) => {
    setFormData(prev => ({
      ...prev,
      coBorrowers: (prev.coBorrowers || []).map(cb => 
        cb.id === id ? { ...cb, [field]: value } : cb
      )
    }));
  };

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

  const handleCoBorrowerContact = async (id: string) => {
    const contact = await selectContact();
    if (contact) {
      setFormData(prev => ({
        ...prev,
        coBorrowers: (prev.coBorrowers || []).map(cb => 
          cb.id === id ? { 
            ...cb, 
            name: cb.name || contact.name || '', 
            phone: contact.phone || cb.phone || '' 
          } : cb
        )
      }));
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={initialData ? "แก้ไขข้อมูลลูกค้า" : "เพิ่มลูกค้าใหม่"} maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-blue-700 flex items-center">
              <ClipboardPaste className="w-4 h-4 mr-2 text-blue-500" /> 
              วางข้อมูลลูกค้า (ชื่อและเบอร์โทร)
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

        <div className="flex flex-col items-center mb-6">
          <div className="relative group">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-200 group-hover:border-blue-500 transition-colors">
              {formData.avatar ? (
                <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <User className="w-12 h-12 text-gray-300" />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>
            {formData.avatar && (
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, avatar: '' }))}
                className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
          <p className="text-xs text-gray-500 mt-2">รูปโปรไฟล์ลูกค้า</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between items-center">
              <span>ชื่อ-นามสกุล</span>
              {isContactPickerSupported() ? (
                <button
                  type="button"
                  onClick={handleSelectContact}
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center font-normal"
                >
                  <Contact className="w-3 h-3 mr-1" /> เลือกจากรายชื่อติดต่อ
                </button>
              ) : isBrowserSupportedButInIframe() ? (
                <span className="text-[10px] text-gray-400 font-normal italic">
                  เปิดในแท็บใหม่เพื่อเลือกจากรายชื่อติดต่อ
                </span>
              ) : null}
            </label>
            <input 
              required
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
            <input 
              required
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Line ID (ไม่บังคับ)</label>
            <input 
              type="text" 
              name="lineId"
              value={formData.lineId || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none" 
              placeholder="เช่น line_id_123"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">ลิงก์ Facebook (ไม่บังคับ)</label>
            <input 
              type="url" 
              name="facebookUrl"
              value={formData.facebookUrl || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none" 
              placeholder="เช่น https://facebook.com/username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">อาชีพ</label>
            <input 
              required
              type="text" 
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รายได้ต่อเดือน (บาท)</label>
            <input 
              required
              type="number" 
              name="income"
              value={formData.income}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รายได้เสริม (บาท)</label>
            <input 
              type="number" 
              name="additionalIncome"
              value={formData.additionalIncome || 0}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ภาระหนี้ต่อเดือน (บาท)</label>
            <input 
              type="number" 
              name="debtBurden"
              value={formData.debtBurden || 0}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none" 
            />
          </div>
          <div className="sm:col-span-2 bg-blue-50 p-3 rounded-md border border-blue-100">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-blue-800">รายได้สุทธิคงเหลือ (รวมผู้กู้ร่วม):</span>
              <span className="text-lg font-bold text-blue-600">
                {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(
                  (formData.income || 0) + (formData.additionalIncome || 0) + (formData.coBorrowers || []).reduce((sum, cb) => sum + (cb.income || 0), 0) - (formData.debtBurden || 0)
                )}
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">เครดิตบูโร (เกรด)</label>
            <select 
              name="creditScore"
              value={formData.creditScore}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="Excellent">ดีเยี่ยม (Excellent)</option>
              <option value="Good">ดี (Good)</option>
              <option value="Fair">พอใช้ (Fair)</option>
              <option value="Poor">ต้องปรับปรุง (Poor)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รหัสสถานะเครดิตบูโร</label>
            <input 
              type="text" 
              name="ncbCode"
              placeholder="เช่น 010, 020"
              value={formData.ncbCode || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none" 
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">คำอธิบายสถานะเครดิต</label>
            <div className="w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-600 text-sm min-h-[42px] flex items-center">
              {formData.ncbCode ? getNcbDescription(formData.ncbCode) : 'กรุณาระบุรหัสสถานะ'}
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">ทรัพย์สินที่สนใจ (เลือกได้หลายรายการ)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-3 border rounded-md bg-gray-50">
              {properties.map(p => (
                <label key={p.id} className="flex items-center space-x-2 cursor-pointer hover:bg-white p-1 rounded transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.propertyIds?.includes(p.id) || false}
                    onChange={(e) => {
                      const currentIds = formData.propertyIds || [];
                      const newIds = e.target.checked 
                        ? [...currentIds, p.id]
                        : currentIds.filter(id => id !== p.id);
                      setFormData({ ...formData, propertyIds: newIds });
                    }}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 truncate">{p.name}</span>
                </label>
              ))}
              {properties.length === 0 && (
                <p className="text-xs text-gray-400 italic col-span-2">ไม่มีข้อมูลทรัพย์สิน</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">พาร์ทเนอร์ / ผู้แนะนำ</label>
            <select 
              name="partnerId"
              value={formData.partnerId}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">-- เลือกพาร์ทเนอร์ --</option>
              {partners.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.bankName || 'ไม่ระบุธนาคาร'})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Landmark className="w-4 h-4 mr-1.5 text-purple-500" /> เจ้าหน้าที่ธนาคาร
            </label>
            <select 
              name="bankOfficerId"
              value={formData.bankOfficerId}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">-- เลือกเจ้าหน้าที่ --</option>
              {bankOfficers.map(bo => (
                <option key={bo.id} value={bo.id}>{bo.name} ({bo.bankName})</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">สถานะสินเชื่อ</label>
            <select 
              name="loanStatus"
              value={formData.loanStatus}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="NEW">ลูกค้าใหม่</option>
              <option value="DOCUMENT_COLLECTION">กำลังเก็บเอกสาร</option>
              <option value="PRE_APPROVE">Pre-Approved</option>
              <option value="SUBMITTED">ยื่นกู้แล้ว</option>
              <option value="APPROVED">อนุมัติแล้ว</option>
              <option value="REJECTED">ไม่ผ่าน</option>
              <option value="TRANSFERRED">โอนกรรมสิทธิ์แล้ว</option>
            </select>
          </div>

          {/* Co-Borrowers Section */}
          <div className="sm:col-span-2 border-t pt-4 mt-2">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-bold text-gray-900 flex items-center">
                <Users className="w-4 h-4 mr-2 text-blue-500" /> ข้อมูลผู้กู้ร่วม
              </h4>
              <button
                type="button"
                onClick={addCoBorrower}
                className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition-colors flex items-center"
              >
                <Plus className="w-3 h-3 mr-1" /> เพิ่มผู้กู้ร่วม
              </button>
            </div>

            <div className="space-y-4">
              {formData.coBorrowers?.map((cb, index) => (
                <div key={cb.id} className="p-4 border rounded-lg bg-gray-50 relative space-y-3">
                  <button
                    type="button"
                    onClick={() => removeCoBorrower(cb.id)}
                    className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <p className="text-xs font-bold text-gray-400 uppercase">ผู้กู้ร่วม #{index + 1}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase flex justify-between items-center">
                        <span>ชื่อ-นามสกุล</span>
                        {isContactPickerSupported() ? (
                          <button
                            type="button"
                            onClick={() => handleCoBorrowerContact(cb.id)}
                            className="text-[10px] text-blue-600 hover:text-blue-700 flex items-center font-normal lowercase"
                          >
                            <Contact className="w-2.5 h-2.5 mr-1" /> เลือกจากรายชื่อติดต่อ
                          </button>
                        ) : isBrowserSupportedButInIframe() ? (
                          <span className="text-[8px] text-gray-400 font-normal italic lowercase">
                            เปิดในแท็บใหม่เพื่อเลือกจากรายชื่อติดต่อ
                          </span>
                        ) : null}
                      </label>
                      <input 
                        type="text" 
                        value={cb.name}
                        onChange={(e) => handleCoBorrowerChange(cb.id, 'name', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-blue-500 outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase">เบอร์โทรศัพท์</label>
                      <input 
                        type="tel" 
                        value={cb.phone}
                        onChange={(e) => handleCoBorrowerChange(cb.id, 'phone', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-blue-500 outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase">ความสัมพันธ์</label>
                      <input 
                        type="text" 
                        value={cb.relation}
                        placeholder="เช่น คู่สมรส, บุตร"
                        onChange={(e) => handleCoBorrowerChange(cb.id, 'relation', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-blue-500 outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase">อาชีพ</label>
                      <input 
                        type="text" 
                        value={cb.occupation}
                        onChange={(e) => handleCoBorrowerChange(cb.id, 'occupation', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-blue-500 outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase">รายได้ต่อเดือน</label>
                      <input 
                        type="number" 
                        value={cb.income}
                        onChange={(e) => handleCoBorrowerChange(cb.id, 'income', Number(e.target.value))}
                        className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-blue-500 outline-none" 
                      />
                    </div>
                  </div>
                </div>
              ))}
              {(!formData.coBorrowers || formData.coBorrowers.length === 0) && (
                <p className="text-xs text-gray-400 italic text-center py-2">ไม่มีข้อมูลผู้กู้ร่วม</p>
              )}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t flex justify-end gap-3 mt-6">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            ยกเลิก
          </button>
          <button 
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            บันทึกข้อมูล
          </button>
        </div>
      </form>
    </Dialog>
  );
}

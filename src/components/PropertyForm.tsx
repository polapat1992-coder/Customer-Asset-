import { useState, useEffect, useRef } from 'react';
import { Dialog } from './ui/Dialog';
import { PropertyDetails, PropertyType, Owner } from '../types';
import { extractPropertyFromText } from '../services/geminiService';
import { cn } from '../lib/utils';
import { parseContactString, isClipboardReadSupported } from '../lib/contacts';
import { 
  Building2, MapPin, Phone, User, Home, Bed, Bath, Square, 
  MessageCircle, Facebook, Image as ImageIcon, Plus, Trash2, 
  Upload, Layers, Sparkles, Loader2, ClipboardPaste, Check,
  UserCheck, Eye, EyeOff, Mail
} from 'lucide-react';

interface PropertyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<PropertyDetails>) => void;
  initialData?: PropertyDetails | null;
  owners: Owner[];
}

export function PropertyForm({ isOpen, onClose, onSubmit, initialData, owners }: PropertyFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [pasteError, setPasteError] = useState<string | null>(null);
  const [ownerQuickPaste, setOwnerQuickPaste] = useState('');
  const [ownerPasteError, setOwnerPasteError] = useState<string | null>(null);

  const handleOwnerQuickPaste = (val: string) => {
    setOwnerQuickPaste(val);
    if (val.trim()) {
      const parsed = parseContactString(val);
      setFormData(prev => ({
        ...prev,
        ownerName: parsed.name || prev.ownerName,
        ownerPhone: parsed.phone || prev.ownerPhone
      }));
    }
  };

  const handleOwnerPasteFromClipboard = async () => {
    setOwnerPasteError(null);
    try {
      if (!navigator.clipboard) {
        throw new Error('Clipboard API not available');
      }
      const text = await navigator.clipboard.readText();
      handleOwnerQuickPaste(text);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
      setOwnerPasteError('ไม่สามารถเข้าถึงคลิปบอร์ดได้ กรุณาวางข้อความด้วยตัวเอง (Ctrl+V)');
      setTimeout(() => setOwnerPasteError(null), 5000);
    }
  };
  const [formData, setFormData] = useState<Partial<PropertyDetails>>({
    name: '',
    location: '',
    zone: '',
    price: 0,
    contactPhone: '',
    ownerId: '',
    showOwnerInfo: true,
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    lineId: '',
    facebookUrl: '',
    ownerAddress: '',
    mapUrl: '',
    images: [],
    specifications: {
      type: 'CONDO',
      bedrooms: 1,
      bathrooms: 1,
      area: 0,
      floors: 1,
    }
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        images: initialData.images || [],
        specifications: {
          ...initialData.specifications,
          floors: initialData.specifications.floors || 1
        },
        ownerId: initialData.ownerId || '',
        showOwnerInfo: initialData.showOwnerInfo ?? true
      });
    } else {
      setFormData({
        name: '',
        location: '',
        zone: '',
        price: 0,
        contactPhone: '',
        ownerId: '',
        showOwnerInfo: true,
        ownerName: '',
        ownerPhone: '',
        ownerEmail: '',
        lineId: '',
        facebookUrl: '',
        ownerAddress: '',
        mapUrl: '',
        images: [],
        specifications: {
          type: 'CONDO',
          bedrooms: 1,
          bathrooms: 1,
          area: 0,
          floors: 1,
        }
      });
    }
  }, [initialData, isOpen]);

  const handleOwnerChange = (ownerId: string) => {
    const selectedOwner = owners.find(o => o.id === ownerId);
    if (selectedOwner) {
      setFormData({
        ...formData,
        ownerId,
        ownerName: selectedOwner.name,
        ownerPhone: selectedOwner.phone,
        ownerEmail: selectedOwner.email || '',
        lineId: selectedOwner.lineId || '',
        facebookUrl: selectedOwner.facebookUrl || '',
        ownerAddress: selectedOwner.address || ''
      });
    } else {
      setFormData({
        ...formData,
        ownerId: '',
        ownerName: '',
        ownerPhone: '',
        ownerEmail: '',
        lineId: '',
        facebookUrl: '',
        ownerAddress: ''
      });
    }
  };

  const handleAutoFill = async () => {
    if (!pasteText.trim()) return;
    
    setIsExtracting(true);
    setPasteError(null);
    try {
      const extractedData = await extractPropertyFromText(pasteText);
      setFormData(prev => ({
        ...prev,
        ...extractedData,
        specifications: {
          ...prev.specifications!,
          ...extractedData.specifications
        }
      }));
      setPasteText('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to extract property details:', error);
      setPasteError('ไม่สามารถดึงข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
      setTimeout(() => setPasteError(null), 5000);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({
          ...prev,
          images: [...(prev.images || []), base64String]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? "แก้ไขข้อมูลทรัพย์สิน" : "เพิ่มทรัพย์สินใหม่"}
      maxWidth="max-w-xl"
    >
      <div className="space-y-6">
        {/* AI Auto-fill Section */}
        {!initialData && (
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-blue-700 flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-blue-500" /> 
                กรอกข้อมูลอัตโนมัติจากข้อความ
              </label>
              <span className="text-[10px] text-blue-500 font-medium bg-blue-100 px-2 py-0.5 rounded-full">
                AI Powered
              </span>
            </div>
            <div className="relative">
              <textarea
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder="วางข้อความรายละเอียดทรัพย์สินที่นี่ (Ctrl+V) (เช่น จาก Line หรือ Facebook)... / Paste property details here..."
                className="w-full h-32 px-3 py-2 text-sm border border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none resize-none bg-white/80"
              />
              <div className="absolute bottom-3 right-3 flex gap-2">
                {pasteText && (
                  <button
                    type="button"
                    onClick={() => setPasteText('')}
                    className="bg-white text-slate-500 px-3 py-2 rounded-lg text-xs font-bold border border-slate-200 hover:bg-slate-50 transition-all"
                  >
                    ล้าง
                  </button>
                )}
                {isClipboardReadSupported() && (
                  <button
                    type="button"
                    onClick={async () => {
                      setPasteError(null);
                      try {
                        if (!navigator.clipboard) {
                          throw new Error('Clipboard API not available');
                        }
                        const text = await navigator.clipboard.readText();
                        setPasteText(text);
                      } catch (err) {
                        console.error('Failed to read clipboard:', err);
                        setPasteError('ไม่สามารถเข้าถึงคลิปบอร์ดได้ กรุณาวางข้อความด้วยตัวเอง (Ctrl+V)');
                        setTimeout(() => setPasteError(null), 5000);
                      }
                    }}
                    className="bg-white text-blue-600 px-3 py-2 rounded-lg text-xs font-bold border border-blue-200 hover:bg-blue-50 transition-all flex items-center"
                  >
                    <ClipboardPaste className="w-3.5 h-3.5 mr-1.5" />
                    วาง
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleAutoFill}
                  disabled={isExtracting || !pasteText.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isExtracting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      กำลังประมวลผล...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                      ดึงข้อมูล
                    </>
                  )}
                </button>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 italic">
              * ระบบจะพยายามดึงข้อมูล ชื่อ, ราคา, ทำเล, และสเปคต่างๆ จากข้อความที่คุณวาง
            </p>
            {pasteError && (
              <div className="bg-red-50 text-red-600 text-[10px] font-bold p-2 rounded-lg border border-red-100 flex items-center animate-in fade-in slide-in-from-top-1">
                {pasteError}
              </div>
            )}
            {showSuccess && (
              <div className="bg-green-50 text-green-700 text-[10px] font-bold p-2 rounded-lg border border-green-100 flex items-center animate-in fade-in slide-in-from-top-1">
                <Check className="w-3 h-3 mr-1.5" />
                ดึงข้อมูลสำเร็จ! กรุณาตรวจสอบและกรอกข้อมูลที่เหลือ
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <Building2 className="w-4 h-4 mr-2 text-gray-400" /> ชื่อทรัพย์สิน / Property Name
            </label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="เช่น Supalai Veranda / e.g. Supalai Veranda"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-gray-400" /> ทำเลที่ตั้ง / Location
            </label>
            <input
              required
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="เช่น พระราม 9, กรุงเทพฯ / e.g. Rama 9, Bangkok"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-gray-400" /> โซน (Zone)
            </label>
            <input
              type="text"
              value={formData.zone || ''}
              onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="เช่น กรุงเทพตะวันออก, บางนา"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-gray-400" /> ลิงก์แผนที่ (Google Maps)
            </label>
            <input
              type="url"
              value={formData.mapUrl || ''}
              onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="เช่น https://goo.gl/maps/..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Home className="w-4 h-4 mr-2 text-gray-400" /> ประเภท / Type
              </label>
              <select
                value={formData.specifications?.type}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  specifications: { ...formData.specifications!, type: e.target.value as PropertyType } 
                })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="CONDO">คอนโด / Condo</option>
                <option value="HOUSE">บ้านเดี่ยว / House</option>
                <option value="TOWNHOUSE">ทาวน์โฮม / Townhome</option>
                <option value="SEMI_DETACHED">บ้านแฝด / Semi-Detached</option>
                <option value="RENOVATED">บ้านรีโนเวท / Renovated</option>
                <option value="USED">บ้านมือสอง / Used House</option>
                <option value="LAND">ที่ดิน / Land</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                ฿ ราคาขาย / Price
              </label>
              <input
                required
                type="number"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="เช่น 3500000 / e.g. 3500000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Bed className="w-4 h-4 mr-2 text-gray-400" /> ห้องนอน / Bedrooms
              </label>
              <input
                type="number"
                value={formData.specifications?.bedrooms || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  specifications: { ...formData.specifications!, bedrooms: Number(e.target.value) } 
                })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Bath className="w-4 h-4 mr-2 text-gray-400" /> ห้องน้ำ / Bathrooms
              </label>
              <input
                type="number"
                value={formData.specifications?.bathrooms || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  specifications: { ...formData.specifications!, bathrooms: Number(e.target.value) } 
                })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Square className="w-4 h-4 mr-2 text-gray-400" /> พื้นที่ / Area
              </label>
              <input
                type="number"
                value={formData.specifications?.area || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  specifications: { ...formData.specifications!, area: Number(e.target.value) } 
                })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Layers className="w-4 h-4 mr-2 text-gray-400" /> จำนวนชั้น / Floors
              </label>
              <input
                type="number"
                value={formData.specifications?.floors || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  specifications: { ...formData.specifications!, floors: Number(e.target.value) } 
                })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <ImageIcon className="w-4 h-4 mr-2 text-gray-400" /> รูปภาพทรัพย์สิน / Property Images
            </label>
            <div className="grid grid-cols-3 gap-2">
              {formData.images?.map((img, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border group">
                  <img 
                    src={img} 
                    alt={`Property ${index}`} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-all"
              >
                <Plus className="w-6 h-6 mb-1" />
                <span className="text-[10px]">เพิ่มรูป</span>
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
              multiple
            />
          </div>
        </div>

        <div className="border-t pt-4 mt-2">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-900">ข้อมูลเจ้าของทรัพย์ / Owner Details</h4>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, showOwnerInfo: !formData.showOwnerInfo })}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  formData.showOwnerInfo 
                    ? "bg-green-50 text-green-600 border border-green-100" 
                    : "bg-slate-100 text-slate-500 border border-slate-200"
                )}
              >
                {formData.showOwnerInfo ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                {formData.showOwnerInfo ? "แสดงข้อมูลเจ้าของ" : "ซ่อนข้อมูลเจ้าของ"}
              </button>
            </div>

            {formData.showOwnerInfo && (
              <div className="space-y-4">
                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 space-y-3">
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
                      value={ownerQuickPaste}
                      onChange={(e) => handleOwnerQuickPaste(e.target.value)}
                      placeholder="วางชื่อและเบอร์โทรเจ้าของที่นี่ (Ctrl+V) (เช่น สมชาย 0812345678)..."
                      className="w-full h-24 px-3 py-2 text-sm border border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none resize-none bg-white/80"
                    />
                    <div className="absolute bottom-3 right-3 flex gap-2">
                      {ownerQuickPaste && (
                        <button
                          type="button"
                          onClick={() => setOwnerQuickPaste('')}
                          className="bg-white text-slate-500 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 hover:bg-slate-50 transition-all"
                        >
                          ล้าง
                        </button>
                      )}
                      {isClipboardReadSupported() && (
                        <button
                          type="button"
                          onClick={handleOwnerPasteFromClipboard}
                          className="bg-white text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-blue-200 hover:bg-blue-50 transition-all flex items-center"
                        >
                          <ClipboardPaste className="w-3.5 h-3.5 mr-1.5" />
                          วาง
                        </button>
                      )}
                    </div>
                  </div>
                  {ownerPasteError && (
                    <p className="text-[10px] text-red-500 mt-1 animate-pulse">{ownerPasteError}</p>
                  )}
                  <p className="text-[10px] text-blue-400 mt-1 italic">* ระบบจะแยกชื่อและเบอร์โทรให้อัตโนมัติ</p>
                </div>

                <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <UserCheck className="w-4 h-4 mr-2 text-blue-500" /> เลือกเจ้าของจากรายการ / Select Owner
                </label>
                <select
                  value={formData.ownerId || ''}
                  onChange={(e) => handleOwnerChange(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">-- เลือกเจ้าของ (หรือกรอกข้อมูลใหม่ด้านล่าง) --</option>
                  {owners.map(owner => (
                    <option key={owner.id} value={owner.id}>{owner.name} ({owner.phone})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <User className="w-4 h-4 mr-2 text-gray-400" /> ชื่อเจ้าของ / Owner Name
                </label>
                <input
                  type="text"
                  value={formData.ownerName || ''}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="ชื่อเจ้าของทรัพย์"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-gray-400" /> เบอร์โทรเจ้าของ / Owner Phone
                </label>
                <input
                  type="text"
                  value={formData.ownerPhone || ''}
                  onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="เบอร์โทรเจ้าของ"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-blue-500" /> อีเมลเจ้าของ / Owner Email
                </label>
                <input
                  type="email"
                  value={formData.ownerEmail || ''}
                  onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="example@email.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2 text-green-500" /> Line ID
                </label>
                <input
                  type="text"
                  value={formData.lineId || ''}
                  onChange={(e) => setFormData({ ...formData, lineId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="เช่น line_id_123"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Facebook className="w-4 h-4 mr-2 text-blue-600" /> Facebook Link
                </label>
                <input
                  type="url"
                  value={formData.facebookUrl || ''}
                  onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="เช่น https://facebook.com/username"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-red-500" /> ที่อยู่เจ้าของ / Owner Address
                </label>
                <textarea
                  value={formData.ownerAddress || ''}
                  onChange={(e) => setFormData({ ...formData, ownerAddress: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none"
                  placeholder="ระบุที่อยู่เจ้าของทรัพย์"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-red-500" /> Google Maps Link
                </label>
                <input
                  type="url"
                  value={formData.mapUrl || ''}
                  onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="เช่น https://maps.app.goo.gl/..."
                />
              </div>
            </div>
          </div>
        )}
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
            {initialData ? "บันทึกการแก้ไข" : "เพิ่มทรัพย์สิน"}
          </button>
        </div>
      </form>
    </div>
  </Dialog>
);
}

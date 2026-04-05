import { useState, useEffect, useRef } from 'react';
import { Dialog } from './ui/Dialog';
import { PropertyDetails, PropertyType } from '../types';
import { Building2, MapPin, Phone, User, Home, Bed, Bath, Square, MessageCircle, Facebook, Image as ImageIcon, Plus, Trash2, Upload, Layers } from 'lucide-react';

interface PropertyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<PropertyDetails>) => void;
  initialData?: PropertyDetails | null;
}

export function PropertyForm({ isOpen, onClose, onSubmit, initialData }: PropertyFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Partial<PropertyDetails>>({
    name: '',
    location: '',
    zone: '',
    price: 0,
    contactPhone: '',
    ownerName: '',
    ownerPhone: '',
    lineId: '',
    facebookUrl: '',
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
        }
      });
    } else {
      setFormData({
        name: '',
        location: '',
        zone: '',
        price: 0,
        contactPhone: '',
        ownerName: '',
        ownerPhone: '',
        lineId: '',
        facebookUrl: '',
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <Building2 className="w-4 h-4 mr-2 text-gray-400" /> ชื่อทรัพย์สิน
            </label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="เช่น Supalai Veranda"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-gray-400" /> ทำเลที่ตั้ง
            </label>
            <input
              required
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="เช่น พระราม 9, กรุงเทพฯ"
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
                <Home className="w-4 h-4 mr-2 text-gray-400" /> ประเภท
              </label>
              <select
                value={formData.specifications?.type}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  specifications: { ...formData.specifications!, type: e.target.value as PropertyType } 
                })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="CONDO">คอนโด</option>
                <option value="HOUSE">บ้านเดี่ยว</option>
                <option value="TOWNHOUSE">ทาวน์โฮม</option>
                <option value="SEMI_DETACHED">บ้านแฝด</option>
                <option value="RENOVATED">บ้านรีโนเวท</option>
                <option value="USED">บ้านมือสอง</option>
                <option value="LAND">ที่ดิน</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                ฿ ราคาขาย
              </label>
              <input
                required
                type="number"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="เช่น 3500000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Bed className="w-4 h-4 mr-2 text-gray-400" /> ห้องนอน
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
                <Bath className="w-4 h-4 mr-2 text-gray-400" /> ห้องน้ำ
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
                <Square className="w-4 h-4 mr-2 text-gray-400" /> พื้นที่ (ตร.ม.)
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
                <Layers className="w-4 h-4 mr-2 text-gray-400" /> จำนวนชั้น
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
              <ImageIcon className="w-4 h-4 mr-2 text-gray-400" /> รูปภาพทรัพย์สิน
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

          <div className="border-t pt-4 mt-2">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">ข้อมูลเจ้าของทรัพย์ (Owner)</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <User className="w-4 h-4 mr-2 text-gray-400" /> ชื่อเจ้าของ
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
                  <Phone className="w-4 h-4 mr-2 text-gray-400" /> เบอร์โทรเจ้าของ
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
            </div>
          </div>
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
    </Dialog>
  );
}

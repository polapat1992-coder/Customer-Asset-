import { useState, useRef, useEffect } from 'react';
import { Dialog } from './ui/Dialog';
import { ConfirmDialog } from './ui/ConfirmDialog';
import { PropertyDetails, Customer, Owner } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { PLATFORM_CONTACT } from '../constants';
import html2canvas from 'html2canvas';
import { 
  MapPin, Phone, Home, Maximize, BedDouble, Bath, User, Users, 
  Edit2, Trash2, Plus, ExternalLink, Facebook, MessageCircle, 
  Layers, Share2, Copy, Check, Download, Printer, Eye, EyeOff,
  Image as ImageIcon, FileText, Loader2, UserCheck, Mail, Calendar, CreditCard, Building
} from 'lucide-react';

interface PropertyDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  property: PropertyDetails | null;
  customers?: Customer[];
  owners?: Owner[];
  onEdit?: (property: PropertyDetails) => void;
  onDelete?: (id: string) => void;
  onViewCustomer?: (customer: Customer) => void;
  onLinkCustomer?: (propertyId: string, customerId: string) => void;
  initialViewMode?: 'admin' | 'customer';
}

const propertyTypeLabels = {
  HOUSE: 'บ้านเดี่ยว',
  CONDO: 'คอนโดมิเนียม',
  TOWNHOUSE: 'ทาวน์โฮม/ทาวน์เฮ้าส์',
  SEMI_DETACHED: 'บ้านแฝด',
  RENOVATED: 'บ้านรีโนเวท',
  USED: 'บ้านมือสอง',
  LAND: 'ที่ดิน',
};

export function PropertyDetailsDialog({ 
  isOpen, onClose, property, customers = [], owners = [], onEdit, onDelete, onViewCustomer, onLinkCustomer, initialViewMode = 'admin'
}: PropertyDetailsDialogProps) {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [isCustomerView, setIsCustomerView] = useState(initialViewMode === 'customer');
  const [isCopied, setIsCopied] = useState(false);
  const [isTextCopied, setIsTextCopied] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const captureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsCustomerView(initialViewMode === 'customer');
    }
  }, [isOpen, initialViewMode]);

  if (!property) return null;

  const handleCopyLink = () => {
    const url = window.location.href + `?propertyId=${property.id}&view=customer`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyAsText = () => {
    const text = `
🏠 ${property.name}
💰 ราคา: ${formatCurrency(property.price)}
📍 ทำเล: ${property.location} ${property.zone ? `(${property.zone})` : ''}

📋 รายละเอียด:
- ประเภท: ${propertyTypeLabels[property.specifications.type]}
- พื้นที่: ${property.specifications.area} ${property.specifications.type === 'CONDO' ? 'ตร.ม.' : 'ตร.ว.'}
- ${property.specifications.bedrooms} ห้องนอน / ${property.specifications.bathrooms} ห้องน้ำ
- จำนวน ${property.specifications.floors} ชั้น

📞 ติดต่อสอบถาม:
- โทร: ${PLATFORM_CONTACT.phone}
- Line: ${PLATFORM_CONTACT.lineId}
- Facebook: ${PLATFORM_CONTACT.facebookUrl}
    `.trim();

    navigator.clipboard.writeText(text);
    setIsTextCopied(true);
    setTimeout(() => setIsTextCopied(false), 2000);
  };

  const handleShareAsImage = async () => {
    if (!captureRef.current) return;
    
    setIsCapturing(true);
    try {
      // Temporarily hide no-print elements for capture
      const noPrintElements = document.querySelectorAll('.no-print');
      noPrintElements.forEach(el => (el as HTMLElement).style.display = 'none');

      const canvas = await html2canvas(captureRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
      });

      // Restore no-print elements
      noPrintElements.forEach(el => (el as HTMLElement).style.display = '');

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `property-${property.id}.png`;
      link.click();
    } catch (error) {
      console.error('Failed to capture image:', error);
      alert('ไม่สามารถสร้างรูปภาพได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsCapturing(false);
    }
  };

  const linkedCustomers = customers.filter(c => c.propertyIds?.includes(property.id));
  const unlinkedCustomers = customers.filter(c => !c.propertyIds?.includes(property.id));

  const linkedOwner = owners.find(o => o.id === property.ownerId);

  const displayContact = isCustomerView ? PLATFORM_CONTACT.phone : property.contactPhone;
  const displayOwnerName = isCustomerView 
    ? PLATFORM_CONTACT.name 
    : (linkedOwner?.name || property.ownerName || 'ไม่ระบุชื่อ');
  const displayOwnerPhone = isCustomerView 
    ? PLATFORM_CONTACT.phone 
    : (linkedOwner?.phone || property.ownerPhone || 'ไม่ระบุเบอร์โทร');
  const displayLineId = isCustomerView 
    ? PLATFORM_CONTACT.lineId 
    : (linkedOwner?.lineId || property.lineId);
  const displayFacebookUrl = isCustomerView 
    ? PLATFORM_CONTACT.facebookUrl 
    : (linkedOwner?.facebookUrl || property.facebookUrl);
  const displayOwnerEmail = isCustomerView 
    ? PLATFORM_CONTACT.email 
    : (linkedOwner?.email || property.ownerEmail);
  const displayOwnerAddress = isCustomerView 
    ? null 
    : (linkedOwner?.address || property.ownerAddress);

  return (
    <>
      <Dialog 
        isOpen={isOpen} 
        onClose={() => {
          setIsCustomerView(false);
          onClose();
        }} 
        title={isCustomerView ? "ตัวอย่างมุมมองลูกค้า (แชร์)" : "รายละเอียดทรัพย์สิน"} 
        maxWidth="max-w-2xl"
      >
        <div className="space-y-6" ref={captureRef}>
          {/* Share Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100 no-print">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCustomerView(!isCustomerView)}
                className={cn(
                  "flex items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  isCustomerView 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
                    : "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"
                )}
              >
                {isCustomerView ? <EyeOff className="w-3.5 h-3.5 mr-1.5" /> : <Eye className="w-3.5 h-3.5 mr-1.5" />}
                {isCustomerView ? "ปิดโหมดลูกค้า" : "เปิดโหมดลูกค้า (ซ่อนข้อมูลเจ้าของ)"}
              </button>
            </div>
            
            {isCustomerView && (
              <div className="flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center px-3 py-1.5 bg-white text-slate-700 border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all"
                  title="คัดลอกลิงก์"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 mr-1.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
                  ลิงก์
                </button>
                <button
                  onClick={handleCopyAsText}
                  className="flex items-center px-3 py-1.5 bg-white text-slate-700 border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all"
                  title="คัดลอกเป็นข้อความ"
                >
                  {isTextCopied ? <Check className="w-3.5 h-3.5 mr-1.5 text-green-500" /> : <FileText className="w-3.5 h-3.5 mr-1.5" />}
                  ข้อความ
                </button>
                <button
                  onClick={handleShareAsImage}
                  disabled={isCapturing}
                  className="flex items-center px-3 py-1.5 bg-white text-slate-700 border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all disabled:opacity-50"
                  title="บันทึกเป็นรูปภาพ"
                >
                  {isCapturing ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <ImageIcon className="w-3.5 h-3.5 mr-1.5" />}
                  รูปภาพ
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center px-3 py-1.5 bg-white text-slate-700 border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all"
                  title="พิมพ์ / PDF"
                >
                  <Printer className="w-3.5 h-3.5 mr-1.5" />
                  PDF
                </button>
              </div>
            )}
          </div>

          {property.images && property.images.length > 0 && (
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 border">
              <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar h-full">
                {property.images.map((img, index) => (
                  <img 
                    key={index} 
                    src={img} 
                    alt={`Property ${index}`} 
                    className="w-full h-full object-cover snap-center flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
              {property.images.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur px-2 py-1 rounded text-[10px] text-white font-medium">
                  {property.images.length} รูปภาพ
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between items-start border-b pb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-4">
                <Home className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{property.name}</h3>
                <p className="text-2xl font-semibold text-blue-600">{formatCurrency(property.price)}</p>
              </div>
            </div>
            <div className="flex gap-2 no-print">
              {onEdit && !isCustomerView && (
                <button 
                  onClick={() => onEdit(property)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors flex items-center text-sm font-medium"
                >
                  <Edit2 className="w-4 h-4 mr-1.5" /> แก้ไข
                </button>
              )}
              {onDelete && !isCustomerView && (
                <button 
                  onClick={() => setIsDeleteConfirmOpen(true)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4 mr-1.5" /> ลบ
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">สเปคทรัพย์สิน</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">ประเภท</p>
                    <p className="font-medium">{propertyTypeLabels[property.specifications.type]}</p>
                  </div>
                  <div className="flex items-center">
                    <Maximize className="w-4 h-4 text-gray-400 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">พื้นที่</p>
                      <p className="font-medium">{property.specifications.area} {property.specifications.type === 'CONDO' ? 'ตร.ม.' : 'ตร.ว.'}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <BedDouble className="w-4 h-4 text-gray-400 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">ห้องนอน</p>
                      <p className="font-medium">{property.specifications.bedrooms} ห้อง</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-4 h-4 text-gray-400 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">ห้องน้ำ</p>
                      <p className="font-medium">{property.specifications.bathrooms} ห้อง</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Layers className="w-4 h-4 text-gray-400 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">จำนวนชั้น</p>
                      <p className="font-medium">{property.specifications.floors} ชั้น</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">ทำเลที่ตั้ง</p>
                    <p className="font-medium text-gray-900">{property.location}</p>
                  </div>
                </div>
                {property.zone && (
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">โซน (Zone)</p>
                      <p className="font-medium text-gray-900">{property.zone}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">{isCustomerView ? 'เบอร์ติดต่อสอบถาม' : 'เบอร์ติดต่อโครงการ/ผู้ขาย'}</p>
                    <p className="font-medium text-gray-900">{displayContact}</p>
                  </div>
                </div>
                {property.mapUrl && (
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">แผนที่</p>
                      <a 
                        href={property.mapUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-600 hover:underline flex items-center"
                      >
                        เปิดใน Google Maps <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className={cn(
                "border rounded-xl p-4 transition-all", 
                isCustomerView && "bg-blue-50/30 border-blue-100",
                !isCustomerView && !property.showOwnerInfo && "bg-slate-50 border-slate-200 opacity-75"
              )}>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-semibold text-gray-900 flex items-center">
                    <User className="w-4 h-4 mr-2 text-blue-500" /> {isCustomerView ? 'ข้อมูลติดต่อสอบถาม' : 'ข้อมูลเจ้าของทรัพย์'}
                  </h4>
                  {!isCustomerView && (
                    <div className={cn(
                      "flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold",
                      property.showOwnerInfo ? "text-green-600 bg-green-50" : "text-slate-500 bg-slate-100"
                    )}>
                      {property.showOwnerInfo ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {property.showOwnerInfo ? "แสดงข้อมูล" : "ซ่อนข้อมูล"}
                    </div>
                  )}
                </div>

                {(!isCustomerView && !property.showOwnerInfo) ? (
                  <div className="py-4 text-center">
                    <p className="text-xs text-slate-500 italic">ข้อมูลเจ้าของทรัพย์ถูกตั้งค่าให้ซ่อนไว้</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm font-medium flex items-center gap-2">
                      {displayOwnerName}
                      {linkedOwner && !isCustomerView && (
                        <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                          <UserCheck className="w-2.5 h-2.5" /> เชื่อมโยงแล้ว
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Phone className="w-3.5 h-3.5 mr-1.5" /> {displayOwnerPhone}
                    </p>
                    {displayLineId && (
                      <div className="flex items-center">
                        <MessageCircle className="w-3.5 h-3.5 mr-1.5 text-green-500" />
                        <a 
                          href={`https://line.me/ti/p/~${displayLineId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Line: {displayLineId}
                        </a>
                      </div>
                    )}
                    {displayOwnerEmail && (
                      <p className="text-sm text-gray-500 flex items-center">
                        <Mail className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> {displayOwnerEmail}
                      </p>
                    )}
                    {displayFacebookUrl && (
                      <a 
                        href={displayFacebookUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        <Facebook className="w-3.5 h-3.5 mr-1.5" /> {isCustomerView ? 'Facebook Page' : 'ดู Facebook'}
                      </a>
                    )}
                    {displayOwnerAddress && (
                      <p className="text-xs text-gray-500 flex items-start mt-1">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-red-500 mt-0.5 flex-shrink-0" /> {displayOwnerAddress}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {!isCustomerView && (
                <div className="border rounded-xl p-4 no-print">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-semibold text-gray-900 flex items-center">
                      <Users className="w-4 h-4 mr-2 text-blue-500" /> ลูกค้าที่สนใจ ({linkedCustomers.length})
                    </h4>
                    {onLinkCustomer && (
                      <button 
                        onClick={() => setIsLinking(!isLinking)}
                        className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                      >
                        {isLinking ? 'ยกเลิก' : '+ เชื่อมโยงลูกค้า'}
                      </button>
                    )}
                  </div>

                  {isLinking && (
                    <div className="mb-4 p-2 bg-gray-50 rounded-lg border border-dashed border-gray-300 animate-in slide-in-from-top-2 duration-200">
                      <p className="text-[10px] text-gray-500 mb-2">เลือกรายชื่อลูกค้าเพื่อเชื่อมโยง:</p>
                      <div className="max-h-32 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                        {unlinkedCustomers.map(customer => (
                          <div 
                            key={customer.id}
                            onClick={() => {
                              onLinkCustomer?.(property.id, customer.id);
                              setIsLinking(false);
                            }}
                            className="flex items-center justify-between p-1.5 hover:bg-white rounded cursor-pointer transition-colors text-xs border border-transparent hover:border-gray-200"
                          >
                            <span className="font-medium">{customer.name}</span>
                            <Plus className="w-3 h-3 text-blue-500" />
                          </div>
                        ))}
                        {unlinkedCustomers.length === 0 && (
                          <p className="text-[10px] text-gray-400 italic text-center py-2">ไม่มีรายชื่อลูกค้าอื่น</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                    {linkedCustomers.length > 0 ? (
                      linkedCustomers.map(customer => (
                        <div 
                          key={customer.id} 
                          onClick={() => onViewCustomer?.(customer)}
                          className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-100"
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs mr-3">
                              {customer.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                              <p className="text-xs text-gray-500">{customer.phone}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400 italic text-center py-2">ยังไม่มีลูกค้าที่สนใจ</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Dialog>

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={() => {
          onDelete?.(property.id);
          onClose();
        }}
        title="ยืนยันการลบ"
        message={`คุณต้องการลบข้อมูลทรัพย์สิน "${property.name}" ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`}
        confirmText="ลบข้อมูล"
        variant="danger"
      />
    </>
  );
}

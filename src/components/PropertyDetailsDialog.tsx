import { useState } from 'react';
import { Dialog } from './ui/Dialog';
import { ConfirmDialog } from './ui/ConfirmDialog';
import { PropertyDetails, Customer } from '../types';
import { formatCurrency } from '../lib/utils';
import { MapPin, Phone, Home, Maximize, BedDouble, Bath, User, Users, Edit2, Trash2, Plus, ExternalLink, Facebook, MessageCircle, Layers } from 'lucide-react';

interface PropertyDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  property: PropertyDetails | null;
  customers?: Customer[];
  onEdit?: (property: PropertyDetails) => void;
  onDelete?: (id: string) => void;
  onViewCustomer?: (customer: Customer) => void;
  onLinkCustomer?: (propertyId: string, customerId: string) => void;
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
  isOpen, onClose, property, customers = [], onEdit, onDelete, onViewCustomer, onLinkCustomer 
}: PropertyDetailsDialogProps) {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isLinking, setIsLinking] = useState(false);

  if (!property) return null;

  const linkedCustomers = customers.filter(c => c.propertyIds?.includes(property.id));
  const unlinkedCustomers = customers.filter(c => !c.propertyIds?.includes(property.id));

  return (
    <>
      <Dialog isOpen={isOpen} onClose={onClose} title="รายละเอียดทรัพย์สิน" maxWidth="max-w-2xl">
        <div className="space-y-6">
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
            <div className="flex gap-2">
              {onEdit && (
                <button 
                  onClick={() => onEdit(property)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors flex items-center text-sm font-medium"
                >
                  <Edit2 className="w-4 h-4 mr-1.5" /> แก้ไข
                </button>
              )}
              {onDelete && (
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
                    <p className="text-sm text-gray-500">เบอร์ติดต่อโครงการ/ผู้ขาย</p>
                    <p className="font-medium text-gray-900">{property.contactPhone}</p>
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
              <div className="border rounded-xl p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2 text-blue-500" /> ข้อมูลเจ้าของทรัพย์
                </h4>
                <div className="space-y-2">
                  <p className="text-sm font-medium">{property.ownerName || 'ไม่ระบุชื่อ'}</p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Phone className="w-3.5 h-3.5 mr-1.5" /> {property.ownerPhone || 'ไม่ระบุเบอร์โทร'}
                  </p>
                  {property.lineId && (
                    <div className="flex items-center">
                      <MessageCircle className="w-3.5 h-3.5 mr-1.5 text-green-500" />
                      <a 
                        href={`https://line.me/ti/p/~${property.lineId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Line: {property.lineId}
                      </a>
                    </div>
                  )}
                  {property.facebookUrl && (
                    <a 
                      href={property.facebookUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline flex items-center"
                    >
                      <Facebook className="w-3.5 h-3.5 mr-1.5" /> ดู Facebook
                    </a>
                  )}
                </div>
              </div>

              <div className="border rounded-xl p-4">
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

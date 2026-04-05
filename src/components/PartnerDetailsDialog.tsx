import { useState } from 'react';
import { Dialog } from './ui/Dialog';
import { ConfirmDialog } from './ui/ConfirmDialog';
import { PartnerDetails } from '../types';
import { formatCurrency } from '../lib/utils';
import { Building, Percent, User, Coins, Phone, MessageCircle, Facebook, FileText, Edit2, Trash2, ExternalLink } from 'lucide-react';

interface PartnerDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  partner: PartnerDetails | null;
  onEdit?: (partner: PartnerDetails) => void;
  onDelete?: (id: string) => void;
}

export function PartnerDetailsDialog({ isOpen, onClose, partner, onEdit, onDelete }: PartnerDetailsDialogProps) {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  if (!partner) return null;

  return (
    <>
      <Dialog isOpen={isOpen} onClose={onClose} title="รายละเอียดพันธมิตร" maxWidth="max-w-md">
        <div className="space-y-6">
          <div className="flex justify-between items-start border-b pb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-4">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{partner.name}</h3>
                <p className="text-sm text-blue-600 font-medium">{partner.bankName || 'ไม่ระบุธนาคาร'}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {onEdit && (
                <button 
                  onClick={() => onEdit(partner)}
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

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center text-gray-700">
                <Phone className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-xs text-gray-500">เบอร์โทรศัพท์</p>
                  <p className="font-medium">{partner.phone}</p>
                </div>
              </div>

              {partner.lineId && (
                <div className="flex items-center text-gray-700">
                  <MessageCircle className="w-5 h-5 text-green-500 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">Line ID</p>
                    <p className="font-medium">{partner.lineId}</p>
                  </div>
                </div>
              )}

              {partner.facebookUrl && (
                <div className="flex items-center text-gray-700">
                  <Facebook className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">Facebook</p>
                    <a 
                      href={partner.facebookUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:underline flex items-center"
                    >
                      ดูโปรไฟล์ <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center p-3 border rounded-lg">
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mr-3">
                  <Percent className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">คอมมิชชั่น</p>
                  <p className="font-semibold text-gray-900">{partner.commissionRate}%</p>
                </div>
              </div>

              <div className="flex items-center p-3 border rounded-lg">
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mr-3">
                  <Coins className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">ค่าแนะนำ</p>
                  <p className="font-semibold text-gray-900">{formatCurrency(partner.referralFee)}</p>
                </div>
              </div>
            </div>

            <div className="border rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-gray-400" /> หมายเหตุ
              </h4>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {partner.notes || 'ไม่มีหมายเหตุ'}
              </p>
            </div>
          </div>
        </div>
      </Dialog>

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={() => {
          onDelete?.(partner.id);
          onClose();
        }}
        title="ยืนยันการลบ"
        message={`คุณต้องการลบข้อมูลพันธมิตร "${partner.name}" ใช่หรือไม่?`}
        confirmText="ลบข้อมูล"
        variant="danger"
      />
    </>
  );
}

import { PartnerDetails } from '../types';
import { formatCurrency } from '../lib/utils';
import { Building, Percent, User, Coins, Phone, MessageCircle } from 'lucide-react';

interface PartnerCardProps {
  partner: PartnerDetails;
  onClick: () => void;
}

export function PartnerCard({ partner, onClick }: PartnerCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-white border rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer group"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
          <User className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {partner.name}
          </h3>
          <div className="flex items-center text-xs text-gray-500 mt-0.5">
            <Building className="w-3 h-3 mr-1" />
            {partner.bankName || 'ไม่ได้ระบุธนาคาร'}
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-gray-50">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center text-gray-500">
            <Phone className="w-4 h-4 mr-2 text-gray-400" />
            เบอร์โทร
          </div>
          <span className="font-medium text-gray-900">{partner.phone}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center text-gray-500">
            <Percent className="w-4 h-4 mr-2 text-gray-400" />
            ค่าคอมมิชชั่น
          </div>
          <span className="font-bold text-blue-600">{partner.commissionRate}%</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center text-gray-500">
            <Coins className="w-4 h-4 mr-2 text-gray-400" />
            ค่าแนะนำ
          </div>
          <span className="font-bold text-green-600">{formatCurrency(partner.referralFee)}</span>
        </div>
      </div>
    </div>
  );
}

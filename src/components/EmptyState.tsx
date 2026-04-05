import { Users } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white border rounded-xl border-dashed">
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        <Users className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">ไม่พบข้อมูลลูกค้า</h3>
      <p className="text-gray-500 max-w-sm">
        ยังไม่มีข้อมูลลูกค้าในระบบ หรือไม่พบข้อมูลที่ค้นหา เริ่มต้นโดยการเพิ่มลูกค้าใหม่
      </p>
    </div>
  );
}

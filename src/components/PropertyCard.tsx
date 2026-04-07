import { PropertyDetails } from '../types';
import { formatCurrency } from '../lib/utils';
import { MapPin, Maximize, BedDouble, Bath, Home, ChevronRight, Share2, EyeOff, UserCheck } from 'lucide-react';

interface PropertyCardProps {
  property: PropertyDetails;
  onClick: () => void;
  onShare?: (e: React.MouseEvent) => void;
}

const propertyTypeLabels = {
  HOUSE: 'บ้านเดี่ยว',
  CONDO: 'คอนโด',
  TOWNHOUSE: 'ทาวน์โฮม',
  SEMI_DETACHED: 'บ้านแฝด',
  RENOVATED: 'บ้านรีโนเวท',
  USED: 'บ้านมือสอง',
  LAND: 'ที่ดิน',
};

export function PropertyCard({ property, onClick, onShare }: PropertyCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 cursor-pointer group flex flex-col h-full relative"
    >
      <div className="aspect-[4/3] bg-slate-50 relative flex items-center justify-center overflow-hidden">
        {property.images && property.images.length > 0 ? (
          <img 
            src={property.images[0]} 
            alt={property.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
        ) : (
          <Home className="w-12 h-12 text-slate-200" />
        )}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black text-blue-600 shadow-lg shadow-slate-900/5 uppercase tracking-widest border border-white/20">
            {propertyTypeLabels[property.specifications.type]}
          </div>
          {!property.showOwnerInfo && (
            <div className="bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-lg text-[9px] font-bold text-white flex items-center gap-1 shadow-lg border border-white/10">
              <EyeOff className="w-3 h-3" /> ซ่อนเจ้าของ
            </div>
          )}
          {property.ownerId && (
            <div className="bg-blue-600/90 backdrop-blur-md px-2 py-1 rounded-lg text-[9px] font-bold text-white flex items-center gap-1 shadow-lg border border-white/10">
              <UserCheck className="w-3 h-3" /> เชื่อมโยงแล้ว
            </div>
          )}
        </div>
        
        {onShare && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShare(e);
            }}
            className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-slate-600 shadow-lg hover:bg-blue-600 hover:text-white transition-all z-10"
            title="แชร์ให้ลูกค้า"
          >
            <Share2 className="w-4 h-4" />
          </button>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
          <span className="text-white text-xs font-bold flex items-center gap-2">
            ดูรายละเอียดทรัพย์สิน <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate leading-tight">
            {property.name}
          </h3>
          <p className="text-xl font-black text-blue-600 mt-1.5 tracking-tight">
            {formatCurrency(property.price)}
          </p>
          
          <div className="flex items-center text-[11px] font-bold text-slate-400 mt-3 uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 mr-2 text-slate-300" />
            <span className="truncate">{property.location}{property.zone ? ` (${property.zone})` : ''}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-widest">
          <div className="flex flex-col items-center gap-1.5">
            <Maximize className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
            <span>{property.specifications.area} {property.specifications.type === 'CONDO' ? 'ตร.ม.' : 'ตร.ว.'}</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <BedDouble className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
            <span>{property.specifications.bedrooms} นอน</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Bath className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
            <span>{property.specifications.bathrooms} น้ำ</span>
          </div>
        </div>
      </div>
    </div>
  );
}

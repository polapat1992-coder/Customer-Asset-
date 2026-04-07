import { Phone, MessageCircle, Facebook, MoreVertical, Edit2, Trash2, User } from 'lucide-react';
import { Owner } from '../types';
import { cn } from '../lib/utils';

interface OwnerCardProps {
  owner: Owner;
  onEdit: (owner: Owner) => void;
  onDelete: (id: string) => void;
  onClick: (owner: Owner) => void;
}

export function OwnerCard({ owner, onEdit, onDelete, onClick }: OwnerCardProps) {
  return (
    <div 
      onClick={() => onClick(owner)}
      className="bg-white rounded-2xl p-5 border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all group cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{owner.name}</h3>
            <p className="text-xs text-slate-500">เจ้าของทรัพย์ (Owner)</p>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(owner);
            }}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(owner.id);
            }}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Phone className="w-4 h-4 text-slate-400" />
          <span>{owner.phone}</span>
        </div>
        {owner.lineId && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MessageCircle className="w-4 h-4 text-green-500" />
            <span>{owner.lineId}</span>
          </div>
        )}
        {owner.facebookUrl && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Facebook className="w-4 h-4 text-blue-600" />
            <span className="truncate max-w-[150px]">{owner.facebookUrl.replace('https://', '')}</span>
          </div>
        )}
      </div>

      {owner.notes && (
        <div className="mt-4 pt-4 border-t border-slate-50">
          <p className="text-xs text-slate-500 line-clamp-2 italic">
            "{owner.notes}"
          </p>
        </div>
      )}
    </div>
  );
}

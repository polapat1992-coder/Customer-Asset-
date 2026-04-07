import { BankOfficer } from '../types';
import { Phone, Landmark, MessageCircle, Facebook, User, Building2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface BankOfficerCardProps {
  officer: BankOfficer;
  onClick: () => void;
}

const getBankStyles = (bankName: string) => {
  const name = bankName.toUpperCase();
  if (name.includes('SCB')) return { bg: 'bg-purple-100', text: 'text-purple-600', hover: 'group-hover:bg-purple-600', badge: 'bg-purple-50 text-purple-600', hoverText: 'group-hover:text-purple-600' };
  if (name.includes('KBANK') || name.includes('KASIKORN')) return { bg: 'bg-green-100', text: 'text-green-600', hover: 'group-hover:bg-green-600', badge: 'bg-green-50 text-green-600', hoverText: 'group-hover:text-green-600' };
  if (name.includes('BBL') || name.includes('BANGKOK')) return { bg: 'bg-blue-100', text: 'text-blue-600', hover: 'group-hover:bg-blue-600', badge: 'bg-blue-50 text-blue-700', hoverText: 'group-hover:text-blue-600' };
  if (name.includes('KTB') || name.includes('KRUNGTHAI')) return { bg: 'bg-cyan-100', text: 'text-cyan-600', hover: 'group-hover:bg-cyan-600', badge: 'bg-cyan-50 text-cyan-700', hoverText: 'group-hover:text-cyan-600' };
  if (name.includes('BAY') || name.includes('KRUNGSRI')) return { bg: 'bg-yellow-100', text: 'text-yellow-600', hover: 'group-hover:bg-yellow-600', badge: 'bg-yellow-50 text-yellow-700', hoverText: 'group-hover:text-yellow-600' };
  if (name.includes('GSB') || name.includes('GOVERNMENT SAVINGS')) return { bg: 'bg-pink-100', text: 'text-pink-600', hover: 'group-hover:bg-pink-600', badge: 'bg-pink-50 text-pink-700', hoverText: 'group-hover:text-pink-600' };
  if (name.includes('GHB') || name.includes('GOVERNMENT HOUSING')) return { bg: 'bg-orange-100', text: 'text-orange-600', hover: 'group-hover:bg-orange-600', badge: 'bg-orange-50 text-orange-700', hoverText: 'group-hover:text-orange-600' };
  if (name.includes('TTB')) return { bg: 'bg-blue-100', text: 'text-blue-600', hover: 'group-hover:bg-blue-600', badge: 'bg-blue-50 text-blue-700', hoverText: 'group-hover:text-blue-600' };
  return { bg: 'bg-gray-100', text: 'text-gray-600', hover: 'group-hover:bg-gray-600', badge: 'bg-gray-50 text-gray-600', hoverText: 'group-hover:text-gray-600' };
};

export function BankOfficerCard({ officer, onClick }: BankOfficerCardProps) {
  const styles = getBankStyles(officer.bankName);

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="relative">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
            styles.bg,
            styles.text,
            styles.hover,
            "group-hover:text-white"
          )}>
            <User className="w-6 h-6" />
          </div>
          <div className={cn(
            "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center",
            styles.bg,
            styles.text
          )}>
            <Building2 className="w-2.5 h-2.5" />
          </div>
        </div>
        <span className={cn(
          "px-2.5 py-1 text-xs font-semibold rounded-full",
          styles.badge
        )}>
          Bank Officer
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className={cn(
            "font-bold text-gray-900 transition-colors",
            styles.hoverText
          )}>{officer.name}</h3>
          <div className="flex items-center text-gray-500 text-sm mt-1">
            <Landmark className={cn("w-3.5 h-3.5 mr-1.5", styles.text)} />
            {officer.bankName}
          </div>
        </div>

        <div className="pt-3 border-t border-gray-50 space-y-2">
          <div className="flex items-center text-gray-600 text-sm">
            <Phone className="w-3.5 h-3.5 mr-2 text-gray-400" />
            {officer.phone}
          </div>
          <div className="flex items-center gap-3">
            {officer.lineId && (
              <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                <MessageCircle className="w-3 h-3 mr-1" />
                Line
              </div>
            )}
            {officer.facebookUrl && (
              <div className="flex items-center text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                <Facebook className="w-3 h-3 mr-1" />
                FB
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

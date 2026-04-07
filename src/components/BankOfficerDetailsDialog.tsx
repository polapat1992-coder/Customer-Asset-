import { useState } from 'react';
import { Dialog } from './ui/Dialog';
import { ConfirmDialog } from './ui/ConfirmDialog';
import { BankOfficer } from '../types';
import { User, Phone, Landmark, MessageCircle, Facebook, FileText, Edit2, Trash2, ExternalLink } from 'lucide-react';

interface BankOfficerDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  officer: BankOfficer | null;
  onEdit?: (officer: BankOfficer) => void;
  onDelete?: (id: string) => void;
}

export function BankOfficerDetailsDialog({ 
  isOpen, onClose, officer, onEdit, onDelete 
}: BankOfficerDetailsDialogProps) {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  if (!officer) return null;

  return (
    <>
      <Dialog isOpen={isOpen} onClose={onClose} title="Bank Officer Details" maxWidth="max-w-md">
        <div className="space-y-6">
          <div className="flex justify-between items-start border-b pb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mr-4">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{officer.name}</h3>
                <p className="text-sm text-purple-600 font-medium">{officer.bankName}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {onEdit && (
                <button 
                  onClick={() => onEdit(officer)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors flex items-center text-sm font-medium"
                >
                  <Edit2 className="w-4 h-4 mr-1.5" /> Edit
                </button>
              )}
              {onDelete && (
                <button 
                  onClick={() => setIsDeleteConfirmOpen(true)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4 mr-1.5" /> Delete
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center text-gray-700">
                <Phone className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-xs text-gray-500">Phone Number</p>
                  <p className="font-medium">{officer.phone}</p>
                </div>
              </div>

              {officer.lineId && (
                <div className="flex items-center text-gray-700">
                  <MessageCircle className="w-5 h-5 text-green-500 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">Line ID</p>
                    <p className="font-medium">{officer.lineId}</p>
                  </div>
                </div>
              )}

              {officer.facebookUrl && (
                <div className="flex items-center text-gray-700">
                  <Facebook className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">Facebook</p>
                    <a 
                      href={officer.facebookUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:underline flex items-center"
                    >
                      View Profile <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="border rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-gray-400" /> Notes
              </h4>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {officer.notes || 'No notes'}
              </p>
            </div>
          </div>
        </div>
      </Dialog>

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={() => {
          onDelete?.(officer.id);
          onClose();
        }}
        title="Confirm Deletion"
        message={`Are you sure you want to delete bank officer "${officer.name}"?`}
        confirmText="Delete Data"
        variant="danger"
      />
    </>
  );
}

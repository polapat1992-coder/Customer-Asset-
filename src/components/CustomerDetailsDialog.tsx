import { useState } from 'react';
import { Dialog } from './ui/Dialog';
import { ConfirmDialog } from './ui/ConfirmDialog';
import { Customer, PropertyDetails, PartnerDetails, BankOfficer, CoBorrower } from '../types';
import { formatCurrency } from '../lib/utils';
import { getNcbDescription } from '../lib/ncb';
import { User, Phone, Briefcase, Wallet, CreditCard, CheckCircle2, Circle, Edit2, Trash2, ShieldCheck, MessageSquare, Send, ChevronRight, Facebook, MessageCircle, Landmark, Users } from 'lucide-react';

interface CustomerDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  properties: PropertyDetails[];
  partner?: PartnerDetails;
  bankOfficers: BankOfficer[];
  onViewProperty: (property: PropertyDetails) => void;
  onViewPartner: () => void;
  onViewBankOfficer: (officer: BankOfficer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
  onUpdateChecklist: (customerId: string, category: 'personal' | 'income', item: string, value: boolean) => void;
  onAddNote: (customerId: string, content: string) => void;
}

export function CustomerDetailsDialog({ 
  isOpen, onClose, customer, properties, partner, bankOfficers, onViewProperty, onViewPartner, onViewBankOfficer, onEdit, onDelete, onUpdateChecklist, onAddNote 
}: CustomerDetailsDialogProps) {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [newNote, setNewNote] = useState('');

  if (!customer) return null;

  const linkedProperties = properties.filter(p => customer.propertyIds?.includes(p.id));
  const bankOfficer = bankOfficers.find(bo => bo.id === customer.bankOfficerId);
  const coBorrowerIncome = (customer.coBorrowers || []).reduce((sum, cb) => sum + (cb.income || 0), 0);
  const totalCombinedIncome = (customer.income || 0) + (customer.additionalIncome || 0) + coBorrowerIncome - (customer.debtBurden || 0);

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    onAddNote(customer.id, newNote);
    setNewNote('');
  };

  const renderChecklist = (category: 'personal' | 'income', items: Record<string, boolean>, labels: Record<string, string>) => (
    <div className="space-y-2">
      {Object.entries(items).map(([key, value]) => (
        <div 
          key={key} 
          className="flex items-center text-sm cursor-pointer group"
          onClick={() => onUpdateChecklist(customer.id, category, key, !value)}
        >
          {value ? (
            <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
          ) : (
            <Circle className="w-5 h-5 text-gray-300 mr-2 group-hover:text-blue-400" />
          )}
          <span className={value ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-700'}>{labels[key]}</span>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <Dialog isOpen={isOpen} onClose={onClose} title="Customer Details" maxWidth="max-w-2xl">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 border-b pb-6">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-sm">
              {customer.avatar ? (
                <img src={customer.avatar} alt={customer.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <User className="w-12 h-12 text-blue-600" />
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-2xl font-bold text-gray-900">{customer.name}</h3>
              <p className="text-blue-600 font-medium">{customer.occupation}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                  ID: {customer.id}
                </span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  customer.loanStatus === 'APPROVED' ? 'bg-green-100 text-green-700' :
                  customer.loanStatus === 'REJECTED' ? 'bg-red-100 text-red-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {customer.loanStatus}
                </span>
              </div>
            </div>
            <div className="flex gap-2 self-start">
              <button 
                onClick={() => onEdit(customer)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors flex items-center text-sm font-medium"
              >
                <Edit2 className="w-4 h-4 mr-1.5" /> Edit
              </button>
              <button 
                onClick={() => setIsDeleteConfirmOpen(true)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center text-sm font-medium"
              >
                <Trash2 className="w-4 h-4 mr-1.5" /> Delete
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center">
              <User className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-xs text-gray-500">Full Name</p>
                <p className="font-medium">{customer.name}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-xs text-gray-500">Phone Number</p>
                <p className="font-medium">{customer.phone}</p>
              </div>
            </div>
            {customer.lineId && (
              <div className="flex items-center">
                <MessageCircle className="w-5 h-5 text-green-500 mr-3" />
                <div>
                  <p className="text-xs text-gray-500">Line ID</p>
                  <p className="font-medium">{customer.lineId}</p>
                </div>
              </div>
            )}
            {customer.facebookUrl && (
              <div className="flex items-center">
                <Facebook className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-xs text-gray-500">Facebook</p>
                  <a 
                    href={customer.facebookUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    View Profile
                  </a>
                </div>
              </div>
            )}
            <div className="flex items-center">
              <Briefcase className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-xs text-gray-500">Occupation</p>
                <p className="font-medium">{customer.occupation}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Wallet className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-xs text-gray-500">Main Income</p>
                <p className="font-medium">{formatCurrency(customer.income)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Wallet className="w-5 h-5 text-green-500 mr-3" />
              <div>
                <p className="text-xs text-gray-500">Additional Income</p>
                <p className="font-medium text-green-600">{formatCurrency(customer.additionalIncome || 0)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Wallet className="w-5 h-5 text-red-500 mr-3" />
              <div>
                <p className="text-xs text-gray-500">Debt Burden</p>
                <p className="font-medium text-red-600">{formatCurrency(customer.debtBurden || 0)}</p>
              </div>
            </div>
            <div className="flex items-center bg-blue-50 p-2 rounded-md border border-blue-100">
              <Wallet className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <p className="text-xs text-blue-500 font-medium">Net Income (Incl. Co-Borrowers)</p>
                <p className="font-bold text-blue-700">
                  {formatCurrency(totalCombinedIncome)}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-xs text-gray-500">Credit Bureau (Grade)</p>
                <p className="font-medium">{customer.creditScore}</p>
              </div>
            </div>
            <div className="flex items-start sm:col-span-2">
              <ShieldCheck className="w-5 h-5 text-gray-400 mr-3 mt-1" />
              <div>
                <p className="text-xs text-gray-500">Credit Bureau Status ({customer.ncbCode || '-'})</p>
                <p className="font-medium text-sm text-gray-700">
                  {customer.ncbCode ? getNcbDescription(customer.ncbCode) : 'Status code not specified'}
                </p>
              </div>
            </div>
          </div>

          {/* Properties and Partners */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Interested Properties ({linkedProperties.length})</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                {linkedProperties.length > 0 ? (
                  linkedProperties.map(p => (
                    <div key={p.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded transition-colors group">
                      <div>
                        <p className="font-medium text-sm text-blue-600 cursor-pointer hover:underline" onClick={() => onViewProperty(p)}>
                          {p.name}
                        </p>
                        <p className="text-[10px] text-gray-500">{formatCurrency(p.price)}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-blue-400" />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No properties selected</p>
                )}
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Partner / Bank</h3>
              {partner ? (
                <div>
                  <p className="font-medium text-blue-600 cursor-pointer hover:underline" onClick={onViewPartner}>
                    {partner.name}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Bank: {partner.bankName || '-'}</p>
                  <p className="text-sm text-gray-500">Phone: {partner.phone}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No bank selected</p>
              )}
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                <Landmark className="w-4 h-4 mr-1.5 text-purple-500" /> Bank Officer
              </h3>
              {bankOfficer ? (
                <div>
                  <p className="font-medium text-purple-600 cursor-pointer hover:underline" onClick={() => onViewBankOfficer(bankOfficer)}>
                    {bankOfficer.name}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Bank: {bankOfficer.bankName}</p>
                  <p className="text-sm text-gray-500">Phone: {bankOfficer.phone}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No officer selected</p>
              )}
            </div>
          </section>

          {/* Co-Borrowers */}
          {customer.coBorrowers && customer.coBorrowers.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center">
                <Users className="w-4 h-4 mr-2" /> Co-Borrower Info ({customer.coBorrowers.length})
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {customer.coBorrowers.map((cb) => (
                  <div key={cb.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-900">{cb.name}</h4>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full uppercase">
                        {cb.relation || 'Relation not specified'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-3.5 h-3.5 mr-2 text-gray-400" />
                        {cb.phone || '-'}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Briefcase className="w-3.5 h-3.5 mr-2 text-gray-400" />
                        {cb.occupation || '-'}
                      </div>
                      <div className="flex items-center text-gray-600 col-span-2">
                        <Wallet className="w-3.5 h-3.5 mr-2 text-gray-400" />
                        <span className="font-medium text-gray-900">{formatCurrency(cb.income)}</span>
                        <span className="text-xs text-gray-400 ml-1">/ month</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Documents */}
          <section>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Document Checklist (Click to mark)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50 rounded-lg p-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Personal Documents</h4>
                {renderChecklist('personal', customer.documentChecklist.personal, {
                  idCard: 'ID Card',
                  houseRegistration: 'House Registration',
                  nameChangeCertificate: 'Name Change Certificate',
                  marriageCertificate: 'Marriage/Divorce Certificate',
                })}
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Income Documents</h4>
                {renderChecklist('income', customer.documentChecklist.income, {
                  salarySlip: 'Salary Slip (3-6 months)',
                  bankStatement: 'Bank Statement (6 months)',
                  employmentCertificate: 'Employment Certificate',
                  taxReturn: 'Tax Return (P.N.D. 90/91/50)',
                })}
              </div>
            </div>
          </section>

          {/* Notes */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" /> Additional Notes
            </h3>
            
            <div className="space-y-3">
              {customer.notes && customer.notes.length > 0 ? (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {customer.notes.map((note) => (
                    <div key={note.id} className="bg-blue-50/50 rounded-lg p-3 border border-blue-100">
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">{note.content}</p>
                      <p className="text-[10px] text-gray-400 mt-2">
                        {new Date(note.createdAt).toLocaleString('en-US')}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic text-center py-4">No notes yet</p>
              )}

              <div className="flex gap-2">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a new note..."
                  className="flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none h-20"
                />
                <button
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className="self-end p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </Dialog>

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={() => {
          onDelete(customer.id);
          onClose();
        }}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${customer.name}"? This action cannot be undone.`}
        confirmText="Delete Data"
        variant="danger"
      />
    </>
  );
}

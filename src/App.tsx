/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Sidebar, ViewType } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CustomerCard } from './components/CustomerCard';
import { PropertyCard } from './components/PropertyCard';
import { PartnerCard } from './components/PartnerCard';
import { LoanCalculator } from './components/LoanCalculator';
import { EmptyState } from './components/EmptyState';
import { CustomerForm } from './components/CustomerForm';
import { PropertyForm } from './components/PropertyForm';
import { CustomerDetailsDialog } from './components/CustomerDetailsDialog';
import { PropertyDetailsDialog } from './components/PropertyDetailsDialog';
import { PartnerDetailsDialog } from './components/PartnerDetailsDialog';
import { NotificationBell } from './components/NotificationBell';
import { BankOfficerCard } from './components/BankOfficerCard';
import { BankOfficerForm } from './components/BankOfficerForm';
import { BankOfficerDetailsDialog } from './components/BankOfficerDetailsDialog';
import { PartnerForm } from './components/PartnerForm';
import { CalendarView } from './components/CalendarView';
import { AppointmentForm } from './components/AppointmentForm';
import { SettingsView } from './components/SettingsView';
import { AIAssistant } from './components/AIAssistant';
import { mockCustomers, mockProperties, mockPartners, mockNotifications, mockBankOfficers, mockAppointments } from './data/mock';
import { Customer, PropertyDetails, PartnerDetails, LoanStatus, BankOfficer, Appointment } from './types';
import { Plus, Users, CheckCircle, Clock, AlertCircle, Filter, Landmark, Download, Search, MapPin } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('DASHBOARD');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [properties, setProperties] = useState<PropertyDetails[]>(mockProperties);
  const [partners, setPartners] = useState<PartnerDetails[]>(mockPartners);
  const [bankOfficers, setBankOfficers] = useState<BankOfficer[]>(mockBankOfficers);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [notifications, setNotifications] = useState(mockNotifications);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyZoneFilter, setPropertyZoneFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<LoanStatus | 'ALL'>('ALL');
  
  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPropertyFormOpen, setIsPropertyFormOpen] = useState(false);
  const [isPartnerFormOpen, setIsPartnerFormOpen] = useState(false);
  const [isBankOfficerFormOpen, setIsBankOfficerFormOpen] = useState(false);
  const [isAppointmentFormOpen, setIsAppointmentFormOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editingProperty, setEditingProperty] = useState<PropertyDetails | null>(null);
  const [editingPartner, setEditingPartner] = useState<PartnerDetails | null>(null);
  const [editingBankOfficer, setEditingBankOfficer] = useState<BankOfficer | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<PropertyDetails | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<PartnerDetails | null>(null);
  const [selectedBankOfficer, setSelectedBankOfficer] = useState<BankOfficer | null>(null);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const lowerQuery = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        c.name.toLowerCase().includes(lowerQuery) || 
        c.phone.includes(lowerQuery);
      const matchesStatus = statusFilter === 'ALL' || c.loanStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [customers, searchQuery, statusFilter]);

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const lowerQuery = searchQuery.toLowerCase();
      const lowerZone = propertyZoneFilter.toLowerCase();
      
      const matchesSearch = !searchQuery || 
        p.name.toLowerCase().includes(lowerQuery) || 
        p.location.toLowerCase().includes(lowerQuery) ||
        (p.zone && p.zone.toLowerCase().includes(lowerQuery));
        
      const matchesZone = !propertyZoneFilter || 
        (p.zone && p.zone.toLowerCase().includes(lowerZone));
        
      return matchesSearch && matchesZone;
    });
  }, [properties, searchQuery, propertyZoneFilter]);

  const stats = useMemo(() => {
    return {
      total: customers.length,
      approved: customers.filter(c => c.loanStatus === 'APPROVED' || c.loanStatus === 'TRANSFERRED').length,
      pending: customers.filter(c => ['NEW', 'DOCUMENT_COLLECTION', 'PRE_APPROVE', 'SUBMITTED'].includes(c.loanStatus)).length,
      rejected: customers.filter(c => c.loanStatus === 'REJECTED').length,
    };
  }, [customers]);

  const handleAddOrEditCustomer = (data: Partial<Customer>) => {
    if (editingCustomer) {
      setCustomers(prev => prev.map(c => c.id === editingCustomer.id ? { ...c, ...data, updatedAt: new Date().toISOString() } as Customer : c));
      setEditingCustomer(null);
    } else {
      const newCustomer: Customer = {
        ...data,
        id: `c${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        documentChecklist: {
          personal: { idCard: false, houseRegistration: false, nameChangeCertificate: false, marriageCertificate: false },
          income: { salarySlip: false, bankStatement: false, employmentCertificate: false, taxReturn: false },
        }
      } as Customer;
      setCustomers([newCustomer, ...customers]);
    }
  };

  const handleAddOrEditProperty = (data: Partial<PropertyDetails>) => {
    if (editingProperty) {
      setProperties(prev => prev.map(p => p.id === editingProperty.id ? { ...p, ...data } as PropertyDetails : p));
      setEditingProperty(null);
    } else {
      const newProperty: PropertyDetails = {
        ...data,
        id: `p${Date.now()}`,
      } as PropertyDetails;
      setProperties([newProperty, ...properties]);
    }
  };

  const handleAddOrEditPartner = (data: Partial<PartnerDetails>) => {
    if (editingPartner) {
      setPartners(prev => prev.map(p => p.id === editingPartner.id ? { ...p, ...data } as PartnerDetails : p));
      setEditingPartner(null);
    } else {
      const newPartner: PartnerDetails = {
        ...data,
        id: `pt${Date.now()}`,
      } as PartnerDetails;
      setPartners([newPartner, ...partners]);
    }
  };

  const handleAddOrEditBankOfficer = (data: Partial<BankOfficer>) => {
    if (editingBankOfficer) {
      setBankOfficers(prev => prev.map(bo => bo.id === editingBankOfficer.id ? { ...bo, ...data } as BankOfficer : bo));
      setEditingBankOfficer(null);
    } else {
      const newOfficer: BankOfficer = {
        ...data,
        id: `bo${Date.now()}`,
      } as BankOfficer;
      setBankOfficers([newOfficer, ...bankOfficers]);
    }
  };

  const handleAddOrEditAppointment = (data: Appointment) => {
    if (appointments.find(a => a.id === data.id)) {
      setAppointments(prev => prev.map(a => a.id === data.id ? data : a));
    } else {
      setAppointments(prev => [data, ...prev]);
    }
    setEditingAppointment(null);
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    setSelectedCustomer(null);
  };

  const handleDeleteProperty = (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
    setSelectedProperty(null);
  };

  const handleDeletePartner = (id: string) => {
    setPartners(prev => prev.filter(p => p.id !== id));
    setSelectedPartner(null);
  };

  const handleDeleteBankOfficer = (id: string) => {
    setBankOfficers(prev => prev.filter(bo => bo.id !== id));
    setSelectedBankOfficer(null);
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  const handleLinkCustomer = (propertyId: string, customerId: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const currentIds = c.propertyIds || [];
        if (currentIds.includes(propertyId)) return c;
        const updated = {
          ...c,
          propertyIds: [...currentIds, propertyId],
          updatedAt: new Date().toISOString()
        };
        if (selectedCustomer?.id === customerId) {
          setSelectedCustomer(updated);
        }
        return updated;
      }
      return c;
    }));
  };

  const handleUpdateChecklist = (customerId: string, category: 'personal' | 'income', item: string, value: boolean) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const updated = {
          ...c,
          documentChecklist: {
            ...c.documentChecklist,
            [category]: {
              ...c.documentChecklist[category],
              [item]: value
            }
          },
          updatedAt: new Date().toISOString()
        };
        if (selectedCustomer?.id === customerId) {
          setSelectedCustomer(updated);
        }
        return updated;
      }
      return c;
    }));
  };

  const handleAddNote = (customerId: string, content: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const newNote = {
          id: `n${Date.now()}`,
          content,
          createdAt: new Date().toISOString()
        };
        const updated = {
          ...c,
          notes: [newNote, ...(c.notes || [])],
          updatedAt: new Date().toISOString()
        };
        if (selectedCustomer?.id === customerId) {
          setSelectedCustomer(updated);
        }
        return updated;
      }
      return c;
    }));
  };

  const handleOpenNotifications = () => {
    setIsNotificationsOpen(true);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Phone', 'Line ID', 'Occupation', 'Income', 'Credit Score', 'Loan Status', 'Created At'];
    const csvRows = [
      headers.join(','),
      ...customers.map(c => [
        c.id,
        `"${c.name}"`,
        `"${c.phone}"`,
        `"${c.lineId || ''}"`,
        `"${c.occupation}"`,
        c.income,
        `"${c.creditScore}"`,
        `"${c.loanStatus}"`,
        `"${c.createdAt}"`
      ].join(','))
    ];
    
    const csvContent = "\uFEFF" + csvRows.join('\n'); // Add BOM for Excel Thai support
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `customers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderCustomersView = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-2 rounded-xl border shadow-sm">
        <div className="flex p-1 bg-gray-100 rounded-lg w-full sm:w-auto overflow-x-auto no-scrollbar">
          {(['ALL', 'PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap",
                statusFilter === status 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {status === 'ALL' ? 'ทั้งหมด' : 
               status === 'PENDING' ? 'รอดำเนินการ' :
               status === 'SUBMITTED' ? 'ยื่นกู้แล้ว' :
               status === 'APPROVED' ? 'อนุมัติแล้ว' : 'ไม่ผ่าน'}
            </button>
          ))}
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={handleExportCSV}
            className="flex-1 sm:flex-none bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center font-medium hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Download className="w-5 h-5 mr-1.5" />
            ส่งออก CSV
          </button>
          <button 
            onClick={() => {
              setEditingCustomer(null);
              setIsFormOpen(true);
            }}
            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl flex items-center justify-center font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มลูกค้าใหม่
          </button>
        </div>
      </div>

      {filteredCustomers.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map(customer => (
            <CustomerCard 
              key={customer.id} 
              customer={customer} 
              onClick={() => setSelectedCustomer(customer)}
            />
          ))}
        </div>
      )}
    </div>
  );

  const renderPropertiesView = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">รายการทรัพย์สิน ({filteredProperties.length})</h2>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="ค้นหาทรัพย์สิน..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all shadow-sm"
            />
          </div>
          <div className="relative flex-1 sm:w-48">
            <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="กรองตามโซน..."
              value={propertyZoneFilter}
              onChange={(e) => setPropertyZoneFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={() => {
              setEditingProperty(null);
              setIsPropertyFormOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl flex items-center justify-center font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-200 active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มทรัพย์สิน
          </button>
        </div>
      </div>
      
      {filteredProperties.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">ไม่พบข้อมูลทรัพย์สิน</h3>
          <p className="text-gray-500">ลองเปลี่ยนคำค้นหาหรือเพิ่มทรัพย์สินใหม่</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProperties.map(property => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              onClick={() => setSelectedProperty(property)}
            />
          ))}
        </div>
      )}
    </div>
  );

  const renderPartnersView = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">รายการพันธมิตร (Partners)</h2>
        <button 
          onClick={() => {
            setEditingPartner(null);
            setIsPartnerFormOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl flex items-center font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-200 active:scale-95"
        >
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มพันธมิตร
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {partners.map(partner => (
          <PartnerCard 
            key={partner.id} 
            partner={partner} 
            onClick={() => setSelectedPartner(partner)}
          />
        ))}
      </div>
    </div>
  );

  const renderBankOfficersView = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">เจ้าหน้าที่ธนาคาร</h2>
        <button 
          onClick={() => {
            setEditingBankOfficer(null);
            setIsBankOfficerFormOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl flex items-center font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-200 active:scale-95"
        >
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มเจ้าหน้าที่
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {bankOfficers.map(officer => (
          <BankOfficerCard 
            key={officer.id} 
            officer={officer} 
            onClick={() => setSelectedBankOfficer(officer)}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans flex flex-col selection:bg-blue-100 selection:text-blue-900">
      <Header 
        notifications={notifications} 
        onSearch={setSearchQuery} 
        onOpenNotifications={handleOpenNotifications} 
        onMenuClick={() => setIsSidebarOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          activeView={activeView} 
          onViewChange={setActiveView} 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto no-scrollbar">
          {activeView === 'DASHBOARD' && <Dashboard customers={customers} appointments={appointments} />}
          {activeView === 'SETTINGS' && <SettingsView />}
          {activeView === 'CALENDAR' && (
            <div className="animate-in fade-in duration-500 h-full">
              <CalendarView 
                appointments={appointments}
                customers={customers}
                partners={partners}
                bankOfficers={bankOfficers}
                onAddAppointment={() => {
                  setEditingAppointment(null);
                  setIsAppointmentFormOpen(true);
                }}
                onEditAppointment={(app) => {
                  setEditingAppointment(app);
                  setIsAppointmentFormOpen(true);
                }}
                onDeleteAppointment={handleDeleteAppointment}
              />
            </div>
          )}
          {activeView === 'CUSTOMERS' && renderCustomersView()}
          {activeView === 'PROPERTIES' && renderPropertiesView()}
          {activeView === 'PARTNERS' && renderPartnersView()}
          {activeView === 'BANK_OFFICERS' && renderBankOfficersView()}
          {activeView === 'CALCULATOR' && <div className="animate-in fade-in duration-500"><LoanCalculator /></div>}
        </main>
      </div>

      <AIAssistant customers={customers} properties={properties} />

      {/* Dialogs */}
      <CustomerForm 
        isOpen={isFormOpen || !!editingCustomer} 
        onClose={() => {
          setIsFormOpen(false);
          setEditingCustomer(null);
        }} 
        onSubmit={handleAddOrEditCustomer}
        initialData={editingCustomer}
        properties={properties}
        partners={partners}
        bankOfficers={bankOfficers}
      />

      <CustomerDetailsDialog
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        customer={selectedCustomer}
        properties={properties}
        partner={partners.find(p => p.id === selectedCustomer?.partnerId)}
        bankOfficers={bankOfficers}
        onViewProperty={(prop) => {
          setSelectedProperty(prop);
        }}
        onViewPartner={() => {
          const part = partners.find(p => p.id === selectedCustomer?.partnerId);
          if (part) setSelectedPartner(part);
        }}
        onViewBankOfficer={(officer) => {
          setSelectedBankOfficer(officer);
        }}
        onEdit={(customer) => {
          setSelectedCustomer(null);
          setEditingCustomer(customer);
        }}
        onDelete={handleDeleteCustomer}
        onUpdateChecklist={handleUpdateChecklist}
        onAddNote={handleAddNote}
      />

      <PropertyForm
        isOpen={isPropertyFormOpen || !!editingProperty}
        onClose={() => {
          setIsPropertyFormOpen(false);
          setEditingProperty(null);
        }}
        onSubmit={handleAddOrEditProperty}
        initialData={editingProperty}
      />

      <PropertyDetailsDialog
        isOpen={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
        property={selectedProperty}
        customers={customers}
        onEdit={(property) => {
          setSelectedProperty(null);
          setEditingProperty(property);
        }}
        onDelete={handleDeleteProperty}
        onViewCustomer={(customer) => {
          setSelectedProperty(null);
          setSelectedCustomer(customer);
          setActiveView('CUSTOMERS');
        }}
        onLinkCustomer={handleLinkCustomer}
      />

      <PartnerDetailsDialog
        isOpen={!!selectedPartner}
        onClose={() => setSelectedPartner(null)}
        partner={selectedPartner}
        onEdit={(partner) => {
          setSelectedPartner(null);
          setEditingPartner(partner);
        }}
        onDelete={handleDeletePartner}
      />

      <PartnerForm
        isOpen={isPartnerFormOpen || !!editingPartner}
        onClose={() => {
          setIsPartnerFormOpen(false);
          setEditingPartner(null);
        }}
        onSubmit={handleAddOrEditPartner}
        initialData={editingPartner}
      />

      <BankOfficerDetailsDialog
        isOpen={!!selectedBankOfficer}
        onClose={() => setSelectedBankOfficer(null)}
        officer={selectedBankOfficer}
        onEdit={(officer) => {
          setSelectedBankOfficer(null);
          setEditingBankOfficer(officer);
        }}
        onDelete={handleDeleteBankOfficer}
      />

      <BankOfficerForm
        isOpen={isBankOfficerFormOpen || !!editingBankOfficer}
        onClose={() => {
          setIsBankOfficerFormOpen(false);
          setEditingBankOfficer(null);
        }}
        onSubmit={handleAddOrEditBankOfficer}
        initialData={editingBankOfficer}
      />

      <AppointmentForm
        isOpen={isAppointmentFormOpen || !!editingAppointment}
        onClose={() => {
          setIsAppointmentFormOpen(false);
          setEditingAppointment(null);
        }}
        onSave={handleAddOrEditAppointment}
        onDelete={handleDeleteAppointment}
        appointment={editingAppointment}
        customers={customers}
        partners={partners}
        bankOfficers={bankOfficers}
      />

      <NotificationBell
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
      />
    </div>
  );
}

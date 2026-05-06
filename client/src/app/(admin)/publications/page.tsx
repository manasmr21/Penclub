"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Trash2, 
  Eye, 
  Plus, 
  Edit, 
  Mail, 
  Phone, 
  Building2,
  Calendar,
  X,
  Download,
  CheckCircle
} from "lucide-react";
import { StatCard } from "@/src/components/cards";

interface Publisher {
  id: string;
  name: string;
  publisherId: string;
  email: string;
  number: string;
  logo: string;
  logoId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

// Mock data based on the entity
const MOCK_PUBLISHERS: Publisher[] = [
  {
    id: "1",
    name: "Penguin Random House",
    publisherId: "PRH001",
    email: "contact@penguinrandomhouse.com",
    number: "+1 (212) 123-4567",
    logo: "https://ui-avatars.com/api/?name=PRH&background=0D387D&color=fff",
    logoId: "logo_prh_001",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-03-20"),
    deletedAt: null
  },
  {
    id: "2",
    name: "HarperCollins Publishers",
    publisherId: "HC002",
    email: "info@harpercollins.com",
    number: "+1 (212) 207-7000",
    logo: "https://ui-avatars.com/api/?name=HC&background=4D127A&color=fff",
    logoId: "logo_hc_002",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-03-18"),
    deletedAt: null
  },
  {
    id: "3",
    name: "Simon & Schuster",
    publisherId: "SS003",
    email: "publishers@simonandschuster.com",
    number: "+1 (212) 698-7000",
    logo: "https://ui-avatars.com/api/?name=SS&background=065F46&color=fff",
    logoId: "logo_ss_003",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-03-15"),
    deletedAt: null
  },
  {
    id: "4",
    name: "Hachette Livre",
    publisherId: "HL004",
    email: "contact@hachette.com",
    number: "+33 (1) 43-92-30-00",
    logo: "https://ui-avatars.com/api/?name=HL&background=854D0E&color=fff",
    logoId: "logo_hl_004",
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-03-12"),
    deletedAt: null
  },
  {
    id: "5",
    name: "Macmillan Publishers",
    publisherId: "MP005",
    email: "info@macmillan.com",
    number: "+1 (646) 307-5151",
    logo: "https://ui-avatars.com/api/?name=MP&background=0D387D&color=fff",
    logoId: "logo_mp_005",
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-03-10"),
    deletedAt: null
  }
];

// Publisher Details Modal Component
function PublisherDetailsModal({ publisher, onClose }: { publisher: Publisher | null; onClose: () => void }) {
  if (!publisher) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-card rounded-none max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-primary/30 font-inter">
        <div className="sticky top-0 bg-white border-b border-primary/20 p-6 flex items-center justify-between z-10">
          <h2 className="text-lg font-serif font-bold text-primary uppercase tracking-widest">Publisher Details</h2>
          <button 
            onClick={onClose} 
            className="cursor-pointer p-2 hover:bg-primary/5 border border-transparent hover:border-primary/10 rounded-none transition-all"
          >
            <X className="w-5 h-5 text-primary" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Logo and Name */}
          <div className="flex items-center gap-5 border-b border-primary/10 pb-6">
            <img
              src={publisher.logo}
              alt={publisher.name}
              className="w-20 h-20 rounded-none border border-primary/20 object-cover shadow-sm"
            />
            <div>
              <h3 className="text-2xl font-serif font-bold text-primary tracking-tight">{publisher.name}</h3>
              <p className="text-xs text-primary/45 font-mono uppercase tracking-widest mt-1">Publisher ID: {publisher.publisherId}</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Contact Information
            </h4>
            <div className="bg-primary/[0.01] rounded-none p-4 border border-primary/15 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-primary/40" />
                <span className="text-primary font-serif italic">{publisher.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-primary/40" />
                <span className="text-primary font-serif italic">{publisher.number}</span>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Administrative Registry
            </h4>
            <div className="bg-primary/[0.01] rounded-none p-4 border border-primary/15 space-y-3">
              <div className="flex justify-between items-center text-sm border-b border-primary/5 pb-2">
                <span className="text-primary/40 font-bold uppercase tracking-wider text-[9px]">Internal SKU</span>
                <span className="text-primary font-mono">{publisher.publisherId}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-primary/40 font-bold uppercase tracking-wider text-[9px]">Logo ID Reference</span>
                <span className="text-primary font-mono">{publisher.logoId}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Registry Timeline
            </h4>
            <div className="bg-primary/[0.01] rounded-none p-4 border border-primary/15 space-y-3">
              <div className="flex justify-between items-center text-sm border-b border-primary/5 pb-2">
                <span className="text-primary/40 font-bold uppercase tracking-wider text-[9px]">Date Created</span>
                <span className="text-primary font-serif italic">
                  {new Date(publisher.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-primary/40 font-bold uppercase tracking-wider text-[9px]">Last Profile Edit</span>
                <span className="text-primary font-serif italic">
                  {new Date(publisher.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add/Edit Publisher Modal
function PublisherFormModal({ publisher, onClose, onSave }: { 
  publisher?: Publisher | null; 
  onClose: () => void; 
  onSave: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    name: publisher?.name || "",
    email: publisher?.email || "",
    number: publisher?.number || "",
    publisherId: publisher?.publisherId || `PUB${Date.now()}`,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-card rounded-none max-w-md w-full shadow-2xl border border-primary/30 overflow-hidden font-inter">
        <div className="bg-white border-b border-primary/20 p-6 flex items-center justify-between">
          <h2 className="text-lg font-serif font-bold text-primary uppercase tracking-widest">
            {publisher ? "Edit Publisher" : "Add New Publisher"}
          </h2>
          <button 
            onClick={onClose} 
            className="cursor-pointer p-2 hover:bg-primary/5 border border-transparent hover:border-primary/10 rounded-none transition-all"
          >
            <X className="w-5 h-5 text-primary" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/60 mb-2">
              Publisher Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-primary/20 rounded-none focus:outline-none focus:border-primary text-sm font-serif italic"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/60 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-primary/20 rounded-none focus:outline-none focus:border-primary text-sm font-serif italic"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/60 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              required
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-primary/20 rounded-none focus:outline-none focus:border-primary text-sm font-serif italic"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-primary/60 mb-2">
              Publisher ID
            </label>
            <input
              type="text"
              required
              value={formData.publisherId}
              onChange={(e) => setFormData({ ...formData, publisherId: e.target.value })}
              className="w-full px-4 py-3 bg-primary/5 border border-primary/20 rounded-none text-sm font-mono select-none outline-none"
              readOnly={!!publisher}
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-primary/10">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-5 py-3 text-xs font-bold uppercase tracking-widest text-primary bg-white border border-primary/20 rounded-none hover:bg-primary/5 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-5 py-3 text-xs font-bold uppercase tracking-widest text-white bg-primary border border-primary rounded-none hover:opacity-90 transition-all cursor-pointer"
            >
              {publisher ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PublishersPage() {
  const [publishers, setPublishers] = useState<Publisher[]>(MOCK_PUBLISHERS);
  const [filteredPublishers, setFilteredPublishers] = useState<Publisher[]>(MOCK_PUBLISHERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingPublisher, setEditingPublisher] = useState<Publisher | null>(null);

  // Filter publishers
  useEffect(() => {
    let filtered = [...publishers];
    
    if (searchTerm) {
      filtered = filtered.filter(publisher =>
        publisher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        publisher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        publisher.publisherId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredPublishers(filtered);
  }, [searchTerm, publishers]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this publisher?")) {
      setPublishers(publishers.filter(p => p.id !== id));
    }
  };

  const handleView = (publisher: Publisher) => {
    setSelectedPublisher(publisher);
    setShowDetailsModal(true);
  };

  const handleEdit = (publisher: Publisher) => {
    setEditingPublisher(publisher);
    setShowFormModal(true);
  };

  const handleAdd = () => {
    setEditingPublisher(null);
    setShowFormModal(true);
  };

  const handleSave = (data: any) => {
    if (editingPublisher) {
      // Update existing publisher
      setPublishers(publishers.map(p => 
        p.id === editingPublisher.id 
          ? { ...p, ...data, updatedAt: new Date() }
          : p
      ));
    } else {
      // Add new publisher
      const newPublisher: Publisher = {
        id: Date.now().toString(),
        ...data,
        logo: `https://ui-avatars.com/api/?name=${data.name.substring(0, 2).toUpperCase()}&background=0D387D&color=fff`,
        logoId: `logo_${data.publisherId.toLowerCase()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      };
      setPublishers([newPublisher, ...publishers]);
    }
    setShowFormModal(false);
  };

  const stats = {
    total: publishers.length,
    active: publishers.filter(p => !p.deletedAt).length
  };

  return (
    <>
      <div className="pt-2 px-8 pb-8 space-y-8 font-inter">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-primary/20 pb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
              Literary Registry
            </span>
            <h1 className="text-3xl font-serif font-bold text-primary mt-1 tracking-tight">Publishers</h1>
            <p className="text-xs text-muted-foreground mt-1.5 font-serif italic">Manage book publishers and literary houses</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="cursor-pointer flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-primary bg-white border border-primary/20 rounded-none hover:bg-primary/5 transition-all">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button 
              onClick={handleAdd}
              className="cursor-pointer flex items-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white bg-primary border border-primary rounded-none hover:opacity-90 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Publisher
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Publishers"
            value={stats.total.toString()}
            icon={Building2}
            theme="blue"
          />
          <StatCard
            title="Active Publishers"
            value={stats.active.toString()}
            icon={CheckCircle}
            theme="ocean"
          />
        </div>

        {/* Search */}
        <div className="mb-8 border-b border-primary/10 pb-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary/40 pointer-events-none" />
            <input
              type="text"
              placeholder="Search publishers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-primary/20 rounded-none focus:outline-none focus:border-primary transition-all text-sm font-serif italic"
            />
          </div>
        </div>

        {/* Publishers Grid */}
        {filteredPublishers.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-primary/20 bg-primary/[0.01]">
            <Building2 className="w-16 h-16 text-primary/30 mx-auto mb-4" />
            <h3 className="text-lg font-serif font-bold text-primary uppercase tracking-widest">No publishers found</h3>
            <p className="text-xs text-muted-foreground font-serif italic mt-1">Try adjusting your search filters or add a new publisher</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPublishers.map((publisher) => (
              <div
                key={publisher.id}
                className="bg-card border border-primary/15 rounded-none p-6 hover:border-primary/40 hover:bg-primary/[0.01] transition-all duration-300 group flex flex-col justify-between"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={publisher.logo}
                    alt={publisher.name}
                    className="w-16 h-16 rounded-none border border-primary/20 object-cover shadow-sm group-hover:scale-105 transition-transform flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-primary group-hover:text-secondary transition-colors text-sm truncate">{publisher.name}</h3>
                    <p className="text-[9px] text-muted-foreground font-mono mt-1 uppercase tracking-widest">{publisher.publisherId}</p>
                    <p className="text-xs text-muted-foreground mt-2 font-serif italic truncate">{publisher.email}</p>
                    <p className="text-[10px] font-bold text-primary/45 mt-1 uppercase tracking-widest">{publisher.number}</p>
                  </div>
                </div>

                <div className="flex gap-2.5 mt-6 pt-4 border-t border-primary/10 justify-end">
                  <button
                    onClick={() => handleView(publisher)}
                    className="cursor-pointer p-2.5 hover:bg-primary hover:text-white text-primary border border-primary/20 rounded-none transition-all"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(publisher)}
                    className="cursor-pointer p-2.5 hover:bg-primary hover:text-white text-primary border border-primary/20 rounded-none transition-all"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(publisher.id)}
                    className="cursor-pointer p-2.5 hover:bg-red-600 hover:text-white hover:border-red-600 text-primary border border-primary/20 rounded-none transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && (
        <PublisherDetailsModal
          publisher={selectedPublisher}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {/* Form Modal */}
      {showFormModal && (
        <PublisherFormModal
          publisher={editingPublisher}
          onClose={() => setShowFormModal(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
}
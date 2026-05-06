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
  Download
} from "lucide-react";

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
    logo: "https://ui-avatars.com/api/?name=PRH&background=6366f1&color=fff",
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
    logo: "https://ui-avatars.com/api/?name=HC&background=8b5cf6&color=fff",
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
    logo: "https://ui-avatars.com/api/?name=SS&background=ec4899&color=fff",
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
    logo: "https://ui-avatars.com/api/?name=HL&background=10b981&color=fff",
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
    logo: "https://ui-avatars.com/api/?name=MP&background=f59e0b&color=fff",
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#0A192F]/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl border border-primary/10">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-primary/10 px-8 py-6 flex items-center justify-between z-10">
          <div>
            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40 mb-1">Publication House</p>
            <h2 className="text-2xl font-serif font-bold text-[#0A192F]">Publisher Details</h2>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 flex items-center justify-center border border-primary/20 text-primary/40 hover:text-primary hover:border-primary transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Logo and Name */}
          <div className="flex items-center gap-6">
            <img
              src={publisher.logo}
              alt={publisher.name}
              className="w-16 h-16 object-cover border border-primary/10"
            />
            <div>
              <h3 className="text-2xl font-serif font-bold text-[#0A192F]">{publisher.name}</h3>
              <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40 mt-1">ID: {publisher.publisherId}</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40 flex items-center gap-2">
              <Mail className="w-3 h-3" /> Contact Information
            </p>
            <div className="border border-primary/10 bg-zinc-50 p-5 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-primary/30 shrink-0" />
                <span className="font-sans text-[#0A192F]">{publisher.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-primary/30 shrink-0" />
                <span className="font-sans text-[#0A192F]">{publisher.number}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40 flex items-center gap-2">
              <Calendar className="w-3 h-3" /> Timeline
            </p>
            <div className="border border-primary/10 bg-zinc-50 p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-primary/40">Created</span>
                <span className="font-sans text-[#0A192F]">{new Date(publisher.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="h-px bg-primary/5" />
              <div className="flex justify-between text-sm">
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-primary/40">Last Updated</span>
                <span className="font-sans text-[#0A192F]">{new Date(publisher.updatedAt).toLocaleDateString()}</span>
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#0A192F]/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-xl shadow-2xl border border-primary/10 overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-primary/10 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40 mb-1">Publications</p>
            <h2 className="text-2xl font-serif font-bold text-[#0A192F]">
              {publisher ? "Edit Publisher" : "Add Publisher"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 flex items-center justify-center border border-primary/20 text-primary/40 hover:text-primary hover:border-primary transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40">
              Publisher Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Penguin Random House"
              className="h-12 w-full rounded-none border border-primary/20 bg-zinc-50 px-4 text-sm font-sans text-[#0A192F] outline-none transition-all focus:border-primary focus:bg-white placeholder:text-primary/20"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="contact@publisher.com"
              className="h-12 w-full rounded-none border border-primary/20 bg-zinc-50 px-4 text-sm font-sans text-[#0A192F] outline-none transition-all focus:border-primary focus:bg-white placeholder:text-primary/20"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40">
              Phone Number
            </label>
            <input
              type="tel"
              required
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              placeholder="+1 (212) 000-0000"
              className="h-12 w-full rounded-none border border-primary/20 bg-zinc-50 px-4 text-sm font-sans text-[#0A192F] outline-none transition-all focus:border-primary focus:bg-white placeholder:text-primary/20"
            />
          </div>

          {/* Publisher ID */}
          <div className="space-y-2">
            <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40">
              Publisher ID
              {publisher && <span className="ml-2 font-normal normal-case tracking-normal text-primary/30">(read-only)</span>}
            </label>
            <input
              type="text"
              required
              value={formData.publisherId}
              onChange={(e) => setFormData({ ...formData, publisherId: e.target.value })}
              readOnly={!!publisher}
              className={`h-12 w-full rounded-none border border-primary/20 px-4 text-sm font-sans text-[#0A192F] outline-none transition-all focus:border-primary ${
                publisher ? "bg-zinc-100 cursor-not-allowed text-primary/40" : "bg-zinc-50 focus:bg-white"
              }`}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-4 pt-2 border-t border-primary/10">
            <button
              type="button"
              onClick={onClose}
              className="h-12 flex-1 rounded-none border border-primary/20 bg-transparent text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/60 transition-all hover:border-primary/40 hover:text-primary cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-12 flex-[2] rounded-none bg-[#0A192F] text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-white transition-all hover:opacity-90 active:scale-95 cursor-pointer"
            >
              {publisher ? "Update Publisher" : "Create Publisher"}
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
        logo: `https://ui-avatars.com/api/?name=${data.name.substring(0, 2).toUpperCase()}&background=6366f1&color=fff`,
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
      <div className="p-8 space-y-8 font-inter">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-primary tracking-tight">Publishers</h1>
            <p className="text-muted-foreground text-sm mt-1 font-serif italic">Manage book publishers and literary houses</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="cursor-pointer flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-primary bg-white border border-primary/20 rounded-full hover:bg-primary/5 transition-all shadow-sm">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button 
              onClick={handleAdd}
              className="cursor-pointer flex items-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white bg-primary rounded-full hover:bg-primary/90 transition-all shadow-[0_4px_12px_rgba(13,56,125,0.2)]"
            >
              <Plus className="w-4 h-4" />
              Add Publisher
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-border/40 rounded-2xl p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Total Publishers</p>
            <p className="text-3xl font-bold text-primary">{stats.total}</p>
          </div>
          <div className="bg-white border border-border/40 rounded-2xl p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Active Publishers</p>
            <p className="text-3xl font-bold text-green-600">{stats.active}</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary/40 pointer-events-none" />
            <input
              type="text"
              placeholder="Search publishers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-border/40 rounded-xl focus:outline-none focus:border-primary/40 transition-all text-sm"
            />
          </div>
        </div>

        {/* Publishers Grid */}
        {filteredPublishers.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No publishers found</h3>
            <p className="text-gray-500">Try adjusting your search or add a new publisher</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPublishers.map((publisher) => (
              <div
                key={publisher.id}
                className="bg-white border border-border/40 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-start gap-5">
                  <img
                    src={publisher.logo}
                    alt={publisher.name}
                    className="w-16 h-16 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-primary group-hover:text-secondary transition-colors">{publisher.name}</h3>
                    <p className="text-[10px] text-muted-foreground font-mono mt-1 uppercase tracking-widest">{publisher.publisherId}</p>
                    <p className="text-sm text-muted-foreground mt-2 font-serif italic">{publisher.email}</p>
                    <p className="text-[10px] font-bold text-muted-foreground/60 mt-1 uppercase tracking-tighter">{publisher.number}</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-6 border-t border-border/10">
                  <button
                    onClick={() => handleView(publisher)}
                    className="cursor-pointer flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-[10px] font-bold uppercase tracking-widest bg-background hover:bg-primary hover:text-white text-primary rounded-xl transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(publisher)}
                    className="cursor-pointer flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-[10px] font-bold uppercase tracking-widest bg-background hover:bg-orange-500 hover:text-white text-primary rounded-xl transition-all"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(publisher.id)}
                    className="cursor-pointer flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-[10px] font-bold uppercase tracking-widest bg-background hover:bg-red-500 hover:text-white text-primary rounded-xl transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
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
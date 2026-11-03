import { useState } from 'react';
import { Menu, X, Sparkles, Phone, ShieldCheck, ClipboardList } from 'lucide-react';
import { BusinessConfig } from '../types';

interface NavbarProps {
  config: BusinessConfig;
  onOpenChat: () => void;
  onOpenAdmin: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Navbar({ config, onOpenChat, onOpenAdmin, activeTab, setActiveTab }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#1E3A2F]/95 backdrop-blur-md text-white border-b border-[#2C4A3E]">
      {/* Demo Notice Banner */}
      <div className="bg-[#D4AF37]/15 border-b border-[#D4AF37]/30 px-4 py-1.5 text-center text-xs text-[#D4AF37] font-medium tracking-wide flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-[#D4AF37]" />
        <span>Private Concept Demo — Not Affiliated With Aravat Landscaping Inc.</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="cursor-pointer flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#1E3A2F] font-bold text-xl font-serif shadow-md">
            A
          </div>
          <div>
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-white block">
              {config.logoText}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] block font-medium">
              San Francisco Bay Area
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-200">
          <button 
            onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`hover:text-[#D4AF37] transition-colors cursor-pointer ${activeTab === 'home' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] pb-1' : ''}`}
          >
            Home
          </button>
          <button 
            onClick={() => { setActiveTab('services'); }}
            className={`hover:text-[#D4AF37] transition-colors cursor-pointer ${activeTab === 'services' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] pb-1' : ''}`}
          >
            Services
          </button>
          <button 
            onClick={() => { setActiveTab('portfolio'); }}
            className={`hover:text-[#D4AF37] transition-colors cursor-pointer ${activeTab === 'portfolio' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] pb-1' : ''}`}
          >
            Portfolio
          </button>
          <button 
            onClick={() => { setActiveTab('about'); }}
            className={`hover:text-[#D4AF37] transition-colors cursor-pointer ${activeTab === 'about' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] pb-1' : ''}`}
          >
            About
          </button>
          <button 
            onClick={() => { setActiveTab('contact'); }}
            className={`hover:text-[#D4AF37] transition-colors cursor-pointer ${activeTab === 'contact' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] pb-1' : ''}`}
          >
            Contact
          </button>
        </nav>

        {/* Actions */}
        <div className="hidden sm:flex items-center gap-4">
          <a 
            href={`tel:${config.contactInfo.phone}`}
            className="flex items-center gap-2 text-xs font-semibold text-gray-300 hover:text-white bg-[#2C4A3E]/60 px-3 py-2 rounded-lg border border-[#3A5A4E]"
          >
            <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{config.contactInfo.phone}</span>
          </a>

          <button
            onClick={onOpenChat}
            className="cursor-pointer bg-gradient-to-r from-[#D4AF37] to-[#C59B27] hover:from-[#E2BE50] hover:to-[#D4AF37] text-[#1E3A2F] px-4 py-2.5 rounded-lg font-semibold text-sm shadow-lg flex items-center gap-2 transition-all transform hover:scale-105"
          >
            <Sparkles className="w-4 h-4 fill-[#1E3A2F]" />
            <span>AI Concierge</span>
          </button>

          <button
            onClick={onOpenAdmin}
            className="cursor-pointer bg-[#2C4A3E] hover:bg-[#3A5A4E] text-[#D4AF37] p-2.5 rounded-lg border border-[#D4AF37]/40 transition-colors"
            title="View Demo Inquiry Inbox"
          >
            <ClipboardList className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={onOpenChat}
            className="cursor-pointer bg-[#D4AF37] text-[#1E3A2F] p-2 rounded-lg font-semibold text-xs flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white p-2 rounded-lg bg-[#2C4A3E]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1E3A2F] border-t border-[#2C4A3E] px-4 pt-4 pb-6 space-y-3">
          <button
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-gray-200 hover:text-[#D4AF37] font-medium"
          >
            Home
          </button>
          <button
            onClick={() => { setActiveTab('services'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-gray-200 hover:text-[#D4AF37] font-medium"
          >
            Services
          </button>
          <button
            onClick={() => { setActiveTab('portfolio'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-gray-200 hover:text-[#D4AF37] font-medium"
          >
            Portfolio
          </button>
          <button
            onClick={() => { setActiveTab('about'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-gray-200 hover:text-[#D4AF37] font-medium"
          >
            About
          </button>
          <button
            onClick={() => { setActiveTab('contact'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-gray-200 hover:text-[#D4AF37] font-medium"
          >
            Contact
          </button>
          <div className="pt-2 border-t border-[#2C4A3E] flex flex-col gap-2">
            <button
              onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}
              className="w-full bg-[#2C4A3E] text-[#D4AF37] py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 border border-[#D4AF37]/30"
            >
              <ClipboardList className="w-4 h-4" />
              <span>View Demo Inquiry Inbox</span>
            </button>
            <a
              href={`tel:${config.contactInfo.phone}`}
              className="w-full bg-[#3A5A4E] text-white py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#D4AF37]" />
              <span>{config.contactInfo.phone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

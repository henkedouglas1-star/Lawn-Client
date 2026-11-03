import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { PortfolioSection } from './components/PortfolioSection';
import { ProcessSection } from './components/ProcessSection';
import { ServiceAreasSection } from './components/ServiceAreasSection';
import { ContactSection } from './components/ContactSection';
import { AiChatModal } from './components/AiChatModal';
import { DemoInquiryDashboard } from './components/DemoInquiryDashboard';
import { Footer } from './components/Footer';
import { BusinessConfig, Lead } from './types';
import { Sparkles, Shield, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<BusinessConfig | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [chatOpen, setChatOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [initialChatMessage, setInitialChatMessage] = useState<string>('');

  useEffect(() => {
    async function loadData() {
      try {
        const configRes = await fetch('/api/config');
        if (!configRes.ok) throw new Error('Demo configuration unavailable');
        setConfig(await configRes.json());
      } catch (err) {
        console.error('Failed to load application data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleLeadCreated = (newLead: Lead) => {
    setLeads(prev => [newLead, ...prev]);
  };

  const handleOpenChatWithService = (serviceTitle: string) => {
    setInitialChatMessage(`I would like to discuss a project involving ${serviceTitle}. Can you help me plan this?`);
    setChatOpen(true);
  };

  if (loading || !config) {
    return (
      <div className="min-h-screen bg-[#1E3A2F] flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#D4AF37] border-t-transparent animate-spin" />
        <p className="font-serif text-lg tracking-wide">Loading Aravat Landscaping Platform...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F8F6] text-[#1E2922] font-sans">
      <Navbar 
        config={config} 
        onOpenChat={() => { setInitialChatMessage(''); setChatOpen(true); }} 
        onOpenAdmin={() => setAdminOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <Hero 
              config={config} 
              onOpenChat={() => { setInitialChatMessage(''); setChatOpen(true); }}
              onNavigateContact={() => {
                const el = document.getElementById('contact');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <ServicesSection 
              config={config} 
              onOpenChatWithService={handleOpenChatWithService}
              onNavigateContact={() => {
                const el = document.getElementById('contact');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <PortfolioSection 
              config={config} 
              onOpenChatWithService={handleOpenChatWithService}
            />
            <ProcessSection />
            <ServiceAreasSection config={config} />
            <ContactSection 
              config={config} 
              onOpenChat={() => { setInitialChatMessage(''); setChatOpen(true); }}
              onLeadCreated={handleLeadCreated}
            />
          </>
        )}

        {activeTab === 'services' && (
          <div className="py-12">
            <ServicesSection 
              config={config} 
              onOpenChatWithService={handleOpenChatWithService}
              onNavigateContact={() => setActiveTab('contact')}
            />
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="py-12">
            <PortfolioSection 
              config={config} 
              onOpenChatWithService={handleOpenChatWithService}
            />
          </div>
        )}

        {activeTab === 'about' && (
          <div className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-4">
              <span className="text-[#1E3A2F] bg-[#1E3A2F]/10 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase">
                About Aravat Landscaping
              </span>
              <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#1E3A2F]">
                Crafting Outdoor Excellence Since 2008
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Led by principal landscape architects and master craftsmen, Aravat Landscaping Inc. delivers high-end residential outdoor architecture across the San Francisco Bay Area.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-8">
              <div className="space-y-6">
                <h3 className="font-serif text-2xl font-bold text-[#1E3A2F]">Uncompromising Craftsmanship & Design Integrity</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We believe your outdoor living environment should be an extension of your home's architecture, seamlessly integrating natural topography, sustainable horticulture, and resort-grade amenities.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-800">
                    <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
                    <span>Licensed California Landscape Contractors (C-27)</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-800">
                    <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
                    <span>Comprehensive 5-Year Structural Warranty</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-800">
                    <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
                    <span>Water-Efficient Smart Irrigation Certified</span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl overflow-hidden shadow-2xl h-[400px]">
                <img 
                  src="https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=1200&q=85" 
                  alt="Aravat Landscaping Craftsmanship" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="py-12">
            <ContactSection 
              config={config} 
              onOpenChat={() => { setInitialChatMessage(''); setChatOpen(true); }}
              onLeadCreated={handleLeadCreated}
            />
          </div>
        )}
      </main>

      <Footer 
        config={config} 
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {/* AI Chat Modal */}
      <AiChatModal 
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        config={config}
        initialMessage={initialChatMessage}
        onLeadCreated={handleLeadCreated}
      />

      {/* Admin / Lead Dashboard Modal */}
      <DemoInquiryDashboard 
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        config={config}
        leads={leads}
      />
    </div>
  );
}

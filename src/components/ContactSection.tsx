import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Phone, Mail, MapPin, Sparkles } from 'lucide-react';
import { BusinessConfig, Lead } from '../types';

interface ContactSectionProps {
  config: BusinessConfig;
  onOpenChat: () => void;
  onLeadCreated: (lead: Lead) => void;
}

export function ContactSection({ config, onOpenChat, onLeadCreated }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    projectType: config.services[0].title,
    projectDescription: '',
    projectCity: '',
    projectZip: '',
    budgetRange: 'Not specified',
    desiredTimeline: 'Next 3-6 months'
  });

  const [submitting, setSubmitting] = useState(false);
  const [successLead, setSuccessLead] = useState<Lead | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!formData.customerName || !formData.email || !formData.projectDescription) {
      setErrorMsg('Please complete all required fields (Name, Email, Project Description).');
      return;
    }

    setSubmitting(true);
    // Concept demo: all form data stays in memory in this browser tab.
    const now = new Date().toISOString();
    const demoLead: Lead = {
      ...formData, leadId: 'demo-' + Date.now(), businessId: config.businessId,
      source: 'Demo estimate form', qualificationStatus: 'Pending Review',
      bookingStatus: 'Not Booked', jobStatus: 'Estimate Sent',
      paymentStatus: 'Pending', commissionStatus: 'Not Payable',
      createdAt: now, updatedAt: now, consentTimestamp: ''
    };
    onLeadCreated(demoLead);
    setSuccessLead(demoLead);
    setSubmitting(false);
  };

  return (
    <section id="contact" className="py-24 bg-white text-[#1E2922]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-[#1E3A2F] bg-[#1E3A2F]/10 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase">
                Initiate Project
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#1E3A2F] mt-4">
                Explore a Sample Consultation Request
              </h2>
              <p className="text-gray-600 text-base mt-4 leading-relaxed">
                Connect directly with our principal design team or use our AI project assistant for instant preliminary scope analysis.
              </p>
            </div>

            <div className="space-y-6 pt-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#1E3A2F] text-[#D4AF37] flex items-center justify-center shrink-0 shadow">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-[#1E3A2F]">Direct Line</h4>
                  <a href={`tel:${config.contactInfo.phone}`} className="text-gray-600 text-sm hover:text-[#1E3A2F] font-medium">
                    {config.contactInfo.phone}
                  </a>
                  <p className="text-xs text-gray-400">{config.contactInfo.hours}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#1E3A2F] text-[#D4AF37] flex items-center justify-center shrink-0 shadow">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-[#1E3A2F]">Design Concierge</h4>
                  <a href={`mailto:${config.contactInfo.email}`} className="text-gray-600 text-sm hover:text-[#1E3A2F] font-medium">
                    {config.contactInfo.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#1E3A2F] text-[#D4AF37] flex items-center justify-center shrink-0 shadow">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-[#1E3A2F]">Headquarters</h4>
                  <p className="text-gray-600 text-sm">{config.contactInfo.address}</p>
                </div>
              </div>
            </div>

            {/* AI Assistant Banner */}
            <div className="bg-[#1E3A2F] text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                <h4 className="font-serif font-bold text-base">Prefer Conversational Planning?</h4>
              </div>
              <p className="text-xs text-gray-300 mb-4 leading-relaxed">
                Chat with Mateo, our AI project assistant, to talk through your ideas and instantly qualify your project scope before scheduling.
              </p>
              <button
                type="button"
                onClick={onOpenChat}
                className="cursor-pointer bg-[#D4AF37] hover:bg-[#E2BE50] text-[#1E3A2F] px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Launch AI Assistant</span>
              </button>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 bg-[#F9F8F6] p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-xl">
            {successLead ? (
              <div className="text-center py-12 space-y-6">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-3xl font-bold text-[#1E3A2F]">Demo Inquiry Created</h3>
                  <p className="text-gray-600 text-sm max-w-md mx-auto">
                    Thank you, <span className="font-semibold text-[#1E3A2F]">{successLead.customerName}</span>. Your project inquiry has been securely saved to our lead management system (ID: <span className="font-mono text-xs text-[#D4AF37]">{successLead.leadId}</span>).
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 text-left space-y-3 max-w-md mx-auto text-xs text-gray-700 shadow-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-500">Service:</span>
                    <span className="font-semibold text-[#1E3A2F]">{successLead.projectType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-500">Location:</span>
                    <span className="font-semibold text-[#1E3A2F]">{successLead.projectCity} ({successLead.projectZip})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-500">Budget Range:</span>
                    <span className="font-semibold text-[#1E3A2F]">{successLead.budgetRange}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-500">Timeline:</span>
                    <span className="font-semibold text-[#1E3A2F]">{successLead.desiredTimeline}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSuccessLead(null)}
                  className="cursor-pointer bg-[#1E3A2F] hover:bg-[#2C4A3E] text-white px-6 py-3 rounded-xl text-xs font-semibold shadow"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="font-serif text-2xl font-bold text-[#1E3A2F]">Project Estimate Form</h3>
                  <p className="text-xs text-gray-500 mt-1">Please provide initial details regarding your Bay Area property and vision.</p>
                </div>

                {errorMsg && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Full Name *</label>
                    <input 
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="Jonathan Sterling"
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#1E3A2F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Email Address *</label>
                    <input 
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jonathan@example.com"
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#1E3A2F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Phone Number</label>
                    <input 
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(415) 555-0199"
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#1E3A2F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Primary Service</label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#1E3A2F]"
                    >
                      {config.services.map(s => (
                        <option key={s.id} value={s.title}>{s.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">City / Region</label>
                    <input 
                      type="text"
                      value={formData.projectCity}
                      onChange={(e) => setFormData({ ...formData, projectCity: e.target.value })}
                      placeholder="San Francisco / Marin / Palo Alto"
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#1E3A2F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">ZIP Code</label>
                    <input 
                      type="text"
                      value={formData.projectZip}
                      onChange={(e) => setFormData({ ...formData, projectZip: e.target.value })}
                      placeholder="94111"
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#1E3A2F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Est. Budget Range</label>
                    <select
                      value={formData.budgetRange}
                      onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#1E3A2F]"
                    >
                      <option value="$15,000 - $35,000">$15,000 - $35,000</option>
                      <option value="$35,000 - $75,000">$35,000 - $75,000</option>
                      <option value="$75,000 - $150,000">$75,000 - $150,000</option>
                      <option value="$150,000+">$150,000+ (Estate)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Project Description & Vision *</label>
                  <textarea 
                    rows={4}
                    required
                    value={formData.projectDescription}
                    onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                    placeholder="Describe your property, existing layout, and what you would like to build (e.g. backyard patio, retaining wall, drought-tolerant garden)..."
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#1E3A2F]"
                  />
                </div>

                <div className="text-[11px] text-gray-500">
                  Concept demonstration only. Use fictional information. This form does not send information to Aravat Landscaping or a database.
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#1E3A2F] hover:bg-[#2C4A3E] text-white py-4 rounded-xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Preparing Demo Inquiry...</span>
                  ) : (
                    <>
                      <span>Create Demo Inquiry</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

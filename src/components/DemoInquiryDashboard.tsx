import React from 'react';
import { X, ClipboardList, CalendarDays, Sparkles, RotateCcw } from 'lucide-react';
import { BusinessConfig, Lead } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  config: BusinessConfig;
  leads: Lead[];
}
const examples: Array<Partial<Lead>> = [
  { leadId: 'sample-1', customerName: 'Jordan Example', projectType: 'Hardscaping', projectCity: 'Palo Alto', projectDescription: 'Interested in a new paver patio and backyard seating area.', budgetRange: '$25,000 - $50,000', desiredTimeline: 'Next 3 months', source: 'Sample AI conversation' },
  { leadId: 'sample-2', customerName: 'Taylor Example', projectType: 'Landscaping & Irrigation', projectCity: 'San Mateo', projectDescription: 'Drought-tolerant front yard landscaping with drip irrigation.', budgetRange: 'Not specified', desiredTimeline: 'Flexible', source: 'Sample estimate form' }
];
export function DemoInquiryDashboard({ isOpen, onClose, leads }: Props) {
  const [showExamples, setShowExamples] = React.useState(true);
  if (!isOpen) return null;
  const rows = [...leads, ...(showExamples ? examples as Lead[] : [])];
  return (
    <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true" aria-label="Demo inquiry inbox">
      <div className="bg-[#F9F8F6] w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl">
        <header className="bg-[#1E3A2F] text-white px-5 py-5 flex items-start justify-between gap-3">
          <div><div className="flex items-center gap-2"><ClipboardList className="w-5 h-5 text-[#D4AF37]" /><h2 className="font-serif text-2xl font-bold">AI Inquiry Inbox</h2></div><p className="text-sm text-white/75 mt-2">Sales demonstration - Fictional inquiries only - No real bookings</p></div>
          <button onClick={onClose} aria-label="Close inbox" className="p-2 rounded-lg hover:bg-white/10"><X className="w-5 h-5" /></button>
        </header>
        <div className="p-5 sm:p-7 space-y-5">
          <div className="flex flex-wrap justify-between items-center gap-3"><div><p className="text-xs uppercase tracking-widest text-gray-500">Potential customer inquiries</p><p className="font-serif text-3xl font-bold text-[#1E3A2F]">{rows.length} <span className="text-sm font-normal text-gray-500">demo records</span></p></div><button className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 text-sm text-[#1E3A2F]" onClick={() => setShowExamples(v => !v)}><RotateCcw className="w-4 h-4" />{showExamples ? 'Hide sample inquiries' : 'Show sample inquiries'}</button></div>
          {rows.length === 0 && <p className="p-6 bg-white rounded-xl text-gray-600">No demo inquiries yet. Try the AI concierge or sample estimate form, then return here.</p>}
          {rows.map((lead, idx) => <article key={lead.leadId || idx} className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-semibold text-lg text-[#1E3A2F]">{lead.customerName || 'Demo Visitor'}</h3><span className="text-xs bg-amber-50 text-amber-900 border border-amber-200 px-2 py-1 rounded-full">DEMO - Not a real lead</span></div>
            <p className="text-sm text-gray-600">{lead.projectType || 'Landscape project'} - {lead.projectCity || 'Location not provided'}</p>
            <p className="text-gray-800">{lead.projectDescription || 'No project description yet.'}</p>
            <div className="flex flex-wrap gap-3 text-xs text-gray-600"><span>Budget: {lead.budgetRange || 'Not specified'}</span><span>Timeline: {lead.desiredTimeline || 'Not specified'}</span><span>Source: {lead.source || 'Demo'}</span></div>
            <div className="border-t pt-3 flex items-center gap-2 text-sm text-[#1E3A2F]"><CalendarDays className="w-4 h-4" />Next step: Staff reviews inquiry and offers a consultation. No appointment has been booked.</div>
          </article>)}
          <div className="rounded-xl bg-[#E9EEE9] p-4 flex gap-3 text-sm text-[#1E3A2F]"><Sparkles className="w-5 h-5 shrink-0" /><p><strong>What this demonstrates:</strong> AI can gather project details and organize a clear follow-up for a landscaping team. Data exists only in this open browser session; refresh to reset submitted inquiries.</p></div>
        </div>
      </div>
    </div>
  );
}

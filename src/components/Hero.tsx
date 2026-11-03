import { Sparkles, ArrowRight, CheckCircle2, Award, MapPin } from 'lucide-react';
import { BusinessConfig } from '../types';

interface HeroProps {
  config: BusinessConfig;
  onOpenChat: () => void;
  onNavigateContact: () => void;
}

export function Hero({ config, onOpenChat, onNavigateContact }: HeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-[#1E3A2F] text-white overflow-hidden py-20">
      {/* Background cinematic overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=2000&q=85" 
          alt="Luxury Landscape Design" 
          className="w-full h-full object-cover object-center opacity-30 transform scale-105 animate-pulse duration-10000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E3A2F] via-[#1E3A2F]/90 to-[#1E3A2F]/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-4 py-2 rounded-full text-[#D4AF37] text-xs font-semibold tracking-wider uppercase">
            <Award className="w-4 h-4 text-[#D4AF37]" />
            <span>Bay Area Premier Landscape Architecture & Construction</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
            Transforming Bay Area Outdoor Living Into <span className="text-[#D4AF37] italic">Masterpieces</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 font-light leading-relaxed max-w-2xl">
            {config.description}
          </p>

          {/* Key bullets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-200 pt-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <span>Bespoke 3D Master Planning</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <span>Architectural Stone & Pavers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <span>Resort-Grade Outdoor Kitchens</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <span>Smart Drought-Tolerant Planting</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <button
              onClick={onNavigateContact}
              className="cursor-pointer bg-[#D4AF37] hover:bg-[#E2BE50] text-[#1E3A2F] px-8 py-4 rounded-xl font-bold text-base shadow-xl flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5"
            >
              <span>Request an Estimate</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onOpenChat}
              className="cursor-pointer bg-[#2C4A3E]/90 hover:bg-[#3A5A4E] text-white border border-[#D4AF37]/50 px-8 py-4 rounded-xl font-semibold text-base shadow-lg flex items-center justify-center gap-3 transition-all"
            >
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
              <span>Chat with AI Concierge</span>
            </button>
          </div>

          {/* Service Area Pill */}
          <div className="flex items-center gap-2 text-xs text-gray-400 pt-4 border-t border-[#2C4A3E]">
            <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <span>Serving San Francisco, Marin County, Silicon Valley / Peninsula, and the East Bay.</span>
          </div>
        </div>

        {/* Right side card - AI Assistant Quick Launcher */}
        <div className="lg:col-span-5">
          <div className="bg-[#162E25] border border-[#2C4A3E] rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <div className="absolute -top-3 right-6 bg-[#D4AF37] text-[#1E3A2F] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
              AI Powered
            </div>

            <div className="flex items-center gap-4 mb-6">
              <img 
                src={config.aiReceptionist.avatar} 
                alt={config.aiReceptionist.name} 
                className="w-14 h-14 rounded-full object-cover border-2 border-[#D4AF37] shadow-md"
              />
              <div>
                <h3 className="font-serif font-bold text-lg text-white">{config.aiReceptionist.name}</h3>
                <p className="text-xs text-[#D4AF37]">{config.aiReceptionist.title}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[11px] text-emerald-300 font-medium">Online & Ready to Assist</span>
                </div>
              </div>
            </div>

            <div className="bg-[#10241D] rounded-2xl p-4 text-sm text-gray-200 mb-6 border border-[#234538] leading-relaxed">
              "{config.aiReceptionist.welcomeMessage}"
            </div>

            <div className="space-y-3">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Common Questions:</p>
              <button 
                onClick={onOpenChat}
                className="w-full text-left text-xs bg-[#1E3A2F] hover:bg-[#254639] text-gray-200 p-3 rounded-xl border border-[#2C4A3E] transition-colors flex items-center justify-between group cursor-pointer"
              >
                <span>What is the typical timeline for an outdoor living project?</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={onOpenChat}
                className="w-full text-left text-xs bg-[#1E3A2F] hover:bg-[#254639] text-gray-200 p-3 rounded-xl border border-[#2C4A3E] transition-colors flex items-center justify-between group cursor-pointer"
              >
                <span>Do you provide 3D landscape architecture designs?</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <button
              onClick={onOpenChat}
              className="mt-6 w-full bg-[#D4AF37] hover:bg-[#E2BE50] text-[#1E3A2F] py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Interactive Project Chat</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

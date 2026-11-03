import { useState } from 'react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { BusinessConfig } from '../types';

interface ServicesSectionProps {
  config: BusinessConfig;
  onOpenChatWithService: (serviceTitle: string) => void;
  onNavigateContact: () => void;
}

export function ServicesSection({ config, onOpenChatWithService, onNavigateContact }: ServicesSectionProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  return (
    <section id="services" className="py-24 bg-[#F9F8F6] text-[#1E2922]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-[#1E3A2F] bg-[#1E3A2F]/10 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase">
            Bespoke Offerings
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#1E3A2F]">
            Master Landscape Architecture & Construction Services
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            Every property in the San Francisco Bay Area possesses unique topography, microclimate, and architectural heritage. We craft custom solutions tailored to perfection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {config.services.map((service) => (
            <div 
              key={service.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-60 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A2F]/80 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block mb-1">
                    {service.priceRange}
                  </span>
                  <h3 className="font-serif font-bold text-xl leading-tight">
                    {service.title}
                  </h3>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {service.fullDesc}
                  </p>
                  
                  <ul className="space-y-2 pt-2 border-t border-gray-100">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-gray-700">
                        <Check className="w-3.5 h-3.5 text-[#1E3A2F] shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => onOpenChatWithService(service.title)}
                    className="cursor-pointer flex-1 bg-[#1E3A2F] hover:bg-[#2C4A3E] text-white py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Discuss with AI</span>
                  </button>

                  <button
                    onClick={onNavigateContact}
                    className="cursor-pointer bg-gray-100 hover:bg-[#D4AF37] hover:text-[#1E3A2F] text-gray-800 p-2.5 rounded-xl transition-colors"
                    title="Request Estimate"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA banner */}
        <div className="mt-16 bg-[#1E3A2F] text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl">
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-0 max-w-2xl mx-auto space-y-6">
            <h3 className="font-serif text-2xl sm:text-4xl font-bold">
              Have a Custom or Complex Landscape Vision?
            </h3>
            <p className="text-gray-300 text-sm sm:text-base">
              Our principal landscape architects specialize in hillside stabilization, heritage tree preservation, and resort-grade estate transformations across Northern California.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <button
                onClick={() => onOpenChatWithService("Custom Estate Landscape Project")}
                className="cursor-pointer bg-[#D4AF37] hover:bg-[#E2BE50] text-[#1E3A2F] px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Consult with AI Assistant</span>
              </button>
              <button
                onClick={onNavigateContact}
                className="cursor-pointer bg-[#2C4A3E] hover:bg-[#3A5A4E] text-white px-8 py-3.5 rounded-xl font-semibold text-sm border border-[#D4AF37]/30"
              >
                Schedule Site Visit
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

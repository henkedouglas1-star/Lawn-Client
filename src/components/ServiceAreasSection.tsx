import { MapPin, CheckCircle } from 'lucide-react';
import { BusinessConfig } from '../types';

interface ServiceAreasProps {
  config: BusinessConfig;
}

export function ServiceAreasSection({ config }: ServiceAreasProps) {
  return (
    <section className="py-24 bg-[#F9F8F6] text-[#1E2922]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[#1E3A2F] bg-[#1E3A2F]/10 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase">
              Regional Expertise
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#1E3A2F]">
              Serving Northern California's Finest Neighborhoods
            </h2>
            <p className="text-gray-600 text-base leading-relaxed">
              We specialize in the distinct microclimates, architectural styles, and municipal regulations of the San Francisco Bay Area. From coastal fog resilience in San Francisco to sun-drenched valley estates in Silicon Valley, our designs endure and flourish.
            </p>

            <div className="space-y-3 pt-2">
              {config.serviceAreas.map((area, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm">
                  <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-serif font-bold text-base text-[#1E3A2F]">{area}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Specialized local grading, HOA compliance, and native horticulture.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200 h-[500px]">
              <img 
                src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=85" 
                alt="San Francisco Bay Area Landscape" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A2F]/90 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
                <span className="text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-1">
                  Bay Area Microclimates
                </span>
                <h3 className="font-serif text-2xl font-bold">
                  Engineered for Coastal & Inland Conditions
                </h3>
                <p className="text-sm text-gray-300 mt-2">
                  Our construction standards exceed local seismic codes and water efficiency ordinances.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

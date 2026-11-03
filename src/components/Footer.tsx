import { ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';
import { BusinessConfig } from '../types';

interface FooterProps {
  config: BusinessConfig;
  onOpenAdmin: () => void;
}

export function Footer({ config, onOpenAdmin }: FooterProps) {
  return (
    <footer className="bg-[#162E25] text-white border-t border-[#2C4A3E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#1E3A2F] font-bold text-xl font-serif">
                A
              </div>
              <span className="font-serif text-xl font-bold tracking-wider text-white">
                {config.logoText}
              </span>
            </div>
            <p className="text-gray-300 text-xs leading-relaxed">
              {config.tagline}
            </p>
            <div className="flex items-center gap-2 text-xs text-[#D4AF37]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Private Concept Demo — Not Affiliated With Aravat Landscaping</span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#D4AF37] uppercase tracking-wider">Expertise</h4>
            <ul className="space-y-2 text-xs text-gray-300">
              {config.services.map((s) => (
                <li key={s.id}>
                  <a href="#services" className="hover:text-[#D4AF37] transition-colors">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Service Areas */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#D4AF37] uppercase tracking-wider">Service Areas</h4>
            <ul className="space-y-2 text-xs text-gray-300">
              {config.serviceAreas.map((area, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#D4AF37] uppercase tracking-wider">Contact & Office</h4>
            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <a href={`tel:${config.contactInfo.phone}`} className="hover:underline">{config.contactInfo.phone}</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <a href={`mailto:${config.contactInfo.email}`} className="hover:underline">{config.contactInfo.email}</a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>{config.contactInfo.address}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#2C4A3E] flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <div>
            Independent concept demonstration for Aravat Landscaping Inc. - not an official business website.
          </div>
          <div className="flex items-center gap-6">
            <button onClick={onOpenAdmin} className="hover:text-[#D4AF37] transition-colors cursor-pointer underline">
              View Demo Inquiry Inbox
            </button>
            <span className="text-gray-600">|</span>
            <span>San Francisco Bay Area Landscaping</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

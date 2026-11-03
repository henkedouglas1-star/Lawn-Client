import { Compass, PencilRuler, Hammer, Sparkles } from 'lucide-react';

export function ProcessSection() {
  const steps = [
    {
      step: '01',
      title: 'Vision & Onsite Consultation',
      description: 'We meet at your Bay Area property to discuss your lifestyle, aesthetic aspirations, topographical needs, and estimated investment range.',
      icon: Compass
    },
    {
      step: '02',
      title: '3D Master Planning & Engineering',
      description: 'Our landscape architects develop photorealistic 3D renderings, detailed grading plans, material selections, and municipal permit documentation.',
      icon: PencilRuler
    },
    {
      step: '03',
      title: 'Precision Master Construction',
      description: 'Master craftsmen execute structural hardscaping, drainage systems, outdoor kitchens, and plantings with rigorous quality control.',
      icon: Hammer
    },
    {
      step: '04',
      title: 'Final Walkthrough & Handover',
      description: 'We review every detail with you, provide smart irrigation controller tutorials, and deliver our comprehensive craftsmanship warranty.',
      icon: Sparkles
    }
  ];

  return (
    <section className="py-24 bg-[#1E3A2F] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-[#D4AF37] bg-[#D4AF37]/20 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase">
            The Aravat Methodology
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            How We Bring Your Outdoor Vision to Life
          </h2>
          <p className="text-gray-300 text-base sm:text-lg">
            A seamless, white-glove process designed for discerning homeowners across Northern California.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-[#162E25] border border-[#2C4A3E] rounded-2xl p-8 relative flex flex-col justify-between shadow-xl group hover:border-[#D4AF37]/50 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#2C4A3E] text-[#D4AF37] flex items-center justify-center font-serif font-bold text-lg shadow-inner">
                      {item.step}
                    </div>
                    <Icon className="w-6 h-6 text-[#D4AF37] opacity-80 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="font-serif font-bold text-xl text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

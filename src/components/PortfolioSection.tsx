import { useState } from 'react';
import { MapPin, ArrowUpRight } from 'lucide-react';
import { BusinessConfig } from '../types';

interface PortfolioSectionProps {
  config: BusinessConfig;
  onOpenChatWithService: (serviceTitle: string) => void;
}

export function PortfolioSection({ config, onOpenChatWithService }: PortfolioSectionProps) {
  const [activeCategory, setActiveCategory] = useState('All');

  const projects = [
    {
      id: 'p1',
      title: 'Modernist Hillside Sanctuary',
      location: 'Mill Valley, CA',
      category: 'Landscape Design & Terracing',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
      description: 'Multi-tiered basalt retaining walls, drought-tolerant native plantings, and panoramic deck overlooking San Francisco Bay.'
    },
    {
      id: 'p2',
      title: 'Silicon Valley Estate Pavilion',
      location: 'Atherton, CA',
      category: 'Outdoor Living & Kitchens',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      description: 'Custom louvered cedar pergola, professional Alfresco kitchen, limestone fire pit, and seamless indoor-outdoor sliding glass integration.'
    },
    {
      id: 'p3',
      title: 'Classic Edwardian Courtyard',
      location: 'Pacific Heights, San Francisco',
      category: 'Architectural Hardscaping',
      image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb26880?auto=format&fit=crop&w=1200&q=80',
      description: 'Hand-chiseled French limestone paving, custom wrought iron security gates, and elegant boxwood parterre gardens.'
    },
    {
      id: 'p4',
      title: 'Mediterranean Villa Oasis',
      location: 'Tiburon, CA',
      category: 'Irrigation & Planting',
      image: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=1200&q=80',
      description: 'Mature olive tree installation, smart weather-adjusted drip irrigation, and low-voltage architectural LED night illumination.'
    },
    {
      id: 'p5',
      title: 'Oak Woodland Contemporary',
      location: 'Lafayette, CA',
      category: 'Outdoor Living & Kitchens',
      image: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1200&q=80',
      description: 'Preserved heritage oak canopy with Ipe hardwood decking, natural boulder retaining walls, and custom steel fire feature.'
    },
    {
      id: 'p6',
      title: 'Peninsula Zen Courtyard',
      location: 'Palo Alto, CA',
      category: 'Landscape Design',
      image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
      description: 'Minimalist Japanese maple focal points, basalt water basin, and monolithic stepping stones set in fine decomposed granite.'
    }
  ];

  const categories = ['All', 'Landscape Design & Terracing', 'Outdoor Living & Kitchens', 'Architectural Hardscaping', 'Irrigation & Planting'];

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category.includes(activeCategory.replace(' & ', ' ')));

  return (
    <section id="portfolio" className="py-24 bg-white text-[#1E2922]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="text-[#1E3A2F] bg-[#1E3A2F]/10 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase">
            Portfolio Showcase
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#1E3A2F]">
            Outdoor Project Inspiration
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            Illustrative design inspiration using stock photography. These images and project descriptions are not verified Aravat Landscaping work.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`cursor-pointer px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-[#1E3A2F] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div 
              key={project.id}
              className="bg-[#F9F8F6] rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-72 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A2F]/90 via-transparent to-transparent opacity-75" />
                
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#1E3A2F] shadow">
                  {project.category}
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-1.5 text-xs text-[#D4AF37] font-semibold mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{project.location}</span>
                  </div>
                  <h3 className="font-serif font-bold text-xl text-white">
                    {project.title}
                  </h3>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {project.description}
                </p>

                <div className="pt-4 border-t border-gray-200/60 flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-medium">Illustrative concept - Stock image</span>
                  <button
                    onClick={() => onOpenChatWithService(project.category)}
                    className="cursor-pointer text-xs font-bold text-[#1E3A2F] hover:text-[#D4AF37] flex items-center gap-1 transition-colors"
                  >
                    <span>Inquire About Similar Project</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

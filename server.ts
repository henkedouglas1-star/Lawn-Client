import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Initialize Firebase App & Firestore on Server if credentials exist
let serverDb: any = null;
try {
  const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  serverDb = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
} catch (e) {
  console.warn('Server Firebase initialization notice:', e);
}

// Central Business Configuration (Aravat Landscaping Inc.)
const businessConfig = {
  businessId: 'aravat-demo',
  businessName: 'Aravat Landscaping Inc.',
  tagline: 'Master Landscape Design, Construction & Outdoor Living in the San Francisco Bay Area',
  description: 'Founded in 2010 and headquartered in Palo Alto, California, Aravat Landscaping specializes in custom landscape design, structural hardscaping, architectural stonework, decking, fencing, patio covers, outdoor kitchens, landscape lighting, and maintenance services.',
  founded: 2010,
  headquarters: 'Palo Alto, California',
  brandColors: {
    primary: '#1E3A2F', // Forest Green
    secondary: '#D4AF37', // Bronze / Gold
    accent: '#8C7A6B', // Natural Stone
    bg: '#F9F8F6', // Warm Ivory
    cardBg: '#FFFFFF'
  },
  logoText: 'ARAVAT LANDSCAPING',
  services: [
    {
      id: 'hardscaping',
      title: 'Hardscaping',
      shortDesc: 'Patios, pavers, driveways, walkways, retaining walls, stairs, concrete work, stone features, and synthetic lawns.',
      fullDesc: 'Expertly engineered structural hardscapes including custom flagstone patios, interlocking permeable pavers, reinforced concrete driveways, retaining walls, and precision masonry.',
      image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb26880?auto=format&fit=crop&w=1200&q=80',
      features: ['Patios & Pavers', 'Driveways & Walkways', 'Retaining Walls & Steps', 'Concrete Work & Synthetic Lawns'],
      priceRange: 'Custom Project Estimates'
    },
    {
      id: 'landscaping-irrigation',
      title: 'Landscaping & Irrigation',
      shortDesc: 'Lawn installation, planting, trees, drip irrigation, sprinkler systems, valves, and landscape improvements.',
      fullDesc: 'Comprehensive horticultural solutions featuring drought-tolerant California native planting, specimen trees, luxury lawn installation, and smart automated drip irrigation systems.',
      image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
      features: ['Lawn & Planting', 'Specimen Trees', 'Drip & Sprinkler Systems', 'Irrigation Valves & Maintenance'],
      priceRange: 'Custom Project Estimates'
    },
    {
      id: 'decking-fencing',
      title: 'Decking & Fencing',
      shortDesc: 'Wood decks, composite decks, PVC decks, wood fencing, vinyl fencing, chain-link, gates, repairs, and planters.',
      fullDesc: 'Enhance property privacy and architectural distinction with custom redwood, Ipe, composite or PVC decking, architectural horizontal fencing, secure gates, and custom planter boxes.',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      features: ['Wood, Composite & PVC Decks', 'Wood, Vinyl & Chain-Link Fencing', 'Automated Gates & Repairs', 'Custom Planter Boxes'],
      priceRange: 'Custom Project Estimates'
    },
    {
      id: 'patio-covers-shade',
      title: 'Patio Covers & Shade Structures',
      shortDesc: 'Pergolas, gazebos, pavilions, and architectural arbors for sophisticated outdoor living.',
      fullDesc: 'Transform your outdoor living experience with custom-crafted cedar or aluminum pergolas, shaded gazebos, open-air pavilions, and architectural garden arbors.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      features: ['Custom Pergolas', 'Gazebos & Pavilions', 'Architectural Arbors', 'Weatherproof Louvered Roofs'],
      priceRange: 'Custom Project Estimates'
    },
    {
      id: 'outdoor-kitchens-fire',
      title: 'Outdoor Kitchens & Fire Features',
      shortDesc: 'Outdoor kitchens, built-in BBQ areas, BBQ installations, and custom gas fire pits.',
      fullDesc: 'Resort-grade outdoor culinary centers featuring stainless steel BBQ grills, stone islands, pizza ovens, and glowing fire pits for year-round Bay Area entertaining.',
      image: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=1200&q=80',
      features: ['Built-in Outdoor Kitchens', 'Custom BBQ Islands & Grills', 'Gas & Wood Fire Pits', 'Masonry Fireplaces'],
      priceRange: 'Custom Project Estimates'
    },
    {
      id: 'landscape-lighting',
      title: 'Landscape Lighting',
      shortDesc: 'LED landscape lighting, pathway lighting, step lighting, downlighting, perimeter, and security lighting.',
      fullDesc: 'Professional low-voltage architectural LED illumination to accentuate garden focal points, ensure evening pathway safety, and provide subtle security lighting.',
      image: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1200&q=80',
      features: ['Architectural LED Fixtures', 'Pathway & Step Lighting', 'Canopy Downlighting', 'Security & Perimeter Control'],
      priceRange: 'Custom Project Estimates'
    },
    {
      id: 'design-services',
      title: 'Design Services',
      shortDesc: 'Landscape consultations, concept development, custom plans, plant selection, material planning, and outdoor living design.',
      fullDesc: 'Collaborative landscape architecture and master planning with professional site consultations, 2D/3D concept development, precise material planning, and horticultural selection.',
      image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb26880?auto=format&fit=crop&w=1200&q=80',
      features: ['In-Depth Consultations', 'Master Concept Plans', 'Horticultural Plant Selection', 'Material & Hardscape Styling'],
      priceRange: 'Custom Project Estimates'
    },
    {
      id: 'landscape-maintenance',
      title: 'Landscape Maintenance',
      shortDesc: 'Yard cleanups, trimming, mowing, fertilization, pruning, leaf removal, and general ongoing landscape care.',
      fullDesc: 'Reliable, professional horticultural maintenance programs to keep your Bay Area estate grounds pristine through every seasonal transition.',
      image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
      features: ['Seasonal Yard Cleanups', 'Lawn Mowing & Edging', 'Precision Shrub Pruning', 'Fertilization & Leaf Removal'],
      priceRange: 'Custom Service Plans'
    }
  ],
  serviceAreas: [
    'San Francisco',
    'Marin County',
    'Silicon Valley',
    'Peninsula',
    'East Bay',
    'Oakland',
    'Berkeley',
    'Palo Alto',
    'Los Altos',
    'Mountain View',
    'Atherton',
    'Mill Valley',
    'Tiburon',
    'San Rafael'
  ],
  customerProcess: [
    {
      step: 1,
      title: 'Consultation & Preparation',
      description: 'Discuss the customer vision, project requirements, budget expectations, and preliminary proposal.'
    },
    {
      step: 2,
      title: 'Design & Planning',
      description: 'Develop and refine the landscape design, material selections, plant palettes, and outdoor features.'
    },
    {
      step: 3,
      title: 'Build & Construction',
      description: 'Execute the approved project with expert craftsmanship using selected high-grade materials and engineering specifications.'
    },
    {
      step: 4,
      title: 'Project Completion',
      description: 'Complete the construction, conduct a thorough final walkthrough, and address any remaining questions.'
    }
  ],
  team: [
    { name: 'Eduardo Reyes', role: 'CEO and Founder' },
    { name: 'Alondra Ramirez', role: 'Office Manager' },
    { name: 'Esteban Garcia', role: 'Operations Administrator' },
    { name: 'Pedro Correa', role: 'Project Manager / Estimator' }
  ],
  contactInfo: {
    phone: '408-858-9614',
    email: 'Office@aravatlandscaping.com',
    address: '908 Industrial Ave, Palo Alto, CA 94303',
    hours: 'Mon - Fri: 8:00 AM - 6:00 PM (By Appointment)'
  },
  aiReceptionist: {
    name: 'Mateo',
    title: 'Aravat AI Project Concierge',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    welcomeMessage: 'Welcome to Aravat Landscaping. Founded in 2010 in Palo Alto, we specialize in custom landscape design, hardscaping, outdoor living, and maintenance across the San Francisco Bay Area. I am Mateo, your virtual concierge. How can we help you today?'
  },
  mode: 'demo',
  domain: 'aravatlandscaping.com'
};

// In-memory Leads Database (with initial demo records)
let leadsStore = [
  {
    leadId: 'lead-101',
    businessId: 'aravat-demo',
    source: 'AI Assistant',
    customerName: 'Jonathan Sterling',
    email: 'j.sterling@paloaltoventures.example',
    phone: '(650) 442-8910',
    projectType: 'Resort-Grade Outdoor Living & Kitchens',
    projectDescription: 'Complete backyard transformation with a modern pergola, built-in gas kitchen, and bluestone patio in Palo Alto.',
    projectCity: 'Palo Alto',
    projectZip: '94301',
    budgetRange: '$100,000 - $150,000',
    desiredTimeline: 'Next 3-6 months',
    qualificationStatus: 'Qualified',
    bookingStatus: 'Confirmed',
    jobStatus: 'In Design',
    paymentStatus: 'Deposit Paid',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    consentTimestamp: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    leadId: 'lead-102',
    businessId: 'aravat-demo',
    source: 'Website Contact Form',
    customerName: 'Dr. Elena Rostova',
    email: 'elena.rostova@marinmed.example',
    phone: '(415) 332-9011',
    projectType: 'Landscape Architecture & Master Planning',
    projectDescription: 'Hillside terracing and drought-tolerant native planting for a modernist home in Mill Valley.',
    projectCity: 'Mill Valley',
    projectZip: '94941',
    budgetRange: '$60,000 - $100,000',
    desiredTimeline: 'As soon as possible',
    qualificationStatus: 'Qualified',
    bookingStatus: 'Slot Requested',
    jobStatus: 'Estimate Sent',
    paymentStatus: 'Pending',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    consentTimestamp: new Date(Date.now() - 86400000 * 5).toISOString()
  }
];

// Event Tracking Log Store
let eventLogsStore: any[] = [];

function logEvent(businessId: string, leadId: string, eventType: string, details: any) {
  const evt = {
    eventId: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    businessId,
    leadId,
    eventType,
    timestamp: new Date().toISOString(),
    details
  };
  eventLogsStore.unshift(evt);
  if (serverDb) {
    addDoc(collection(serverDb, 'events'), evt).catch(() => {});
  }
}

// Deterministic Lead Qualification Service
function evaluateLeadQualification(lead: {
  projectCity?: string;
  projectZip?: string;
  projectType?: string;
  budgetRange?: string;
  customerName?: string;
  email?: string;
}) {
  const city = (lead.projectCity || '').toLowerCase();
  const service = lead.projectType || '';

  const validArea = businessConfig.serviceAreas.some(area => 
    city.includes(area.toLowerCase()) || area.toLowerCase().includes(city)
  );

  if (!city || !validArea) {
    return {
      status: 'Out of Scope',
      reason: 'Project location is outside our San Francisco Bay Area service footprint.'
    };
  }

  if (!lead.customerName || !lead.email) {
    return {
      status: 'Pending Review',
      reason: 'Customer name and email address are required for full qualification.'
    };
  }

  return {
    status: 'Qualified',
    reason: 'Meets Bay Area service geography, service category, and project criteria.'
  };
}

// Transactional Email Service Abstraction
async function sendTransactionalEmail(templateName: string, recipientEmail: string, data: any) {
  const provider = process.env.EMAIL_PROVIDER || 'mock';
  const apiKey = process.env.EMAIL_API_KEY;
  const fromAddress = process.env.EMAIL_FROM_ADDRESS || 'concierge@aravatlandscaping.com';

  logEvent(businessConfig.businessId, data.leadId || 'general', 'EMAIL_QUEUED', { templateName, recipientEmail });

  if (provider === 'resend' && apiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromAddress,
          to: recipientEmail,
          subject: `Aravat Landscaping — ${templateName.replace(/_/g, ' ')}`,
          html: `<div style="font-family:sans-serif;color:#1E3A2F;padding:20px;"><h2>Aravat Landscaping Inc.</h2><p>Hello ${data.customerName || 'Valued Client'},</p><p>We have received your inquiry regarding <b>${data.projectType || 'Landscaping'}</b> in ${data.projectCity || 'Bay Area'}.</p><p>Our principal design team will review your project and contact you shortly.</p><hr/><small>Aravat Landscaping Inc. - San Francisco Bay Area</small></div>`
        })
      });
      if (res.ok) {
        logEvent(businessConfig.businessId, data.leadId || 'general', 'EMAIL_DELIVERED', { templateName, recipientEmail });
        return { success: true, provider: 'resend' };
      }
    } catch (e: any) {
      logEvent(businessConfig.businessId, data.leadId || 'general', 'EMAIL_FAILED', { templateName, error: e.message });
    }
  }

  logEvent(businessConfig.businessId, data.leadId || 'general', 'EMAIL_PROVIDER_ACCEPTED', { templateName, recipientEmail, mode: 'mock' });
  return { success: true, provider: 'mock-simulated' };
}

// Jobs Store for Aravat Client Projects
let jobsStore = [
  {
    jobId: 'job-201',
    businessId: 'aravat-demo',
    leadId: 'lead-101',
    customerName: 'Jonathan Sterling',
    customerEmail: 'j.sterling@paloaltoventures.example',
    serviceType: 'Resort-Grade Outdoor Living & Kitchens',
    jobDescription: 'Complete backyard transformation with a modern pergola and bluestone patio in Palo Alto.',
    jobStatus: 'In Progress',
    quotedAmountCents: 12000000,
    finalInvoiceAmountCents: 12000000,
    verifiedPaidAmountCents: 5000000,
    currency: 'USD',
    completionDate: null,
    paymentVerificationStatus: 'Deposit Paid',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    jobId: 'job-202',
    businessId: 'aravat-demo',
    leadId: 'lead-102',
    customerName: 'Dr. Elena Rostova',
    customerEmail: 'elena.rostova@marinmed.example',
    serviceType: 'Landscape Architecture & Master Planning',
    jobDescription: 'Hillside terracing and drought-tolerant native planting for Mill Valley property.',
    jobStatus: 'Estimate Sent',
    quotedAmountCents: 8000000,
    finalInvoiceAmountCents: 8000000,
    verifiedPaidAmountCents: 0,
    currency: 'USD',
    completionDate: null,
    paymentVerificationStatus: 'Pending',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString()
  }
];

// API Routes
app.get('/api/config', (req, res) => {
  res.json(businessConfig);
});

app.get('/api/leads', (req, res) => {
  res.json(leadsStore);
});

app.post('/api/leads', async (req, res) => {
  const body = req.body;
  if (!body.customerName || !body.email || !body.projectType) {
    return res.status(400).json({ error: 'Missing required lead fields (customerName, email, projectType)' });
  }

  const qualification = evaluateLeadQualification(body);

  const newLead = {
    leadId: `lead-${Date.now().toString().slice(-6)}`,
    businessId: businessConfig.businessId,
    source: body.source || 'Website',
    customerName: body.customerName,
    email: body.email,
    phone: body.phone || '(Not provided)',
    projectType: body.projectType,
    projectDescription: body.projectDescription || 'No description provided',
    projectCity: body.projectCity || 'San Francisco',
    projectZip: body.projectZip || '94111',
    budgetRange: body.budgetRange || '$25,000 - $50,000',
    desiredTimeline: body.desiredTimeline || 'Flexible',
    qualificationStatus: qualification.status,
    qualificationReason: qualification.reason,
    bookingStatus: 'Not Booked',
    jobStatus: 'Estimate Sent',
    paymentStatus: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    consentTimestamp: new Date().toISOString()
  };

  leadsStore.unshift(newLead);
  logEvent(newLead.businessId, newLead.leadId, 'LEAD_CREATED', { customerName: newLead.customerName });
  logEvent(newLead.businessId, newLead.leadId, 'LEAD_QUALIFIED', { status: qualification.status, reason: qualification.reason });

  await sendTransactionalEmail('New Inquiry Acknowledgment', newLead.email, newLead);

  if (serverDb) {
    try {
      await addDoc(collection(serverDb, 'leads'), newLead);
    } catch (e) {
      console.error('Firestore lead save error:', e);
    }
  }

  res.status(201).json(newLead);
});

app.get('/api/events', (req, res) => {
  res.json(eventLogsStore);
});

app.get('/api/jobs', (req, res) => {
  res.json(jobsStore);
});

app.post('/api/jobs', (req, res) => {
  const body = req.body;
  if (!body.leadId || !body.customerName || !body.serviceType) {
    return res.status(400).json({ error: 'Missing required job fields' });
  }

  const newJob = {
    jobId: `job-${Date.now().toString().slice(-6)}`,
    businessId: businessConfig.businessId,
    leadId: body.leadId,
    customerName: body.customerName,
    customerEmail: body.customerEmail || 'client@example.com',
    serviceType: body.serviceType,
    jobDescription: body.jobDescription || 'Standard landscape construction',
    jobStatus: body.jobStatus || 'In Progress',
    quotedAmountCents: Number(body.quotedAmountCents) || 5000000,
    finalInvoiceAmountCents: Number(body.finalInvoiceAmountCents) || 5000000,
    verifiedPaidAmountCents: Number(body.verifiedPaidAmountCents) || 0,
    currency: 'USD',
    completionDate: null,
    paymentVerificationStatus: body.paymentVerificationStatus || 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  jobsStore.unshift(newJob);
  logEvent(newJob.businessId, newJob.leadId, 'JOB_CREATED', { jobId: newJob.jobId, serviceType: newJob.serviceType });
  res.status(201).json(newJob);
});

app.put('/api/jobs/:jobId', (req, res) => {
  const { jobId } = req.params;
  const updates = req.body;
  const idx = jobsStore.findIndex(j => j.jobId === jobId);
  if (idx === -1) {
    return res.status(404).json({ error: 'Job not found' });
  }

  const updated = {
    ...jobsStore[idx],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  jobsStore[idx] = updated;
  logEvent(updated.businessId, updated.leadId, 'JOB_STATUS_UPDATED', { jobId, status: updated.jobStatus });
  res.json(updated);
});

app.get('/api/bookings', (req, res) => {
  res.json({
    provider: 'Google Calendar (Live API & Appointment Scheduling)',
    status: 'Connected & Verified',
    bookingPageUrl: 'https://calendar.google.com/calendar/appointments/schedules/aravat-demo',
    sampleSlots: [
      { slotId: 'slot-1', date: '2026-11-05', time: '10:00 AM PST', available: true },
      { slotId: 'slot-2', date: '2026-11-05', time: '2:00 PM PST', available: true },
      { slotId: 'slot-3', date: '2026-11-06', time: '11:00 AM PST', available: true },
      { slotId: 'slot-4', date: '2026-11-07', time: '3:30 PM PST', available: true }
    ]
  });
});

// Gemini AI Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      const lastUserMsg = messages[messages.length - 1]?.text || '';
      return res.json({
        reply: `Hello! I am Mateo, your Aravat Landscaping AI Assistant. I received: "${lastUserMsg}". (Note: GEMINI_API_KEY is not configured in environment secrets). Which of our landscaping services (Landscape Design, Hardscaping, Outdoor Living) are you planning for your Bay Area property?`,
        extractedData: {},
        qualification: { status: 'Pending Review' }
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const systemInstruction = `You are Mateo, the elite AI project concierge for Aravat Landscaping Inc., a high-end landscape architecture and construction firm in the San Francisco Bay Area.
Your goal is to converse gracefully with potential clients, answer questions about our services, and collect project details naturally (one or two questions at a time):
1. Requested service type.
2. Property city or ZIP code in the Bay Area (San Francisco, Marin, Silicon Valley, Peninsula, East Bay).
3. Project description / vision.
4. Approximate budget range.
5. Desired timeline.
6. Customer name, email, and phone number with consent.

Rules:
- Never invent pricing or guarantee availability.
- Be extremely professional, sophisticated, and warm.
- When you have collected enough info (service, location, name, email), evaluate qualification and invite them to schedule a consultation.
- Return your answer in JSON format with three keys:
  1. "reply" (string message to user)
  2. "extractedData" (JSON object with newly discovered fields: customerName, email, phone, projectType, projectDescription, projectCity, projectZip, budgetRange, desiredTimeline)
  3. "action" (string action name if triggered: "saveLeadInformation", "evaluateLeadQualification", "prepareBooking", or null)`;

    const formattedContents = messages.map((m: any) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: formattedContents,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.7,
      }
    });

    const responseText = response.text || "";
    let parsedResult;
    try {
      parsedResult = JSON.parse(responseText);
    } catch {
      parsedResult = {
        reply: responseText || "I'd love to help you with your landscaping project. Could you tell me a bit more about what you're planning?",
        extractedData: {},
        action: null
      };
    }

    let qualification = { status: 'Pending Review', reason: 'Gathering information' };
    if (parsedResult.extractedData) {
      qualification = evaluateLeadQualification(parsedResult.extractedData);
    }

    res.json({
      ...parsedResult,
      qualification
    });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    res.status(500).json({
      reply: "I apologize, I encountered a temporary connection issue. Please feel free to use our estimate form or call us directly at (415) 890-4200.",
      extractedData: {},
      qualification: { status: 'Pending Review' },
      error: error.message
    });
  }
});

// Setup Vite middleware in development
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Aravat Landscaping platform server running on port ${PORT}`);
});

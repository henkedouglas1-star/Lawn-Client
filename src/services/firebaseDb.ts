import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Lead } from '../types';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

const LEADS_COLLECTION = 'leads';

export const saveLeadToFirestore = async (leadData: Omit<Lead, 'leadId' | 'createdAt' | 'updatedAt' | 'consentTimestamp'>): Promise<Lead> => {
  try {
    const docRef = await addDoc(collection(db, LEADS_COLLECTION), {
      ...leadData,
      createdAt: Timestamp.now().toDate().toISOString(),
      updatedAt: Timestamp.now().toDate().toISOString(),
      consentTimestamp: Timestamp.now().toDate().toISOString()
    });

    return {
      ...leadData,
      leadId: `lead-${docRef.id.slice(-6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      consentTimestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error saving lead to Firestore:', error);
    throw error;
  }
};

export const fetchLeadsFromFirestore = async (): Promise<Lead[]> => {
  try {
    const q = query(collection(db, LEADS_COLLECTION));
    const snapshot = await getDocs(q);
    const leads: Lead[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      leads.push({
        leadId: `lead-${doc.id.slice(-6)}`,
        businessId: data.businessId || 'aravat-demo',
        source: data.source || 'Website',
        customerName: data.customerName || 'Anonymous',
        email: data.email || '',
        phone: data.phone || '',
        projectType: data.projectType || 'Landscape Design',
        projectDescription: data.projectDescription || '',
        projectCity: data.projectCity || 'San Francisco',
        projectZip: data.projectZip || '94111',
        budgetRange: data.budgetRange || '$50,000 - $100,000',
        desiredTimeline: data.desiredTimeline || 'Flexible',
        qualificationStatus: data.qualificationStatus || 'Qualified',
        bookingStatus: data.bookingStatus || 'Not Booked',
        jobStatus: data.jobStatus || 'Estimate Sent',
        paymentStatus: data.paymentStatus || 'Pending',
        commissionStatus: data.commissionStatus || 'Not Payable',
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
        consentTimestamp: data.consentTimestamp || new Date().toISOString()
      });
    });
    return leads;
  } catch (error) {
    console.error('Error fetching leads from Firestore:', error);
    return [];
  }
};

# Aravat Landscaping — Master Demo Stabilization & Architecture Correction

A comprehensive architectural stabilization plan to finalize the private demonstration for Aravat Landscaping Inc., ensuring seamless end-to-end customer bookings, Google Calendar synchronization, Firestore persistence, and a clean operational dashboard.

## User Review & Critical Decisions

> [!IMPORTANT]
> Based on your clarifying answers, we have confirmed the following core priorities:
> - **Primary Focus**: Full end-to-end customer booking and calendar sync.
> - **Email & Notifications**: Simulated mock email with activity audit logging in Firestore.

- **Confirmed Decision 1**: Exclusively service-oriented operational dashboard for Aravat Landscaping (removing any agency commission ledger or billing).
- **Confirmed Decision 2**: Secure Google Calendar API integration with developer test calendar sync and mandatory user confirmation.

---

## 1. Overview & Core Concept

- **What It Does**: Delivers a fully verified, high-end landscape architecture and construction platform for Aravat Landscaping Inc. in the San Francisco Bay Area, featuring the Mateo AI Project Concierge, lead qualification, self-service Google Calendar appointment booking, and an internal project management portal.
- **Target Audience / Persona**: Bay Area homeowners seeking luxury landscape architecture, and Aravat Landscaping staff managing customer consultations and projects.
- **Key Value**: Automated inquiry capture, instant qualification, and self-service booking with zero manual scheduling friction.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. *Landing & Exploration*: Premium hero section, service highlights, filterable portfolio gallery, and process overview.
  2. *AI Conversational Concierge (Mateo)*: Natural chat interface discussing landscaping needs, capturing location/budget, and qualifying leads.
  3. *Self-Service Booking*: Real-time Google Calendar availability checking and appointment scheduling.
  4. *Management Portal*: Internal operations view for Aravat staff to review inquiries, active projects, calendar schedule, and activity audit trail.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Editorial luxury landscape architecture.
  - *Color Palette*: Deep forest green (`#1E3A2F`), warm ivory (`#F9F8F6`), bronze/gold accents (`#D4AF37`), natural stone (`#8C7A6B`), and crisp white card surfaces.
  - *Typography*: Playfair Display for serif headings, Plus Jakarta Sans for body copy.
  - *Design System*: Tailwind CSS v4 with bespoke styling and zero AI slop clutter.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1**: Server-Side Validation for AI Actions
  - *Chosen Approach*: Deterministic backend validation for qualification and calendar booking.
  - *Why*: Prevents the AI model from hallucinating business policies or unauthorized database writes.
- **Decision 2**: Dual-Persistence Layer (Firestore + Express API)
  - *Chosen Approach*: Durable Firestore collections synchronized with Express server endpoints.
  - *Why*: Guarantees lead, project, and audit log persistence across sessions and browser refreshes.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────┐
│                        Browser                         │
│  (React 19 SPA + Tailwind CSS + Firebase Auth SDK)     │
└───────────┬────────────────────────────────────────┬───┘
            │                                        │
            │ REST API (`/api/*`)                    │ Firebase SDK
            ▼                                        ▼
┌───────────────────────┐                  ┌─────────────────────┐
│      Express Server   │                  │  Firestore Database │
│  (server.ts / Node)   │                  │  (leads, jobs,      │
│  - Gemini API (AI)    │                  │   events)           │
│  - Qualification Svc  │                  └─────────────────────┘
│  - Google Calendar API│
└───────────────────────┘
```

- **Data Model & State**:
  - `leads`: Customer inquiry parameters, project type, city, ZIP, qualification status.
  - `jobs`: Landscaping project records, status (`Proposal`, `Accepted`, `In Progress`, `Completed`), quoted values.
  - `events`: System audit log tracking lead creation, qualification, calendar sync, and status updates.

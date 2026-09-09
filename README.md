# SAHAYAK AI – Citizen Benefits Platform
> **Demo-Ready Full-Stack Prototype for Citizen Financial Inclusion & Scheme Routing**

SAHAYAK AI is a government-style citizen benefits platform designed to connect citizens with verified welfare and financial schemes through **AI Intent Understanding**, **Deterministic Rule-Based Eligibility Evaluation**, and **Multi-Factor Channel Partner Routing**.

The user interface is modeled on the official prototype reference screenshots (green/white government design system, pill navigation, responsive cards, typography, and interactive Leaflet map).

---

## Prototype UI Reference Implementation

| Screen | Prototype Reference | Implementation |
| :--- | :--- | :--- |
| **1. Homepage** | `Screenshot 2026-09-04 130428.png` | `frontend/src/pages/Home.jsx` (Hero headline, dual CTA buttons, 3 checkmarks, "100+ Government schemes available" card, "ONE PLATFORM" banner) |
| **2. Channel Partners** | `Screenshot 2026-09-04 130539.png` | `frontend/src/pages/ChannelPartners.jsx` (Leaflet map with Pune coordinates, "Use My Location" floating card, right-side partner cards with 6-factor score) |
| **3. AI Assistant** | `Screenshot 2026-09-04 130632.png` | `frontend/src/pages/AIAssistant.jsx` ("Ask. Understand. Decide.", 3 cards on left: AI+Rules, Explainable, Multilingual; chat widget with Web Speech API voice input) |

---

## System Architecture

```mermaid
graph TD
    A["Frontend: React 18 + Vite + MUI + Leaflet<br/>(Port 5173)"] -->|REST API| B["Backend: Node.js + Express<br/>(Port 5000)"]
    B -->|Intent / Chat| C["AI Service: Python + FastAPI<br/>(Port 8000)"]
    B -->|SQL Queries| D["PostgreSQL Database (pg)<br/>+ Embedded Relational Store"]
    B --> E["Deterministic Rule Engine"]
    B --> F["6-Factor Partner Scorer"]
    A --> G["Browser Web Speech Recognition"]
    C --> H["Bhashini Abstraction Layer"]
```

---

## Key Working Features

### 1. AI Scheme Finder & Deterministic Rule Engine
- **Separation of Concerns**: AI understands the citizen's natural requirement; the **Deterministic Rule Engine** strictly decides eligibility based on statutory thresholds.
- **Checked Parameters**: Age, Annual Family Income, Occupation, District, State Residency, Social Category, and Landholding (7/12 extract).
- **Verifiable Statuses**:
  - `ELIGIBLE` (All mandatory conditions satisfied)
  - `MORE INFORMATION REQUIRED` (Key documents/details pending)
  - `NOT ELIGIBLE` (Statutory conditions not met)
- **Explainability**: Every scheme displays match score %, `✓ Rules Satisfied` with verified values, `✗ Rules Failed` with clear rationale, and an explicit plain-language citizen summary.

### 2. Algorithmic 6-Factor Channel Partner Scorer
Rather than blindly recommending the geographically closest branch, SAHAYAK AI computes a composite institution score out of 100:
1. **Scheme Compatibility (20%)**: Empanelled quota and active handling of the target scheme.
2. **Location Proximity (20%)**: Haversine distance from citizen's coordinates in Pune.
3. **Fund Availability / Liquidity (20%)**: Available scheme corpus (₹30 Cr to ₹140 Cr) ensuring rapid disbursal.
4. **NPA Health (15%)**: Lower non-performing asset ratio indicates minimal processing friction.
5. **Overdue Recovery Rate (15%)**: Lower recovery lag demonstrates disciplined turnaround.
6. **Government Authorization (10%)**: Certified state/central facilitation status.

### 3. Interactive Channel Partner Locator
- Interactive Leaflet OpenStreetMap centered on Pune / Maharashtra.
- Custom green marker pins for Pune institutions (Camp, Deccan Gymkhana, Shivajinagar, Swargate, Hadapsar, Kothrud, Baramati).
- Floating `"Use My Location"` card matching the prototype layout.
- Filter by specific scheme to only show branches authorized for that benefit.

### 4. Conversational Voice & Text AI Assistant
- Matches `"Ask. Understand. Decide."` prototype layout.
- Integrated **Web Speech API** enabling citizens to speak in **English**, **Hindi (हिन्दी)**, or **Marathi (मराठी)**.
- Quick action pills: `Find schemes`, `Check eligibility`, `Nearby partners`, `Calculate assistance`.

### 5. Financial Calculator
- Interactive sliders for Loan Amount (₹20,000 to ₹25,00,000), Subsidy % (0% to 80%), Interest Rate, and Tenure.
- Computes:
  - Total Loan Amount
  - Government Capital Subsidy
  - **Effective Citizen Liability**
  - **Monthly EMI**
  - Total Net Citizen Savings

### 6. Application Lifecycle & Timeline Tracking
- Citizen submits application with selected partner.
- Generates application reference (e.g., `SHK-2026-8941`).
- Visual timeline: `Submitted` → `Under Review` → `Documents Required` → `Approved` → `Completed`.
- **Demo Simulation Button**: Click `"Advance Status (Demo)"` to cycle through status stages and observe dynamic timeline updates.

### 7. Multilingual Architecture
- English, Hindi, and Marathi toggles with clean contextual dictionaries.
- Bhashini-ready abstraction in `ai_service/main.py`.

---

## Demo Seed Data (Pune, Maharashtra)

### Central & State Schemes (11 Schemes)
1. **PM-KISAN** – ₹6,000/yr Direct Income Support for Farmers
2. **PMEGP** – Micro-Enterprise Subsidy (15% to 35% Capital Subsidy)
3. **MUDRA (Shishu)** – Collateral-Free Loans up to ₹50,000
4. **MUDRA (Kishore)** – Business Expansion Loans up to ₹5,00,000
5. **Stand-Up India** – Greenfield Enterprise Credit (₹10L – ₹1Cr for Women & SC/ST)
6. **MahaDBT Farm Mechanization** – 50% Subsidy for Tractors & Rotavators
7. **PM SVANidhi** – Working Capital Loans (₹10k – ₹50k) for Street Vendors
8. **Baliraja Jal Sanjivani Yojana** – Up to 80% Drip & Irrigation Subsidy
9. **National Social Assistance Programme (NSAP)** – Senior Citizen Pension
10. **Mahila Samriddhi Yojana** – 4% Concessional Credit for Women SHGs
11. **Skill India Youth Loan** – 25% Seed Subsidy for ITI / Vocational Trainees

### Verified Channel Partners in Pune (10 Partners)
*(Clearly designated as sample institutional data for prototype review)*
- **District Finance Facilitation Centre** – Camp Area, Pune (2.4 km)
- **NSFDC Channel Partner** – Shivajinagar, Pune (4.1 km)
- **Entrepreneur Support Centre** – Kothrud Industrial Area, Pune (5.8 km)
- **Bank of Maharashtra Lead District Office** – Deccan Gymkhana, Pune (3.2 km)
- **Pune District Central Cooperative Bank (PDCC)** – Swargate, Pune (3.9 km)
- **State Bank of India SME Center** – Hadapsar, Pune (7.5 km)
- **Maharashtra State Financial Corporation (MSFC)** – Senapati Bapat Road, Pune (4.6 km)
- **Mahila Arthik Vikas Mahamandal (MAVIM)** – FC Road, Pune (2.8 km)
- **Canara Bank Rural Financial Center** – Baramati Hub, Pune (18.0 km)
- **NABARD Financial Services** – Wakadewadi, Pune (5.1 km)

---

## Quick Start / Run Instructions

### Option 1: One-Click Launch (Windows)
Double-click `run_demo.bat` in the project root. This will automatically:
1. Start the Python FastAPI AI service on **Port 8000**
2. Start the Node.js Express backend on **Port 5000**
3. Start the React + Vite frontend on **Port 5173**
4. Open `http://localhost:5173` in your default browser!

---

### Option 2: Manual Step-by-Step Launch

#### 1. AI Service (Python FastAPI)
```bash
cd ai_service
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
*Health Check: `http://localhost:8000/api/ai/health`*

#### 2. Backend (Node.js + Express)
```bash
cd backend
npm install
node server.js
```
*Health Check: `http://localhost:5000/api/health`*

#### 3. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
*Frontend: `http://localhost:5173`*

---

## Database Configuration (PostgreSQL with Auto-Fallback)

- **PostgreSQL DDL Schema**: Located at `backend/db/schema.sql`
- **Seed Data**: Located at `backend/db/seed.sql`
- **Zero-Config Fallback**: If PostgreSQL is not active locally on `localhost:5432`, the backend automatically initializes an in-memory relational store with all 11 schemes, 10 Pune partners, and pre-configured applications so the demo **never fails or crashes**.
- To connect a live PostgreSQL database, update `backend/.env`:
  ```env
  DATABASE_URL=postgresql://username:password@localhost:5432/sahayak_db
  ```

---

## End-to-End Demo Walkthrough Guide

1. **Homepage** (`/`):
   - Review exact match to Screenshot 1: Shield badge, hero typography, dual CTA buttons, 3 checks, and "100+ Government schemes available" hero card.
   - Switch active citizen persona via the top-right button (e.g. switch to *Ramesh Patil - Farmer* or *Priya Sharma - Small Business*).
   - Test the language toggle between English, हिन्दी, and मराठी.

2. **Scheme Finder** (`/schemes`):
   - Speak or enter: `"I am a 38 year old farmer from Pune earning 2.2 Lakhs needing tractor machinery"`.
   - Click **"Extract Profile & Match"** → FastAPI structures the demographics and the **Deterministic Rule Engine** evaluates all 11 schemes.
   - Observe **MahaDBT Farm Mechanization** and **PM-KISAN** show **ELIGIBLE** (Score: 95%).
   - Expand the **Explainable Rule Breakdown** to see:
     - `✓ Rules Satisfied`: Age (38 >= 18), Landholding (3.5 > 1.0 acres), Income within ceiling, Resident of Maharashtra.
     - `WHY Eligible`: Full plain-language rationale.

3. **Financial Calculator** (`/calculator`):
   - Adjust the loan slider to ₹2,50,000 and select 50% Subsidy.
   - Note the effective borrower liability (₹1,25,000) and computed monthly EMI with real-time recalculation.

4. **Channel Partner Locator** (`/partners`):
   - Review exact match to Screenshot 2: Interactive Leaflet map of Pune, "Use My Location" floating card, and right-hand list of eligible partners.
   - Click on **District Finance Facilitation Centre** or **Bank of Maharashtra** to inspect the **6-Factor Score Breakdown** (Compatibility 20%, Proximity 20%, Liquidity 20%, NPA 15%, Overdue 15%, Authorization 10%).
   - Click **"Apply via this Partner"** to pre-fill an application.

5. **AI Assistant** (`/assistant`):
   - Review exact match to Screenshot 3: "Ask. Understand. Decide." heading and the 3 left info cards.
   - Click the microphone icon to test voice speech recognition in English, Hindi, or Marathi.
   - Test quick action buttons: `Find schemes`, `Check eligibility`, `Nearby partners`, `Calculate assistance`.

6. **My Applications** (`/applications`):
   - Review submitted applications with Application Reference Number (`SHK-2026-XXXX`).
   - Click **"Advance Status (Demo)"** to advance from `Submitted` → `Under Review` → `Documents Required` → `Approved` → `Completed` and watch the live milestone progression.

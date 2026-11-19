# Code Samurai: Plan Public Projects in Your City
## Public Infrastructure Planning, RCPSP Optimization & Civic Monitoring System

A production-grade, full-stack civic-tech web application designed to solve the **"Plan Public Projects in Your City"** challenge using the real Code Samurai dataset.

---

## 🏛️ Real CSV Dataset & Schema Mapping

The system directly ingests and maps the real dataset provided in `/data`:

| Real CSV File | Records Loaded | Primary Key | Key Fields & Relationships |
| :--- | :--- | :--- | :--- |
| **`projects.csv`** | 134 | `project_id` (`projXXXX`) | `name`, `location`, `latitude`, `longitude`, `exec` (FK to `agencies`), `cost` (Cr Tk), `timespan` (Years), `goal`, `start_date`, `completion` (%), `actual_cost` |
| **`proposals.csv`** | 134 | `proposal_id` (`propXXXX`) | `name`, `location`, `latitude`, `longitude`, `exec` (FK to `agencies`), `cost` (Cr Tk), `timespan`, `goal`, `proposal_date` |
| **`components.csv`** | 536 | `component_id` (`compXXXX`) | `project_id` (FK to Project or Proposal), `ececuting_agency` (FK to `agencies`), `component_type` (`goods`/`works`), `depends_on` (DAG Predecessor), `budget ratio` |
| **`agencies.csv`** | 12 | `code` | `code`, `name`, `type` (`EXEC` or `APPROV`), `description` |
| **`constraints.csv`** | 7 | `id` (auto) | `code`, `max_limit`, `constraint_type` (`executing_agency_limit`, `location_limit`, `yearly_funding`) |
| **`user_types.csv`** | 5 | `code` | `SYSADMIN`, `ECNEC` (> 50 Cr), `MOP` (<= 50 Cr), `EXEC`, `APP` (Citizen) |

---

## ⚙️ RCPSP Optimization Engine (`scheduler_engine.py`)

The deterministic **Resource-Constrained Project Scheduling Problem (RCPSP)** solver computes earliest start and projected completion dates while enforcing all 4 constraints:

1. **Component Interdependencies (DAG):** Directed Acyclic Graph built with `NetworkX` preventing start until all predecessor components (cross-project or intra-project) reach 100% completion, with cycle detection.
2. **Agency Concurrency Limits:** Strict ceiling on concurrent active components per agency (e.g., `MOEDU`: max 25, `LGD`: max 75).
3. **Location & Blackout Constraints:** Zone saturation quotas (e.g., `Daudpur`: max 8, `Kanchan`: max 5, `Pabna`: max 1) and zero execution during restricted blackout timeframes.
4. **Yearly Budget Constraints:** Executing agency expenditure cannot exceed annual funds (e.g., `PWD`: 500 Cr Tk, `LGD`: 1000 Cr Tk). Defer components to the next fiscal year when depleted.
5. **Dynamic Progress Recalculation:**
   $$\text{Remaining\_Duration} = \text{Original\_Duration} \times \frac{100 - \text{Current\_Completion\_Pct}}{100}$$
   Dynamically cascades delays or rollbacks to all downstream dependent components.

---

## 🚀 Tech Stack

- **Backend:** Python FastAPI, SQLAlchemy ORM, SQLite (`smart_city.db`), Pandas, NetworkX, Watchdog (Live DB File Watcher), Google GenAI SDK (`gemini-2.5-flash` with deterministic rule-based fallback).
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Leaflet.js (GIS Map with status markers), Recharts (Planned vs. Projected Timeline & Gantt view).

---

## 💻 Quick Start & Running Locally

### 1. Prerequisites
- Python 3.10+ (Tested on Python 3.15)
- Node.js 18+ and npm

### 2. Run Backend API (FastAPI)
```bash
# Navigate to backend directory
cd backend

# Activate existing virtual environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1
# (or in Windows CMD: venv\Scripts\activate.bat)

# (Optional) If setting up a fresh venv:
# python -m venv venv
# pip install -r requirements.txt

# Start the server on port 8000
python -m uvicorn main:app --reload --port 8000
```
> The backend automatically ingests `/data/*.csv` on first launch and initializes the SQLite database and Live File Watcher.
> API Documentation is live at: `http://localhost:8000/docs`

### 3. Run Frontend (Vite React + TypeScript)
In a separate terminal:
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already installed)
npm install

# Start Vite development server
npm run dev
```
> The frontend is live at: `http://localhost:5173/` (proxies `/api` requests to `http://localhost:8000`).
> In production, `http://localhost:8000/` serves both the backend API and the compiled frontend directly!

---

## 🔑 1-Click Quick Demo Login (Role-Based Workflows)

Click the **Role Switcher** button in the top-right header for instant 1-click access:

1. **Executing Agency Official (`EXEC_LGD` / `EXEC_MOEDU` / `EXEC_PWD`):**
   - Access **DPP & RCPSP Lab** to draft proposals and click **"Suggest Optimal Timeframe"** to test constraint headroom.
   - Access **Agency Progress Desk** to update component completion % and actual cost with live cascade preview.
2. **Approving Agency Official (`ECNEC` / `MOP`):**
   - Access **Approvals Desk** with automatic threshold routing (Projects $\le$ 50 Cr Tk tagged for **MOP**; Projects $>$ 50 Cr Tk tagged for **ECNEC**).
   - 1-click **Approve** (transitions proposal into active project) or **Reject** with audit notes.
3. **Citizen / Public Explorer (`APP`):**
   - Browse the **Civic GIS Map** with status markers (Running, Delayed, Completed, Approved).
   - Search/filter by location, agency, or rating.
   - Submit 1–5 star ratings and post public citizen feedback.
4. **System Administrator (`SYSADMIN`):**
   - Review the **CSV Ingestion & Audit Report** (rows read, loaded, bad rows).
   - Click **"Re-ingest CSVs from /data"** or manual **"Sync & Recalculate DB"**.
   - View and manage system constraints and blackout windows.
5. **AI Urban Advisor (`gemini-2.5-flash`):**
   - Query automated bottleneck reports, citizen feedback summaries, and DPP submission windows.

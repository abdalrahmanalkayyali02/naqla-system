# Naqla System Developer Workspace

Welcome to the **Naqla System Developer Workspace**. This environment is a unified, intelligent development dashboard designed to orchestrate the entire Naqla System architecture seamlessly from a single place.

## 💡 Project Idea & Benefits

Managing microservices, databases, and multi-portal architectures can be complex and error-prone during local development. The Naqla System Developer Workspace solves this by providing a "UI/UX Pro Max" dashboard built with Next.js. 

**Key Benefits:**
- **Centralized Orchestration:** Start, stop, and monitor all your infrastructure and development services with a single click.
- **Hybrid Execution (Local vs. Docker):** Flexibility to run development applications using either full Docker containers or mock/local Node processes depending on your hardware constraints.
- **Zero-Friction Networking:** Includes a pre-configured Nginx reverse proxy so all portals and APIs are uniformly accessible over common ports without CORS headaches.
- **Aesthetic Developer Experience:** A beautiful, glassmorphism-inspired UI with dark mode, vibrant colors, and real-time status indicators.

## 🏗 Architecture

The Naqla System is divided into two primary service groups:

### 1. Infrastructure Services
These are core persistent services managed entirely via Docker Compose:
* **Database (PostgreSQL):** Running on port `5433` (mapped from internal `5432` to avoid host conflicts). Database: `naqla-system`, User: `root`, Password: `naqla-system`.
* **Cache (Redis):** Running on port `6379`. Password: `redis`.
* **Redis Insight:** Visual GUI for Redis running on port `8001`.
* **Nginx Reverse Proxy:** Running on port `8080`, routing all frontend and backend traffic uniformly.

### 2. Development Services
These represent the actual applications you build and run. They can be executed inside Docker or locally.
* **Backend API:** Python/Node API running on port `5000`. (Accessible via `http://localhost:8080/docs`)
* **Frontend Portal:** Main user interface running on port `5012`. (Accessible via `http://localhost:8080/`)
* **Organization Portal:** B2B organizational interface running on port `5013`. (Accessible via `http://localhost:8080/org/`)
* **Participle Portal:** Specialized portal running on port `5014`. (Accessible via `http://localhost:8080/participle/`)

---

## 📂 Project Structure

```text
naqla-system-workspace/
├── dev-dashboard/          # Next.js Application (The Developer UI)
│   ├── src/app/
│   │   ├── api/services/   # Next.js APIs that execute Docker & Shell commands
│   │   ├── globals.css     # Glassmorphism & UI/UX Pro Max design tokens
│   │   └── page.tsx        # The main React Dashboard UI
│   ├── package.json        # Dashboard dependencies
│   └── next.config.ts      # Next.js configuration
├── docker-compose.yml      # Master configuration for all Containers
├── nginx.conf              # Nginx routing logic for the entire system
└── README.md               # Project documentation (You are here!)
```

---

## 🚀 Getting Started

### Prerequisites
* **Docker & Docker Compose** installed and running on your machine.
* **Node.js** (v18+) for running the developer dashboard.

### 1. Launching the Developer Dashboard
Navigate into the dashboard folder, install dependencies, and start the development server:

```bash
cd dev-dashboard
npm install
npm run dev
```

### 2. Managing Services via UI
Open your browser and navigate to: **[http://localhost:3000](http://localhost:3000)**

From the UI, you can:
1. **Run Infra:** Click this button to spin up PostgreSQL, Redis, Redis Insight, and Nginx.
2. **Run Dev Services:** Click this button to spin up the dummy containers for the Backend and Portals.
3. **Run All:** Spin up the entire stack at once.

*Note: Once running, you can click the `Open ↗` button on any card to instantly navigate to that service.*

### 3. Connecting to Redis Insight
When configuring Redis Insight (at `http://localhost:8001`), add the database connection with these exact credentials:
- **Host:** `naqla-redis`
- **Port:** `6379`
- **Password:** `redis`

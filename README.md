# AI SaaS MVP — Business R&D & Builder Assistant

Overview
This is an MVP for an AI SaaS targeted at business owners and founders. It provides:
- Business research & validation assistants
- AI chat agent
- Image and video generation assistant
- Coding and website-building assistant
Core features: AI routing by intent and subscription tier, UPI-style simulated payment flow, subscription plans configurable in a single config, localStorage-based persistence (MVP only).

Not secure for production: Chat history, account, and subscription data are stored in browser localStorage for the MVP. See Security Notes below.

Contents
- plans.json — Global plan config
- backend/ — Node.js + Express API + AI router + provider stubs
- frontend/ — React + Vite UI

Quick start (development)
1. Clone repo
2. Backend
   - cd backend
   - cp .env.example .env and fill values (if integrating real providers)
   - npm install
   - npm run dev (starts server at PORT from .env or 4000)
3. Frontend
   - cd frontend
   - cp .env.example .env
   - npm install
   - npm run dev (starts dev server, default http://localhost:5173)
4. Use the UI:
   - Chat, sign-up/login via modal, try plan purchase (UPI simulation).

Important environment variables
- BACKEND_PORT (default 4000)
- FRONTEND env uses VITE_API_URL set to your backend API URL
- Provider API keys (for production) go in backend .env

Plans configuration
- plans.json is the single config file for all subscription tiers (Free, Premium, Pro, ProMax)
- Modify pricing, limits, and features there; the backend and frontend read it.

Security notes (MUST READ)
- MVP stores user accounts, passwords, and subscriptions in browser localStorage — not secure.
- Passwords are hashed with bcrypt on the backend for demonstration; however the persistent storage is localStorage.
- No CSRF, rate-limiting, audit, or DB encryption is implemented.
- Production must:
  - Use a real database (Postgres, MySQL, MongoDB, etc.)
  - Replace localStorage with server-side storage and secure session/JWT handling
  - Use HTTPS, secrets vault, provider API keys rotation
  - Hard rate-limiting and billing webhooks

How AI routing works (summary)
- Frontend sends prompt + user plan to backend /api/ai/route
- Backend classifier identifies intent category (business/research, education, code, image, video, general)
- AI Router selects provider(s) based on intent and plan (free vs paid) and calls provider module
- Provider modules are currently mocked — swap with real provider SDKs in backend/src/providers

UPI Simulated Payment Flow
- Payment modal shows a list of UPI apps (simulate)
- On "Pay", frontend calls /api/subscription/purchase which returns a payment request id and status "pending"
- The user "confirms" payment in the modal (simulate the UPI app)
- Frontend calls /api/subscription/verify with transactionId to simulate verification
- Backend verifies amount and transaction status then activates subscription and returns expiry

Extending to production
- Replace provider stubs in backend/src/providers with actual provider calls and error handling
- Persist users and subscriptions in DB
- Integrate real payment gateway and webhook verification
- Add rate-limiting, observability, Sentry
- Add webhooks for subscription lifecycle management

License
MIT

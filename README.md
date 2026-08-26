# WebBuilderAi

> An AI-powered, full-stack website builder that lets users describe a website in plain English, generates production-ready HTML/CSS/JS using AI (DeepSeek via OpenRouter), provides a real-time code editor with live preview, and deploys the site to a shareable URL — all within a credit-based monetisation system powered by Stripe.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Data Flow Diagrams](#data-flow-diagrams)
- [Folder Structure](#folder-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Authentication Flow](#authentication-flow)
- [AI Generation Pipeline](#ai-generation-pipeline)
- [Billing & Credits System](#billing--credits-system)
- [Client-Side Architecture](#client-side-architecture)
- [Pages & Routing](#pages--routing)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Credits & Cost Table](#credits--cost-table)

---

## Project Overview

**WebBuilderAi** is a SaaS-style MERN stack application where users can:

1. **Sign in** using Google OAuth (via Firebase Authentication).
2. **Describe** the website they want in natural language.
3. **AI generates** a complete, responsive, single-file HTML website (using DeepSeek model via OpenRouter API).
4. **Edit & iterate** on the generated website through a chat-based interface with a live preview and Monaco code editor.
5. **Deploy** the website to a public URL accessible by anyone.
6. **Manage** all their generated websites from a dashboard.
7. **Purchase credits** via Stripe Checkout to generate more websites.

---

## Key Features

| Feature | Description |
|---|---|
| 🤖 AI Website Generation | Generates full responsive HTML/CSS/JS websites from a text prompt using DeepSeek AI via OpenRouter |
| 💬 Conversational Editing | Chat-based UI to request iterative changes to the generated website |
| 🖥️ Live Preview | Real-time iframe preview of the generated HTML with blob URL rendering |
| ✏️ Code Editor | Monaco Editor integration (VS Code-like) for direct HTML code editing |
| 🚀 One-Click Deploy | Generates a unique slug-based URL and serves the website publicly |
| 🔐 Google OAuth | Firebase-based Google Sign-In with JWT session cookies on the backend |
| 💳 Stripe Payments | Credit purchase system with Stripe Checkout and webhook-based fulfillment |
| 📊 Dashboard | Grid view of all user websites with thumbnail previews, deploy & share buttons |
| 🎨 Premium Dark UI | Glassmorphism, Framer Motion animations, TailwindCSS v4 styling |

---

## Tech Stack

### Frontend (Client)

| Technology | Version | Purpose |
|---|---|---|
| React | 19.2.0 | UI library |
| Vite | 7.3.1 | Build tool & dev server |
| TailwindCSS | 4.1.18 | Utility-first CSS framework |
| React Router DOM | 7.13.0 | Client-side routing |
| Redux Toolkit | 2.11.2 | Global state management (user data) |
| React Redux | 9.2.0 | React bindings for Redux |
| Axios | 1.13.5 | HTTP client for API calls |
| Firebase | 12.9.0 | Google OAuth provider (client-side) |
| Monaco Editor | 4.7.0 | In-browser code editor (VS Code engine) |
| Framer Motion | 12.34.0 | Animations & transitions |
| Lucide React | 0.563.0 | Icon library |

### Backend (Server)

| Technology | Version | Purpose |
|---|---|---|
| Node.js | — | Runtime |
| Express | 5.2.1 | HTTP server framework |
| Mongoose | 9.2.0 | MongoDB ODM |
| JSON Web Token | 9.0.3 | JWT-based session auth |
| Cookie Parser | 1.4.7 | Parse cookies from requests |
| Stripe | 20.3.1 | Payment processing |
| dotenv | 17.2.4 | Environment variable management |
| Nodemon | 3.1.11 | Dev server auto-restart |

### External Services

| Service | Purpose |
|---|---|
| MongoDB Atlas | Cloud database |
| Firebase Auth | Google OAuth identity provider |
| OpenRouter API | AI model gateway (routes to DeepSeek) |
| DeepSeek Chat | LLM used for website code generation |
| Stripe | Payment gateway for credit purchases |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          CLIENT (React + Vite)                          │
│                         http://localhost:5173                            │
│                                                                         │
│  ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌─────────┐ ┌──────────────┐  │
│  │  Home    │ │ Generate  │ │Dashboard │ │ Editor  │ │   Pricing    │  │
│  │  Page    │ │   Page    │ │  Page    │ │  Page   │ │    Page      │  │
│  └────┬─────┘ └─────┬─────┘ └────┬─────┘ └────┬────┘ └──────┬───────┘  │
│       │             │            │             │             │          │
│  ┌────┴─────────────┴────────────┴─────────────┴─────────────┴───────┐  │
│  │                    Redux Store (userSlice)                         │  │
│  │                    ─ userData: { name, email, avatar, credits }    │  │
│  └──────────────────────────────┬────────────────────────────────────┘  │
│                                 │                                       │
│  ┌──────────────────────────────┴────────────────────────────────────┐  │
│  │              Firebase Auth (Google OAuth Provider)                 │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────┬──────────────────────────────────┘
                                       │ Axios HTTP (withCredentials)
                                       │ Cookie: token=<JWT>
                                       ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        SERVER (Express.js)                              │
│                       http://localhost:8000                              │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                      Middleware Layer                              │  │
│  │  ┌──────────┐ ┌────────────┐ ┌──────────────┐ ┌───────────────┐  │  │
│  │  │  CORS    │ │ JSON Body  │ │Cookie Parser │ │  isAuth (JWT) │  │  │
│  │  │  Origin: │ │  Parser    │ │              │ │  Middleware    │  │  │
│  │  │  :5173   │ │            │ │              │ │               │  │  │
│  │  └──────────┘ └────────────┘ └──────────────┘ └───────┬───────┘  │  │
│  └───────────────────────────────────────────────────────┼──────────┘  │
│                                                           │             │
│  ┌───────────────────────────────────────────────────────┼──────────┐  │
│  │                       Route Layer                      │          │  │
│  │                                                        ▼          │  │
│  │  /api/auth/*       → Auth Controller (Google, Logout)             │  │
│  │  /api/user/*       → User Controller (Get Current User)           │  │
│  │  /api/website/*    → Website Controller (Generate, Update,        │  │
│  │                       GetById, GetAll, Deploy, GetBySlug)         │  │
│  │  /api/billing      → Billing Controller (Create Stripe Session)   │  │
│  │  /api/stripe/webhook → Stripe Webhook (Payment Fulfillment)       │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                     Controller Layer                               │  │
│  │                                                                    │  │
│  │  auth.controller.js ──────► JWT sign + set cookie                 │  │
│  │  website.controllers.js ──► OpenRouter API ──► DeepSeek AI        │  │
│  │  billing.controller.js ───► Stripe Checkout Session               │  │
│  │  stripeWebhook.controller.js ► Update user credits + plan         │  │
│  └──────────────────────────────────┬────────────────────────────────┘  │
└─────────────────────────────────────┼──────────────────────────────────┘
                                      │
              ┌───────────────────────┼───────────────────────┐
              ▼                       ▼                       ▼
┌──────────────────┐   ┌──────────────────────┐   ┌────────────────────┐
│   MongoDB Atlas   │   │   OpenRouter API      │   │    Stripe API      │
│                   │   │   (DeepSeek Chat)      │   │                    │
│  Collections:     │   │                        │   │  - Checkout        │
│  ─ users          │   │  POST /v1/chat/        │   │    Sessions        │
│  ─ websites       │   │    completions         │   │  - Webhooks        │
│                   │   │  Model: deepseek/      │   │  - Payment         │
│                   │   │    deepseek-chat       │   │    Fulfillment     │
└──────────────────┘   └──────────────────────┘   └────────────────────┘
```

---

## Data Flow Diagrams

### 1. Website Generation Flow

```
User (Client)                    Server                        OpenRouter/DeepSeek
     │                              │                                │
     │  POST /api/website/generate  │                                │
     │  { prompt: "..." }           │                                │
     │ ────────────────────────────►│                                │
     │                              │  Check user credits ≥ 50      │
     │                              │  Build masterPrompt            │
     │                              │  + user prompt                 │
     │                              │                                │
     │                              │  POST /v1/chat/completions     │
     │                              │ ──────────────────────────────►│
     │                              │                                │
     │                              │  { message, code } (raw JSON)  │
     │                              │ ◄──────────────────────────────│
     │                              │                                │
     │                              │  extractJson() → parse         │
     │                              │  Retry up to 2x if parse fails │
     │                              │                                │
     │                              │  Website.create({              │
     │                              │    user, title, latestCode,    │
     │                              │    conversation })             │
     │                              │  user.credits -= 50            │
     │                              │                                │
     │  { websiteId,                │                                │
     │    remainingCredits }        │                                │
     │ ◄────────────────────────────│                                │
     │                              │                                │
     │  navigate(`/editor/${id}`)   │                                │
```

### 2. Conversational Update Flow

```
User (Editor Page)              Server                        OpenRouter/DeepSeek
     │                              │                                │
     │  POST /api/website/update/:id│                                │
     │  { prompt: "change..." }     │                                │
     │ ────────────────────────────►│                                │
     │                              │  Check user credits ≥ 25      │
     │                              │  Build updatePrompt with       │
     │                              │  current website.latestCode    │
     │                              │                                │
     │                              │  POST /v1/chat/completions     │
     │                              │ ──────────────────────────────►│
     │                              │                                │
     │                              │  { message, code }             │
     │                              │ ◄──────────────────────────────│
     │                              │                                │
     │                              │  Push to conversation[]        │
     │                              │  Update latestCode             │
     │                              │  user.credits -= 25            │
     │                              │                                │
     │  { message, code,            │                                │
     │    remainingCredits }        │                                │
     │ ◄────────────────────────────│                                │
```

### 3. Authentication Flow

```
User (Browser)          Firebase         Server              MongoDB
     │                     │                │                    │
     │  Click "Continue    │                │                    │
     │  with Google"       │                │                    │
     │ ───────────────────►│                │                    │
     │                     │                │                    │
     │  Google OAuth Popup │                │                    │
     │  returns user info  │                │                    │
     │ ◄───────────────────│                │                    │
     │                     │                │                    │
     │  POST /api/auth/google              │                    │
     │  { name, email, avatar }            │                    │
     │ ───────────────────────────────────►│                    │
     │                                     │  findOne({email})  │
     │                                     │ ──────────────────►│
     │                                     │                    │
     │                                     │  If not found:     │
     │                                     │  User.create()     │
     │                                     │ ──────────────────►│
     │                                     │                    │
     │                                     │  JWT.sign({id})    │
     │                                     │  Set cookie:       │
     │                                     │  token=<JWT>       │
     │                                     │  (7 days, secure,  │
     │                                     │   SameSite=none)   │
     │                                     │                    │
     │  Set-Cookie: token=<JWT>            │                    │
     │  Response: user object              │                    │
     │ ◄───────────────────────────────────│                    │
     │                                     │                    │
     │  Redux: dispatch(setUserData(user)) │                    │
```

### 4. Payment / Billing Flow

```
User (Pricing Page)         Server               Stripe              MongoDB
     │                         │                    │                    │
     │  POST /api/billing      │                    │                    │
     │  { planType: "pro" }    │                    │                    │
     │ ───────────────────────►│                    │                    │
     │                         │  Validate plan     │                    │
     │                         │  Create Checkout   │                    │
     │                         │  Session           │                    │
     │                         │ ──────────────────►│                    │
     │                         │                    │                    │
     │                         │  { session.url }   │                    │
     │                         │ ◄──────────────────│                    │
     │                         │                    │                    │
     │  { sessionUrl }         │                    │                    │
     │ ◄───────────────────────│                    │                    │
     │                         │                    │                    │
     │  window.location =      │                    │                    │
     │  session.url            │                    │                    │
     │ ───────────────────────────────────────────►│                    │
     │                         │                    │                    │
     │  (User pays on Stripe)  │                    │                    │
     │                         │                    │                    │
     │                         │  Webhook Event:    │                    │
     │                         │  checkout.session   │                    │
     │                         │  .completed         │                    │
     │                         │ ◄──────────────────│                    │
     │                         │                    │                    │
     │                         │  User.findById     │                    │
     │                         │  AndUpdate({       │                    │
     │                         │   $inc: {credits}, │                    │
     │                         │   plan })          │                    │
     │                         │ ──────────────────────────────────────►│
     │                         │                    │                    │
     │  Redirect to /          │                    │                    │
     │ ◄──────────────────────────────────────────│                    │
```

---

## Folder Structure

```
websiteBuilder/
├── README.md
├── client/                           # Frontend (React + Vite)
│   ├── .env                          # VITE_FIREBASE_API_KEY
│   ├── index.html                    # HTML entry point
│   ├── package.json                  # Client dependencies
│   ├── vite.config.js                # Vite config with React plugin
│   └── src/
│       ├── main.jsx                  # React entry, Redux Provider wrap
│       ├── App.jsx                   # Router setup, route definitions
│       ├── firebase.js               # Firebase app init, auth & provider exports
│       ├── index.css                 # Global styles (TailwindCSS import)
│       ├── components/
│       │   └── LoginModal.jsx        # Google OAuth login modal with animations
│       ├── hooks/
│       │   └── useGetCurrentUser.jsx # Custom hook: fetch logged-in user on mount
│       ├── pages/
│       │   ├── Home.jsx              # Landing page with hero, features, CTA
│       │   ├── Generate.jsx          # Prompt input + progress bar for AI generation
│       │   ├── Dashboard.jsx         # Grid of user's websites with deploy/share
│       │   ├── Editor.jsx            # Split-pane editor: chat + live preview + Monaco
│       │   ├── LiveSite.jsx          # Public page rendering deployed website via slug
│       │   └── Pricing.jsx           # Three-tier pricing cards with Stripe checkout
│       └── redux/
│           ├── store.js              # Redux store configuration
│           └── userSlice.js          # User state slice (userData)
│
└── server/                           # Backend (Express.js)
    ├── .env                          # All secrets (see Environment Variables)
    ├── index.js                      # Express app entry, middleware, route mounting
    ├── package.json                  # Server dependencies
    ├── config/
    │   ├── db.js                     # MongoDB connection via Mongoose
    │   ├── openRouter.js             # OpenRouter API wrapper (DeepSeek chat)
    │   ├── plan.js                   # Plan definitions (free/pro/enterprise)
    │   └── stripe.js                 # Stripe SDK initialization
    ├── controllers/
    │   ├── auth.controller.js        # Google auth: find/create user, JWT, cookie
    │   ├── user.controllers.js       # Get current authenticated user
    │   ├── website.controllers.js    # Generate, update, get, deploy website logic
    │   ├── billing.controller.js     # Create Stripe Checkout session
    │   └── stripeWebhook.controller.js # Handle Stripe webhook, update credits
    ├── middlewares/
    │   └── isAuth.js                 # JWT verification middleware
    ├── models/
    │   ├── user.model.js             # Mongoose User schema
    │   └── website.model.js          # Mongoose Website schema (with messages)
    ├── routes/
    │   ├── auth.routes.js            # POST /google, GET /logout
    │   ├── user.routes.js            # GET /me (protected)
    │   ├── website.routes.js         # All website CRUD + deploy routes
    │   └── billing.routes.js         # POST / (protected)
    └── utils/
        └── extractJson.js            # Utility to extract JSON from AI response text
```

---

## Database Schema

### User Collection (`users`)

```javascript
{
  _id: ObjectId,
  name: String,                    // Required — from Google profile
  email: String,                   // Required, Unique — from Google profile
  avatar: String,                  // Optional — Google profile photo URL
  credits: Number,                 // Default: 100, Min: 0
  plan: String,                    // Enum: ["free", "pro", "enterprise"], Default: "free"
  createdAt: Date,                 // Auto (timestamps)
  updatedAt: Date                  // Auto (timestamps)
}
```

### Website Collection (`websites`)

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref → User),    // Required — owner of the website
  title: String,                   // Default: "Untitled Website" — first 60 chars of prompt
  latestCode: String,              // Required — full HTML document (latest version)
  conversation: [                  // Array of chat messages
    {
      role: String,                // Enum: ["ai", "user"]
      content: String,             // Message text
      createdAt: Date,
      updatedAt: Date
    }
  ],
  deployed: Boolean,               // Default: false
  deployUrl: String,               // e.g., "http://localhost:5173/site/mysitename1a2b3"
  slug: String,                    // Unique, sparse — URL-safe identifier
  createdAt: Date,                 // Auto (timestamps)
  updatedAt: Date                  // Auto (timestamps)
}
```

**Relationships:**
```
User (1) ──────────────< (Many) Website
  │                          │
  │  _id ◄────────── user   │
  │                          │
  │  credits consumed ◄──── generate (−50) / update (−25)
```

---

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/google` | ❌ | Login/register with Google. Body: `{ name, email, avatar }`. Sets JWT cookie. Returns user object. |
| `GET` | `/api/auth/logout` | ❌ | Clears the `token` cookie. |

### User (`/api/user`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/user/me` | ✅ | Returns the currently authenticated user object (decoded from JWT cookie). |

### Website (`/api/website`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/website/generate` | ✅ | Generate a new website. Body: `{ prompt }`. Costs **50 credits**. Returns `{ websiteId, remainingCredits }`. |
| `POST` | `/api/website/update/:id` | ✅ | Update an existing website via AI. Body: `{ prompt }`. Costs **25 credits**. Returns `{ message, code, remainingCredits }`. |
| `GET` | `/api/website/get-by-id/:id` | ✅ | Get full website document (code + conversation) by MongoDB ID. |
| `GET` | `/api/website/get-all` | ✅ | Get all websites belonging to the authenticated user. |
| `GET` | `/api/website/deploy/:id` | ✅ | Deploy a website: generates a slug, sets `deployed=true`, returns `{ url }`. |
| `GET` | `/api/website/get-by-slug/:slug` | ❌ | Public endpoint. Fetch deployed website by slug for live rendering. |

### Billing (`/api/billing`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/billing` | ✅ | Create a Stripe Checkout session. Body: `{ planType: "pro" | "enterprise" }`. Returns `{ sessionUrl }`. |

### Stripe Webhook (`/api/stripe/webhook`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/stripe/webhook` | ❌ (Stripe signature) | Handles `checkout.session.completed` events. Updates user credits and plan. Uses `express.raw()` body parser. |

---

## Authentication Flow

1. **Client-Side**: User clicks "Continue with Google" → Firebase `signInWithPopup()` opens Google consent screen → returns `{ displayName, email, photoURL }`.
2. **API Call**: Client sends `POST /api/auth/google` with `{ name, email, avatar }`.
3. **Server**: Finds or creates user in MongoDB. Signs a JWT (`{ id: user._id }`, expires in 7 days). Sets it as an HTTP cookie (`token`, secure, SameSite=none).
4. **Subsequent Requests**: Every API call includes the cookie. The `isAuth` middleware decodes the JWT, looks up the user via `User.findById(decoded.id)`, and attaches `req.user`.
5. **Session Restore**: On every page load, `useGetCurrentUser` hook calls `GET /api/user/me` with credentials to restore the Redux `userData` state.

---

## AI Generation Pipeline

### Model Configuration

| Parameter | Value |
|---|---|
| Provider | OpenRouter API (`https://openrouter.ai/api/v1/chat/completions`) |
| Model | `deepseek/deepseek-chat` |
| Temperature | `0.2` (low creativity, high consistency) |
| Max Tokens | `12000` |
| System Prompt | `"You must return ONLY valid raw JSON."` |

### Master Prompt Strategy

The `masterPrompt` in `website.controllers.js` is a ~200-line detailed instruction set that tells the AI to act as a **Principal Frontend Architect**. Key instructions include:

- Generate a **single HTML file** with one `<style>` and one `<script>` tag
- **No frameworks, no libraries, no external resources**
- Fully **responsive** (mobile-first, 3 breakpoints)
- **SPA-style navigation** with JavaScript page switching
- Must include pages: Home, About, Services/Features, Contact
- Use **Unsplash images** with specific query parameters
- Must be **iframe `srcdoc` compatible**
- Output format: raw JSON `{ "message": "...", "code": "<html>...</html>" }`

### Retry Logic

The AI response is parsed using `extractJson()`, which:
1. Strips markdown code fences (` ```json `)
2. Finds the first `{` and last `}` to extract JSON
3. Calls `JSON.parse()`

If parsing fails, the system **retries up to 2 times** with an appended instruction: `"RETURN ONLY RAW JSON."`.

### Update (Conversational Edit) Prompt

For updates, the server builds a new prompt containing:
- The full current HTML code (`website.latestCode`)
- The user's change request
- The same JSON output format requirement

---

## Billing & Credits System

### Plans

| Plan | Price (INR) | Credits | Plan Key |
|------|-------------|---------|----------|
| Free | ₹0 | 100 | `free` |
| Pro | ₹499 | 500 | `pro` |
| Enterprise | ₹1,499 | 1,000 | `enterprise` |

### Credit Costs

| Action | Credits Consumed |
|--------|-----------------|
| Generate a new website | 50 |
| Update/edit existing website | 25 |

### Payment Flow

1. User clicks a plan on the Pricing page → `POST /api/billing` with `{ planType }`.
2. Server creates a **Stripe Checkout Session** (one-time payment, INR currency).
3. Session metadata includes `userId`, `credits`, and `plan`.
4. User is redirected to Stripe's hosted checkout page.
5. On successful payment, Stripe fires a `checkout.session.completed` webhook.
6. The webhook handler reads metadata and calls `User.findByIdAndUpdate(userId, { $inc: { credits }, plan })`.
7. User is redirected back to the app.

---

## Client-Side Architecture

### State Management

```
Redux Store
└── user (userSlice)
    └── userData: null | {
          _id, name, email, avatar, credits, plan, createdAt, updatedAt
        }
```

- **`setUserData`**: Only reducer. Sets the entire user object or null.
- **`useGetCurrentUser`**: Custom hook that runs on app mount, calls `GET /api/user/me`, and dispatches `setUserData`.

### Component Hierarchy

```
<Provider store={store}>              ← Redux Provider
  <BrowserRouter>                     ← React Router
    <App>                             ← Route definitions + useGetCurrentUser()
      ├── <Home />                    ← Landing page (public)
      │   └── <LoginModal />          ← Google OAuth modal
      ├── <Generate />                ← AI prompt page (protected)
      ├── <Dashboard />               ← Website grid (protected)
      ├── <WebsiteEditor />           ← Editor + preview (protected)
      │   ├── Chat Sidebar            ← Conversation messages
      │   ├── <iframe>                ← Live HTML preview (blob URL)
      │   └── <Editor /> (Monaco)     ← Code editor panel (slide-in)
      ├── <LiveSite />                ← Public deployed site (public)
      └── <Pricing />                 ← Plans + Stripe checkout (public)
    </App>
  </BrowserRouter>
</Provider>
```

### Key Technical Details

| Feature | Implementation |
|---|---|
| Live Preview Rendering | `new Blob([code], { type: "text/html" })` → `URL.createObjectURL(blob)` → set as iframe `src` |
| Full-Screen Preview | Uses iframe `srcDoc` attribute directly |
| Code Editor | Monaco Editor (`@monaco-editor/react`) with `vs-dark` theme, `html` language |
| Route Protection | Conditional rendering: `userData ? <ProtectedPage/> : <Home/>` |
| Animations | Framer Motion (`motion/react`): page transitions, slide-in panels, hover effects |
| Loading States | Simulated progress bar with phased messages during AI generation (~8-12 min wait) |

---

## Pages & Routing

| Path | Component | Auth Required | Description |
|------|-----------|---------------|-------------|
| `/` | `Home` | ❌ | Landing page with hero section, feature showcase, login CTA |
| `/generate` | `Generate` | ✅ | Textarea prompt input + progress bar + "Generate Website" button |
| `/dashboard` | `Dashboard` | ✅ | Grid of user's websites with iframe thumbnails, deploy & share |
| `/editor/:id` | `WebsiteEditor` | ✅ | Split-pane: chat sidebar + live preview + Monaco editor + deploy |
| `/site/:slug` | `LiveSite` | ❌ | Full-screen iframe rendering the deployed website by slug |
| `/pricing` | `Pricing` | ❌ | Three pricing cards with Stripe Checkout integration |

---

## Environment Variables

### Client (`client/.env`)

```env
VITE_FIREBASE_API_KEY=<your-firebase-api-key>
```

### Server (`server/.env`)

```env
MONGODB_URL=<your-mongodb-atlas-connection-string>
JWT_SECRET=<your-jwt-secret>
OPENROUTER_API_KEY=<your-openrouter-api-key>
STRIPE_SECRET_KEY=<your-stripe-secret-key>
STRIPE_WEBHOOK_SECRET=<your-stripe-webhook-signing-secret>
FRONTEND_URL=http://localhost:5173
PORT=8000
```

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account
- Firebase project with Google Auth enabled
- OpenRouter API key (with DeepSeek access)
- Stripe account with webhook configured

### Installation

```bash
# Clone the repository
git clone https://github.com/chopadeyash/WebBuild.git
cd WebBuild

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Running Locally

```bash
# Terminal 1 — Start the server
cd server
npm run dev          # Runs on http://localhost:8000

# Terminal 2 — Start the client
cd client
npm run dev          # Runs on http://localhost:5173
```

### Stripe Webhook (Local Dev)

```bash
# Install Stripe CLI and forward webhooks
stripe listen --forward-to localhost:8000/api/stripe/webhook
```

---

## Credits & Cost Table

| User Action | Credit Cost | Where It Happens |
|---|---|---|
| Sign up (new user) | +100 (free) | `user.model.js` default |
| Buy Pro plan | +500 | Stripe webhook → `$inc` |
| Buy Enterprise plan | +1,000 | Stripe webhook → `$inc` |
| Generate new website | −50 | `website.controllers.js` → `generateWebsite()` |
| Edit/update website | −25 | `website.controllers.js` → `changes()` |

---

## License

This project is for educational purposes.

---

*Built with ❤️ using the MERN Stack + AI*
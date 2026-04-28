# AI Life Manager

A full-stack, mobile-first web application that intelligently plans your day based on energy levels, task priority, and habits.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| State | Zustand |
| Auth | Firebase Authentication |
| Database | Firebase Firestore |
| Charts | Chart.js + react-chartjs-2 |
| Hosting | Vercel (frontend) + Firebase (backend) |

## Project Structure

```
ai-life-manager/
├── app/                        # Next.js App Router pages
│   ├── auth/
│   │   ├── login/page.tsx      # Login (email + Google)
│   │   └── signup/page.tsx     # Registration with sample data seed
│   ├── dashboard/page.tsx      # Main dashboard
│   ├── tasks/page.tsx          # Task manager
│   ├── energy/page.tsx         # Energy tracker
│   ├── habits/page.tsx         # Habits & health
│   ├── profile/page.tsx        # Settings & profile
│   ├── layout.tsx              # Root layout with AuthProvider
│   └── globals.css             # Global styles
│
├── components/
│   ├── layout/
│   │   ├── AuthProvider.tsx    # Firebase auth context + route guard
│   │   └── BottomNav.tsx       # Mobile bottom navigation
│   ├── ui/
│   │   ├── EnergySelector.tsx  # Low/Medium/High energy picker
│   │   └── Tag.tsx             # Category, energy, priority badges
│   ├── dashboard/
│   │   ├── BestTaskCard.tsx    # AI "best task now" suggestion
│   │   └── Timeline.tsx        # Daily schedule timeline
│   ├── tasks/
│   │   ├── TaskItem.tsx        # Individual task row
│   │   └── AddTaskModal.tsx    # Slide-up add task form
│   ├── energy/
│   │   └── EnergyChart.tsx     # Weekly energy Chart.js graph
│   └── habits/                 # (extend with HabitChart etc.)
│
├── lib/
│   ├── firebase.ts             # Firebase app init
│   ├── firestore.ts            # All Firestore CRUD operations
│   ├── ai-engine.ts            # Rule-based AI logic
│   └── sample-data.ts          # Seed data for new users
│
├── store/
│   └── app-store.ts            # Zustand global state
│
├── types/
│   └── index.ts                # All TypeScript interfaces
│
├── firestore.rules             # Firestore security rules
├── firestore.indexes.json      # Composite indexes
└── .env.local.example          # Environment variables template
```

## Setup Instructions

### 1. Clone and install

```bash
git clone <your-repo>
cd ai-life-manager
npm install
```

### 2. Create Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add Project** → name it "ai-life-manager"
3. Enable **Google Analytics** (optional)
4. In the project, go to **Build → Authentication**
   - Click **Get Started**
   - Enable **Email/Password** provider
   - Enable **Google** provider (add your domain later)
5. Go to **Build → Firestore Database**
   - Click **Create database**
   - Choose **Start in production mode**
   - Select your region (e.g. `us-east1`)
6. Go to **Project Settings → Your Apps**
   - Click **Add app → Web**
   - Register the app, copy the config object

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Firebase config values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 4. Deploy Firestore security rules

```bash
npm install -g firebase-tools
firebase login
firebase init firestore   # select your project
firebase deploy --only firestore:rules,firestore:indexes
```

Or paste the contents of `firestore.rules` into the Firestore Console → Rules tab.

### 5. Run locally

```bash
npm run dev
# Open http://localhost:3000
```

## Deployment to Vercel

### Option A: Vercel CLI

```bash
npm install -g vercel
vercel
# Follow prompts, add env vars when asked
```

### Option B: GitHub + Vercel Dashboard

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repo
4. Add all `NEXT_PUBLIC_FIREBASE_*` environment variables
5. Click **Deploy**

### After deployment: add your domain to Firebase

1. Firebase Console → Authentication → Settings → Authorized domains
2. Add your Vercel domain (e.g. `ai-life-manager.vercel.app`)

## AI Logic — How It Works

The AI scoring engine in `lib/ai-engine.ts` is fully rule-based and explainable:

```
Task Score = Priority Weight + Energy Match + Deadline Urgency + Context Bonus

Priority:     High=30, Medium=15, Low=0
Energy match: Perfect match=40, Partial=10-20, Mismatch=-10
Deadline:     Overdue=50, Today=35, 3 days=20, This week=10
Context:      In-progress=25, Short tasks when tired=+10
```

**No black box** — users always understand *why* a task is recommended.

## Extending the App

### Add OpenAI integration

In `lib/ai-engine.ts`, replace `getBestTask()` with an API call:

```typescript
// app/api/recommend/route.ts
import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { tasks, energy, context } = await req.json();
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{
      role: "system",
      content: "You are a productivity coach. Given the user's energy level and task list, recommend the best task to work on now and explain why in 1-2 sentences."
    }, {
      role: "user",
      content: JSON.stringify({ tasks, energy, context })
    }]
  });
  return Response.json({ recommendation: completion.choices[0].message.content });
}
```

### Add push notifications

Use Firebase Cloud Messaging (FCM) for habit reminders and energy check-in nudges.

### Add weekly report generation

Create a Firestore Cloud Function that runs every Sunday, aggregates the week's data, and stores a report document.

## Sample Data

New users are automatically seeded with:
- 8 sample tasks across all categories (work, study, health, personal)
- 5 default habits (water, breakfast, stretch, sleep, no-screens)

## Firestore Data Model

```
users/{uid}
  - displayName, email, streak, preferredWorkStart/End
  - darkMode, smartNotifications, weeklyReport

tasks/{taskId}
  - userId, name, category, priority, energyRequired
  - estimatedMinutes, status, notes, deadline, subtasks[]

energyLogs/{logId}
  - userId, date (YYYY-MM-DD), period (morning|afternoon|evening), level

habits/{habitId}
  - userId, name, icon, category, reminderTime, active

habitLogs/{logId}
  - userId, habitId, date (YYYY-MM-DD), done
```

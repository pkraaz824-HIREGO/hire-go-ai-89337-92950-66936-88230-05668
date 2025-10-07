# HireGoai Project Structure

## 📁 Folder Organization

This project follows a clean separation between frontend and backend code:

### Frontend (`src/`)
All React components, pages, and UI code
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn UI components (buttons, cards, etc.)
│   └── interview/      # Interview-specific components
├── pages/              # Route pages
│   ├── candidate/      # Candidate-facing pages
│   ├── employer/       # Employer-facing pages
│   └── *.tsx          # Shared pages (Landing, Auth, etc.)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── integrations/       # External service integrations
    └── supabase/       # Supabase client configuration
```

### Backend (`supabase/`)
All database schemas, policies, and serverless functions
```
supabase/
├── migrations/         # Database schema migrations
│   └── *.sql          # SQL migration files
└── functions/         # Edge Functions (serverless backend)
    └── */             # Individual function folders
```

## 🎨 Design System

The app uses a comprehensive 3D design system with:
- **Clean backgrounds**: Subtle gradients and proper contrast
- **Bold typography**: All headings and important text use bold fonts
- **3D effects**: Cards have depth with shadows and hover effects
- **Semantic tokens**: Colors defined in `src/index.css` and `tailwind.config.ts`

### Design Features:
- Enhanced 3D card shadows with inset effects
- Smooth transitions and transform effects
- Gradient buttons with glow effects
- Interactive tab navigation with 3D styling
- Responsive layouts for all screen sizes

## 🗄️ Database Schema

### Tables:
1. **profiles** - User profile information (candidate/employer)
2. **jobs** - Job postings from employers
3. **applications** - Candidate applications to jobs
4. **interviews** - Scheduled interviews
5. **candidate_skills** - Candidate skill sets

All tables have Row Level Security (RLS) enabled with appropriate policies.

## 🎯 Key Features

### For Candidates:
- Dashboard with tabbed navigation
- AI-powered job matching
- Application tracking
- Interview management
- Profile completion tracking

### For Employers:
- Advanced candidate search
- Job pipeline management
- Interview scheduling
- Hiring analytics
- AI candidate recommendations

## 🚀 Getting Started

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Backend is automatically configured via Lovable Cloud

## 📦 Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + Shadcn UI
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Auth**: Supabase Auth with auto-confirm
- **State**: React Query for server state

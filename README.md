# Next.js Todo Application

A clean and modern Todo application built with Next.js, TypeScript, Tailwind CSS, Prisma, and SQLite.

> 🚀 **Next Generation Vision**: This application is designed to evolve into an enterprise-grade task management and data integration platform. See our [comprehensive development plan](docs/EXECUTIVE_SUMMARY.md) inspired by Palantir Technologies' strategic approach.

## Features

- ✅ Add new tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Delete tasks
- ✅ Separate views for active and completed tasks
- ✅ Clean, modern UI with smooth animations
- ✅ Fully responsive design
- ✅ **Database persistence with Prisma and SQLite**

## Getting Started

First, install the dependencies:

```bash
npm install
```

Set up the database:

```bash
npx prisma migrate dev
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build for Production

```bash
npm run build
npm start
```

## Technologies Used

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- **Prisma 7.2** (ORM)
- **SQLite** (Database)
- ESLint

## Project Structure

```
app/
├── api/
│   └── todos/
│       ├── route.ts              # GET and POST endpoints
│       └── [id]/
│           └── route.ts          # PATCH and DELETE endpoints
├── components/
│   ├── TodoList.tsx              # Main todo list component with API integration
│   ├── TodoItem.tsx              # Individual todo item component
│   └── TodoInput.tsx             # Input form for adding new todos
├── layout.tsx                    # Root layout
├── page.tsx                      # Home page
└── globals.css                   # Global styles
lib/
└── prisma.ts                     # Prisma client singleton
prisma/
├── schema.prisma                 # Database schema
└── migrations/                   # Database migrations
```

## Database Schema

```prisma
model Todo {
  id        Int      @id @default(autoincrement())
  text      String
  completed Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

## API Endpoints

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `PATCH /api/todos/[id]` - Update a todo (toggle completed)
- `DELETE /api/todos/[id]` - Delete a todo

## Strategic Development Plan 📋

This project includes a comprehensive 3-year development roadmap to transform this Todo app into an enterprise-grade platform:

### Planning Documents

- 📊 **[Executive Summary](docs/EXECUTIVE_SUMMARY.md)** - High-level strategic overview and vision
- 📖 **[System Development Plan](docs/SYSTEM_DEVELOPMENT_PLAN.md)** - Comprehensive development strategy (Japanese)
- 🏗️ **[Architecture Overview](docs/ARCHITECTURE.md)** - Technical architecture and system design
- 🗓️ **[Phase 1 Roadmap](docs/PHASE1_ROADMAP.md)** - Detailed implementation plan for Q1 2026

### Strategic Vision

Inspired by Palantir Technologies' evolution from a government-focused tool to a universal enterprise AI platform, this roadmap outlines:

1. **Four Core Modules** (inspired by Gotham, Foundry, Apollo, AIP):
   - **TaskCore** - Data integration layer
   - **CollabFoundry** - Collaboration platform with ontology
   - **CloudRelay** - Multi-cloud deployment automation
   - **SmartAgent** - AI-driven automation with LLM integration

2. **Six Development Phases** (2026-2028):
   - Phase 1: Multi-user foundation (Q1 2026)
   - Phase 2: External tool integrations (Q2 2026)
   - Phase 3-4: Enterprise collaboration & cloud-native (2026-2027)
   - Phase 5-6: AI agents & ecosystem (2027-2028)

3. **Business Model**: Freemium + Enterprise SaaS
   - Target: ¥1B ARR by 2028
   - Focus: Japanese market with strategic partnerships

### Key Differentiators

- 🇯🇵 Japan-first approach with legacy system integration
- 🤖 Agentic AI with Human-in-the-Loop safety
- 🔒 Ethical AI principles (transparency, auditability)
- 🌐 Multi-cloud deployment (AWS, Azure, GCP, on-premise)

For more details, start with the [Executive Summary](docs/EXECUTIVE_SUMMARY.md).

## License

This project is licensed under the MIT License.

# Next.js Todo Application

A clean and modern Todo application built with Next.js, TypeScript, Tailwind CSS, Prisma, and SQLite.

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

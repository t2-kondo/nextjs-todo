# Next.js Todo Application

A clean and modern Todo application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- ✅ Add new tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Delete tasks
- ✅ Separate views for active and completed tasks
- ✅ Clean, modern UI with smooth animations
- ✅ Fully responsive design

## Getting Started

First, install the dependencies:

```bash
npm install
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
- ESLint

## Project Structure

```
app/
├── components/
│   ├── TodoList.tsx    # Main todo list component with state management
│   ├── TodoItem.tsx    # Individual todo item component
│   └── TodoInput.tsx   # Input form for adding new todos
├── layout.tsx          # Root layout
├── page.tsx            # Home page
└── globals.css         # Global styles
```

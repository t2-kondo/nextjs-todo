import { TodoList } from './components/TodoList';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <TodoList />
    </main>
  );
}

import Sidebar from './components/Sidebar/Sidebar';
import AppRouter from './routes/AppRouter';

export default function App() {
  return (
    <div className="relative w-screen h-screen bg-gray-100">
      <Sidebar />
      <AppRouter />
    </div>
  );
}

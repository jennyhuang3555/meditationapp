import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ManageExercises from './pages/ManageExercises';
import BottomNav from './components/BottomNav';
import SchedulePage from './pages/SchedulePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <main className="container mx-auto px-4 py-8 pb-24">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/manage" element={<ManageExercises />} />
            <Route path="/schedule" element={<SchedulePage />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App; 
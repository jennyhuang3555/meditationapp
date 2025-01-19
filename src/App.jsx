import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/manage" element={<div>Manage Exercises</div>} />
            <Route path="/schedule" element={<div>Schedule Page</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 
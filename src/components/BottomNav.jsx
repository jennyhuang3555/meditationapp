import { Link, useLocation } from 'react-router-dom';

function BottomNav() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'text-blue-500' : 'text-gray-500';
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-around py-4">
          <Link
            to="/"
            className={`flex flex-col items-center ${isActive('/')}`}
          >
            <span className="text-sm">Home</span>
          </Link>
          <Link
            to="/manage"
            className={`flex flex-col items-center ${isActive('/manage')}`}
          >
            <span className="text-sm">Manage Exercises</span>
          </Link>
          <Link
            to="/schedule"
            className={`flex flex-col items-center ${isActive('/schedule')}`}
          >
            <span className="text-sm">Schedule</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BottomNav; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { getMessaging, getToken } from 'firebase/messaging';
import HomePage from './pages/HomePage';
import ManageExercises from './pages/ManageExercises';
import BottomNav from './components/BottomNav';
import SchedulePage from './pages/SchedulePage';

function App() {
  useEffect(() => {
    const requestNotificationPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          // Get FCM token
          const messaging = getMessaging();
          const token = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
          });
          
          console.log('FCM Token:', token);
          // You might want to save this token to your database
          // to send notifications to this specific device
        } else {
          console.log('Notification permission denied');
        }
      } catch (error) {
        console.error('Error requesting permission:', error);
      }
    };

    requestNotificationPermission();
  }, []);

  return (
    <Router>
      <div className="min-h-screen">
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
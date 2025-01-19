import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

function HomePage() {
  const [upcomingExercises, setUpcomingExercises] = useState([]);

  const fetchSchedule = async () => {
    try {
      const today = new Date();
      const currentDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][today.getDay()];
      const currentTime = today.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

      const querySnapshot = await getDocs(
        query(collection(db, 'schedules'),
        orderBy('time', 'asc'))
      );

      const scheduleList = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(schedule => schedule.days.includes(currentDay))
        .sort((a, b) => {
          if (a.time < currentTime && b.time > currentTime) return 1;
          if (a.time > currentTime && b.time < currentTime) return -1;
          return a.time.localeCompare(b.time);
        });

      setUpcomingExercises(scheduleList);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchSchedule, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      fetchSchedule();
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        handleFocus();
      }
    });

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-light text-gray-700 mb-2">Your Meditation Journey</h1>
        <p className="text-gray-500">Today's peaceful moments await</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {upcomingExercises.map((schedule, index) => (
          <div 
            key={schedule.id}
            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105"
            style={{
              borderLeft: `4px solid ${
                schedule.time < new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
                  ? '#CBD5E1'  // past exercises
                  : '#93C5FD'  // upcoming exercises
              }`
            }}
          >
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <span className="text-sm font-medium text-blue-400">
                  {schedule.time}
                </span>
              </div>
              
              <h3 className="text-2xl font-light text-gray-700 mb-2">
                {schedule.exerciseName}
              </h3>
              
              <div className="flex-grow">
                <div className="flex flex-wrap gap-2 mt-2">
                  {schedule.days.map(day => (
                    <span 
                      key={day}
                      className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-600"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {upcomingExercises.length === 0 && (
          <div className="col-span-2 text-center py-12 bg-white rounded-2xl shadow-sm">
            <p className="text-gray-500 mb-4">No meditation exercises scheduled for today</p>
            <Link
              to="/schedule"
              className="inline-block px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              Schedule Your First Session
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage; 
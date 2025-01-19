import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

function HomePage() {
  const [weeklySchedule, setWeeklySchedule] = useState([]);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'schedules'));
        const scheduleList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setWeeklySchedule(scheduleList);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };

    fetchSchedule();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Weekly Meditation Schedule</h1>
        <Link
          to="/schedule"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Assign Exercises
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        {weeklySchedule.map((schedule, index) => (
          <div 
            key={index}
            className="mb-4 p-4 border-b last:border-b-0 flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold text-lg text-gray-800">{schedule.day}</h3>
              <p className="text-gray-600">{schedule.exercise}</p>
            </div>
            <span className="text-gray-500">{schedule.time}</span>
          </div>
        ))}
        
        {weeklySchedule.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No exercises scheduled. Click "Assign Exercises" to get started!
          </p>
        )}
      </div>
    </div>
  );
}

export default HomePage; 
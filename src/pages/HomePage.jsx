import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy, getDoc, doc } from 'firebase/firestore';

function HomePage() {
  const [upcomingExercises, setUpcomingExercises] = useState([]);

  const fetchSchedule = async () => {
    try {
      const today = new Date();
      const currentDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][today.getDay()];
      console.log('Current day:', currentDay);
      
      // First get all exercises
      const exercisesSnapshot = await getDocs(collection(db, 'exercises'));
      const exercisesMap = {};
      exercisesSnapshot.docs.forEach(doc => {
        exercisesMap[doc.id] = {
          id: doc.id,
          ...doc.data()
        };
      });
      console.log('Exercises map:', exercisesMap);

      // Then get all schedules
      const schedulesSnapshot = await getDocs(collection(db, 'schedules'));
      console.log('Raw schedules:', schedulesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      
      const scheduleList = [];

      schedulesSnapshot.docs.forEach(scheduleDoc => {
        const scheduleData = scheduleDoc.data();
        console.log('Processing schedule:', scheduleData);
        console.log('Exercise ID:', scheduleData.exerciseId);
        console.log('Found exercise:', exercisesMap[scheduleData.exerciseId]);
        console.log('Days include current day?', scheduleData.days.includes(currentDay));
        
        const exercise = exercisesMap[scheduleData.exerciseId];
        
        if (exercise && scheduleData.days.includes(currentDay)) {
          scheduleList.push({
            id: scheduleDoc.id,
            ...scheduleData,
            exerciseName: exercise.name,
            description: exercise.description,
            duration: exercise.duration
          });
        }
      });

      // Sort by time
      const sortedSchedules = scheduleList.sort((a, b) => a.time.localeCompare(b.time));
      console.log('Final sorted schedules:', sortedSchedules);
      setUpcomingExercises(sortedSchedules);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    }
  };

  // Add useEffect to refetch when component mounts or when navigating back
  useEffect(() => {
    fetchSchedule();
  }, []);

  // Add useEffect to refetch periodically
  useEffect(() => {
    const interval = setInterval(fetchSchedule, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Add useEffect to refetch when the page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchSchedule();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', fetchSchedule);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', fetchSchedule);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-light text-gray-900 mb-2">Your Meditation Journey</h1>
        <p className="text-gray-600">Today's peaceful moments await</p>
      </div>

      <div className="grid gap-6">
        {upcomingExercises.map((schedule) => (
          <div 
            key={schedule.id}
            className="card p-6 transition-all duration-300 hover:scale-105"
          >
            <div className="flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-light text-gray-900">
                  {schedule.exerciseName}
                </h3>
                <span className="text-lg font-medium text-purple-600">
                  {schedule.time}
                </span>
              </div>
              
              <p className="text-gray-500 mb-2">Duration: {schedule.duration} minutes</p>
              
              <div className="text-gray-600 whitespace-pre-wrap mb-4">
                {schedule.description?.split('•').map((point, i) => 
                  point.trim() && (
                    <div key={i} className={`${i > 0 ? 'ml-4' : ''} mb-2`}>
                      {i > 0 ? '• ' : ''}{point.trim()}
                    </div>
                  )
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {schedule.days.map(day => (
                  <span 
                    key={day}
                    className="px-3 py-1 text-sm rounded-full bg-purple-50 text-purple-600"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

        {upcomingExercises.length === 0 && (
          <div className="card p-8 text-center">
            <p className="text-gray-500 mb-4">No upcoming meditation exercises scheduled</p>
            <Link
              to="/schedule"
              className="gradient-button inline-block"
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
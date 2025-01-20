import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  getDocs,
  query,
  where,
  updateDoc,
  doc
} from 'firebase/firestore';
import { getMessaging, getToken } from 'firebase/messaging';

function SchedulePage() {
  const [exercises, setExercises] = useState([]);
  const [schedules, setSchedules] = useState({});
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    days: [],
    time: ''
  });

  // Add FCM token state
  const [fcmToken, setFcmToken] = useState(null);

  // Update the VAPID key to use environment variable
  const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

  // Add permission request when component mounts
  useEffect(() => {
    const requestPermissionAndToken = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const messaging = getMessaging();
          const token = await getToken(messaging, {
            vapidKey: VAPID_KEY
          });
          setFcmToken(token);
          console.log('FCM Token obtained:', token);
        } else {
          console.log('Notification permission denied');
          alert('Please enable notifications to set exercise schedules');
        }
      } catch (error) {
        console.error('Error requesting permission:', error);
      }
    };

    requestPermissionAndToken();
  }, []);

  // Fetch exercises and schedules from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch exercises
        const exercisesSnapshot = await getDocs(collection(db, 'exercises'));
        const exerciseList = exercisesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setExercises(exerciseList);

        // Fetch schedules
        const schedulesSnapshot = await getDocs(collection(db, 'schedules'));
        const schedulesData = {};
        schedulesSnapshot.docs.forEach(doc => {
          const data = doc.data();
          schedulesData[data.exerciseId] = {
            days: data.days,
            time: data.time
          };
        });
        setSchedules(schedulesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleExerciseSelect = (exercise) => {
    setSelectedExercise(exercise);
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setScheduleForm(prev => ({
        ...prev,
        days: checked
          ? [...prev.days, value]
          : prev.days.filter(day => day !== value)
      }));
    } else {
      setScheduleForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // If no FCM token, try requesting permission again
      if (!fcmToken) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const messaging = getMessaging();
          const token = await getToken(messaging, {
            vapidKey: VAPID_KEY
          });
          setFcmToken(token);
        } else {
          throw new Error('Notification permission is required to set schedules. Please enable notifications and try again.');
        }
      }

      const scheduleData = {
        exerciseId: selectedExercise.id,
        exerciseName: selectedExercise.name,
        days: scheduleForm.days,
        time: scheduleForm.time,
        fcmToken: fcmToken
      };

      // Check if schedule already exists
      const schedulesRef = collection(db, 'schedules');
      const q = query(schedulesRef, 
        where('exerciseId', '==', selectedExercise.id)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Update existing schedule
        const scheduleDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, 'schedules', scheduleDoc.id), scheduleData);
      } else {
        // Create new schedule
        await addDoc(collection(db, 'schedules'), scheduleData);
      }

      // After successful save
      setShowForm(false);
      setScheduleForm({ days: [], time: '' });
      setSelectedExercise(null);
      
      // Force refresh homepage data
      window.dispatchEvent(new Event('schedule-updated'));
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('Error saving schedule: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-light text-gray-900 mb-6">Schedule Exercises</h1>

      {/* Exercise List */}
      <div className="card p-8 mb-8">
        <h2 className="text-2xl font-light text-gray-700 mb-6">Select an Exercise</h2>
        <div className="grid gap-4">
          {exercises.map(exercise => (
            <button
              key={exercise.id}
              onClick={() => handleExerciseSelect(exercise)}
              className="text-left p-6 border border-purple-100 rounded-lg hover:bg-purple-50 transition-all duration-300 hover:scale-105"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-light text-gray-700 mb-2">{exercise.name}</h3>
                  <p className="text-gray-500">Duration: {exercise.duration} minutes</p>
                </div>
                {schedules[exercise.id] && (
                  <div className="text-right text-sm text-purple-600">
                    <p>Days: {schedules[exercise.id].days.join(', ')}</p>
                    <p>Time: {schedules[exercise.id].time}</p>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Scheduling Form */}
      {showForm && selectedExercise && (
        <div className="card p-8">
          <h2 className="text-2xl font-light text-gray-700 mb-6">
            Schedule "{selectedExercise.name}"
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-600 mb-4">
                Days of Week
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {daysOfWeek.map(day => (
                  <label
                    key={day}
                    className="flex items-center p-3 border border-purple-100 rounded-lg hover:bg-purple-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name="days"
                      value={day}
                      checked={scheduleForm.days.includes(day)}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-purple-600 rounded border-purple-300 focus:ring-purple-200"
                    />
                    <span className="ml-2 text-gray-600">{day}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-gray-600 mb-2" htmlFor="time">
                Time
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={scheduleForm.time}
                onChange={handleInputChange}
                className="w-full p-3 border border-purple-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
                required
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setSelectedExercise(null);
                }}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`gradient-button ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Saving...' : 'Save Schedule'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default SchedulePage; 
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  getDocs,
  query,
  where 
} from 'firebase/firestore';

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
    if (scheduleForm.days.length === 0) {
      alert('Please select at least one day');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'schedules'), {
        exerciseId: selectedExercise.id,
        exerciseName: selectedExercise.name,
        days: scheduleForm.days,
        time: scheduleForm.time,
        createdAt: new Date(),
        userId: 'default'
      });

      // Update local schedules state
      setSchedules(prev => ({
        ...prev,
        [selectedExercise.id]: {
          days: scheduleForm.days,
          time: scheduleForm.time
        }
      }));

      setShowForm(false);
      setSelectedExercise(null);
      setScheduleForm({ days: [], time: '' });
      alert('Schedule saved successfully!');
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Schedule Exercises</h1>

      {/* Exercise List */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Select an Exercise</h2>
        <div className="grid gap-4">
          {exercises.map(exercise => (
            <button
              key={exercise.id}
              onClick={() => handleExerciseSelect(exercise)}
              className="text-left p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{exercise.name}</h3>
                  <p className="text-gray-600">Duration: {exercise.duration} minutes</p>
                </div>
                {schedules[exercise.id] && (
                  <div className="text-right text-sm text-gray-600">
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
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Schedule "{selectedExercise.name}"
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Days of Week
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {daysOfWeek.map(day => (
                  <label
                    key={day}
                    className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      name="days"
                      value={day}
                      checked={scheduleForm.days.includes(day)}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-500 rounded"
                    />
                    <span>{day}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="time">
                Time
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={scheduleForm.time}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
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
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`${
                  isSubmitting 
                    ? 'bg-blue-300' 
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white px-4 py-2 rounded-lg`}
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
import React, { useState } from 'react';

function SchedulePage() {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    days: [],
    time: ''
  });

  // We'll replace this with Firebase data later
  const exercises = [
    { id: 1, name: 'Mindfulness Breathing', duration: 10 },
    { id: 2, name: 'Body Scan', duration: 15 },
    { id: 3, name: 'Walking Meditation', duration: 20 }
  ];

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here we'll add Firebase integration later
    console.log({
      exercise: selectedExercise,
      ...scheduleForm
    });
    
    // Reset form
    setShowForm(false);
    setSelectedExercise(null);
    setScheduleForm({ days: [], time: '' });
  };

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
              <h3 className="font-semibold">{exercise.name}</h3>
              <p className="text-gray-600">Duration: {exercise.duration} minutes</p>
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
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Save Schedule
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default SchedulePage; 
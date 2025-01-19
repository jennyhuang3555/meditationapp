import React, { useState } from 'react';

function ManageExercises() {
  const [exercises, setExercises] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingExercise) {
      // Update existing exercise
      setExercises(prev => prev.map(ex => 
        ex.id === editingExercise.id ? { ...formData, id: ex.id } : ex
      ));
    } else {
      // Add new exercise
      setExercises(prev => [...prev, { ...formData, id: Date.now() }]);
    }
    resetForm();
  };

  const handleEdit = (exercise) => {
    setFormData(exercise);
    setEditingExercise(exercise);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    setExercises(prev => prev.filter(ex => ex.id !== id));
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', duration: '' });
    setEditingExercise(null);
    setIsFormOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Exercises</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Add Exercise
        </button>
      </div>

      {/* Exercise Form */}
      {isFormOpen && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="name">
                Exercise Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                rows="3"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="duration">
                Duration (minutes)
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                {editingExercise ? 'Update Exercise' : 'Add Exercise'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Exercise List */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {exercises.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No exercises added yet. Click "Add Exercise" to get started!
          </p>
        ) : (
          exercises.map(exercise => (
            <div
              key={exercise.id}
              className="mb-4 p-4 border-b last:border-b-0"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {exercise.name}
                  </h3>
                  <p className="text-gray-600 mt-1">{exercise.description}</p>
                  <p className="text-gray-500 mt-1">
                    Duration: {exercise.duration} minutes
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(exercise)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exercise.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ManageExercises; 
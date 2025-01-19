import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc 
} from 'firebase/firestore';

function ManageExercises() {
  const [exercises, setExercises] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    description: ''
  });

  // Fetch exercises from Firebase
  useEffect(() => {
    console.log('Fetching exercises...');
    const fetchExercises = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'exercises'));
        const exerciseList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log('Fetched exercises:', exerciseList);
        setExercises(exerciseList);
      } catch (error) {
        console.error('Error fetching exercises:', error);
        alert('Error fetching exercises: ' + error.message);
      }
    };

    fetchExercises();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log('Input changed:', name, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting exercise:', formData);
    
    try {
      if (!formData.name || !formData.duration || !formData.description) {
        alert('Please fill in all fields');
        return;
      }

      const exerciseData = {
        ...formData,
        duration: parseInt(formData.duration, 10)
      };
      
      if (editingExercise) {
        // Update existing exercise
        await updateDoc(doc(db, 'exercises', editingExercise.id), exerciseData);
        console.log('Exercise updated');
      } else {
        // Add new exercise
        await addDoc(collection(db, 'exercises'), exerciseData);
        console.log('Exercise added');
      }

      // Refresh exercises list
      const querySnapshot = await getDocs(collection(db, 'exercises'));
      const exerciseList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setExercises(exerciseList);
      
      // Reset form
      setFormData({ name: '', duration: '', description: '' });
      setIsFormOpen(false);
      setEditingExercise(null);
      
      alert(editingExercise ? 'Exercise updated successfully!' : 'Exercise added successfully!');
    } catch (error) {
      console.error('Error saving exercise:', error);
      alert('Error saving exercise: ' + error.message);
    }
  };

  const handleEdit = (exercise) => {
    setEditingExercise(exercise);
    setFormData({
      name: exercise.name,
      duration: exercise.duration.toString(),
      description: exercise.description
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this exercise?')) {
      try {
        await deleteDoc(doc(db, 'exercises', id));
        console.log('Exercise deleted');
        
        // Refresh exercises list
        const querySnapshot = await getDocs(collection(db, 'exercises'));
        const exerciseList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setExercises(exerciseList);
        
        alert('Exercise deleted successfully!');
      } catch (error) {
        console.error('Error deleting exercise:', error);
        alert('Error deleting exercise: ' + error.message);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Exercises</h1>
        <button
          onClick={() => {
            setEditingExercise(null);
            setFormData({ name: '', duration: '', description: '' });
            setIsFormOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Add Exercise
        </button>
      </div>

      {/* Display existing exercises */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Current Exercises</h2>
        {exercises.length === 0 ? (
          <p className="text-gray-500">No exercises added yet.</p>
        ) : (
          <div className="grid gap-4">
            {exercises.map(exercise => (
              <div 
                key={exercise.id}
                className="bg-white p-4 rounded-lg shadow flex justify-between items-start"
              >
                <div>
                  <h3 className="font-semibold">{exercise.name}</h3>
                  <p className="text-gray-600">Duration: {exercise.duration} minutes</p>
                  <p className="text-gray-600">{exercise.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(exercise)}
                    className="text-blue-500 hover:text-blue-700 px-3 py-1 rounded border border-blue-500 hover:border-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exercise.id)}
                    className="text-red-500 hover:text-red-700 px-3 py-1 rounded border border-red-500 hover:border-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Exercise Form */}
      {isFormOpen && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingExercise ? 'Edit Exercise' : 'Add New Exercise'}
          </h2>
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
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  setFormData({ name: '', duration: '', description: '' });
                  setEditingExercise(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                {editingExercise ? 'Update Exercise' : 'Save Exercise'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ManageExercises; 
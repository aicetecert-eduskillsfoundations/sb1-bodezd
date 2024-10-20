import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2 } from 'lucide-react';
import ClassForm from './ClassForm';
import BatchList from './BatchList';

interface Class {
  id: number;
  className: string;
  batches: Batch[];
}

interface Batch {
  id: number;
  batchName: string;
  projectName: string;
  projectLink: string;
}

const ClassManagement: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [showClassForm, setShowClassForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get<Class[]>('http://localhost:3000/api/classes');
      setClasses(response.data);
      setError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error fetching classes:', errorMessage);
      setError('Failed to fetch classes. Using local data.');
      // Fallback to local data
      setClasses([
        { id: 1, className: 'Sample Class', batches: [] }
      ]);
    }
  };

  const handleAddClass = async (newClass: Omit<Class, 'id'>) => {
    try {
      const response = await axios.post<Class>('http://localhost:3000/api/classes', newClass);
      setClasses([...classes, response.data]);
      setShowClassForm(false);
      setError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error adding class:', errorMessage);
      setError('Failed to add class. Using local data.');
      // Fallback to local data
      const newId = classes.length > 0 ? Math.max(...classes.map(c => c.id)) + 1 : 1;
      const newClassWithId = { ...newClass, id: newId, batches: [] };
      setClasses([...classes, newClassWithId as Class]);
      setShowClassForm(false);
    }
  };

  const handleDeleteClass = async () => {
    if (!selectedClass) return;
    try {
      await axios.delete(`http://localhost:3000/api/classes/${selectedClass.id}`);
      setClasses(classes.filter(c => c.id !== selectedClass.id));
      setSelectedClass(null);
      setError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error deleting class:', errorMessage);
      setError('Failed to delete class. Using local data.');
      // Fallback to local data
      setClasses(classes.filter(c => c.id !== selectedClass.id));
      setSelectedClass(null);
    }
  };

  const handleAddBatch = async (classId: number) => {
    try {
      const response = await axios.post<Batch>(`http://localhost:3000/api/classes/${classId}/batches`, {
        batchName: `Batch ${selectedClass?.batches.length! + 1}`,
        projectName: '',
        projectLink: ''
      });
      const updatedClass = { ...selectedClass!, batches: [...selectedClass!.batches, response.data] };
      setSelectedClass(updatedClass);
      setClasses(classes.map(c => c.id === classId ? updatedClass : c));
      setError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error adding batch:', errorMessage);
      setError('Failed to add batch. Using local data.');
      // Fallback to local data
      const newBatch: Batch = {
        id: selectedClass!.batches.length + 1,
        batchName: `Batch ${selectedClass?.batches.length! + 1}`,
        projectName: '',
        projectLink: ''
      };
      const updatedClass = { ...selectedClass!, batches: [...selectedClass!.batches, newBatch] };
      setSelectedClass(updatedClass);
      setClasses(classes.map(c => c.id === classId ? updatedClass : c));
    }
  };

  const handleUpdateBatch = async (classId: number, batchId: number, updatedBatch: Partial<Batch>) => {
    try {
      const response = await axios.put<Batch>(`http://localhost:3000/api/classes/${classId}/batches/${batchId}`, updatedBatch);
      const updatedBatches = selectedClass!.batches.map(b => b.id === batchId ? response.data : b);
      const updatedClass = { ...selectedClass!, batches: updatedBatches };
      setSelectedClass(updatedClass);
      setClasses(classes.map(c => c.id === classId ? updatedClass : c));
      setError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error updating batch:', errorMessage);
      setError('Failed to update batch. Using local data.');
      // Fallback to local data
      const updatedBatches = selectedClass!.batches.map(b => b.id === batchId ? { ...b, ...updatedBatch } : b);
      const updatedClass = { ...selectedClass!, batches: updatedBatches };
      setSelectedClass(updatedClass);
      setClasses(classes.map(c => c.id === classId ? updatedClass : c));
    }
  };

  const handleDeleteBatch = async (classId: number, batchId: number) => {
    try {
      await axios.delete(`http://localhost:3000/api/classes/${classId}/batches/${batchId}`);
      const updatedBatches = selectedClass!.batches.filter(b => b.id !== batchId);
      const updatedClass = { ...selectedClass!, batches: updatedBatches };
      setSelectedClass(updatedClass);
      setClasses(classes.map(c => c.id === classId ? updatedClass : c));
      setError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error deleting batch:', errorMessage);
      setError('Failed to delete batch. Using local data.');
      // Fallback to local data
      const updatedBatches = selectedClass!.batches.filter(b => b.id !== batchId);
      const updatedClass = { ...selectedClass!, batches: updatedBatches };
      setSelectedClass(updatedClass);
      setClasses(classes.map(c => c.id === classId ? updatedClass : c));
    }
  };

  return (
    <div>
      {error && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
          onClick={() => setShowClassForm(true)}
        >
          <Plus className="mr-2" /> Add Class
        </button>
        <select
          className="border p-2 rounded"
          value={selectedClass?.id || ''}
          onChange={(e) => setSelectedClass(classes.find(c => c.id === Number(e.target.value)) || null)}
        >
          <option value="">-- Select a class --</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.className}</option>
          ))}
        </select>
        {selectedClass && (
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center"
            onClick={handleDeleteClass}
          >
            <Trash2 className="mr-2" /> Delete Class
          </button>
        )}
      </div>

      {showClassForm && (
        <ClassForm onSubmit={handleAddClass} onCancel={() => setShowClassForm(false)} />
      )}

      {selectedClass && (
        <BatchList
          batches={selectedClass.batches}
          onAddBatch={() => handleAddBatch(selectedClass.id)}
          onUpdateBatch={(batchId, updatedBatch) => handleUpdateBatch(selectedClass.id, batchId, updatedBatch)}
          onDeleteBatch={(batchId) => handleDeleteBatch(selectedClass.id, batchId)}
        />
      )}
    </div>
  );
};

export default ClassManagement;
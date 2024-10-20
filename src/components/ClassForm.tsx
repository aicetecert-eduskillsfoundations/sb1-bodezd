import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ClassFormProps {
  onSubmit: (newClass: { className: string; batches: { batchName: string }[] }) => void;
  onCancel: () => void;
}

const ClassForm: React.FC<ClassFormProps> = ({ onSubmit, onCancel }) => {
  const [className, setClassName] = useState('');
  const [batchCount, setBatchCount] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newClass = {
      className,
      batches: Array.from({ length: batchCount }, (_, i) => ({ batchName: `Batch ${i + 1}` }))
    };
    onSubmit(newClass);
  };

  return (
    <div className="bg-white p-4 rounded shadow-md mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Add a New Class</h2>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <X />
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="className" className="block mb-2">Class Name:</label>
          <input
            type="text"
            id="className"
            className="border p-2 w-full rounded"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="batchCount" className="block mb-2">Number of Batches:</label>
          <input
            type="number"
            id="batchCount"
            className="border p-2 w-full rounded"
            value={batchCount}
            onChange={(e) => setBatchCount(Number(e.target.value))}
            min="1"
            required
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Save Class
        </button>
      </form>
    </div>
  );
};

export default ClassForm;
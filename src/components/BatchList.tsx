import React from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';

interface Batch {
  id: number;
  batchName: string;
  projectName: string;
  projectLink: string;
}

interface BatchListProps {
  batches: Batch[];
  onAddBatch: () => void;
  onUpdateBatch: (batchId: number, updatedBatch: Partial<Batch>) => void;
  onDeleteBatch: (batchId: number) => void;
}

const BatchList: React.FC<BatchListProps> = ({ batches, onAddBatch, onUpdateBatch, onDeleteBatch }) => {
  return (
    <div className="bg-white p-4 rounded shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Batches for the selected class</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
          onClick={onAddBatch}
        >
          <Plus className="mr-2" /> Add Batch
        </button>
      </div>
      {batches.map((batch) => (
        <div key={batch.id} className="mb-4 p-4 border rounded">
          <h5 className="font-medium mb-2">{batch.batchName}</h5>
          <input
            type="text"
            className="border p-2 w-full mb-2 rounded"
            placeholder="Project Name"
            value={batch.projectName}
            onChange={(e) => onUpdateBatch(batch.id, { projectName: e.target.value })}
          />
          <input
            type="text"
            className="border p-2 w-full mb-2 rounded"
            placeholder="Project Link"
            value={batch.projectLink}
            onChange={(e) => onUpdateBatch(batch.id, { projectLink: e.target.value })}
          />
          <div className="flex justify-end">
            <button
              className="icon-btn mr-2"
              onClick={() => onUpdateBatch(batch.id, { projectName: batch.projectName, projectLink: batch.projectLink })}
            >
              <Save />
            </button>
            <button
              className="icon-btn"
              onClick={() => onDeleteBatch(batch.id)}
            >
              <Trash2 />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BatchList;
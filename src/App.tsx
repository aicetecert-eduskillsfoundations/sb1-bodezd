import React from 'react';
import Navbar from './components/Navbar';
import ClassManagement from './components/ClassManagement';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4">
        <ClassManagement />
      </div>
    </div>
  );
}

export default App;
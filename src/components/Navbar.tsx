import React from 'react';
import { GraduationCap } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-[#f0806c] p-4 flex justify-between items-center">
      <div className="flex items-center">
        <GraduationCap className="w-8 h-8 text-white mr-2" />
        <h1 className="text-white text-xl font-semibold">My College</h1>
      </div>
    </nav>
  );
};

export default Navbar;
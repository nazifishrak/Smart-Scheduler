import React from 'react';
import { X } from 'lucide-react';
import Timeline from './Timeline';
import { Task } from '../types';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, tasks }) => {
  return (
    <div
      className={`fixed inset-y-0 right-0 w-full bg-white shadow-lg transform ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } transition-transform duration-300 ease-in-out z-50 overflow-y-auto`}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">AI Timeline</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>
        <Timeline tasks={tasks} />
      </div>
    </div>
  );
};

export default Drawer;

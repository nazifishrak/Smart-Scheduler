import React, { useState } from 'react';
import { CheckCircle, Circle, Edit2, X, Trash2 } from 'lucide-react';
import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onEditTask: (editedTask: Task) => void;
  onClearCompleted: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleTask, onEditTask, onClearCompleted }) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      onEditTask(editingTask);
      setEditingTask(null);
    }
  };

  const handleEditCancel = () => {
    setEditingTask(null);
  };

  return (
    <div className="space-y-4">
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center justify-between p-3 bg-white rounded-lg shadow"
          >
            {editingTask && editingTask.id === task.id ? (
              <form onSubmit={handleEditSubmit} className="w-full flex items-center space-x-2">
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  className="flex-grow px-2 py-1 border rounded"
                />
                <input
                  type="number"
                  value={editingTask.priority}
                  min="1"
                  max="10"
                  onChange={(e) => setEditingTask({ ...editingTask, priority: Number(e.target.value) })}
                  className="w-16 px-2 py-1 border rounded"
                />
                <input
                  type="number"
                  value={editingTask.estimatedTime}
                  min="1"
                  onChange={(e) => setEditingTask({ ...editingTask, estimatedTime: Number(e.target.value) })}
                  className="w-20 px-2 py-1 border rounded"
                />
                <button type="submit" className="p-1 bg-green-500 text-white rounded">Save</button>
                <button type="button" onClick={handleEditCancel} className="p-1 bg-red-500 text-white rounded"><X size={16} /></button>
              </form>
            ) : (
              <>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className="focus:outline-none"
                  >
                    {task.completed ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <Circle className="h-6 w-6 text-gray-400" />
                    )}
                  </button>
                  <span className={task.completed ? 'line-through text-gray-500' : ''}>
                    {task.title}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>Priority: {task.priority}</span>
                  <span>Est. Time: {task.estimatedTime}m</span>
                  <button
                    onClick={() => handleEditClick(task)}
                    className="p-1 bg-blue-500 text-white rounded"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      {tasks.some(task => task.completed) && (
        <button
          onClick={onClearCompleted}
          className="flex items-center justify-center w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300"
        >
          <Trash2 className="mr-2 h-5 w-5" />
          Clear Completed Tasks
        </button>
      )}
    </div>
  );
};

export default TaskList;
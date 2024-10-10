import React, { useState, useEffect } from 'react';
import { Task } from './types';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Drawer from './components/Drawer';
import { ListTodo, Calendar } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (newTask: Task) => {
    setTasks([...tasks, newTask]);
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleEditTask = (editedTask: Task) => {
    setTasks(tasks.map(task =>
      task.id === editedTask.id ? editedTask : task
    ));
  };

  const handleClearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <ListTodo className="mr-2 h-8 w-8 text-blue-500" />
            AI-Driven Todo App
          </h1>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
          >
            <Calendar className="mr-2 h-5 w-5" />
            View Timeline
          </button>
        </header>
        <div className="space-y-6">
          <TaskForm onAddTask={handleAddTask} />
          <TaskList
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onEditTask={handleEditTask}
            onClearCompleted={handleClearCompleted}
          />
        </div>
      </div>
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} tasks={tasks} />
    </div>
  );
}

export default App;
'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, TrashIcon, CheckIcon } from '@heroicons/react/24/outline';

// Types
interface Task {
  id: string;
  content: string;
  completed: boolean;
  createdAt: Date;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

const TaskTracker = () => {
  // Initial columns
  const initialColumns: Column[] = [
    {
      id: 'todo',
      title: 'To Do',
      tasks: []
    },
    {
      id: 'inProgress',
      title: 'In Progress',
      tasks: []
    },
    {
      id: 'done',
      title: 'Done',
      tasks: []
    }
  ];
  
  // State
  const [columns, setColumns] = useState<Column[]>(() => {
    // Load from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('taskColumns');
      return saved ? JSON.parse(saved) : initialColumns;
    }
    return initialColumns;
  });
  
  const [newTask, setNewTask] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  
  // Save to localStorage whenever columns change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('taskColumns', JSON.stringify(columns));
    }
  }, [columns]);
  
  // Handle drag end
  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    
    // Drop outside droppable area
    if (!destination) return;
    
    // Drop in same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;
    
    // Find the task being dragged
    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);
    const task = sourceColumn?.tasks.find(t => t.id === draggableId);
    
    if (!task) return;
    
    // Create new columns array
    const newColumns = columns.map(column => {
      // Remove from source
      if (column.id === source.droppableId) {
        return {
          ...column,
          tasks: column.tasks.filter(t => t.id !== draggableId)
        };
      }
      
      // Add to destination
      if (column.id === destination.droppableId) {
        const newTasks = Array.from(column.tasks);
        newTasks.splice(destination.index, 0, task);
        return {
          ...column,
          tasks: newTasks
        };
      }
      
      return column;
    });
    
    setColumns(newColumns);
  };
  
  // Add new task
  const handleAddTask = () => {
    if (!newTask.trim()) return;
    
    const task: Task = {
      id: Date.now().toString(),
      content: newTask.trim(),
      completed: false,
      createdAt: new Date()
    };
    
    const newColumns = columns.map(column => {
      if (column.id === 'todo') {
        return {
          ...column,
          tasks: [...column.tasks, task]
        };
      }
      return column;
    });
    
    setColumns(newColumns);
    setNewTask('');
    setShowAddTask(false);
  };
  
  // Toggle task completion
  const toggleTaskCompletion = (taskId: string) => {
    const newColumns = columns.map(column => ({
      ...column,
      tasks: column.tasks.map(task =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      )
    }));
    
    setColumns(newColumns);
  };
  
  // Delete task
  const deleteTask = (taskId: string) => {
    const newColumns = columns.map(column => ({
      ...column,
      tasks: column.tasks.filter(task => task.id !== taskId)
    }));
    
    setColumns(newColumns);
  };
  
  return (
    <motion.div 
      className="glass dark:glass-dark rounded-2xl p-8 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Task Tracker</h2>
        <button
          onClick={() => setShowAddTask(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-lavender text-white rounded-full hover:bg-lavender-dark transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Task</span>
        </button>
      </div>
      
      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddTask && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-darkbg rounded-lg p-6 w-full max-w-md"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h3 className="text-xl font-semibold mb-4">Add New Task</h3>
              <textarea
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter task description..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800 mb-4"
                rows={3}
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddTask(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTask}
                  className="px-4 py-2 bg-lavender text-white rounded-md"
                >
                  Add Task
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Task Columns */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map(column => (
            <div key={column.id} className="flex flex-col">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
                {column.title}
              </h3>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex-1 min-h-[200px] bg-white/50 dark:bg-darkbg/50 rounded-lg p-4"
                  >
                    <AnimatePresence>
                      {column.tasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <motion.div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              className="bg-white dark:bg-darkbg rounded-lg p-4 mb-3 shadow-sm"
                              onDragStart={(e: MouseEvent | TouchEvent | PointerEvent) => {
                                // Handle drag start if needed
                              }}
                            >
                              <div className="flex items-start space-x-3">
                                <button
                                  onClick={() => toggleTaskCompletion(task.id)}
                                  className={`mt-1 p-1 rounded-full ${
                                    task.completed
                                      ? 'bg-lavender text-white'
                                      : 'border border-gray-300 dark:border-gray-700'
                                  }`}
                                >
                                  <CheckIcon className="w-4 h-4" />
                                </button>
                                <div className="flex-1">
                                  <p className={`text-gray-800 dark:text-white ${
                                    task.completed ? 'line-through text-gray-500' : ''
                                  }`}>
                                    {task.content}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {new Date(task.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <button
                                  onClick={() => deleteTask(task.id)}
                                  className="p-1 text-red-500 hover:text-red-600"
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </Draggable>
                      ))}
                    </AnimatePresence>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </motion.div>
  );
};

export default TaskTracker; 
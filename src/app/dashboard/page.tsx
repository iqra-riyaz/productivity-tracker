'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import PomodoroTimer from '@/components/PomodoroTimer';
import TaskTracker from '@/components/TaskTracker';
import Analytics from '@/components/Analytics';
import { ClockIcon, ClipboardIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'timer' | 'tasks' | 'analytics'>('timer');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-light/20 to-skyblue-light/20 dark:from-darkbg dark:to-darkbg/80">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Productivity Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your focus time, manage tasks, and monitor your progress
          </p>
        </motion.div>
        
        {/* Navigation Tabs */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('timer')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all ${
              activeTab === 'timer'
                ? 'bg-lavender text-white shadow-md'
                : 'bg-white/50 dark:bg-darkbg/50 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-darkbg/80'
            }`}
          >
            <ClockIcon className="w-5 h-5" />
            <span>Pomodoro Timer</span>
          </button>
          
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all ${
              activeTab === 'tasks'
                ? 'bg-skyblue text-white shadow-md'
                : 'bg-white/50 dark:bg-darkbg/50 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-darkbg/80'
            }`}
          >
            <ClipboardIcon className="w-5 h-5" />
            <span>Task Tracker</span>
          </button>
          
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all ${
              activeTab === 'analytics'
                ? 'bg-mint text-white shadow-md'
                : 'bg-white/50 dark:bg-darkbg/50 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-darkbg/80'
            }`}
          >
            <ChartBarIcon className="w-5 h-5" />
            <span>Analytics</span>
          </button>
        </div>
        
        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'timer' && <PomodoroTimer />}
          {activeTab === 'tasks' && <TaskTracker />}
          {activeTab === 'analytics' && <Analytics />}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard; 
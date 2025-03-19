'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { ClockIcon, CheckCircleIcon, ChartBarIcon } from '@heroicons/react/24/outline';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Types
interface DailyStats {
  date: string;
  pomodoros: number;
  tasks: number;
  focusTime: number; // in minutes
}

interface WeeklyStats {
  pomodoros: number;
  tasks: number;
  focusTime: number;
}

const Analytics = () => {
  // State
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats>({
    pomodoros: 0,
    tasks: 0,
    focusTime: 0
  });
  
  // Load data from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load daily stats
      const savedDailyStats = localStorage.getItem('dailyStats');
      if (savedDailyStats) {
        setDailyStats(JSON.parse(savedDailyStats));
      }
      
      // Load weekly stats
      const savedWeeklyStats = localStorage.getItem('weeklyStats');
      if (savedWeeklyStats) {
        setWeeklyStats(JSON.parse(savedWeeklyStats));
      }
    }
  }, []);
  
  // Prepare data for charts
  const lineChartData = {
    labels: dailyStats.map(stat => stat.date),
    datasets: [
      {
        label: 'Focus Time (minutes)',
        data: dailyStats.map(stat => stat.focusTime),
        borderColor: '#9370DB',
        backgroundColor: 'rgba(147, 112, 219, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };
  
  const doughnutChartData = {
    labels: ['Completed Tasks', 'Remaining Tasks'],
    datasets: [
      {
        data: [weeklyStats.tasks, 0], // You might want to track remaining tasks
        backgroundColor: ['#9370DB', '#E5E7EB'],
        borderWidth: 0
      }
    ]
  };
  
  // Chart options
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };
  
  const doughnutChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      }
    },
    cutout: '70%'
  };
  
  return (
    <motion.div 
      className="glass dark:glass-dark rounded-2xl p-8 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex items-center space-x-2 mb-8">
        <ChartBarIcon className="w-6 h-6 text-lavender" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Analytics</h2>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/50 dark:bg-darkbg/50 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-lavender/10 rounded-full">
              <ClockIcon className="w-6 h-6 text-lavender" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Focus Time</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {weeklyStats.focusTime} min
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/50 dark:bg-darkbg/50 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-skyblue/10 rounded-full">
              <CheckCircleIcon className="w-6 h-6 text-skyblue" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed Tasks</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {weeklyStats.tasks}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/50 dark:bg-darkbg/50 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-mint/10 rounded-full">
              <ChartBarIcon className="w-6 h-6 text-mint" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pomodoros</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {weeklyStats.pomodoros}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Focus Time Chart */}
        <div className="bg-white/50 dark:bg-darkbg/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Daily Focus Time
          </h3>
          <div className="h-[300px]">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>
        
        {/* Task Completion Chart */}
        <div className="bg-white/50 dark:bg-darkbg/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Task Completion
          </h3>
          <div className="h-[300px]">
            <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
          </div>
        </div>
      </div>
      
      {/* Insights */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Weekly Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/50 dark:bg-darkbg/50 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              You've completed {weeklyStats.tasks} tasks this week, averaging{' '}
              {(weeklyStats.tasks / 7).toFixed(1)} tasks per day.
            </p>
          </div>
          <div className="bg-white/50 dark:bg-darkbg/50 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your total focus time is {weeklyStats.focusTime} minutes, with{' '}
              {weeklyStats.pomodoros} completed Pomodoros.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics; 
'use client';

import { useState, useEffect, useRef } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { motion } from 'framer-motion';
// @ts-ignore
import useSound from 'use-sound';

// Types
type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

interface TimerSettings {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
}

// Type for useSound
type PlayFunction = () => void;

const PomodoroTimer = () => {
  // Default timer settings (in minutes)
  const defaultSettings: TimerSettings = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15
  };
  
  // State variables
  const [settings, setSettings] = useState<TimerSettings>(defaultSettings);
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [secondsLeft, setSecondsLeft] = useState(settings.pomodoro * 60);
  const [isActive, setIsActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMotivation, setShowMotivation] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  
  // Sound effects with error handling
  let playStart: PlayFunction = () => {}; // Default no-op function
  let playComplete: PlayFunction = () => {}; // Default no-op function
  
  try {
    // Try to use sound effects, but don't crash if they're not available
    const [startSound] = useSound('/sounds/start.mp3', { volume: 0.5 });
    const [completeSound] = useSound('/sounds/complete.mp3', { volume: 0.5 });
    playStart = startSound;
    playComplete = completeSound;
  } catch (error) {
    console.log('Sound effects not available:', error);
    // Continue without sound effects
  }
  
  // References
  const secondsLeftRef = useRef(secondsLeft);
  const isActiveRef = useRef(isActive);
  const modeRef = useRef(mode);
  const settingsRef = useRef(settings);
  
  // Update refs when state changes
  useEffect(() => {
    secondsLeftRef.current = secondsLeft;
    isActiveRef.current = isActive;
    modeRef.current = mode;
    settingsRef.current = settings;
  }, [secondsLeft, isActive, mode, settings]);
  
  // Calculate total seconds based on current mode
  const calculateTotalSeconds = (mode: TimerMode, settings: TimerSettings) => {
    return settings[mode] * 60;
  };
  
  // Format time display (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Timer tick function
  const tick = () => {
    secondsLeftRef.current--;
    setSecondsLeft(secondsLeftRef.current);
    
    if (secondsLeftRef.current === 0) {
      // Timer completed
      try { playComplete(); } catch (e) {} // Safely try to play sound
      isActiveRef.current = false;
      setIsActive(false);
      
      // Show motivation message
      setShowMotivation(true);
      
      // Browser notification
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        try {
          new Notification('Pomodoro Timer', {
            body: modeRef.current === 'pomodoro' 
              ? 'Great job! Take a break.' 
              : 'Break time is over. Ready to focus?',
            icon: '/favicon.ico'
          });
        } catch (e) {
          console.log('Notification failed:', e);
        }
      }
      
      // Handle session completion logic
      if (modeRef.current === 'pomodoro') {
        const newCompleted = completedPomodoros + 1;
        setCompletedPomodoros(newCompleted);
        
        // After 4 pomodoros, suggest a long break
        if (newCompleted % 4 === 0) {
          switchMode('longBreak');
        } else {
          switchMode('shortBreak');
        }
      } else {
        // After break, go back to pomodoro
        switchMode('pomodoro');
      }
    }
  };
  
  // Start the timer
  useEffect(() => {
    // Request notification permission
    if (typeof Notification !== 'undefined' && 
        Notification.permission !== 'granted' && 
        Notification.permission !== 'denied') {
      try {
        Notification.requestPermission();
      } catch (e) {
        console.log('Notification permission request failed:', e);
      }
    }
    
    // Initialize timer
    const initTimer = () => {
      setSecondsLeft(calculateTotalSeconds(mode, settings));
    };
    
    initTimer();
    
    // Timer interval
    const interval = setInterval(() => {
      if (isActiveRef.current) {
        tick();
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []); // Empty dependency array to run only once
  
  // Switch timer mode
  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setSecondsLeft(calculateTotalSeconds(newMode, settingsRef.current));
  };
  
  // Toggle timer start/pause
  const toggleTimer = () => {
    const nextState = !isActive;
    setIsActive(nextState);
    
    if (nextState) {
      try { playStart(); } catch (e) {} // Safely try to play sound
    }
  };
  
  // Reset timer
  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(calculateTotalSeconds(mode, settings));
  };
  
  // Update settings
  const updateSettings = (newSettings: TimerSettings) => {
    setSettings(newSettings);
    setSecondsLeft(calculateTotalSeconds(mode, newSettings));
    setShowSettings(false);
  };
  
  // Calculate progress percentage
  const progress = 100 - (secondsLeft / (settings[mode] * 60) * 100);
  
  // Determine color based on current mode
  const getTimerColor = () => {
    switch(mode) {
      case 'pomodoro':
        return '#9370DB'; // Lavender
      case 'shortBreak':
        return '#87CEEB'; // Sky Blue
      case 'longBreak':
        return '#98FB98'; // Mint Green
      default:
        return '#9370DB';
    }
  };

  return (
    <motion.div 
      className="glass dark:glass-dark rounded-2xl p-8 shadow-lg max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Mode Selection */}
      <div className="flex justify-center space-x-2 mb-6">
        <button 
          onClick={() => switchMode('pomodoro')} 
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            mode === 'pomodoro' 
              ? 'bg-lavender text-white shadow-md' 
              : 'bg-lavender-light/30 text-gray-700 dark:text-gray-300'
          }`}
        >
          Pomodoro
        </button>
        <button 
          onClick={() => switchMode('shortBreak')} 
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            mode === 'shortBreak' 
              ? 'bg-skyblue text-white shadow-md' 
              : 'bg-skyblue-light/30 text-gray-700 dark:text-gray-300'
          }`}
        >
          Short Break
        </button>
        <button 
          onClick={() => switchMode('longBreak')} 
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            mode === 'longBreak' 
              ? 'bg-mint text-white shadow-md' 
              : 'bg-mint-light/30 text-gray-700 dark:text-gray-300'
          }`}
        >
          Long Break
        </button>
      </div>
      
      {/* Timer Circle */}
      <div className="w-64 h-64 mx-auto mb-8">
        <CircularProgressbar
          value={progress}
          text={formatTime(secondsLeft)}
          strokeWidth={5}
          styles={buildStyles({
            textSize: '16px',
            pathColor: getTimerColor(),
            textColor: getTimerColor(),
            trailColor: 'rgba(200, 200, 200, 0.2)',
          })}
        />
      </div>
      
      {/* Timer Controls */}
      <div className="flex justify-center space-x-4 mb-6">
        <button 
          onClick={toggleTimer}
          className="w-14 h-14 rounded-full bg-white/80 dark:bg-darkbg/50 flex items-center justify-center shadow-md hover:shadow-lg transition-all"
        >
          {isActive ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={getTimerColor()}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={getTimerColor()}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </button>
        <button 
          onClick={resetTimer}
          className="w-14 h-14 rounded-full bg-white/80 dark:bg-darkbg/50 flex items-center justify-center shadow-md hover:shadow-lg transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={getTimerColor()}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        <button 
          onClick={() => setShowSettings(true)}
          className="w-14 h-14 rounded-full bg-white/80 dark:bg-darkbg/50 flex items-center justify-center shadow-md hover:shadow-lg transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={getTimerColor()}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
      
      {/* Completed Sessions */}
      <div className="text-center text-gray-600 dark:text-gray-400">
        <p>Sessions completed: {completedPomodoros}</p>
      </div>
      
      {/* Settings Modal */}
      {showSettings && (
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
            <h3 className="text-xl font-semibold mb-4">Timer Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pomodoro (minutes)
                </label>
                <input 
                  type="number" 
                  value={settings.pomodoro}
                  onChange={(e) => setSettings({...settings, pomodoro: Math.max(1, Math.min(60, parseInt(e.target.value) || 1))})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800"
                  min="1"
                  max="60"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Short Break (minutes)
                </label>
                <input 
                  type="number" 
                  value={settings.shortBreak}
                  onChange={(e) => setSettings({...settings, shortBreak: Math.max(1, Math.min(30, parseInt(e.target.value) || 1))})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800"
                  min="1"
                  max="30"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Long Break (minutes)
                </label>
                <input 
                  type="number" 
                  value={settings.longBreak}
                  onChange={(e) => setSettings({...settings, longBreak: Math.max(1, Math.min(60, parseInt(e.target.value) || 1))})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800"
                  min="1"
                  max="60"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-6 space-x-3">
              <button 
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button 
                onClick={() => updateSettings(settings)}
                className="px-4 py-2 bg-lavender text-white rounded-md"
              >
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Motivation Modal */}
      {showMotivation && (
        <motion.div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white dark:bg-darkbg rounded-lg p-6 w-full max-w-md text-center"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
          >
            <h3 className="text-xl font-semibold mb-4">
              {mode === 'pomodoro' ? '🎉 Great job!' : '⏰ Break time is over!'}
            </h3>
            <p className="mb-6">
              {mode === 'pomodoro' 
                ? 'You completed a focused work session. Take a well-deserved break!'
                : 'Ready to get back to work? Your next focused session awaits!'}
            </p>
            <button 
              onClick={() => setShowMotivation(false)}
              className="px-6 py-2 bg-lavender text-white rounded-full"
            >
              Continue
            </button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PomodoroTimer; 
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const quotes = [
  "The key is not to prioritize what's on your schedule, but to schedule your priorities.",
  "Productivity is never an accident. It is always the result of a commitment to excellence.",
  "Don't watch the clock; do what it does. Keep going.",
  "Focus on being productive instead of busy.",
  "The way to get started is to quit talking and begin doing."
];

export default function Home() {
  const [quote, setQuote] = useState('');
  
  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Productivity Tracker</h1>
      <p className="text-xl mb-8">Focus better, manage tasks, track your progress</p>
      <div className="flex gap-4">
        <a 
          href="/dashboard" 
          className="px-6 py-3 bg-lavender text-white rounded-full hover:bg-lavender-dark transition-colors"
        >
          Go to Dashboard
        </a>
      </div>
    </main>
  );
} 
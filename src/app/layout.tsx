import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Productivity Tracker',
  description: 'A beautiful productivity app with Pomodoro timer, task tracking, and analytics',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-lavender-light via-skyblue-light to-mint-light dark:from-darkbg dark:via-darkbg dark:to-darkbg`}>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        {children}
        <footer className="text-center p-4 text-gray-600 dark:text-gray-400 text-sm">
          Created with ❤️ by Iqra Riyaz
        </footer>
      </body>
    </html>
  );
} 
import React, { useEffect } from 'react';
import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';
import Navbar from './components/Navbar';
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  console.log({ onlineUsers });

  useEffect(() => {
    checkAuth();

    // Disable Screenshot tools and provide UI feedback
    const handleScreenshotAttempt = (e) => {
      if (e.key === 'PrintScreen' || (e.metaKey && e.shiftKey && e.key === 'S')) {
        e.preventDefault();
        alert('Screenshots are disabled!');
        document.body.classList.add('blur-effect');
        setTimeout(() => document.body.classList.remove('blur-effect'), 500);
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      alert('Right-click is disabled!');
    };

    // Add event listeners
    window.addEventListener('keydown', handleScreenshotAttempt);
    window.addEventListener('contextmenu', handleContextMenu);

    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener('keydown', handleScreenshotAttempt);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;

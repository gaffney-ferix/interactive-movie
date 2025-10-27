
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import UserPage from './pages/UserPage';
import HomePage from './pages/HomePage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="bg-gray-900 text-white min-h-screen font-sans">
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;

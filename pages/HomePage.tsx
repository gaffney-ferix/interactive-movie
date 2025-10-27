
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Hello Study Interractive Movie
          <p>
            ver.1
          </p>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl">
          This application simulates a real-time video commenting experience. Open the Admin view in one tab to play the video, and the User view in another to send stamps.
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <Link
          to="/admin"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg"
        >
          Open Admin View (Player)
        </Link>
        <Link
          to="/user"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg"
        >
          Open User View (Sender)
        </Link>
      </div>
    </div>
  );
};

export default HomePage;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleJoin = () => {
    if (roomId.trim()) {
      // Try to extract ID from a full URL
      let id = roomId.trim();
      try {
        const url = new URL(id);
        const pathParts = url.hash.split('/');
        if (pathParts.length >= 3 && pathParts[1] === 'user') {
          id = pathParts[2];
        }
      } catch (e) {
        // Not a URL, assume it's an ID
      }
      navigate(`/user/${id}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleJoin();
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Hello Study Interractive Movie
          <p className="text-3xl mt-2">
            ver.2 - Multi-Device
          </p>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl">
          Create a room on one device to play the video. Then join the room from other devices (like your phone) to send stamps in real-time!
        </p>
      </div>
      <div className="flex flex-col gap-8 w-full max-w-sm">
        <Link
          to="/admin"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-xl text-center transition-transform transform hover:scale-105 shadow-lg"
        >
          Create a New Room (Player)
        </Link>
        <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center">
                <span className="bg-gray-900 px-2 text-gray-400">or</span>
            </div>
        </div>
        <div className="flex flex-col gap-4">
            <h2 className="text-xl text-center font-semibold">Join an Existing Room</h2>
            <input 
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter Room ID or URL"
                className="w-full bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg py-3 px-4 text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
                onClick={handleJoin}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
                disabled={!roomId.trim()}
            >
                Join Room (Sender)
            </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
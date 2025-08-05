import React from 'react';
import { useNavigate } from 'react-router-dom';

const ExMain: React.FC = () => {
  const navigate = useNavigate();

  const handleStartTraining = () => {
    navigate('/Exercises');
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div
        className="relative bg-gray rounded-3xl shadow-2xl p-10 flex flex-col items-center cursor-pointer hover:shadow-orange-400 transition-shadow duration-300 group"
        onClick={handleStartTraining}
      >
        {/* Animated Glow */}
        <span className="absolute -top-8 -left-8 w-32 h-32 bg-orange-400 opacity-20 rounded-full blur-2xl pointer-events-none group-hover:opacity-40 transition"></span>
        <img
          src="https://img.icons8.com/fluency/96/dumbbell.png"
          alt="Start Training"
          className="w-24 h-24 mb-4 drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
        />
        <h2 className="text-4xl font-extrabold text-orange-500 mb-2 tracking-tight drop-shadow group-hover:text-orange-600 transition-colors">
          START TRAINING
        </h2>
        <p className="text-white mb-4 text-center text-lg">
          Welcome to your personalized training hub! 
          <br/>Here, you can access guided instructions for essential exercises to boost your strength, endurance, and overall fitness.
        </p>
        <ul className="mb-6 text-white text-base list-disc list-inside text-left max-w-xs">
          <li><span className="font-semibold text-orange-500">Bicep Curls:</span> Build arm muscle and strength.</li>
          <li><span className="font-semibold text-pink-500">Push-Ups:</span> Strengthen your chest, shoulders, and core.</li>
          <li><span className="font-semibold text-red-500">Squats:</span> Develop powerful legs and glutes.</li>
        </ul>
        <p className="text-white mb-6 text-center text-sm">
          Click anywhere on this card or the button below to begin your training journey!
        </p>
        <button
          className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-bold px-10 py-3 rounded-xl shadow-lg hover:from-orange-600 hover:to-yellow-500 transition-all text-lg tracking-wide mt-2 group-hover:scale-105"
          tabIndex={-1}
        >
          🚀 Start Training
        </button>
      </div>
    </section>
  );
};

export default ExMain;
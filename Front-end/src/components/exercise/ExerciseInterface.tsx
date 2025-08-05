import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlayCircleIcon, PauseCircleIcon, RefreshCcwIcon } from 'lucide-react';
import ExerciseInstructions from './ExerciseInstructions';
import ExerciseSelector from './ExerciseSelector';
import { exerciseApi } from '../../services/api';

const ExerciseInterface = () => {
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');

  const handleExerciseSelect = async (exercise: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Set the exercise type in the backend
      await exerciseApi.setExerciseType(exercise);

      // Navigate to the exercise interface
      await exerciseApi.goToExerciseInterface();

      // Update the video URL
      const url = exerciseApi.getVideoFeedUrl(exercise);
      setVideoUrl(url);

      // Update the selected exercise and activate the interface
      setSelectedExercise(exercise);
      setIsActive(true);
    } catch (err) {
      console.error('Error starting exercise:', err);
      setError('Failed to connect to exercise service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayPause = () => {
    setIsActive(!isActive);
    // Note: The current backend doesn't have a pause feature,
    // but we can hide/show the video feed on the frontend
  };

  const handleReset = () => {
    setIsActive(false);
    setSelectedExercise('');
    setError(null);
    setVideoUrl('');
  };

  // Set up video URL when exercise changes
  useEffect(() => {
    if (selectedExercise) {
      const url = exerciseApi.getVideoFeedUrl(selectedExercise);
      setVideoUrl(url);
    }
  }, [selectedExercise]);

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="max-w-6xl mx-auto"
        >
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Real-Time Exercise Form Detection
          </h1>

          {error && (
            <div className="bg-red-500 text-white p-4 rounded-lg mb-6 text-center">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : !selectedExercise ? (
            <ExerciseSelector onSelect={handleExerciseSelect} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Video Feed */}
              <motion.div 
                className="lg:col-span-2 bg-gray-800 rounded-lg overflow-hidden" 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="relative w-full h-full">
                  {isActive && videoUrl ? (
                    <img 
                      src={videoUrl} 
                      alt="Exercise video feed" 
                      className="w-full h-full object-contain" // Changed from object-cover to object-contain
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-700 text-white">
                      <span>Video paused. Press play to continue.</span>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-4">
                    <motion.button 
                      whileHover={{ scale: 1.1 }} 
                      whileTap={{ scale: 0.9 }} 
                      className="p-2 rounded-full bg-orange-500 text-white"
                      onClick={handlePlayPause}
                    >
                      {isActive ? <PauseCircleIcon className="h-8 w-8" /> : <PlayCircleIcon className="h-8 w-8" />}
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }} 
                      whileTap={{ scale: 0.9 }} 
                      className="p-2 rounded-full bg-gray-700 text-white"
                      onClick={handleReset}
                    >
                      <RefreshCcwIcon className="h-8 w-8" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
              
              {/* Instructions Panel */}
              <motion.div 
                className="bg-gray-800 rounded-lg p-6" 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }}
              >
                <ExerciseInstructions exercise={selectedExercise} />
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ExerciseInterface;
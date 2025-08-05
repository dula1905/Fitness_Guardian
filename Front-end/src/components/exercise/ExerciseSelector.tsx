import { motion } from 'framer-motion';
import { Dumbbell, Activity, ArrowRight } from 'lucide-react';

interface ExerciseSelectorProps {
  onSelect: (exercise: string) => void;
}

const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({ onSelect }) => {
  const exercises = [
    {
      id: 'bicep_curls',
      name: 'Bicep Curls',
      description: 'Build arm strength with proper form bicep curls.',
      icon: <Dumbbell className="h-12 w-12 text-orange-500" />,
      color: 'from-orange-600 to-orange-400',
    },
    {
      id: 'pushups',
      name: 'Push Ups',
      description: 'Perfect your push-up technique with real-time feedback.',
      icon: <Activity className="h-12 w-12 text-blue-500" />,
      color: 'from-blue-600 to-blue-400',
    },
    {
      id: 'squats',
      name: 'Squats',
      description: 'Master your squat form for maximum effectiveness.',
      icon: <Activity className="h-12 w-12 text-green-500" />,
      color: 'from-green-600 to-green-400',
    }
  ];

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
      },
    }),
    hover: {
      y: -5,
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {exercises.map((exercise, index) => (
        <motion.div
          key={exercise.id}
          className={`bg-gray-800 rounded-lg overflow-hidden cursor-pointer transition-all`}
          custom={index}
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          onClick={() => onSelect(exercise.id)}
        >
          <div className={`h-2 bg-gradient-to-r ${exercise.color}`} />
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gray-700 p-3 rounded-lg">
                {exercise.icon}
              </div>
              <ArrowRight className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{exercise.name}</h3>
            <p className="text-gray-400">{exercise.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ExerciseSelector;
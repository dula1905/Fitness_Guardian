import { CheckCircle, XCircle } from 'lucide-react';

interface ExerciseInstructionsProps {
  exercise: string;
}

const ExerciseInstructions: React.FC<ExerciseInstructionsProps> = ({ exercise }) => {
  // Define instructions for each exercise type
  const instructionsMap = {
    bicep_curls: {
      title: 'Bicep Curl Instructions',
      description: 'Stand with your feet shoulder-width apart, holding weights at your sides with palms facing forward.',
      correctForm: [
        'Keep your elbows close to your torso',
        'Curl the weights toward your shoulders',
        'Lower the weights with control',
        'Maintain a straight back throughout',
        'Keep shoulders relaxed and down'
      ],
      incorrectForm: [
        'Swinging the weights',
        'Moving your elbows forward',
        'Arching your back',
        'Raising shoulders during the movement',
        'Using momentum instead of muscle control'
      ]
    },
    pushups: {
      title: 'Push-Up Instructions',
      description: 'Start in a plank position with your hands slightly wider than shoulder-width apart.',
      correctForm: [
        'Keep your body in a straight line',
        'Lower your chest toward the floor',
        'Push back up to the starting position',
        'Keep your core engaged',
        'Look slightly ahead, not down'
      ],
      incorrectForm: [
        'Arching or sagging your back',
        'Dropping your head',
        'Flaring elbows too far out',
        'Incomplete range of motion',
        'Holding your breath'
      ]
    },
    squats: {
      title: 'Squat Instructions',
      description: 'Stand with feet shoulder-width apart, toes pointing slightly outward.',
      correctForm: [
        'Push your hips back as if sitting in a chair',
        'Lower until thighs are parallel to the ground',
        'Keep your knees in line with your toes',
        'Maintain a neutral spine',
        'Push through your heels to return to standing'
      ],
      incorrectForm: [
        'Knees caving inward',
        'Rising onto your toes',
        'Rounding your back',
        'Not going deep enough',
        'Letting knees go too far forward past toes'
      ]
    }
  };

  // Get the correct instructions based on the selected exercise
  const instructions = instructionsMap[exercise as keyof typeof instructionsMap] || {
    title: 'Instructions',
    description: 'Select an exercise to see specific instructions.',
    correctForm: [],
    incorrectForm: []
  };

  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-4">{instructions.title}</h2>
      <p className="text-gray-300 mb-6">{instructions.description}</p>

      <div className="mb-6">
        <h3 className="flex items-center text-lg font-semibold mb-3 text-green-400">
          <CheckCircle className="mr-2 h-5 w-5" />
          Correct Form
        </h3>
        <ul className="space-y-2">
          {instructions.correctForm.map((item, index) => (
            <li key={`correct-${index}`} className="flex items-start">
              <span className="inline-block bg-green-500/20 text-green-400 p-1 rounded mr-2">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="flex items-center text-lg font-semibold mb-3 text-red-400">
          <XCircle className="mr-2 h-5 w-5" />
          Incorrect Form
        </h3>
        <ul className="space-y-2">
          {instructions.incorrectForm.map((item, index) => (
            <li key={`incorrect-${index}`} className="flex items-start">
              <span className="inline-block bg-red-500/20 text-red-400 p-1 rounded mr-2">✗</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExerciseInstructions;
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Heart, Flame, Activity } from 'lucide-react';

const programs = [
  {
    image: "https://media.cnn.com/api/v1/images/stellar/prod/210818142635-03-strength-training-push-ups-stock.jpg?q=w_1110,c_fill",
    icon: <Dumbbell className="h-8 w-8 text-orange-500" />,
    title: 'Strength Training',
    description: 'Boost your power and endurance with expert-led strength routines and progressive overload. Learn the best techniques for muscle growth and injury prevention.',
    article: `Strength training is essential for building muscle, increasing bone density, and boosting metabolism. Our expert coaches guide you through safe and effective routines, ensuring you progress at your own pace. Whether you’re a beginner or advanced, you’ll find programs tailored to your goals.`
  },
  {
    image: "https://cdn-life.dailyburn.com/life/wp-content/uploads/2016/01/10004903/circuit-training-cardio-not-running-1.jpg",
    icon: <Activity className="h-8 w-8 text-pink-500" />,
    title: 'Cardio Training',
    description: 'Elevate your heart rate and burn calories with fun, high-energy cardio sessions. Perfect for improving stamina and cardiovascular health.',
    article: `Cardio training improves your heart health, endurance, and overall energy levels. Our sessions are designed to be engaging and effective, helping you burn calories and enjoy every workout. From HIIT to steady-state, there’s something for everyone.`
  },
  {
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=400&q=80",
    icon: <Flame className="h-8 w-8 text-red-500" />,
    title: 'Fat Burning',
    description: 'Sculpt your body and shed fat fast with targeted HIIT and metabolic workouts. Get leaner and feel more energetic every day.',
    article: `Our fat burning programs combine high-intensity intervals and metabolic conditioning to maximize calorie burn. You’ll see results quickly, with workouts that keep you motivated and energized.`
  },
  {
    image: "https://www.osfhealthcare.org/blog/wp-content/uploads/2020/04/covid-exercise-at-home-ft1-765x310.jpg",
    icon: <Heart className="h-8 w-8 text-green-500" />,
    title: 'Health Fitness',
    description: 'Focus on holistic wellness, flexibility, and lifelong fitness for every body. Improve your quality of life with balanced routines.',
    article: `Health fitness is about more than just exercise—it’s about feeling your best every day. Our holistic approach includes flexibility, mobility, and mindfulness, helping you build habits for lifelong wellness.`
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};
const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1 }
};

const ProgramsSection = () => {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section id="programs" className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-orange-500">EXPLORE</span>{' '}
            <span className="text-white">PROGRAMS</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            Choose your path to fitness. Each program is designed for real results and real people.
          </p>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {programs.map((program, index) => (
            <motion.article
              key={index}
              className={`bg-gray-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden group hover:shadow-orange-400 transition-shadow duration-300 cursor-pointer ${expanded === index ? 'col-span-1 md:col-span-2 lg:col-span-4 z-20' : ''}`}
              variants={item}
              whileHover={{ y: -8, scale: 1.03 }}
              onClick={() => setExpanded(expanded === index ? null : index)}
              layout
            >
              <img
                src={program.image}
                alt={program.title}
                className="h-40 w-full object-cover"
              />
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center mb-4">
                  <span className="mr-2">{program.icon}</span>
                  <h3 className="text-xl font-bold text-white">{program.title}</h3>
                </div>
                <p className="text-gray-300 flex-1">{program.description}</p>
                <AnimatePresence>
                  {expanded === index && (
                    <motion.div
                      className="mt-6 bg-gray-800 rounded-xl p-4 text-gray-200 shadow-inner"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h4 className="font-semibold text-orange-500 mb-2">About this program</h4>
                      <p>{program.article}</p>
                      <button
                        className="mt-4 text-orange-400 font-semibold hover:underline"
                        onClick={e => {
                          e.stopPropagation();
                          setExpanded(null);
                        }}
                      >
                        Close
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
                <span className="mt-6 inline-flex items-center text-orange-500 font-semibold hover:underline select-none">
                  {expanded === index ? "Hide Details" : "Learn More"}
                  <span className="ml-2 text-xl group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProgramsSection;
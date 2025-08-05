import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { HeartIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

// Types for props
type HeroStats = {
  coaches: number;
  members: number;
  programs: number;
};

type HeroProps = {
  stats: HeroStats;
};

type CountUpProps = {
  end: number;
  duration: number;
};

// Counter animation component
const CountUp: React.FC<CountUpProps> = ({ end, duration }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const updateCount = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count}</span>;
};

const Hero: React.FC<HeroProps> = ({ stats }) => {
  const controls = useAnimation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8
      }
    });
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, [controls]);

  return (
    <section id="home" className="pt-24 md:pt-32 pb-16 relative overflow-hidden">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
        {/* Left side with text content */}
        <motion.div className="w-full lg:w-1/2 mb-10 lg:mb-0 z-10" initial={{
          opacity: 0,
          y: 50
        }} animate={controls}>
          <motion.div className="bg-orange-500 text-white font-semibold rounded-full px-6 py-2 inline-block mb-6" initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            delay: 0.2
          }}>
            THE BEST FITNESS IS NOW WITH YOU
          </motion.div>
          <motion.h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight" initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            delay: 0.4
          }}>
            <span className="text-white/70">SHAPE</span> YOUR
            <br />
            IDEAL <span className="text-white/70">BODY</span>
          </motion.h1>
          <motion.p className="text-lg mb-10 text-gray-300" initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            delay: 0.6
          }}>
            We help you shape and build your ideal body to live your life to the
            fullest.
          </motion.p>
          <motion.div className="flex space-x-6 mb-12" initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            delay: 0.8
          }}>
            {[
              {
                value: stats.coaches,
                label: 'EXPERT COACHES'
              },
              {
                value: stats.members,
                label: 'MEMBERS JOINED'
              },
              {
                value: stats.programs,
                label: 'FITNESS PROGRAMS'
              }
            ].map((stat, index) => (
              <div key={index} className="flex flex-col">
                <div className="text-3xl font-bold text-white flex items-center">
                  <span>+</span>
                  <CountUp end={stat.value} duration={2.5} />
                </div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
          <motion.div className="flex space-x-4" initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            delay: 1
          }}>
            {!isLoggedIn && (
              <Link to="/login">
                <motion.button
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded font-semibold transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.button>
              </Link>
            )}
            <motion.button
              className={`border border-white text-white rounded font-semibold hover:bg-white hover:text-gray-900 transition-colors
                ${isLoggedIn ? 'px-16 py-3 text-lg bg-white bg-opacity-10' : 'px-8 py-3'}
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>
        {/* Right side with image and stats */}
        <motion.div className="w-full lg:w-1/2 relative" initial={{
          opacity: 0,
          x: 100
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.8,
          delay: 0.4
        }}>
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Fitness trainer" className="rounded-3xl z-10 relative" />
            <motion.div className="absolute -top-4 right-4 bg-gray-800 p-4 rounded-lg shadow-lg z-20" initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 1.2
            }}>
              <div className="flex items-center space-x-2">
                <HeartIcon className="text-red-500 h-6 w-6" />
                <div>
                  <div className="text-sm text-gray-400">Heart Rate</div>
                  <div className="text-xl font-bold">116 bpm</div>
                </div>
              </div>
            </motion.div>
            <motion.div className="absolute bottom-10 -left-4 bg-gray-800 p-4 rounded-lg shadow-lg z-20" initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 1.4
            }}>
              <div className="flex items-center space-x-2">
                <div className="text-orange-500">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 17H21M6 10H8M12 10H14M18 10H20M4 10H4.01M10 10H10.01M16 10H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Calories Burned</div>
                  <div className="text-xl font-bold">220 cal</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      {/* Background gradient circles */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-orange-500 rounded-full filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-orange-500 rounded-full filter blur-3xl opacity-20"></div>
    </section>
  );
};

export default Hero;
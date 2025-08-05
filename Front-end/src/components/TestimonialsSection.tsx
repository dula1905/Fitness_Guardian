import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
const TestimonialsSection = () => {
  const testimonials = [{
    id: 1,
    text: 'I made the right choice by choosing the Fitclub and by choosing the right plan and program I already achieved my ideal body!',
    name: 'MATHEW HENDRICKSON',
    role: 'ENTREPRENEUR',
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
  }, {
    id: 2,
    text: "The trainers at Fitclub are professional and dedicated. I've seen amazing results in just 3 months!",
    name: 'JESSICA MILLER',
    role: 'DESIGNER',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
  }, {
    id: 3,
    text: 'As a busy professional, the flexible schedule at Fitclub has been a game-changer for my fitness journey.',
    name: 'MICHAEL THOMPSON',
    role: 'SOFTWARE ENGINEER',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
  }];
  const [currentIndex, setCurrentIndex] = useState(0);
  const nextTestimonial = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % testimonials.length);
  };
  const prevTestimonial = () => {
    setCurrentIndex(prevIndex => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };
  return <section id="testimonials" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div className="mb-12" initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6
      }}>
          <span className="text-orange-500 font-semibold">TESTIMONIALS</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2">
            <span className="text-gray-400">WHAT THEY</span>
            <br />
            <span className="text-white">SAY ABOUT US</span>
          </h2>
        </motion.div>
        <div className="flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-2/3 mb-10 lg:mb-0">
            <AnimatePresence mode="wait">
              <motion.div key={currentIndex} className="bg-transparent" initial={{
              opacity: 0,
              x: 50
            }} animate={{
              opacity: 1,
              x: 0
            }} exit={{
              opacity: 0,
              x: -50
            }} transition={{
              duration: 0.5
            }}>
                <p className="text-lg text-gray-300 mb-6 max-w-2xl">
                  {testimonials[currentIndex].text}
                </p>
                <div className="flex items-center">
                  <div>
                    <p className="text-orange-500 font-semibold">
                      {testimonials[currentIndex].name}
                    </p>
                    <p className="text-gray-400">
                      - {testimonials[currentIndex].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="flex space-x-4 mt-8">
              <motion.button onClick={prevTestimonial} className="p-2 rounded-full border border-gray-600 text-gray-400 hover:border-orange-500 hover:text-orange-500" whileHover={{
              scale: 1.1
            }} whileTap={{
              scale: 0.9
            }}>
                <ChevronLeftIcon className="h-5 w-5" />
              </motion.button>
              <motion.button onClick={nextTestimonial} className="p-2 rounded-full border border-gray-600 text-gray-400 hover:border-orange-500 hover:text-orange-500" whileHover={{
              scale: 1.1
            }} whileTap={{
              scale: 0.9
            }}>
                <ChevronRightIcon className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
          <motion.div className="w-full lg:w-1/3 relative" initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6,
          delay: 0.3
        }}>
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-orange-500 rounded-lg"></div>
              <img src={testimonials[currentIndex].image} alt={testimonials[currentIndex].name} className="rounded-lg relative z-10 w-full" />
              <div className="absolute -bottom-4 -right-4 w-32 h-24 bg-orange-500 rounded-lg z-0"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>;
};
export default TestimonialsSection;
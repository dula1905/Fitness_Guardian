import React from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, CrownIcon, FeatherIcon } from 'lucide-react';
const PricingSection = () => {
  const plans = [{
    name: 'BASIC PLAN',
    price: '$25',
    icon: <FeatherIcon className="h-6 w-6" />,
    features: ['2 hours of exercises', 'Free consultaion to coaches', 'Access to The Community'],
    recommended: false
  }, {
    name: 'PREMIUM PLAN',
    price: '$30',
    icon: <CrownIcon className="h-6 w-6" />,
    features: ['5 hour of excercises', 'Free consultaion of Coaches', 'Accessto minibar'],
    recommended: true
  }, {
    name: 'PRO PLAN',
    price: '$45',
    icon: <FeatherIcon className="h-6 w-6" />,
    features: ['8 hours of exercises', 'Consultation of Private Coach', 'Free Fitness Merchandises'],
    recommended: false
  }];
  return <section id="plans" className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.div className="text-center mb-16" initial={{
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
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gray-400">READY TO START</span>{' '}
            <span className="text-white">YOUR JOURNEY</span>{' '}
            <span className="text-gray-400">NOW WITH US</span>
          </h2>
        </motion.div>
        <div className="flex flex-wrap justify-center -mx-4">
          {plans.map((plan, index) => <motion.div key={index} className="w-full md:w-1/3 px-4 mb-8" initial={{
          opacity: 0,
          y: 50
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5,
          delay: index * 0.2
        }}>
              <motion.div className={`h-full rounded-lg p-8 flex flex-col ${plan.recommended ? 'bg-orange-500 text-white' : 'bg-gray-700 text-white'}`} whileHover={{
            y: -10
          }} transition={{
            duration: 0.3
          }}>
                <div className="mb-8">
                  <div className="text-white mb-4">{plan.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold">{plan.price}</div>
                </div>
                <div className="flex-grow">
                  {plan.features.map((feature, idx) => <div key={idx} className="flex items-center mb-4">
                      <CheckIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>)}
                </div>
                <div className="mt-6">
                  <div className="text-sm mb-4">See more benefits ---</div>
                  <motion.button className={`w-full py-3 rounded font-semibold ${plan.recommended ? 'bg-white text-orange-500 hover:bg-gray-100' : 'bg-white text-gray-800 hover:bg-gray-100'}`} whileHover={{
                scale: 1.03
              }} whileTap={{
                scale: 0.98
              }}>
                    Join Now
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>)}
        </div>
      </div>
    </section>;
};
export default PricingSection;
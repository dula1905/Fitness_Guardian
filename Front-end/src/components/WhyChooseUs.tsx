import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from 'lucide-react';
const WhyChooseUs = () => {
  const reasons = ['OVER 140+ EXPERT COACHS', 'TRAIN SMART AND FASTER THAN BEFORE', '1 FREE PROGRAM FOR NEW MEMBERS', 'RELIABLE PARTNERS'];
  const images = ['https://images.unsplash.com/photo-1574680096145-d05b474e2155?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'];
  const partners = [{
    name: 'New Balance',
    logo: 'NB'
  }, {
    name: 'Nike',
    logo: '✓'
  }, {
    name: 'Adidas',
    logo: 'adidas'
  }];
  return <section id="reasons" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row">
          {/* Left side with images */}
          <motion.div className="w-full lg:w-1/2 grid grid-cols-2 gap-4 mb-10 lg:mb-0" initial={{
          opacity: 0,
          x: -50
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            {images.map((image, index) => <motion.div key={index} className={`rounded-lg overflow-hidden ${index === 0 ? 'col-span-1 row-span-2' : ''}`} whileHover={{
            scale: 1.05
          }} transition={{
            duration: 0.3
          }}>
                <img src={image} alt={`Fitness image ${index + 1}`} className="w-full h-full object-cover" />
              </motion.div>)}
          </motion.div>
          {/* Right side with reasons */}
          <motion.div className="w-full lg:w-1/2 lg:pl-12" initial={{
          opacity: 0,
          x: 50
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <motion.div className="mb-8" initial={{
            opacity: 0
          }} whileInView={{
            opacity: 1
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.2
          }}>
              <span className="text-orange-500 font-semibold">
                SOME REASONS
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mt-2">
                <span className="text-gray-400">WHY</span>{' '}
                <span className="text-white">CHOOSE US?</span>
              </h2>
            </motion.div>
            <motion.div className="space-y-6" initial={{
            opacity: 0
          }} whileInView={{
            opacity: 1
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.4
          }}>
              {reasons.map((reason, index) => <motion.div key={index} className="flex items-start" initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: 0.2 * index
            }}>
                  <CheckCircleIcon className="h-6 w-6 text-orange-500 mr-3 flex-shrink-0 mt-1" />
                  <span className="font-medium">{reason}</span>
                </motion.div>)}
            </motion.div>
            <motion.div className="mt-12" initial={{
            opacity: 0
          }} whileInView={{
            opacity: 1
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.6
          }}>
              <span className="text-gray-400 block mb-4">OUR PARTNERS</span>
              <div className="flex space-x-8">
                {partners.map((partner, index) => <motion.div key={index} className="text-gray-400 text-2xl font-bold" whileHover={{
                scale: 1.1,
                color: '#fff'
              }}>
                    {partner.logo}
                  </motion.div>)}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>;
};
export default WhyChooseUs;
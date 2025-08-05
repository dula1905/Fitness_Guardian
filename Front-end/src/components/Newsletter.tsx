import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ApiService from '../services/ApiService';
const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    try {
      const response = await ApiService.subscribe(email);
      setMessage('Successfully subscribed! Thank you.');
      setEmail('');
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return <section className="py-20 bg-gray-800 border-t border-gray-700">
      <div className="container mx-auto px-4">
        <motion.div className="max-w-3xl mx-auto text-center" initial={{
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
            <span className="text-gray-400">READY TO</span>{' '}
            <span className="text-white">LEVEL UP</span>
            <br />
            <span className="text-white">YOUR BODY</span>{' '}
            <span className="text-gray-400">WITH US</span>
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row max-w-xl mx-auto mt-8">
            <input type="email" placeholder="Enter Your Email Address" className="flex-grow px-4 py-3 rounded-l sm:rounded-r-none bg-gray-700 text-white border-gray-600 focus:outline-none focus:border-orange-500" value={email} onChange={e => setEmail(e.target.value)} required />
            <motion.button type="submit" className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-r sm:rounded-l-none mt-2 sm:mt-0" whileHover={{
            backgroundColor: '#f97316'
          }} whileTap={{
            scale: 0.98
          }} disabled={isSubmitting}>
              {isSubmitting ? 'Joining...' : 'Join Now'}
            </motion.button>
          </form>
          {message && <motion.p className="mt-4 text-orange-500" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }}>
              {message}
            </motion.p>}
        </motion.div>
      </div>
    </section>;
};
export default Newsletter;
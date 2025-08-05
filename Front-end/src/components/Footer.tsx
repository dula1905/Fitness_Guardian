import React from 'react';
import { motion } from 'framer-motion';
import { Github, Instagram, Linkedin } from 'lucide-react';
const Footer = () => {
  return <footer className="py-12 bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-center space-x-8 mb-8">
          <motion.a href="#" className="text-gray-400 hover:text-white" whileHover={{
          scale: 1.2
        }}>
            <Github className="h-6 w-6" />
          </motion.a>
          <motion.a href="#" className="text-gray-400 hover:text-white" whileHover={{
          scale: 1.2
        }}>
            <Instagram className="h-6 w-6" />
          </motion.a>
          <motion.a href="#" className="text-gray-400 hover:text-white" whileHover={{
          scale: 1.2
        }}>
            <Linkedin className="h-6 w-6" />
          </motion.a>
        </div>
        <div className="text-center text-gray-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} THE FITNESS GUARDIAN. All rights reserved.
          </p>
          <p className="mt-2">
            <a href="#" className="hover:text-orange-500 transition-colors">
              Privacy Policy
            </a>
            {' • '}
            <a href="#" className="hover:text-orange-500 transition-colors">
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;
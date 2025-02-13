import React from "react";
import Hero from "./Hero";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="relative py-0">
      {/* Background Container */}
      <div className="relative w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white text-center py-9">
        {/* Animated Heading */}
        <motion.h1
          className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-wide"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Making IoT Work For You
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="mt-3 text-lg md:text-xl text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Seamless, Scalable, and Secure IoT Solutions
        </motion.p>
      </div>

      {/* Hero Section */}
      <Hero />
    </div>
  );
};

export default Home;

import React from "react";

import Hero from "./Hero";

const Home = () => {
  return (
    <div className="py-0">
      <h1 className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white sm:text-lg md:text-2xl lg:text-3xl text-center font-bold py-4">
        Making IoT Work For You
      </h1>
      <Hero />
    </div>
  );
};

export default Home;

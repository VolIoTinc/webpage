import React from "react";
import AboutChunk from "./AboutChunk";

const About = () => {
  return (
    <div className="w-full p-0">
      <h1 className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white sm:text-xl md:text-2xl lg:text-3xl text-center font-bold py-4">
        About VolIoT
      </h1>
      <AboutChunk />
    </div>
  );
};

export default About;

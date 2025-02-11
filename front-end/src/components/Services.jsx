import React from "react";

const Services = () => {
  return (
    <div className="p-8">
      <h1 className="w-full bg-gradient-to-r from-transparent via-gray-800 to-transparent text-white sm:text-xl md:text-2xl lg:text-3xl font-bold text-center py-2 mt-8 mb-6">
        Our Comprehensive Services
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mx-auto max-w-7xl">
        <div className="bg-gray-800 p-4 lg:p-6 rounded-lg justify-self-center max-w-sm w-full">
          <h2 className="text-xl font-bold">Cloud or On-Prem Solutions</h2>
          <p>
            Whether your operations demand the flexibility of the cloud or the
            control of an on-premises setup, we tailor a solution to your
            specifications. We work with top-tier cloud providers or leverage
            your existing infrastructure to create a robust, scalable cluster
            for your IoT network.
          </p>
        </div>
        <div className="bg-gray-800 p-4 lg:p-6 rounded-lg justify-self-center max-w-sm w-full">
          <h2 className="text-xl font-bold">
            Seamless Data Access & Analytics
          </h2>
          <p>
            Unlock the full potential of your IoT data with intuitive access and
            powerful analytics. We provide solutions that allow you to easily
            query, visualize, and derive actionable insights from your device
            data to enhance decision-making and operational efficiency.
          </p>
        </div>
        <div className="bg-gray-800 p-4 lg:p-6 rounded-lg justify-self-center max-w-sm w-full">
          <h2 className="text-xl font-bold">Custom Circuit Board Design</h2>
          <p>
            Stay ahead of the curve with our expertise in designing custom
            circuit boards tailored to your IoT devices. We utilize the latest
            microprocessors, embedded systems, and components to create
            solutions that meet your unique needs for power, efficiency, and
            performance.
          </p>
        </div>
        <div className="bg-gray-800 p-4 lg:p-6 rounded-lg justify-self-center max-w-sm w-full">
          <h2 className="text-xl font-bold">Industrial Enclosures</h2>
          <p>
            Protect your devices with custom enclosures designed for challenging
            environments. Whether it's exposure to extreme temperatures,
            hazardous chemicals, or mechanical wear, we build enclosures that
            ensure your devices are safe and functional, no matter the
            conditions.
          </p>
        </div>
        <div className="bg-gray-800 p-4 lg:p-6 rounded-lg justify-self-center max-w-sm w-full">
          <h2 className="text-xl font-bold">
            Efficient Manufacturing & Scalability
          </h2>
          <p>
            From prototype to mass production, we support every stage of the
            manufacturing process. Whether you need a few devices or thousands,
            we ensure precision and scalability in the production of your custom
            IoT devices, PCB designs, and enclosures.
          </p>
        </div>
        <div className="bg-gray-800 p-4 lg:p-6 rounded-lg justify-self-center max-w-sm w-full">
          <h2 className="text-xl font-bold">
            Tailored Solutions for Your Needs
          </h2>
          <p>
            We understand that every project is unique. Our "Extra Box" service
            offers flexible, customized solutions to address any additional
            needs you may have. If there's something we're missing, we're ready
            to deliver a solution that fits your exact requirements.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Services;

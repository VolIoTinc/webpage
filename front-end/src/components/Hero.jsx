import SimpleSlider from "./Slides";
import serviceImage1 from "../assets/slug.png";
import serviceImage2 from "../assets/slug.png";
import serviceImage3 from "../assets/slug.png";
import securityImage from "../assets/slug.png";
import IoTimg1 from "../assets/duck.png";

const Hero = () => (
  <div className="overflow-hidden">
    {/* Banner Section with Background Image */}
    <section className=" text-white text-shadow-thin-black py-24 min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Transforming Industries with IoT Solutions
        </h1>
      </div>
      <div className="container mx-auto px-4">
        <SimpleSlider />
      </div>
    </section>

    {/* Services Section */}
    <section className="py-16 bg-transparent">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-semibold text-shadow-thin-black mb-8">
          Our Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <img
              src={serviceImage1}
              alt="Service 1"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl text-white text-shadow-thin-black font-semibold mb-2">
              Service 1
            </h3>
            <p className="text-gray-100 text-shadow-thin-black">
              Brief description of Service 1.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <img
              src={serviceImage2}
              alt="Service 2"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl text-white text-shadow-thin-black font-semibold mb-2">
              Service 2
            </h3>
            <p className="text-gray-100 text-shadow-thin-black">
              Brief description of Service 2.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <img
              src={serviceImage3}
              alt="Service 3"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl text-white text-shadow-thin-black font-semibold mb-2">
              Service 3
            </h3>
            <p className="text-gray-100 text-shadow-thin-black">
              Brief description of Service 3.
            </p>
          </div>
        </div>
        <div className="mt-8">
          <button className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-500 transition">
            See Full List
          </button>
        </div>
      </div>
    </section>

    {/* IoT and Industry Overview */}
    <section className="py-24 bg-gradient-to-r from-gray-800 to-transparent text-white text-shadow-thin-black">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2">
          <h2 className="text-3xl font-semibold mb-6">
            What is IoT and How It Helps Industry?
          </h2>
          <p className="text-lg text-gray-100 mb-8">
            The Internet of Things (IoT) is revolutionizing industries by
            connecting devices, systems, and data to drive efficiency,
            productivity, and decision-making.
          </p>
        </div>
        <div className="md:w-1/2 flex flex-wrap justify-around gap-4">
          <img
            src={IoTimg1}
            alt="IoT 1"
            className="w-24 h-24 object-cover rounded-lg shadow-lg"
          />
          <img
            src={IoTimg1}
            alt="IoT 2"
            className="w-24 h-24 object-cover rounded-lg shadow-lg"
          />
          <img
            src={IoTimg1}
            alt="IoT 3"
            className="w-24 h-24 object-cover rounded-lg shadow-lg"
          />
          <img
            src={IoTimg1}
            alt="IoT 4"
            className="w-24 h-24 object-cover rounded-lg shadow-lg"
          />
          <img
            src={IoTimg1}
            alt="IoT 5"
            className="w-24 h-24 object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>

    {/* SOC Type 2 & ISO/IEC 27001 Dedication */}
    <section className="py-24 bg-gradient-to-r from-gray-800 to-transparent">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2">
          <h2 className="text-3xl font-semibold text-shadow-thin-black mb-6">
            Our Commitment to SOC Type 2 & ISO/IEC 27001
          </h2>
          <p className="text-lg text-gray-100 text-shadow-thin-black mb-8">
            We are dedicated to the highest standards of security and
            compliance, ensuring that our IoT solutions meet SOC Type 2 and
            ISO/IEC 27001 certifications for your peace of mind.
          </p>
        </div>
        <div className="md:w-1/2">
          <img
            src={securityImage}
            alt="Security Dedication"
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  </div>
);

export default Hero;

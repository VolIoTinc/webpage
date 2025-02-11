import monayImage from "../assets/monay.png";

const Hero = () => (
  <section className="text-center py-20">
    <h1 className="bg-gradient-to-b from-gray-900 to-gray-800 text-white sm:text-lg md:text-xl lg:text-2xl font-bold">
      Transforming Industries with IoT Solutions
    </h1>
    <h2 className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 flex justify-evenly items-center mb-96">
      <p className="text-gray-400 text-sm my-8 sm:px-5 md:px-8 lg:px-11">
        The Internet of Things (IoT) connects devices, machines, and systems to
        collect and share data seamlessly. This real-time data empowers
        industries to optimize processes, improve decision-making, and drive
        operational efficiency.
        <br />
        <br />
        At VolIoT, we specialize in creating tailored IoT solutions for
        businesses of all sizes. Whether you're looking to improve asset
        management, streamline manufacturing, or enhance customer experiences,
        we build systems that scale with your needs and bring innovative
        insights from even the most remote locations to your fingertips.
      </p>
    </h2>
    <h3 className="bg-gray-800 flex justify-evenly items-center mb-96">
      <p className="text-gray-400 text-sm my-6">
        Our Expertise:
        <br />
        IoT Networks and Device Integration
        <br />
        Custom PCB Design and Enclosures
        <br />
        Cloud Hosted Management and Data Analytics
        <br />
        Tailored User Interfaces and APIs
        <br />
        Scalable Solutions for Every Industry
      </p>
      <button className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 border-double border-4 border-indigo-600">
        Get Started
      </button>
    </h3>
    <h4 className="bg-gradient-to-r from-gray-600 via-gray-900 to-gray-600 flex justify-evenly items-center mb-96 py-3">
      <img
        src={monayImage}
        alt="EXAMPLE"
        className="rounded-lg shadow-lg sm:max-w-4xs md:max-w-2xs lg:max-w-xs"
      />
      <p className="text-gray-400 text-sm text-left pl-2">
        Vol - <br />
        _volition_ <br />
        &nbsp;&nbsp;intentionality and control <br />
        _volume_
        <br />
        &nbsp;&nbsp;signifying scalability and capacity <br />
        _voltage_ <br />
        &nbsp;&nbsp;energy and power <br />
        IoT - <br />
        _internet of things_ <br />
        &nbsp;&nbsp;enabling smarter, more connected systems
      </p>
    </h4>
  </section>
);

export default Hero;

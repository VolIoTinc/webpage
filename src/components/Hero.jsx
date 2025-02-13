import SimpleSlider from "./Slides";
import serviceImageUI from "../assets/slug.png";
import serviceImagePF from "../assets/slug.png";
import serviceImageME from "../assets/slug.png";
import securityImage from "../assets/isoiec.png";
import IoTimg1 from "../assets/duck.png";

const Hero = () => (
  <div className="overflow-hidden">
    {/* Banner Section with Background Image */}
    <section className=" text-white text-shadow-thin-black py-20 min-h-screen">
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
              src={serviceImageUI}
              alt="Service 1"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl text-white text-shadow-thin-black font-semibold mb-2">
              User Interface Design
            </h3>
            <p className="text-gray-100 text-sm pt-12 text-shadow-thin-black">
              We specialize in crafting intuitive and visually appealing user
              interfaces for IoT systems. Our designs focus on ease of use,
              seamless navigation, and ensuring that your users can interact
              with your devices effortlessly, all while maintaining a sleek and
              modern aesthetic.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <img
              src={serviceImagePF}
              alt="Service 2"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl text-white text-shadow-thin-black font-semibold mb-2">
              Personalized Platforms
            </h3>
            <p className="text-gray-100 text-sm pt-2 text-shadow-thin-black">
              We design and implement customized cloud and on-premise platforms
              tailored to your specific business needs. Whether you need
              scalable cloud infrastructure, secure databases, or integrated
              server environments, we provide flexible solutions that optimize
              performance, ensure reliability, and grow with your business.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <img
              src={serviceImageME}
              alt="Service 3"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl text-white text-shadow-thin-black font-semibold mb-2">
              Mechanical & Electrical Design
            </h3>
            <p className="text-gray-100 text-sm pt-2 text-shadow-thin-black">
              Our mechanical and electrical design services deliver innovative
              solutions for IoT devices and systems. We focus on creating
              efficient, reliable, and durable hardware architectures that meet
              the specific needs of your application, ensuring seamless
              integration between mechanical components, electrical systems, and
              software for optimal performance.
            </p>
          </div>
        </div>
        <div className="mt-8">
          <a href="/services">
            <button className="bg-gray-800 text-white px-12 py-2 rounded-lg hover:bg-blue-500 transition">
              See Full List
            </button>
          </a>
        </div>
      </div>
    </section>

    {/* IoT and Industry Overview */}
    <section className="py-24 bg-gradient-to-r from-gray-800 to-transparent text-white text-shadow-thin-black">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Text on the Left */}
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h2 className="text-3xl font-semibold mb-6">
            What is IoT and How It Helps Industry?
          </h2>
          <p className="text-lg text-gray-100 mb-8">
            The Internet of Things (IoT) is revolutionizing industries by
            connecting devices, systems, and data to drive efficiency,
            productivity, and decision-making.
          </p>
          <p className="text-lg text-gray-100 mb-8">
            In manufacturing, for example, IoT facilitates predictive
            maintenance, where sensors monitor equipment health and trigger
            alerts before failures occur, minimizing downtime and maintenance
            costs. In healthcare, IoT enables remote patient monitoring,
            allowing healthcare providers to track patient vitals and adjust
            treatment plans in real-time. IoT also improves supply chain
            management by providing visibility and optimizing routes and
            inventory through connected devices.
          </p>

          <p className="text-lg text-gray-100 mb-8">
            Beyond operational improvements, IoT plays a critical role in
            enhancing customer experiences. Through smart products and services,
            companies can offer personalized solutions, improve product quality,
            and gain valuable insights into consumer behavior. With IoT-enabled
            systems, businesses are empowered to make data-driven decisions that
            fuel growth, innovation, and competitive advantage.
          </p>
        </div>

        {/* Image Cluster on the Right */}
        <div className="md:w-1/2 flex flex-wrap justify-center items-center relative">
          {/* Use absolute positioning for random scatter effect */}
          <img
            src={IoTimg1}
            alt="IoT 1"
            className="absolute top-10 left-5 w-32 h-32 object-cover rounded-lg shadow-lg"
          />
          <img
            src={IoTimg1}
            alt="IoT 2"
            className="absolute top-20 right-10 w-24 h-24 object-cover rounded-lg shadow-lg"
          />
          <img
            src={IoTimg1}
            alt="IoT 3"
            className="absolute bottom-20 left-24 w-24 h-24 object-cover rounded-lg shadow-lg"
          />
          <img
            src={IoTimg1}
            alt="IoT 4"
            className="absolute bottom-10 right-40 w-28 h-28 object-cover rounded-lg shadow-lg"
          />
          <img
            src={IoTimg1}
            alt="IoT 5"
            className="absolute top-32 left-36 w-32 h-32 object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>

    {/* SOC Type 2 & ISO/IEC 27001 Dedication */}
    <section className="py-24 bg-gradient-to-r from-gray-800 to-transparent">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2">
          <h2 className="text-3xl font-semibold text-shadow-thin-black mb-6">
            Our Commitment to SOC 2 Type 2 & ISO/IEC 27001
          </h2>
          <p className="text-m text-gray-100 text-shadow-thin-black mb-8">
            We are dedicated to the highest standards of security and
            compliance, ensuring that our IoT solutions meet SOC 2 Type 2 and
            ISO/IEC 27001 certifications for your peace of mind.
          </p>
          <p className="text-m text-gray-100 text-shadow-thin-black mb-8">
            Security is at the core of everything we build. Our robust
            encryption, access controls, and continuous monitoring safeguard
            your data from potential threats while ensuring compliance with
            industry regulations. Whether you're deploying IoT in enterprise
            environments or critical infrastructure, our commitment to security
            helps you mitigate risks, maintain operational integrity, and build
            trust with your customers. By adhering to these internationally
            recognized standards, we provide secure, scalable, and reliable
            solutions tailored to your business needs.
          </p>
        </div>
        <div className="md:w-1/2 md:ml-8">
          {" "}
          {/* Added md:ml-8 for extra spacing */}
          <img
            src={securityImage}
            alt="Security Dedication"
            className="w-3/4 h-auto object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  </div>
);

export default Hero;

import React, { useState } from "react";
import CalendlyWidget from "./calendly";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    company: "",
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://mailgun-service.hayden-iot.com:5000/send-email", // This will need updated once launched into VolIoT prod
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Message sent successfully!");
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Error during request:", error);
      alert("Error: " + error.message);
    }
  };

  return (
    <section className="bg-gray-900 py-16">
      <div className="container mx-auto text-center">
        <h2 className="text-white text-3xl font-bold mb-8">Contact Us</h2>
        <form
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto bg-gray-800 p-8 rounded-lg"
        >
          <h3 className="pb-4 text-white">Send a Quick Message</h3>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Company"
            className="w-full mb-4 p-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
          />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full mb-4 p-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full mb-4 p-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell Us About the Mission"
            rows="4"
            className="w-full mb-4 p-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
          ></textarea>
          <button
            type="submit"
            className="bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 border-double border-4 border-indigo-600"
          >
            Send Message
          </button>
        </form>
        <div className="mt-8">
          <h3 className="text-white text-lg font-semibold mb-4">
            Schedule a Meeting
          </h3>
          <CalendlyWidget />
        </div>
      </div>
    </section>
  );
};

export default ContactForm;

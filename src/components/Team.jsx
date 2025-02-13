import React from "react";
import Bro from "../assets/slug.png";
import Chuck from "../assets/chuck.jpeg";
import Marcus from "../assets/marcus.jpeg";

const Team = () => {
  const teamMembers = [
    {
      name: "Dane",
      description:
        "Mechanical Engineer. Dane specializes in designing the most cost effective way to keeping your assets safe from the elements, rough work enviornments, or physical malicious intent.",
      imagePosition: "right",
      image: Bro,
    },
    {
      name: "Chuck",
      description:
        "Chucks' pancreas run on linux. With more than a decade of expirence in solutions architecture and the agile process, Chuck will see to the timely dilivery of the product you wish for.",
      imagePosition: "left",
      image: Chuck,
    },
    {
      name: "Sandip",
      description:
        "Sandip was found as an intern. Upon realizing he natural crativity and understanding of User Interfaces, the User Expirence and API data delivery, he has been a core team member since.",
      imagePosition: "right",
      image: Bro,
    },
    {
      name: "Marcus",
      description:
        "The Swedish Wizard. Marcus' understanding of embedded systems and mesh network topology brings a incedibly valuable set of skills to our team, creating all the brains and communications that deliver your data home.",
      imagePosition: "left",
      image: Marcus,
    },
    {
      name: "Andy",
      description:
        "Boots on the ground Systems Architect for a decade. Andy supports the team with infrastructure, platform development and automation.",
      imagePosition: "right",
      image: Bro,
    },
    {
      name: "Ryan",
      description:
        'Formally "The Guitar Mender". Ryan is well knowned accross Western Colorado as an accomplished buisness man and lutheir. He holds the helm of VolIoT while our science team creates for you.',
      imagePosition: "left",
      image: Bro,
    },
  ];

  return (
    <div className="p-8">
      <h1 className="w-full bg-gradient-to-r from-transparent via-gray-800 to-transparent text-white text-2xl font-bold text-center py-2 mt-8 mb-2">
        Our Team
      </h1>
      <div className="grid grid-cols-1 sm:text-2xs md:text-lg md:grid-cols-2 gap-6 mx-4 md:mx-16">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="bg-gray-800 p-4 rounded-lg flex items-center flex-wrap"
          >
            {member.imagePosition === "left" && (
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 sm:w-32 sm:h-32 object-contain rounded-full mr-4 mb-4 sm:mb-0"
              />
            )}
            <div
              className={`flex-1 ${
                member.imagePosition === "left" ? "text-right pl-4" : ""
              }`}
            >
              <h2 className="text-xl font-bold text-center">{member.name}</h2>
              <p>{member.description}</p>
            </div>
            {member.imagePosition === "right" && (
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 sm:w-32 sm:h-32 object-contain rounded-full ml-4 mb-4 sm:mb-0"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;

import React from "react";
import Slider from "react-slick";
import promo1 from "../assets/slug.png";
import promo2 from "../assets/slug.png";
import promo3 from "../assets/slug.png";

export default function SimpleSlider() {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };
  return (
    <Slider {...settings}>
      <div>
        <img
          src={promo1}
          alt="Promotion 1"
          className="w-full h-96 object-cover rounded-lg"
        />
        <p className="text-center mt-4">Promotion 1 Description</p>
      </div>
      <div>
        <img
          src={promo2}
          alt="Promotion 2"
          className="w-full h-96 object-cover rounded-lg"
        />
        <p className="text-center mt-4">Promotion 2 Description</p>
      </div>
      <div>
        <img
          src={promo3}
          alt="Promotion 3"
          className="w-full h-96 object-cover rounded-lg"
        />
        <p className="text-center mt-4">Promotion 3 Description</p>
      </div>
    </Slider>
  );
}

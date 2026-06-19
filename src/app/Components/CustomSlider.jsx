"use client";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function CustomSlider({ items }) {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: false,
    speed: 2500,
    autoplaySpeed: 3500,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="slider-container px-2">
      <Slider {...settings}>
        {items.map((item, index) => (
          <div key={index} className="px-2">
            <div className="relative w-43 h-60 overflow-hidden shadow-md">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-43 h-60 backdrop:blur-3xl bg-opacity-100 object-cover"
                />
              )}

              <div className="absolute bottom-0 left-0 right-0  bg-opacity-100 font-stretch-100% text-white backdrop-blur-3xl text-center py-2 text-sm font-semibold">
                {item.name}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default CustomSlider;


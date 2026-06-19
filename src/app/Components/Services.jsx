"use client";
import React from "react";
import CustomSlider from "./CustomSlider";

function Services() {
  const services = [
    { name: "Web Development", image: "/web dev 1.jpg" },
    { name: "Video Editing", image: "/video editing 1.jpg" }, 
    { name: "Software Development", image: "/soft dev 1.jpg" },
    { name: "SEO", image: "/seo 1.jpg" },
    { name: "Architecture Design", image: "/architecture design 1.jpg" },
    { name: "Graphics & Design", image: "/graphics 1.jpg" },
    { name: "Logo Design", image: "/logo design 1.jpg" },
    { name: "Social Media Marketing", image: "/social media marketing 1.jpg" },
    { name: "AI Development", image: "/ai 1.jpg" },
    { name: "Web Design", image: "/web design 1.jpg" },
    { name: "App Development", image: "/app dev 1.jpg" }
  ];

  return (
    <div className="text-center w-full overflow-hidden items-center justify-center px-4 gap-2 lg:px-20 xl:px-40 mx-auto my-40">
      <h2 className="mb-5 text-2xl font-semibold">Popular Services</h2>
      <CustomSlider items={services} />
    </div>
  );
}

export default Services;

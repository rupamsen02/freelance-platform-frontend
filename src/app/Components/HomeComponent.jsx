"use client";
import React, { useRef } from "react";
import Navbar from "./Navbar.jsx";
import Searchbar from "./Searchbar.jsx";
import Services from "./Services.jsx";
import Footer from "./Footer.jsx";
import { useRouter } from "next/navigation";

function HomeComponent() {
  const router = useRouter();
  const searchbarRef = useRef();

  const handleSearch = (query) => {
    const matchedCategories = [
      "All",
      "Graphics & Design",
      "Web Development",
      "Video Editing",
      "AI Development",
      "Digital Marketing",
      "Software Development",
      "App Development",
      "Logo Design",
      "Search Engine Optimization",
    ];

    const matched = matchedCategories.find(
      (cat) => cat.toLowerCase() === query.toLowerCase().trim(),
    );

    if (matched) {
      router.push(`/client/gigs?category=${encodeURIComponent(matched)}`);
    } else {
      alert("Category not found. Try again.");
    }
  };

  const handlePopularClick = (category) => {
    if (searchbarRef.current) {
      searchbarRef.current.setQueryExternally(category);
    }
  };

  return (
    <>
      <Navbar />
      <div className="relative flex flex-col items-center h-screen px-10 md:px-0 overflow-hidden justify-center">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="w-full h-155 max-h-screen object-cover absolute inset-0"
        >
          <source src="/video-small.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50 h-155"></div>

        <div className=" z-10 text-center sm:px-14 md:px-15 space-y-2 lg:px-4">
          <h1 className="text-white text-xl sm:text-4xl lg:text-6xl font-extralight drop-shadow-md leading-tight">
            Hire the Best Freelancers
          </h1>
          <h2 className="text-white text-lg sm:text-3xl drop-shadow-md">
            for your project
          </h2>

          <p className="sm:mt-4 text-white text-sm sm:text-base max-w-xl mx-auto">
            Connect with talented professionals in design, development,
            marketing, and more.
          </p>

          <div className="flex flex-col items-center my-1 sm:my-14 mx-4 space-y-4 md:px-40">
            <Searchbar ref={searchbarRef} onSearch={handleSearch} />
            <div className="flex flex-wrap justify-center sm:justify-start items-center pt-0 sm:pt-4 text-white gap-2 sm:gap-4 text-sm sm:text-base">
              <span className="w-full sm:w-auto text-center sm:text-left">
                Popular:
              </span>
              <section
                className="border px-2 py-1 rounded-2xl cursor-pointer"
                onClick={() => handlePopularClick("Web Development")}
              >
                Web Development
              </section>
              <section
                className="border px-2 py-1 rounded-2xl cursor-pointer"
                onClick={() => handlePopularClick("AI Development")}
              >
                AI Development
              </section>
              <section
                className="border px-2 py-1 rounded-2xl cursor-pointer"
                onClick={() => handlePopularClick("Logo Design")}
              >
                Logo Design
              </section>
            </div>
          </div>
        </div>

        <div className="relative flex flex-row sm:flex-col items-center justify-between sm:justify-center whitespace-nowrap sm:py-4 mx-auto text-white text-xs sm:text-sm w-full px-2 sm:px-20 md:px-40 lg:px-60 xl:px-80">
          <section className="text-sm sm:text-base hidden sm:flex">Trusted by:</section>
          <div className="flex items-center justify-center sm:justify-between w-full gap-2">
            <img src="google.png" alt="" className="w-12 sm:w-18 h-auto" />
            <img src="netflix.png" alt="" className="w-10 sm:w-16 h-auto" />
            <img src="meta.png" alt="" className="w-6 sm:w-8 h-auto" />
            <img src="p&g.png" alt="" className="w-6 sm:w-8 h-auto" />
            <img src="paypal.png" alt="" className="w-14 sm:w-20 h-auto" />
            <img src="payoneer.png" alt="" className="w-14 sm:w-20 h-auto" />
          </div>
        </div>
      </div>

      <div id="services" className="sm:my-28 my-0 scroll-mt-50 px-4 sm:px-0">
        <Services />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 w-full overflow-hidden -gap-20 bg-sky-100 items-center justify-center px-0 lg:px-40 mx-auto mt-20">
        <div className="px-6 md:px-15 lg:px-20 mb-2 text-gray-500 space-y-2">
          <h1 className="pt-10 sm:pt-20 text-2xl sm:text-3xl text-black">
            A whole world of freelancer at your fingertips
          </h1>
          <h2 className="font-bold mt-6">🌍 Global Access</h2>
          <section>
            Instantly connect with expert freelancers across the globe for any
            project, anytime, anywhere.
          </section>
          <h2 className="font-bold">🎨 Diverse Talent Pool</h2>
          <section>
            Access a vast talent pool in design, tech, marketing, writing, and
            much more easily.
          </section>
          <h2 className="font-bold">⚡ On-Demand Services</h2>
          <section>
            Hire professionals on-demand, manage tasks efficiently, and get
            quality results without leaving home.
          </section>
          <h2 className="font-bold">📱 Convenience & Flexibility</h2>
          <section className="pb-10 sm:pb-20">
            Flexible work solutions tailored to your needs, all from the
            convenience of your fingertips.
          </section>
        </div>
        <div className="px-4 sm:px-0 mt-20">
          <video
            src="/video1.mp4"
            loop
            autoPlay
            controls
            muted
            playsInline
            className="w-150 object-cover pr-0 sm:pr-10 pb-25 mx-auto"
          />
        </div>
      </div>

      <Footer />
    </>
  );
}

export default HomeComponent;

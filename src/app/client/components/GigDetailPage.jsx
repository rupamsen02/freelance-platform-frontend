"use client";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import newRequest from "./newRequest";
import Image1 from "next/image";
import Navbar from "./Navbar";
import Footer from "@/app/Components/Footer";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Reviews from "@/app/reviews/reviews";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const GigDetailPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const params = useParams();
  const searchParams = useSearchParams();
  const { id: gigId } = useParams();
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const {
    data: gigData,
    isLoading: isGigLoading,
    error: gigError,
  } = useQuery({
    queryKey: ["gig", gigId],
    queryFn: () => newRequest.get(`/gig/${gigId}`).then((res) => res.data),
    enabled: !!gigId,
  });
  useEffect(() => {
    if (gigData) {
      console.log("GIG DATA:", gigData);
    }
  }, [gigData]);

  const gig = gigData?.gig;

  const {
    data: freelancerData,
    isLoading: isFreelancerLoading,
    error: freelancerError,
  } = useQuery({
    queryKey: ["freelancer", gig?.userId],
    queryFn: () =>
      newRequest.get(`/freelancer/${gig.userId}`).then((res) => res.data),
    enabled: !!gig?.userId,
  });

  if (isGigLoading || isFreelancerLoading) {
    return <p className="p-10 text-gray-500">Loading gig details...</p>;
  }

  if (gigError || freelancerError) {
    return (
      <p className="p-10 text-red-500">Error fetching gig or freelancer.</p>
    );
  }

  if (!gig || !freelancerData) {
    return <p className="p-10 text-red-500">Gig or Freelancer not found.</p>;
  }

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? gig.images.length - 1 : prevIndex - 1,
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === gig.images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const handleContinue = () => {
    if (!currentUser) {
      window.dispatchEvent(new Event("openLoginModal"));
      return;
    }
    router.push(
      `/orders?title=${encodeURIComponent(gig.title)}&price=${
        gig.price
      }&cover=${encodeURIComponent(gig.cover)}&category=${encodeURIComponent(
        gig.category,
      )}&gigId=${gig._id}`,
    );
  };

  const handleContact = () => {
    const gigId = gig?._id;
    const freelancerId = gig?.userId;

    if (!gigId || !freelancerId) return;

    router.push(`/messages?gigId=${gigId}&to=${freelancerId}`);
  };

  return (
    <>
      <Navbar />
      <div className="relative">
        <div>
          <video
            autoPlay
            playsInline
            muted
            loop
            preload="metadata"
            src="/gigs-page-video.mp4"
            type="video/mp4"
            className="absolute w-full h-full opacity-90 inset-0 object-cover"
          />
        </div>
        <div className="absolute inset-0 backdrop-blur-2xl"></div>
        <div className="relative text-sm text-gray-400 mb-2 px-20 pt-10">
          <span
            className="text-black hover:underline cursor-pointer"
            onClick={() => router.push("/")}
          >
            Freelancer
          </span>{" "}
          &gt;{" "}
          <span
            className=" hover:underline text-gray-700 cursor-pointer"
            onClick={() =>
              router.push(
                `/client/gigs?category=${encodeURIComponent(gig.category)}`,
              )
            }
          >
            {gig.category || "All Categories"}
          </span>{" "}
          &gt; Gig Detail
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 px-20 pb-13 gap-10 relative">
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
              {gig.category}
            </h1>

            {gig.images?.length > 0 && (
              <div className="relative max-w-[120vh] max-h-[120vh] overflow-hidden rounded-lg shadow">
                <Image1
                  src={`${API_URL}/uploads/${gig.images[currentImageIndex]}`}
                  alt={`Gig image ${currentImageIndex + 1}`}
                  width={1280}
                  height={720}
                  className="w-full h-100 object-cover transition duration-300 ease-in-out"
                  unoptimized
                />
                {gig.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-80 text-white p-2 rounded-full"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-80 text-white p-2 rounded-full"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>
            )}

            <div className="space-y-4 text-gray-700 text-[15px]">
              <h2 className="text-xl font-semibold text-gray-800">
                About This Gig
              </h2>
              <p>{gig.desc}</p>
            </div>

            <div className="border border-gray-300 max-w-[120vh] rounded-lg ">
              <h2 className="text-lg font-semibold px-4 py-4 text-gray-800 mb-2">
                About the Freelancer
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-700">
                <div className="px-4 flex flex-col">
                  <strong>Name</strong> {freelancerData.fullName}
                </div>
                <div className="px-4 flex flex-col">
                  <strong>Country</strong> {freelancerData.country}
                </div>
                <div className="px-4 flex flex-col">
                  <strong>Member Since</strong>{" "}
                  {new Date(freelancerData.memberSince).getFullYear()}
                </div>
                <div className="px-4 flex flex-col">
                  <strong>Skills</strong>{" "}
                  {Array.isArray(gig.skills)
                    ? gig.skills.join(", ")
                    : gig.skills}
                </div>
                <div className="px-4 flex flex-col">
                  <strong>Languages Known</strong>{" "}
                  {freelancerData.languages?.join(", ")}
                </div>
                <div className="px-4 flex flex-col">
                  <strong>Service</strong> {freelancerData.serviceOffered}
                </div>
                <hr className="border-gray-300 border-t-2 w-[208%]" />
                <div className="sm:col-span-2 px-4 flex flex-col mb-4">
                  <strong>About Me</strong> {freelancerData.shortDescription}
                </div>
              </div>
            </div>
            <Reviews gigId={gigId} />
          </div>

          <div className="bg-gray-50 rounded-xl p-6 w-[100%] shadow space-y-4 h-fit">
            <h2 className="text-xl font-bold text-gray-800">Gig Info</h2>
            <div className="space-y-2 flex justify-between">
              <p className="flex flex-col">
                <span className="font-bold">Title</span> {gig.title}
              </p>
              <p className="flex flex-col text-right">
                <span className="font-bold">Price</span> ₹{gig.price}
              </p>
            </div>
            <div className="space-y-2 flex justify-between">
              <p className="flex flex-col">
                <span className="font-bold">Delivery Time</span>{" "}
                {gig.deliveryTime} days
              </p>
              <p className="flex flex-col text-right">
                <span className="font-bold">Tags</span>{" "}
                <span className="flex flex-col items-end text-end justify-end gap-1 text-gray-400">
                  {gig.tags?.map((tag, index) => {
                    return (
                      <span key={index} className="text-sm">
                        #{tag}
                      </span>
                    );
                  })}
                </span>
              </p>
            </div>
            {currentUser?.role !== "freelancer" ? (
              <button
                className="btn w-full bg-black text-white"
                onClick={handleContinue}
              >
                Purchase
              </button>
            ) : null}
            {currentUser?.role === "client" ? (
              <button className="btn w-full" onClick={handleContact}>
                Contact Me
              </button>
            ) : currentUser?.role === "freelancer" ? (
              <button
                className="btn w-full"
                onClick={() =>
                  router.push(`/messages?to=${gig.userId}&gigId=${gig._id}`)
                }
              >
                Messages
              </button>
            ) : null}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default GigDetailPage;

"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import newRequest from "./newRequest";
import { ChevronLeft, ChevronRight } from "lucide-react";

const GigCard = ({ item }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNext = (e) => {
    e.preventDefault();
    if (item.cover && currentImageIndex < item.cover.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    }
  };

  const handlePrev = (e) => {
    e.preventDefault();
    if (item.cover && currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    }
  };

  const {
    data: freelancer,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["freelancer", item.userId],
    queryFn: () =>
      newRequest.get(`/freelancer/${item.userId}`).then((res) => res.data),
  });

  const averageRating =
    item.starNumber > 0 ? Math.round(item.totalStars / item.starNumber) : 0;

  return (
    <Link href={`/client/gigs/${item._id}`} className="block">
      <div className="border-animation rounded-3xl">
        <div className="relative w-full bg-white rounded-3xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden group">
          <div className="relative">
            <img
              src={
                item.cover && item.cover.length > 0
                  ? `http://localhost:8800/uploads/${encodeURIComponent(item.cover[currentImageIndex])}`
                  : "/noimage.jpg"
              }
              alt={`gig-${item._id}`}
              className="w-full h-[220px] sm:h-[200px] object-cover rounded-t-xl transition duration-300 group-hover:scale-105"
            />
          </div>

          <div className="p-4">
            {isLoading ? (
              <p className="text-sm text-gray-400">Loading user...</p>
            ) : error ? (
              <p className="text-sm text-red-500">Failed to load user</p>
            ) : (
              <p className="text-sm font-semibold text-gray-800 mb-1">
                {freelancer.displayName}
              </p>
            )}

            <p className="text-sm text-gray-600 mb-2 truncate">{item.desc}</p>

            <div className="flex items-center gap-1 text-yellow-500 text-sm mb-3">
              <img src="/star.png" alt="star" className="w-4 h-4" />
              <span>{!isNaN(averageRating) ? averageRating : "0"}</span>
            </div>
          </div>

          <div className="border-t px-4 py-3 flex items-center justify-between">
            <img
              src="/heart.png"
              alt="heart"
              className="w-5 h-5 opacity-60 hover:opacity-100"
            />
            <div className="text-right">
              <span className="text-xs text-gray-400">STARTING AT</span>
              <h2 className="text-md font-bold text-gray-800">${item.price}</h2>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;

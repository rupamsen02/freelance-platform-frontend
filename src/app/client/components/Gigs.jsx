"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import newRequest from "./newRequest";
import GigCard from "./GigCard";
import Navbar from "./Navbar";
import Footer from "@/app/Components/Footer";

const Gigs = () => {
  const [sort, setSort] = useState("sales");
  const [open, setOpen] = useState(false);
  const minRef = useRef();
  const maxRef = useRef();
  const router = useRouter();

  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";

  const buildQueryString = () => {
    const query = new URLSearchParams(searchParams.toString());

    if (minRef.current?.value) query.set("min", minRef.current.value);
    if (maxRef.current?.value) query.set("max", maxRef.current.value);
    if (sort) query.set("sort", sort);

    return query.toString() ? `?${query.toString()}` : "";
  };

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["gigs", sort, category],
    queryFn: () =>
      newRequest
        .get(
          `/gig?category=${category}&sort=${sort}&min=${
            minRef.current?.value || ""
          }&max=${maxRef.current?.value || ""}`,
        )
        .then((res) => res.data),
  });

  useEffect(() => {
    refetch();
  }, [sort, category]);

  const apply = () => {
    refetch();
  };

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  return (
    <>
      <Navbar />
      <div className="relative flex felx-col items-center justify-center">
        <div>
          <video
            muted
            loop
            autoPlay
            playsInline
            preload="metadata"
            className="w-full h-full absolute inset-0 opacity-95 object-cover"
          >
            <source src="/gigs-page-video.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="absolute inset-0 backdrop-blur-2xl"></div>
        <div className="relative px-6 md:px-20 py-10">
          <div className="text-sm text-gray-400 mb-2">
            <span
              className="text-black hover:underline cursor-pointer"
              onClick={() => router.push("/")}
            >
              Freelancer
            </span>{" "}
            &gt; {category || "All Categories"}
          </div>
          <h1 className="text-3xl font-bold mb-2">{category || "All Gigs"}</h1>
          <p className="text-gray-200 mb-8">
            Browse top gigs in {category || "various categories"}.
          </p>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="font-medium">Budget:</span>
              <input
                ref={minRef}
                type="number"
                placeholder="Min"
                className="border border-gray-300 rounded px-2 py-1 w-20 text-sm"
              />
              <input
                ref={maxRef}
                type="number"
                placeholder="Max"
                className="border border-gray-300 rounded px-2 py-1 w-20 text-sm"
              />
              <button
                onClick={apply}
                className="bg-black text-white px-4 py-1 rounded text-sm ml-2"
              >
                Apply
              </button>
            </div>

            <div className="relative">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                <span className="text-sm text-gray-600">Sort by:</span>
                <span className="font-medium">
                  {sort === "sales" ? "Best Selling" : "Newest"}
                </span>
                <img src="/down.png" alt="dropdown" className="w-3 h-3" />
              </div>
              {open && (
                <div className="absolute right-0 top-6 bg-white shadow border rounded text-sm z-10">
                  {sort !== "createdAt" && (
                    <div
                      className="px-4 py-2 hover:bg-gray-100 outline-none shadow-2xl cursor-pointer"
                      onClick={() => reSort("createdAt")}
                    >
                      Newest
                    </div>
                  )}
                  {sort !== "sales" && (
                    <div
                      className="px-4 py-2 hover:bg-gray-100 outline-none shadow-2xl cursor-pointer"
                      onClick={() => reSort("sales")}
                    >
                      Best Selling
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              <p className="text-sm text-gray-400">Loading gigs...</p>
            ) : error ? (
              <p className="text-sm text-red-500">Failed to load gigs</p>
            ) : data && data.length > 0 ? (
              data.map((gig) => <GigCard key={gig._id} item={gig} />)
            ) : (
              <p className="text-sm text-gray-400">No gigs found</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Gigs;

"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HiMenu } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import newRequest from "./newRequest";
import LoginComponent from "@/app/Components/Login";
import JoinComponent from "@/app/Components/Join";
import Become_a_seller from "@/app/Components/Become_a_seller";
import { useLocalStorage } from "@/app/hook/useLocalStorage";

function Navbar() {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const currentUser = useLocalStorage("currentUser");

  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
      localStorage.removeItem("currentUser");
      window.dispatchEvent(
        new CustomEvent("localStorageChanged", {
          detail: { key: "currentUser", value: null },
        }),
      );
      router.push("/")
    } catch (err) {
      console.log(err);
    }
  };

  const handleContinue = () => {
    router.push(
      `/orders?title=${encodeURIComponent(gig.title)}&price=${
        gig.price
      }&cover=${encodeURIComponent(gig.cover)}&category=${encodeURIComponent(
        gig.category,
      )}&gigId=${gig._id}`,
    );
  };

  const categories = [
    "Graphics and Design",
    "Web Development",
    "Video Editing",
    "AI Development",
    "Digital Marketing",
    "Software Development",
    "App Development",
    "Logo Design",
    "Search Engine Optimization",
  ];

  return (
    <div
      className={`sticky top-0 z-[999] w-full transition-all duration-500 ${
        active || pathname !== "/"
          ? "bg-white text-black shadow"
          : "bg-[#013914] text-white"
      }`}
    >
      <div className="w-full max-w-[1400px] mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-3xl font-bold flex items-center gap-1">
          Freelancer<span className="text-[#1dbf73]">.</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 font-medium underline-offset-8">
          <Link href="/" className="cursor-pointer hover:underline">Home</Link>
          {currentUser ? (
            <div className="relative">
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <img
                  src={
                    currentUser.img
                      ? `${API_URL}/uploads/${encodeURIComponent(
                          currentUser.img,
                        )}`
                      : "/img/noavatar.jpg"
                  }
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span>{currentUser.username}</span>
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-md z-[999] text-gray-700 py-3 px-4 flex flex-col gap-3 text-sm">
                  {currentUser.role === "freelancer" && (
                    <>
                      {pathname !== "/freelancer/components" && (
                        <Link
                          href="/freelancer/components"
                          className="cursor-pointer"
                        >
                          My profile
                        </Link>
                      )}
                      {pathname !== "/freelancer/my-gigs" && (
                        <Link
                          href="/freelancer/my-gigs"
                          className="cursor-pointer"
                        >
                          My gigs
                        </Link>
                      )}
                    </>
                  )}
                  <Link href="/client/gigs" className="cursor-pointer">
                    Gigs
                  </Link>
                  {currentUser.role === "freelancer" && (
                    <>
                      <Link
                        href="/freelancer/add-gig"
                        className="cursor-pointer"
                      >
                        Add New Gig
                      </Link>
                    </>
                  )}
                  {currentUser.role !== "freelancer" && (
                    <>
                      {pathname !== "/orders" && (
                        <Link
                          href="/orders"
                          onClick={handleContinue}
                          className="cursor-pointer"
                        >
                          Orders
                        </Link>
                      )}
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-left cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-full sm:px-2 gap-4 sm:pb-0 pb-8 flex flex-col sm:flex-row items-center justify-center">
              <LoginComponent />
              <JoinComponent />
            </div>
          )}
        </div>

        <div className="md:hidden flex items-center">
          <button
            onClick={() => setOpen(!open)}
            className="text-2xl cursor-pointer"
          >
            {open ? <IoClose /> : <HiMenu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden px-4 py-3 space-y-2 bg-white text-black">
          <div className="flex flex-col gap-2 cursor-pointer font-medium">
            <span>Freelancer Business</span>
            <span>Explore</span>
            <span>English</span>
            {!currentUser?.role === "freelancer" && (
              <span>Become a Seller</span>
            )}
            {currentUser ? (
              <>
                {currentUser.role === "freelancer" && (
                  <>
                    <Link href="/mygigs">Gigs</Link>
                    <Link href="/freelancer/add-gig">Add New Gig</Link>
                  </>
                )}
                {pathname !== "/orders" && (
                  <Link href="/orders" className="cursor-pointer">
                    Orders
                  </Link>
                )}
                <Link href="/messages">Messages</Link>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <Link href="/login">Sign In</Link>
            )}
          </div>
        </div>
      )}

      {(active || pathname !== "/") && (
        <>
          <hr className="border-gray-200" />
          <div className="max-w-[1400px] mx-auto px-4 py-2 flex flex-wrap justify-between gap-3 text-sm text-gray-600 font-light">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/client/gigs?category=${encodeURIComponent(cat)}`}
              >
                {cat}
              </Link>
            ))}
          </div>
          <hr className="border-gray-200" />
        </>
      )}
    </div>
  );
}

export default Navbar;

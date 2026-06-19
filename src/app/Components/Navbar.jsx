"use client";
import React, { useEffect, useState } from "react";
import { HiMenu } from "react-icons/hi";
import LoginComponent from "./Login.jsx";
import JoinComponent from "./Join.jsx";
import Become_a_seller from "./Become_a_seller.jsx";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation.js";
import newRequest from "../client/components/newRequest.jsx";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser && storedUser !== "null") {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser && storedUser !== "null") {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
      localStorage.removeItem("currentUser");
      setCurrentUser(null);
      router.push("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleContinue = (gig) => {
    if (gig && gig.title) {
      router.push(
        `/orders?title=${encodeURIComponent(gig.title)}&price=${gig.price}&cover=${encodeURIComponent(
          gig.cover,
        )}&category=${encodeURIComponent(gig.category)}&gigId=${gig._id}`,
      );
    } else {
      router.push("/orders");
    }
  };

  return (
    <>
      <div className="w-full sticky top-0 shadow z-[999] bg-white text-black transition-all duration-500 px-4 sm:px-6 md:px-10 lg:px-20 py-6 flex items-center justify-between">
        <div>
          <a className="text-2xl md:text-3xl font-bold">
            Freelancer<span className="font-bold text-[#1dbf73]">.</span>
          </a>
        </div>

        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-3xl">
            <HiMenu />
          </button>
        </div>

        <div
          className={`hidden md:flex absolute top-[80px] left-0 bg-base-100 sm:bg-transparent sm:gap-8 sm:items-left text-xs lg:text-base sm:w-auto z-50 sm:static sm:mt-0 -mt-2 sm:pt-0 pt-2 sm:px-0 px-2 text-left`}
        >
          <div className="flex items-center gap-4 xl:gap-8 underline-offset-8">
            <Link href="/client/gigs" className="hover:underline">
              Explore Our Gigs
            </Link>
            <Link href="#services" className="hover:underline">
              Services
            </Link>

            {!loading &&
              (currentUser ? (
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
                          <Link
                            href="/freelancer/components"
                            className="cursor-pointer"
                          >
                            My profile
                          </Link>
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
                      {pathname !== "/orders" && (
                        <Link href="/orders" onClick={() => handleContinue()}>
                          Orders
                        </Link>
                      )}
                      <Link href="/messages" className="cursor-pointer">
                        Messages
                      </Link>
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
                <>
                  <div className="rounded-full gap-4 sm:pb-0 pb-8">
                    <LoginComponent className="text-xs lg:text-base" />
                  </div>
                  <JoinComponent />
                </>
              ))}
          </div>
        </div>
      </div>

      {/* Mobile menu */}

      <div
        className={`md:hidden fixed top-0 h-full w-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col p-40 items-center justify-center text-center space-y-6">
          {/* <button
            onClick={() => setMenuOpen(false)}
            className="self-end text-2xl font-bold"
          >
            ✕
          </button> */}

          <div className="flex flex-col gap-4 text-lg  font-medium">
            <div className="hover:underline">Freelancer Business</div>
            <div className="hover:underline">Explore Our Gigs</div>
            <Link
              href="#services"
              onClick={() => setMenuOpen(false)}
              className="hover:underline"
            >
              Services
            </Link>
            <div className="hover:underline">English</div>
            {currentUser?.role === "client" && (
              <div className="hover:underline">
                <Become_a_seller />
              </div>
            )}

            {!loading &&
              (currentUser ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        currentUser.img
                          ? `${API_URL}/uploads/${encodeURIComponent(currentUser.img)}`
                          : "/img/noavatar.jpg"
                      }
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span>{currentUser.username}</span>
                  </div>

                  <Link href="/client/gigs">Gigs</Link>
                  {currentUser.role === "freelancer" && (
                    <Link href="/freelancer/add-gig">Add New Gig</Link>
                  )}
                  {pathname !== "/orders" && (
                    <Link href="/orders" onClick={() => handleContinue()}>
                      Orders
                    </Link>
                  )}
                  <Link href="/messages">Messages</Link>
                  <button
                    onClick={handleLogout}
                    className="text-left text-red-500"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <LoginComponent />
                  <JoinComponent />
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;

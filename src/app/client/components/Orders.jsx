"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import newRequest from "./newRequest";
import Navbar from "./Navbar";
import Footer from "@/app/Components/Footer";
import { loadStripe } from "@stripe/stripe-js";

const Orders = ({ title, price, cover, category, gigId }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(user);
    console.log("Current User:", user);
  }, []);

  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      newRequest.get(`/orders`).then((res) => {
        return res.data;
      }),
  });

  const handleCheckout = async () => {
    const stripe = await stripePromise;

    const res = await fetch(
      `${apiUrl}/api/payment/create-checkout-session`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gigId,
          title,
          price,
        }),
      }
    );

    const session = await res.json();

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error(result.error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="text-sm text-gray-400 mb-2 px-20 pt-10">
        <span
          className="text-black hover:underline cursor-pointer"
          onClick={() => router.push("/")}
        >
          Freelancer
        </span>{" "}
        &gt;{" "}
        <span
          className="text-black hover:underline cursor-pointer"
          onClick={() =>
            router.push(
              `/client/gigs?category=${encodeURIComponent(category || "")}`
            )
          }
        >
          {category || "All Categories"}
        </span>{" "}
        &gt;{" "}
        <span
          className="text-black hover:underline cursor-pointer"
          onClick={() => router.push(`/client/gigs/${gigId}`)}
        >
          Gig Detail
        </span>{" "}
        &gt; Orders
      </div>
      <div className="flex flex-col justify-center text-gray-700 overflow-hidden">
        {isLoading ? (
          "Loading..."
        ) : error ? (
          "Error loading orders"
        ) : (
          <div className="max-w-screen text-left w-full py-2 px-4 sm:px-8 lg:px-20">
            <div className="flex items-center mb-16">
              <h1 className="text-2xl font-semibold">Orders</h1>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 h-12">
                    <th className="px-4">Image</th>
                    <th className="px-4">Title</th>
                    <th className="px-4">Price</th>
                    {/* <th className="px-4">Contact</th> */}
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(data) && data.length === 0 && (
                    <tr className="h-12 bg-yellow-100/30">
                      <td className="px-4">
                        <img
                          src={`${apiUrl}/uploads/${encodeURIComponent(
                            cover
                          )}`}
                          alt="Cover"
                          className="w-[50px] h-[25px] object-cover"
                        />
                      </td>
                      <td className="px-4">{title}</td>
                      <td className="px-4">₹{price}</td>
                    </tr>
                  )}

                  {Array.isArray(data) &&
                    data.map((order, idx) => (
                      <tr
                        key={order._id}
                        className={`h-12 ${
                          idx % 2 === 0 ? "bg-green-100/10" : ""
                        }`}
                      >
                        <td className="px-4 ">
                          <img
                            src={order.cover}
                            alt="Order"
                            className="w-[50px] h-[25px] object-cover"
                          />
                        </td>
                        <td className="px-4">{order.title}</td>
                        <td className="px-4">
                          {order.price}
                          <sup className="text-xs">₹</sup>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <button
          className="btn bg-black relative text-white w-full sm:w-auto overflow-hidden items-center mt-[3%] mb-[6%] px-4 mx-auto"
          onClick={handleCheckout}
        >
          {" "}
          Continue to Pay ({price})
        </button>
      </div>
      <Footer />
    </>
  );
};

export default Orders;

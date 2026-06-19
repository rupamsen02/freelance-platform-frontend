"use client";
import React from "react";
import { Slider } from "infinite-react-carousel/lib";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "./newRequest";
import Reviews from "./Reviews";

function Gig() {
  const { id } = useParams();

  const { isLoading, error, data } = useQuery({
    queryKey: ["gig"],
    queryFn: () =>
      newRequest.get(`/gig/${id}`).then((res) => res.data),
  });

  const userId = data?.userId;

  const {
    isLoading: isLoadingUser,
    error: errorUser,
    data: dataUser,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () =>
      newRequest.get(`/users/${userId}`).then((res) => res.data),
    enabled: !!userId,
  });

  return (
    <div className="flex justify-center px-4 py-8">
      {isLoading ? (
        "loading"
      ) : error ? (
        "Something went wrong!"
      ) : (
        <div className="w-full max-w-[1400px] flex gap-12">
          <div className="flex-[2] flex flex-col gap-6">
            <span className="uppercase text-sm text-gray-600 font-light">Freelancer &gt; Graphics & Design &gt;</span>
            <h1 className="text-2xl font-semibold">{data.title}</h1>

  
            {isLoadingUser ? (
              "loading"
            ) : errorUser ? (
              "Something went wrong!"
            ) : (
              <div className="flex items-center gap-3">
                <img
                  className="w-8 h-8 rounded-full object-cover"
                  src={dataUser.img || "/img/noavatar.jpg"}
                  alt=""
                />
                <span className="text-sm font-medium">{dataUser.username}</span>
                {!isNaN(data.totalStars / data.starNumber) && (
                  <div className="flex items-center gap-1">
                    {Array(Math.round(data.totalStars / data.starNumber))
                      .fill()
                      .map((_, i) => (
                        <img src="/img/star.png" alt="" key={i} className="w-4 h-4" />
                      ))}
                    <span className="text-yellow-500 text-sm font-bold">
                      {Math.round(data.totalStars / data.starNumber)}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="bg-gray-100">
              <Slider slidesToShow={1} arrowsScroll={1}>
                {data.images.map((img) => (
                  <img key={img} src={img} alt="" className="max-h-[500px] object-contain w-full" />
                ))}
              </Slider>
            </div>

            <h2 className="text-xl font-medium">About This Gig</h2>
            <p className="text-gray-600 font-light leading-6">{data.desc}</p>

            {isLoadingUser ? (
              "loading"
            ) : errorUser ? (
              "Something went wrong!"
            ) : (
              <div className="mt-12 flex flex-col gap-5">
                <h2 className="text-xl font-medium">About The Seller</h2>
                <div className="flex items-center gap-6">
                  <img
                    src={dataUser.img || "/img/noavatar.jpg"}
                    alt=""
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <div className="flex flex-col gap-2">
                    <span className="font-medium">{dataUser.username}</span>
                    {!isNaN(data.totalStars / data.starNumber) && (
                      <div className="flex items-center gap-1">
                        {Array(Math.round(data.totalStars / data.starNumber))
                          .fill()
                          .map((_, i) => (
                            <img src="/img/star.png" alt="" key={i} className="w-4 h-4" />
                          ))}
                        <span className="text-yellow-500 text-sm font-bold">
                          {Math.round(data.totalStars / data.starNumber)}
                        </span>
                      </div>
                    )}
                    <button className="border border-gray-400 px-4 py-2 rounded hover:bg-gray-100 transition">
                      Contact Me
                    </button>
                  </div>
                </div>

                <div className="border border-gray-300 p-5 rounded mt-5">
                  <div className="flex flex-wrap justify-between">
                    <div className="w-[45%] mb-4">
                      <span className="font-light block">From</span>
                      <span>{dataUser.country}</span>
                    </div>
                    <div className="w-[45%] mb-4">
                      <span className="font-light block">Member since</span>
                      <span>Aug 2022</span>
                    </div>
                    <div className="w-[45%] mb-4">
                      <span className="font-light block">Avg. response time</span>
                      <span>4 hours</span>
                    </div>
                    <div className="w-[45%] mb-4">
                      <span className="font-light block">Last delivery</span>
                      <span>1 day</span>
                    </div>
                    <div className="w-[45%] mb-4">
                      <span className="font-light block">Languages</span>
                      <span>English</span>
                    </div>
                  </div>
                  <hr className="my-4 border-gray-300" />
                  <p className="text-gray-600 font-light">{dataUser.desc}</p>
                </div>
              </div>
            )}

            <Reviews gigId={id} />
          </div>

          {/* Right Section */}
          <div className="flex-1 border border-gray-300 p-6 rounded sticky top-36 h-fit max-h-[500px] flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">{data.shortTitle}</h3>
              <h2 className="font-light text-xl">${data.price}</h2>
            </div>
            <p className="text-gray-500">{data.shortDesc}</p>
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-2">
                <img src="/img/clock.png" alt="" className="w-5" />
                <span>{data.deliveryDate} Days Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="/img/recycle.png" alt="" className="w-5" />
                <span>{data.revisionNumber} Revisions</span>
              </div>
            </div>
            <div>
              {data.features.map((feature) => (
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-2" key={feature}>
                  <img src="/img/greencheck.png" alt="" className="w-4" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <Link to={`/pay/${id}`}>
              <button className="bg-green-500 hover:bg-green-600 text-white text-lg font-medium py-2 rounded">
                Continue
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gig;

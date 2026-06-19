"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import newRequest from "../../utils/newRequest";
import Review from "../review/Review";

const Reviews = ({ gigId }) => {
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["reviews"],
    queryFn: () =>
      newRequest.get(`/reviews/${gigId}`).then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (review) => {
      return newRequest.post("/reviews", review);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews"]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const desc = e.target[0].value;
    const star = e.target[1].value;
    mutation.mutate({ gigId, desc, star });
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-6">Reviews</h2>

      {isLoading ? (
        "loading"
      ) : error ? (
        "Something went wrong!"
      ) : (
        data.map((review) => <Review key={review._id} review={review} />)
      )}

      <div className="mt-6 flex flex-col gap-6">
        <h3 className="text-lg font-medium">Add a review</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="Write your opinion"
            className="p-5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <select
            className="w-48 self-end p-4 border border-gray-300 rounded focus:outline-none"
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
          <button
            type="submit"
            className="self-end w-28 bg-green-500 hover:bg-green-600 text-white py-2 rounded"
          >
            Send
          </button>
        </form>
      </div>

      <hr className="my-12 border-t border-gray-300" />
    </div>
  );
};

export default Reviews;

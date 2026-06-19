"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../client/components/newRequest";
import Review from "./review";

const Reviews = ({ gigId }) => {
  const queryClient = useQueryClient();

  
  const { isLoading, error, data } = useQuery({
    queryKey: ["reviews"],
    queryFn: () =>
        newRequest.get(`/review/${gigId}`).then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (review) => newRequest.post("/review", review),
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews", gigId]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const desc = e.target[0].value;
    const star = e.target[1].value;
    mutation.mutate({ gigId, desc, star });
    e.target.reset();
  };

  console.log("Gig ID in Reviews.jsx:", gigId);
  console.log("Is data an array?", Array.isArray(data));
  console.log("Data content:", data);
  console.log("Error from useQuery:", error);

  return (
    <div className="mt-12 max-w-[120vh]">
      <h2 className="text-2xl font-semibold mb-6">Reviews</h2>

      {isLoading ? (
        "Loading..."
      ) : error ? (
        <div className="text-red-500">
          <p>Something went wrong!</p>
          {/* Show error details for debugging */}
          <pre className="text-xs bg-gray-100 p-2 rounded mt-2">
            {error.message}
          </pre>
        </div>
      ) : data && Array.isArray(data) && data.length > 0 ? (
        data
          .filter((r) => r.userId)
          .map((review) => <Review key={review._id} review={review} />)
      ) : (
        <p>No reviews yet</p>
      )}

      <div className="mt-8 flex flex-col gap-5 ">
        <h3 className="text-lg font-medium">Add a review</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Write your opinion"
            className="p-4 border border-gray-300  rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
          <select className="w-48 p-2 border border-gray-300 rounded-md self-end focus:outline-none">
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
          <button
            type="submit"
            className="w-24 self-end bg-black text-white py-2 rounded-md hover:bg-gray-900 transition"
          >
            Send
          </button>
        </form>
      </div>

      <hr className="border-t border-gray-300 my-12" />
    </div>
  );
};

export default Reviews;

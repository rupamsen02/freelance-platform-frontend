"use client";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../client/components/newRequest";

const Review = ({ review }) => {
  if (!review || !review.userId) return null;
  const { isLoading, error, data } = useQuery({
    queryKey: [review.userId],
    queryFn: () =>
        review?.userId
      ? newRequest.get(`/users/${review.userId}`).then((res) => res.data)
      : Promise.resolve(null),
  });
  console.log("User data:", data);
  console.log("Resolved image path:", `http://localhost:8800/uploads/${data?.img ?? "noavatar.jpg"}`);
  return (
    <div className="flex flex-col gap-5 my-5">
      {isLoading ? (
        "Loading..."
      ) : error ? (
        "Error loading user"
      ) : (
        <div className="flex items-center gap-4">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src={`http://localhost:8800/uploads/${data.img || "noavatar.jpg"}`}
            alt="user profile"
          />
          <div className="flex flex-col">
            <span className="font-medium">{data.username}</span>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              {/* <span>{data.country}</span> */}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-1">
        {Array(review.star)
          .fill()
          .map((_, i) => (
            <img src="/star.png" alt="star" key={i} className="h-4 w-4" />
          ))}
        <span className="text-yellow-400 font-semibold text-sm ml-1">
          {review.star}
        </span>
      </div>

      <p className="text-sm text-gray-700">{review.desc}</p>

      <div className="flex items-center gap-3 text-sm text-gray-600">
        <span>Helpful?</span>
        <img src="/like.png" alt="like" className="w-4" />
        <span>Yes</span>
        <img src="/dislike.png" alt="dislike" className="w-4" />
        <span>No</span>
      </div>
    </div>
  );
};

export default Review;

"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "@/app/client/components/Navbar";

export default function MyGigs() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingGig, setEditingGig] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const router = useRouter();

  useEffect(() => {
    fetchMyGigs();
  }, []);

  const fetchMyGigs = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("currentUser"));

      const res = await axios.get(`${API_URL}/api/gig/my-gigs`, {
        withCredentials: true,
      });

      setGigs(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    try {
      await axios.delete(`${API_URL}/api/gig/${id}`, {
        withCredentials: true,
      });

      setGigs((prev) => prev.filter((gig) => gig._id !== id));

      toast.success("Gig deleted");
    } catch (err) {
      console.log(err);
      toast.error("Delete failed");
    }
  };

  const handleUpdate = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("currentUser"));

      await axios.put(
        `${API_URL}/api/gig/${editingGig._id}`,
        {
          title: editingGig.title,
          desc: editingGig.desc,
          category: editingGig.category,
          price: editingGig.price,
          deliveryTime: editingGig.deliveryTime,
          revisionNumber: editingGig.revisionNumber,
          skills: editingGig.skills,
          tags: editingGig.tags,
          cover: editingGig.cover,
          images: editingGig.images,
        },
        {
          withCredentials: true,
        },
      );

      setGigs((prev) =>
        prev.map((gig) => (gig._id === editingGig._id ? editingGig : gig)),
      );

      setEditingGig(null);

      toast.success("Gig Updated");
    } catch (err) {
      console.log(err);
      toast.error("Update Failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="px-20 py-10">
        <h1 className="text-3xl font-bold mb-8">Your Gigs</h1>

        {loading ? (
          <p>Loading...</p>
        ) : gigs.length === 0 ? (
          <p>No gigs found. Create your new gig!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full space-y-6">
            {gigs.map((gig) => (
              <div
                key={gig._id}
                className="border border-gray-400 rounded-lg p-4"
              >
                {editingGig?._id === gig._id ? (
                  <>
                    <input
                      value={editingGig.title}
                      onChange={(e) =>
                        setEditingGig({
                          ...editingGig,
                          title: e.target.value,
                        })
                      }
                      className="border p-2 w-full mb-2"
                    />

                    <textarea
                      value={editingGig.desc}
                      onChange={(e) =>
                        setEditingGig({
                          ...editingGig,
                          desc: e.target.value,
                        })
                      }
                      className="border p-2 w-full mb-2"
                    />

                    <input
                      value={editingGig.category}
                      onChange={(e) =>
                        setEditingGig({
                          ...editingGig,
                          category: e.target.value,
                        })
                      }
                      className="border p-2 w-full mb-2"
                    />

                    <input
                      value={editingGig.price}
                      onChange={(e) =>
                        setEditingGig({
                          ...editingGig,
                          price: e.target.value,
                        })
                      }
                      className="border p-2 w-full mb-2"
                    />

                    <input
                      value={editingGig.deliveryTime}
                      onChange={(e) =>
                        setEditingGig({
                          ...editingGig,
                          deliveryTime: e.target.value,
                        })
                      }
                      className="border p-2 w-full mb-2"
                    />

                    <input
                      value={editingGig.revisionNumber}
                      onChange={(e) =>
                        setEditingGig({
                          ...editingGig,
                          revisionNumber: e.target.value,
                        })
                      }
                      className="border p-2 w-full mb-2"
                    />

                    <input
                      value={editingGig.skills?.join(", ") || ""}
                      onChange={(e) =>
                        setEditingGig({
                          ...editingGig,
                          skills: e.target.value
                            .split(",")
                            .map((item) => item.trim()),
                        })
                      }
                      className="border p-2 w-full mb-2"
                    />

                    <input
                      value={editingGig.tags?.join(", ") || ""}
                      onChange={(e) =>
                        setEditingGig({
                          ...editingGig,
                          tags: e.target.value
                            .split(",")
                            .map((item) => item.trim()),
                        })
                      }
                      className="border p-2 w-full mb-2"
                    />

                    <p className="text-sm text-gray-600 mb-2">
                      Current Cover: {editingGig.cover?.[0]}
                    </p>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setEditingGig({
                          ...editingGig,
                          newCover: e.target.files[0],
                        })
                      }
                      className="
                        w-full
                        border-2 border-dashed border-gray-300
                        rounded-lg
                        p-3
                        my-2
                        text-sm
                        cursor-pointer
                        bg-gray-50
                        hover:border-blue-500
                        hover:bg-blue-50
                        transition-all
                        duration-200
                        file:mr-4
                        file:py-2
                        file:px-4
                        file:rounded-md
                        file:border-0
                        file:text-sm
                        file:font-semibold
                        file:bg-blue-600
                        file:text-white
                        hover:file:bg-blue-700
                      "
                    />

                    <p className="text-sm text-gray-600 mb-2">
                      Current Images:
                    </p>

                    <ul className="text-sm text-gray-600 mb-2">
                      {editingGig.images?.map((img, index) => (
                        <li key={index}>{img}</li>
                      ))}
                    </ul>

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) =>
                        setEditingGig({
                          ...editingGig,
                          newImages: Array.from(e.target.files),
                        })
                      }
                      className="
                        w-full
                        border-2 border-dashed border-gray-300
                        rounded-lg
                        p-3
                        my-2
                        text-sm
                        cursor-pointer
                        bg-gray-50
                        hover:border-blue-500
                        hover:bg-blue-50
                        transition-all
                        duration-200
                        file:mr-4
                        file:py-2
                        file:px-4
                        file:rounded-md
                        file:border-0
                        file:text-sm
                        file:font-semibold
                        file:bg-blue-600
                        file:text-white
                        hover:file:bg-blue-700
                      "
                    />

                    <button
                      onClick={handleUpdate}
                      className="bg-green-600 text-white px-4 py-2 rounded mr-2"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => setEditingGig(null)}
                      className="bg-gray-600 text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <h2 className="font-bold text-xl">{gig.title}</h2>
                      <p className="h-10">{gig.desc}</p>
                      <p className="font-bold text-gray-800">
                        Category <br />{" "}
                        <span className="text-gray-700 text-sm font-semibold">
                          {gig.category}
                        </span>{" "}
                      </p>
                      <p className="font-bold text-gray-800">
                        Price <br />{" "}
                        <span className="text-gray-700 text-sm font-semibold">
                          {" "}
                          ₹{gig.price}
                        </span>{" "}
                      </p>
                      <p className="font-bold text-gray-800">
                        Skills <br />{" "}
                        <span className="text-gray-700 text-sm font-semibold">
                          {" "}
                          {gig.skills?.join(", ")}
                        </span>{" "}
                      </p>
                      <p className="font-bold text-gray-800">
                        Tags <br />{" "}
                        <span className="text-gray-700 text-sm font-semibold">
                          {gig.tags?.join(", ")}
                        </span>{" "}
                      </p>
                      <p className="font-bold text-gray-800">
                        Delivery Time <br />{" "}
                        <span className="text-gray-700 text-sm font-semibold">
                          {" "}
                          {gig.deliveryTime} day(s)
                        </span>{" "}
                      </p>
                      <p className="font-bold text-gray-800">
                        Revisions <br />{" "}
                        <span className="text-gray-700 text-sm font-semibold">
                          {" "}
                          {gig.revisionNumber}
                        </span>
                      </p>
                      <p className="font-bold text-gray-800">
                        Cover <br />{" "}
                        <span className="text-gray-700 text-sm font-semibold">
                          {" "}
                          {gig.cover?.join(", ")}
                        </span>
                      </p>
                      <p className="font-bold text-gray-800">
                        Images <br />{" "}
                        <span className="text-gray-700 text-sm font-semibold">
                          {" "}
                          {gig.images?.join(", ")}
                        </span>
                      </p>
                    </div>
                    <div className="mt-4 flex flex-wrap justify-between w-full gap-3">
                      <button
                        onClick={() => setEditingGig(gig)}
                        className="border-2 border-blue-600 text-blue-600 px-5 py-2 rounded flex items-center gap-1"
                      >
                        <img src="/edit-text.png" alt="" className="w-4 h-4" />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(gig._id)}
                        className="border-2 border-red-600 text-red-600 px-4 py-2 rounded flex items-center gap-1.5"
                      >
                        <img src="/delete-gig.png" alt="" className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

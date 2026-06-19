"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "@/app/client/components/Navbar";
import Footer from "@/app/Components/Footer";

const AddGig = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [skills, setSkills] = useState("");
  const [price, setPrice] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [revisionNumber, setRevisionNumber] = useState("");
  const [tags, setTags] = useState("");
  const [cover, setCover] = useState(null);
  const [images, setImages] = useState([]);
  const [shortTitle, setShortTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [features, setFeatures] = useState("");
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", title);
    formData.append("desc", desc);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("deliveryTime", deliveryTime);
    formData.append("revisionNumber", revisionNumber);

    const skillArray = skills.split(",").map((s) => s.trim());
    const tagArray = tags.split(",").map((s) => s.trim());
    const featureArray = features.split(",").map((s) => s.trim());

    formData.append("skills", JSON.stringify(skillArray));
    formData.append("tags", JSON.stringify(tagArray));
    formData.append("features", featureArray.join(","));

    formData.append("shortTitle", shortTitle);
    formData.append("shortDesc", shortDesc);

    if (cover) {
      formData.append("cover", cover);
    }

    images.forEach((img) => {
      formData.append("images", img);
    });

    formData.append(
      "profile",
      JSON.stringify({
        title: shortTitle,
        description: shortDesc,
        experience: "3 years",
      }),
    );

    const user = JSON.parse(localStorage.getItem("currentUser"));
    try {
      const token = user.token;

      const res = await axios.post(`${API_URL}/api/gig/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      toast.success("Gig added sucessfully!");

      console.log("Gig Created:", res.data);
      setTimeout(() => {
        router.push("/client/gigs");
      }, 1000);
    } catch (err) {
      console.error("Error creating gig:", err);
      alert("Failed to create gig. Check console.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("currentUser"));

    const formData = new FormData();

    formData.append("title", title);
    formData.append("desc", desc);
    formData.append("category", category);
    formData.append("price", price);

    try {
      await axios.put(`${API_URL}/api/gig/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Gig updated successfully");

      router.push("/client/gigs");
    } catch (err) {
      console.log(err);
      toast.error("Update failed");
    }
  };

  const handleDelete = async (gigId) => {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    try {
      await axios.delete(`${API_URL}/api/gig/${gigId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      toast.success("Gig deleted successfully");

      setGigs((prev) => prev.filter((gig) => gig._id !== gigId));
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete gig");
    }
  };

  return (
    <>
      <Navbar />
      <div className="px-1 sm:px-20 mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6 ">Add New Gig</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row w-full items-center sm:items-start justify-center gap-6 md:gap-14 border-b border-gray-400/50 pt-4 pb-8">
            <div className="w-full space-y-4">
              <h2>Gig details</h2>
              <div>
                <label>Title</label>
                <input
                  type="text"
                  placeholder="Title"
                  className="w-full border mt-1 rounded p-2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Description</label>
                <textarea
                  placeholder="Description"
                  className="w-full border mt-1 rounded p-2"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="w-full space-y-4">
              <h2>Gig types and skills requeired</h2>
              <div>
                <label>Category</label>
                <input
                  type="text"
                  placeholder="Category (e.g., Design)"
                  className="w-full border mt-1 rounded p-2"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Skills</label>
                <input
                  type="text"
                  placeholder="Skills (comma separated)"
                  className="w-full border mt-1 rounded p-2"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row w-100 sm:w-full justify-center gap-6 md:gap-14 border-b border-gray-400/50 pt-4 pb-8">
            <div className="w-full space-y-4">
              <h2>Cost and timing</h2>
              <div>
                <label>Price</label>
                <input
                  type="number"
                  placeholder="Price"
                  className="w-full border  mt-1 rounded p-2"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Delivery Time</label>
                <input
                  type="number"
                  placeholder="Delivery Time (in days)"
                  className="w-full border mt-1 rounded p-2"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="w-full space-y-4">
              <h2>Revision and tags</h2>
              <div>
                <label>Revision Number</label>
                <input
                  type="number"
                  placeholder="Revision Number"
                  className="w-full border mt-1 rounded p-2"
                  value={revisionNumber}
                  onChange={(e) => setRevisionNumber(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Tags</label>
                <input
                  type="text"
                  placeholder="Tags (comma separated)"
                  className="w-full border mt-1 rounded p-2"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="w-100 sm:w-full jusitfy-center flex flex-col items-start text-start">
            <h2>Gig images</h2>
            <div className="w-full flex flex-col md:flex-row justify-between items-start gap-6 md:gap-14 space-y-4 border-b border-gray-400/50 py-4">
              <div className="w-full ">
                <label>Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="border w-full rounded p-2 mt-2 file:px-2 file:rounded file:mr-2 file:ml-1 file:border-blue-500 file:border text-gray-500"
                  onChange={(e) => setCover(e.target.files[0])}
                  required
                />
              </div>
              <div className="w-full">
                <label className="flex flex-col lg:flex-row items-start lg:items-center lg:gap-2">
                  Gallery Images{" "}
                  <span className="text-xs text-gray-500">
                    (You can select more than one image.)
                  </span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="border w-full rounded p-2 mt-2 file:px-2 file:rounded file:mr-2 file:ml-1 file:border-blue-500 file:border text-gray-500"
                  multiple
                  onChange={(e) => setImages(Array.from(e.target.files))}
                />
              </div>
            </div>
          </div>

          <div className="text-start my-10">
            <button
              type="submit"
              className="bg-black mx-auto text-white px-4 py-2 rounded"
            >
              Submit Gig
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default AddGig;

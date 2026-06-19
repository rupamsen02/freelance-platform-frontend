"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";



const CreateGig = ({ gigData, setGigData, profileData, onBack }) => {
  const router = useRouter();

  const categorySkillsMap = {
    "Graphics and Design": ["Photoshop", "Illustrator", "Figma", "Canva"],
    "Web Development": ["HTML", "CSS", "JavaScript", "React", "Node.js"],
    "Video Editing": ["Adobe Premiere", "Final Cut Pro", "After Effects"],
    "AI Development": ["Python", "TensorFlow", "PyTorch", "NLP"],
    "Digital Marketing": ["Google Ads", "Facebook Ads", "Content Marketing"],
    "Software Development": ["Java", "C#", "Spring Boot", "Databases"],
    "App Development": ["Flutter", "React Native", "Kotlin", "Swift"],
    "Logo Design": ["Adobe Illustrator", "Affinity Designer", "Canva", "CorelDRAW"],
    "Search Engine Optimization": [
      "On-Page SEO",
      "Off-Page SEO",
      "Keyword Research",
    ],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGigData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("profile", JSON.stringify(profileData));
    formData.append("title", gigData.title || "");
    formData.append("desc", gigData.desc || "");
    formData.append("category", gigData.category || "");
    formData.append("skills", JSON.stringify(gigData.skills));
   
    formData.append("price", gigData.price || "");
    formData.append("deliveryTime", gigData.deliveryTime || "");
    formData.append("revisionNumber", gigData.revisionNumber || "");
    formData.append("shortTitle", (gigData.title || "").slice(0, 25));
    formData.append("shortDesc", (gigData.desc || "").slice(0, 50));
    formData.append("features", "feature1,feature2");

    const tagsArray = (gigData.tags || "").split(",").map((tag) => tag.trim());
    tagsArray.forEach((tag) => {
      if (tag) formData.append("tags", tag);
    });

    if (gigData.cover) {
      formData.append("cover", gigData.cover);
    }

    (gigData.images || []).forEach((img) => {
      formData.append("images", img);
    });

    try {
      const res = await fetch("http://localhost:8800/api/gig", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      let result = {};
      try {
        result = await res.json();
      } catch (err) {
        console.warn("Could not parse response JSON. Possibly empty body.");
      }

      if (!res.ok) {
        console.error("Server Error:", result);
        toast.error(result?.message || "Something went wrong!");
        return;
      }

      toast.success("Gig created & Profile creation completed successfully!");
      setTimeout(() => {
        router.push("/client/gigs");
      }, 1500)
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Failed to create gig!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="space-y-4 mt-10"
    >
      <h2 className="text-xl font-bold">Step 2: Create Your Gig</h2>

      <input
        name="title"
        placeholder="Gig Title"
        onChange={handleChange}
        value={gigData.title || ""}
        className="w-full border px-4 py-2 rounded"
      />

      
      <div>
        <label className="block mb-1 font-medium">Cover Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setGigData((prev) => ({ ...prev, cover: e.target.files[0] }))
          }
          className="w-full border px-4 py-2 rounded"
        />
      </div>

      
      <div>
        <label className="block mb-1 font-medium">Gig Images</label>
        <div className="flex gap-2 flex-wrap">
          {gigData.images?.map((img, idx) => (
            <div
              key={idx}
              className="relative w-24 h-24 border rounded overflow-hidden group"
            >
              <img
                src={URL.createObjectURL(img)}
                alt={`gig-${idx}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setGigData((prev) => ({
                    ...prev,
                    images: prev.images.filter((_, i) => i !== idx),
                  }));
                }}
                className="absolute top-1 right-1 bg-gray-400 bg-opacity-60 text-white text-xs px-2 py-1 rounded-2xl hover:bg-opacity-80"
                title="Remove"
              >
                ✕
              </button>
            </div>
          ))}
          <label className="w-24 h-24 flex items-center justify-center border-2 border-dashed cursor-pointer rounded hover:bg-gray-100">
            <span className="text-2xl">+</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files);
                setGigData((prev) => ({
                  ...prev,
                  images: [...(prev.images || []), ...files],
                }));
                e.target.value = ""; // reset input
              }}
            />
          </label>
        </div>
      </div>

      
      <div>
        <label className="block mb-1 font-medium">Category</label>
        <select
          name="category"
          onChange={(e) => {
            handleChange(e);
            setGigData((prev) => ({
              ...prev,
              skills: [], // Reset skills when category changes
            }));
          }}
          value={gigData.category || ""}
          className="w-full border px-2 py-2 text-gray-500 border-black rounded"
        >
          <option value="">Select Category</option>
          {Object.keys(categorySkillsMap).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      
      {gigData.category && (
        <div className="my-4">
          <label className="block mb-1 font-medium">Add Skills</label>
          <select
            onChange={(e) => {
              const selectedSkill = e.target.value;
              if (
                selectedSkill &&
                Array.isArray(gigData.skills) &&
                !gigData.skills.includes(selectedSkill)
              ) {
                setGigData((prev) => ({
                  ...prev,
                  skills: [...prev.skills, selectedSkill],
                }));
              }
              e.target.value = ""; // reset dropdown
            }}
            className="w-full border px-4 py-2 rounded"
          >
            <option value="">Select Skill</option>
            {categorySkillsMap[gigData.category]
              ?.filter(
                (skill) =>
                  Array.isArray(gigData.skills) &&
                  !gigData.skills.includes(skill)
              )
              .map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
          </select>

          
          <div className="flex flex-wrap gap-2 mt-2">
            {Array.isArray(gigData.skills) &&
              gigData.skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="flex items-center bg-gray-200 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() =>
                      setGigData((prev) => ({
                        ...prev,
                        skills: prev.skills.filter((s) => s !== skill),
                      }))
                    }
                    className="ml-2 text-red-500 hover:text-red-700 font-bold"
                    title="Remove skill"
                  >
                    ✕
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      <input
        type="number"
        name="price"
        placeholder="Price (₹)"
        onChange={handleChange}
        value={gigData.price || ""}
        className="w-full border px-4 py-2 rounded"
      />

      <input
        type="number"
        name="deliveryTime"
        placeholder="Delivery Time (days)"
        onChange={handleChange}
        value={gigData.deliveryTime || ""}
        className="w-full border px-4 py-2 rounded"
      />

      <textarea
        name="desc"
        placeholder="Gig Description"
        onChange={handleChange}
        value={gigData.desc || ""}
        className="w-full border px-4 py-2 rounded"
      />

      <input
        name="tags"
        placeholder="Tags (comma separated)"
        onChange={handleChange}
        value={gigData.tags || ""}
        className="w-full border px-4 py-2 rounded"
      />

      <input
        type="number"
        name="revisionNumber"
        placeholder="Number of Revisions"
        onChange={handleChange}
        value={gigData.revisionNumber || ""}
        className="w-full border px-4 py-2 rounded"
      />

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-black hover:bg-gray-500 text-white rounded"
        >
          ← Back
        </button>
        <button
          type="submit"
          className="bg-black hover:bg-gray-900 text-white px-6 py-2 rounded"
        >
          Create Gig
        </button>
      </div>
    </form>
  );
};

export default CreateGig;

"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import Navbar from "@/app/client/components/Navbar";
import Footer from "@/app/Components/Footer";
import { useRouter } from "next/navigation";

const EditProfile = () => {
  const [previewImage, setPreviewImage] = useState(null);
  const [profileData, setProfileData] = useState({
    fullName: "",
    displayName: "",
    serviceOffered: "",
    whyChooseMe: "",
    country: "",
    customCountry: "",
    memberSince: "",
    languages: "",
    shortDescription: "",
    profileImage: "",
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const router = useRouter();

  // const [profilePicture, setProfilePicture] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));

        const res = await fetch(
          `${API_URL}/api/freelancer/${currentUser._id}`,
        );

        const data = await res.json();

        console.log("Profile Data:", data);
        console.log("Profile Image:", data.profileImage);

        setProfileData({
          ...data,
          languages: Array.isArray(data.languages)
            ? data.languages.join(", ")
            : data.languages || "",
          memberSince: data.memberSince
            ? new Date(data.memberSince).toISOString().split("T")[0]
            : "",
        });
        if (data.profileImage) {
          const imageUrl = `${API_URL}/uploads/${data.profileImage}`;
          console.log(imageUrl);
          setPreviewImage(imageUrl);
        } else {
          console.log("No profileImage in data");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
      await uploadProfileImage(file);
    }
  };

  const uploadProfileImage = async (file) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const formData = new FormData();
      formData.append("profileImage", file);

      const res = await fetch(
        `${API_URL}/api/freelancer/${currentUser._id}`,
        {
          method: "PUT",
          body: formData,
          credentials: "include",
        },
      );

      if (!res.ok) {
        throw new Error("Failed to upload image");
      }

      const updatedData = await res.json();

      // Navbar immediate update
      const updatedUser = {
        ...currentUser,
        img: updatedData.profileImage,
      };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      window.dispatchEvent(
        new CustomEvent("localStorageChanged", {
          detail: { key: "currentUser", value: updatedUser },
        }),
      );

      // Update profileData
      setProfileData((prev) => ({
        ...prev,
        profileImage: updatedData.profileImage,
      }));

      setPreviewImage(
        `${API_URL}/uploads/${updatedData.profileImage}`,
      );
      setSelectedFile(null);

      toast.success("Profile picture updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload profile picture");
      setSelectedFile(null);
    }
  };

  const handleDeletePicture = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));

      const res = await fetch(
        `${API_URL}/api/freelancer/${currentUser._id}/image`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
          credentials: "include",
        },
      );

      if (!res.ok) {
        throw new Error("Failed to delete image");
      }

      const updatedUser = {
        ...currentUser,
        img: "",
      };

      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      window.dispatchEvent(
        new CustomEvent("localStorageChanged", {
          detail: { key: "currentUser", value: updatedUser },
        }),
      );

      setSelectedFile(null);
      setPreviewImage(null);

      setProfileData((prev) => ({
        ...prev,
        profileImage: "",
      }));

      toast.success("Picture removed");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove picture");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));

      const formData = new FormData();

      formData.append("fullName", profileData.fullName);
      formData.append("displayName", profileData.displayName);
      formData.append("serviceOffered", profileData.serviceOffered);
      formData.append("whyChooseMe", profileData.whyChooseMe);
      formData.append("shortDescription", profileData.shortDescription);
      formData.append("country", profileData.country);
      const languagesArray = profileData.languages
        .split(",")
        .map((lang) => lang.trim())
        .filter((lang) => lang !== "");

      languagesArray.forEach((lang) => {
        formData.append("languages", lang);
      });
      formData.append("memberSince", profileData.memberSince);

      const res = await fetch(
        `${API_URL}/api/freelancer/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
          body: formData,
          credentials: "include",
        },
      );

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedData = await res.json();

      setProfileData((prev) => ({
        ...prev,
        ...updatedData,
        languages: Array.isArray(updatedData.languages)
          ? updatedData.languages.join(", ")
          : updatedData.languages || "",
        memberSince: updatedData.memberSince
          ? new Date(updatedData.memberSince).toISOString().split("T")[0]
          : "",
      }));

      toast.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  const handleDeleteProfile = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));

      const res = await fetch(
        `${API_URL}/api/freelancer/${currentUser._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
          credentials: "include",
        },
      );

      if (!res.ok) {
        throw new Error("Failed to delete profile");
      }

      // Clear localStorage
      localStorage.removeItem("currentUser");

      // Notify Navbar and other components
      window.dispatchEvent(
        new CustomEvent("localStorageChanged", {
          detail: { key: "currentUser", value: null },
        }),
      );

      // Clear local state
      setSelectedFile(null);
      setPreviewImage(null);

      setProfileData({
        fullName: "",
        displayName: "",
        serviceOffered: "",
        whyChooseMe: "",
        country: "",
        customCountry: "",
        memberSince: "",
        languages: "",
        shortDescription: "",
        profileImage: "",
      });

      toast.success("Profile deleted successfully. Redirecting...");

      setTimeout(() => {
        router.replace("/");
      }, 3000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete profile");
    }
  };

  return (
    <>
      <Navbar />
      <div className="relative text-white/90">
        <video
          muted
          loop
          autoPlay
          playsInline
          preload="metadata"
          className="w-full h-full object-cover absolute opacity-90 inset-0"
        >
          <source src="/freelancer-profile-video.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/80" />

        <div className="relative ml-20 sm:px-10 lg:px-20 xl:px-60 overflow-hidden z-50">
          <form onSubmit={handleSubmit} className="shadow-sm p-8 text-white">
            <h1 className="text-2xl font-bold text-gray-200">Profile</h1>
            <p className="text-gray-300 mt-1">
              Manage your profile information and settings
            </p>
            <div className="flex flex-col md:flex-row justify-between items-center pb-6 w-full border-b border-gray-200">
              <div className="mb-8 w-full">
                <div className="">
                  <h3 className="text-lg font-semibold  mb-6">
                    Profile Picture
                  </h3>
                  <div className="flex items-center gap-6 w-100">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                      <img
                        src={previewImage || "/img/noavatar.jpg"}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureChange}
                          className="hidden"
                        />
                        <span className="inline-block bg-white/95 hover:bg-white/90 text-black px-6 py-2 rounded-lg font-medium transition-colors">
                          {previewImage ? "Change picture" : "Upload picture"}
                        </span>
                      </label>
                      {previewImage && (
                        <button
                          type="button"
                          onClick={handleDeletePicture}
                          className="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-700 border border-red-600 hover:border-red-700 py-2 px-4 rounded-lg font-medium transition-colors"
                        >
                          <Trash2 size={16} />
                          Delete picture
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-200">
                <h3 className="text-lg font-semibold text-gray-300 mb-6">
                  Profile Name
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Full Name
                    </label>
                    <input
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/90 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Display Name
                    </label>
                    <input
                      name="displayName"
                      value={profileData.displayName}
                      onChange={handleChange}
                      placeholder="How you'll be shown to others"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/90 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 py-8 mb-8">
              <h3 className="text-lg font-semibold text-gray-300 mb-6">
                Professional Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Service Offered
                  </label>
                  <input
                    name="serviceOffered"
                    value={profileData.serviceOffered}
                    onChange={handleChange}
                    placeholder="e.g., Web Development, UI Design"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/90 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Short Description
                  </label>
                  <textarea
                    name="shortDescription"
                    value={profileData.shortDescription}
                    onChange={handleChange}
                    placeholder="A brief description of your skills"
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/90 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-8 mb-8">
              <h3 className="text-lg font-semibold text-gray-300 mb-6">
                Location & Languages
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Country
                  </label>
                  <select
                    name="country"
                    value={profileData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/90 focus:border-transparent"
                  >
                    <option value="">Select Country</option>
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {profileData.country === "Other" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Enter Country
                    </label>
                    <input
                      name="customCountry"
                      value={profileData.customCountry}
                      onChange={handleChange}
                      placeholder="Enter your country"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/90 focus:border-transparent"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Languages
                  </label>
                  <input
                    name="languages"
                    value={profileData.languages}
                    onChange={handleChange}
                    placeholder="e.g., English, Spanish, French"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/90 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-8 mb-8">
              <h3 className="text-lg font-semibold text-gray-300 mb-6">
                Membership
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Member Since
                </label>
                <input
                  type="date"
                  name="memberSince"
                  value={profileData.memberSince}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/90 focus:border-transparent"
                />
              </div>
            </div>

            <div className=" justify-between items-center">
              <button
                type="submit"
                className="bg-white/95 hover:bg-white/90 cursor-pointer text-black px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Save Changes
              </button>
              <div className="border-b border-gray-200 pb-8 mb-6" />
              <div className="flex flex-wrap justify-between w-full">
                <div className="mb-6">
                  <p className="text-white/95 font-semibold">
                    Close your account
                  </p>
                  <p className="text-gray-400 text-sm">
                    Permanently close your account
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDeleteProfile}
                  className="flex gap-3 items-center h-13 border border-red-600 hover:border-red-700 px-6 rounded-lg cursor-pointer text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  <Trash2 size={18} />
                  Delete Profile
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EditProfile;

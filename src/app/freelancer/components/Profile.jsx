"use client";
import React from "react";
import toast from "react-hot-toast";

const Profile = ({ profileData, setProfileData, onNext }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullName = `${profileData.firstName || ""} ${
      profileData.lastName || ""
    }`.trim();

    setProfileData((prev) => ({
      ...prev,
      fullName,
      languages: Array.isArray(profileData.languages)
        ? profileData.languages
        : (profileData.languages || "")
            .split(",")
            .map((lang) => lang.trim()),
    }));    
  
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">Step 1: Freelancer Profile Setup</h2>

      <div className="flex gap-4">
        <input
          name="firstName"
          placeholder="First Name"
          value={profileData?.firstName || ""}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />
        <input
          name="lastName"
          placeholder="Last Name"
          value={profileData?.lastName || ""}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />
      </div>

      <input
        name="displayName"
        placeholder="Display Name"
        value={profileData.displayName || ""}
        onChange={handleChange}
        className="w-full border px-4 py-2 rounded"
      />
      <input
        name="serviceOffered"
        placeholder="What services do you offer?"
        value={profileData.serviceOffered || ""}
        onChange={handleChange}
        className="w-full border px-4 py-2 rounded"
      />
      <textarea
        name="whyChooseMe"
        placeholder="Why should someone choose you?"
        value={profileData.whyChooseMe || ""}
        onChange={handleChange}
        className="w-full border px-4 py-2 rounded"
      />
      <div className="mb-4">
        <select
          name="country"
          onChange={handleChange}
          value={profileData.country || ""}
          className="w-full border border-black px-4 py-2 rounded"
          required
        >
          <option value="">Select your country</option>

          {/* High-demand Freelancing Countries */}
          <option value="India">India</option>
          <option value="United States">United States</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="Philippines">Philippines</option>
          <option value="Pakistan">Pakistan</option>
          <option value="Bangladesh">Bangladesh</option>
          <option value="Nigeria">Nigeria</option>
          <option value="Canada">Canada</option>
          <option value="Germany">Germany</option>
          <option value="Australia">Australia</option>

          {/* Emerging or active freelance markets */}
          <option value="Brazil">Brazil</option>
          <option value="Indonesia">Indonesia</option>
          <option value="Vietnam">Vietnam</option>
          <option value="South Africa">South Africa</option>
          <option value="Ukraine">Ukraine</option>
          <option value="Egypt">Egypt</option>
          <option value="Turkey">Turkey</option>
          <option value="Kenya">Kenya</option>
          <option value="Argentina">Argentina</option>
          <option value="Mexico">Mexico</option>
          <option value="Poland">Poland</option>
          <option value="Russia">Russia</option>
          <option value="Italy">Italy</option>
          <option value="Spain">Spain</option>
          <option value="France">France</option>
          <option value="Netherlands">Netherlands</option>
          <option value="Malaysia">Malaysia</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {profileData.country === "Other" && (
        <div className="mb-4">
          <label className="block font-medium mb-1">
            Please specify your country
          </label>
          <input
            type="text"
            name="customCountry"
            value={profileData.customCountry || ""}
            onChange={(e) =>
              setProfileData({ ...profileData, customCountry: e.target.value })
            }
            className="w-full border px-4 py-2 rounded"
            placeholder="Enter your country"
            required
          />
        </div>
      )}

      <input
        type="date"
        name="memberSince"
        placeholder="Member Since"
        value={profileData.memberSince || ""}
        onChange={handleChange}
        className="w-full border  border-black px-4 py-2 rounded"
      />
      <input
        name="languages"
        placeholder="Languages (e.g., English, Hindi)"
        value={profileData.languages || ""}
        onChange={handleChange}
        className="w-full border px-4 py-2 rounded"
      />
      <textarea
        name="shortDescription"
        placeholder="Short Description"
        value={profileData.shortDescription || ""}
        onChange={handleChange}
        className="w-full border px-4 py-2 rounded"
      />

      <button
        type="submit"
        className="bg-black text-white flex px-4 py-2 rounded hover:bg-gray-900"
      >
        Save & Continue to Gig Creation <section className="mx-2">➜</section>
      </button>
    </form>
  );
};

export default Profile;

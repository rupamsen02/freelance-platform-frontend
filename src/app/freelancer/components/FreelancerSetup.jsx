"use client";
import React, { useState } from "react";
import ProfileForm from "./Profile";
import CreateGigForm from "./CreateGig";

const FreelancerSetup = () => {
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState({});
  const [gigData, setGigData] = useState({});

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow-md">
      <div className="text-3xl font-bold mb-6 text-center">
        Freelancer<span className="text-[#1dbf73]">.</span>
      </div>

      {step === 1 && (
        <ProfileForm
          profileData={profileData}
          setProfileData={setProfileData}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <CreateGigForm
          gigData={gigData}
          setGigData={setGigData}
          profileData={profileData}
          onBack={() => setStep(1)}
        />
      )}
    </div>
  );
};

export default FreelancerSetup;

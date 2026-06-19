"use client";
import React, { Suspense } from "react";
import FreelancerSetup from "../components/FreelancerSetup";
import { Toaster } from "react-hot-toast";

function SetupContent() {
  return (
    <>
      <FreelancerSetup />
      <Toaster position="top-center" />
    </>
  );
}

const ClientGigsPage = () => {
  return (
    <Suspense fallback={<div>Loading setup...</div>}>
      <SetupContent />
    </Suspense>
  );
};

export default ClientGigsPage;
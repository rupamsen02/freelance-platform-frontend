"use client";
import React, { Suspense } from "react";
import AddGig from "../components/AddGig";
import { Toaster } from "react-hot-toast";

function AddGigContent() {
  return (
    <>
      <AddGig />
      <Toaster position="top-center" />
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading gig creation...</div>}>
      <AddGigContent />
    </Suspense>
  );
}
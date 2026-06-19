'use client';
import React, { Suspense } from "react";
import { useParams } from 'next/navigation';
import GigDetailPage from '../../components/GigDetailPage';

const GigDetailWrapper = () => {
  const { id } = useParams();

  return (
    <Suspense fallback={<div>Loading gigs...</div>}>
      <GigDetailPage gigId={id} />
    </Suspense>
  );
};

export default GigDetailWrapper;


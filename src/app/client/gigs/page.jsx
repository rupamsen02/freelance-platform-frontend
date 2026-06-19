'use client';
import React, { Suspense } from 'react';
import Gigs from '../components/Gigs';


const ClientGigsPage = () => {
  return (
    <Suspense fallback={<div>Loading gigs...</div>}>
      <Gigs />
    </Suspense>
  );
};

export default ClientGigsPage;

"use client";
import React, { useRef } from "react";
import Login from "./Login";
import Join from "./Join";

export default function AuthModals() {
  const loginModalRef = useRef(null);
  const joinModalRef = useRef(null);

  return (
    <>

      <Login 
        loginModalRef={loginModalRef} 
        joinModalRef={joinModalRef} 
      />
      <Join
        joinModalRef={joinModalRef}
        loginModalRef={loginModalRef}
      />
    </>
  );
}

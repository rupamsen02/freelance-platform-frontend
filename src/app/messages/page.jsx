"use client";
import { useParams } from "next/navigation";
import Message from "../Components/Message";
import { Suspense } from "react";

const MessagePage = () => {
  const params = useParams();
  const { id } = useParams();
  console.log("Params:", params); 

  return (
    <div>
      <Message />
    </div>
  );
};

const WrappedMessagePage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MessagePage />
    </Suspense>
  );
};

export default WrappedMessagePage;

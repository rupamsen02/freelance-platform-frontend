"use client";
import React, { Suspense } from "react";
import Orders from "../client/components/Orders";
import { useSearchParams } from "next/navigation";

function OrdersPageContent() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const price = searchParams.get("price");
  const cover = searchParams.get("cover");
  const category = searchParams.get("category");
  const gigId = searchParams.get("gigId");

  return (
    <Orders
      title={title}
      price={price}
      cover={cover}
      category={category}
      gigId={gigId}
    />
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div>Loading order...</div>}>
      <OrdersPageContent />
    </Suspense>
  );
}
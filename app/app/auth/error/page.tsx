"use client";
import AuthErrorCard from "@/_components/AuthErrorcard";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function () {
  const params = useSearchParams();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorCard error={params.get("error")!} />
    </Suspense>
  );
}

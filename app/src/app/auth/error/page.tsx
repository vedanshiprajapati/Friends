import AuthErrorCard from "@/app/_components/AuthErrorcard";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AuthErrorWrapper() {
  const params = useSearchParams();
  return <AuthErrorCard error={params.get("error")!} />;
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorWrapper />
    </Suspense>
  );
}

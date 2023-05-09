import React from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import AdminList from "../components/AdminList";

export default function Home() {
  const router = useRouter();
  const { data } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace("/auth/signin");

      alert("관리자만 접근할 수 있습니다.");
    },
  });

  return (
    <div>
      <AdminList />
    </div>
  );
}

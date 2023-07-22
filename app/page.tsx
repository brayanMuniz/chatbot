import React from "react";
import { Chat } from "@/components/Chat";

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen p-6 space-x-10">
      <div className="w-3/12">Left side</div>
      <Chat />
      <div className="w-3/12">Right Side</div>
    </main>
  );
}

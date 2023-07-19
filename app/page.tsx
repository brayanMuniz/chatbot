import React from "react";
import { Chat } from "../components/chat";

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen p-24 space-x-10">
      <div className="w-4/12">Left side</div>
      <Chat />
      <div className="w-4/12">Right Side</div>
    </main>
  );
}

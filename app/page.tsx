import React from "react";
import { Chat } from "@/components/chat";

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen p-6 space-x-10">
      <div className="w-2/12"></div>
      <Chat />
      <div className="w-3/12">Vocabulary</div>
    </main>
  );
}

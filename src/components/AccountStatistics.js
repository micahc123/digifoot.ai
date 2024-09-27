"use client";
import { TextRevealCard } from "./ui/text-reveal-card";

export default function AccountStatistics() {
  return (
    <div className="h-[40rem] w-full flex items-center justify-center">
      <TextRevealCard
        text="Account Statistics"
        revealText="1234 Posts, 5678 Followers, 910 Following"
      />
    </div>
  );
}
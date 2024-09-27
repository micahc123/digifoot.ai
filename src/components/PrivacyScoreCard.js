"use client";
import { CircularProgress } from "./ui/circular-progress";

export default function PrivacyScoreCard() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <CircularProgress value={85} />
      <h2 className="text-2xl font-bold mt-4">Privacy Score</h2>
    </div>
  );
}
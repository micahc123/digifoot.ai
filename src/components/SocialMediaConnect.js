"use client";
import { useState } from 'react';
import { AnimatedTooltip } from "./ui/animated-tooltip";

const people = [
  {
    id: 1,
    name: "Facebook",
    designation: "Connect",
    image: "/facebook-icon.png",
  },
  {
    id: 2,
    name: "Twitter",
    designation: "Connect",
    image: "/twitter-icon.png",
  },
  {
    id: 3,
    name: "Instagram",
    designation: "Connect",
    image: "/instagram-icon.png",
  },
  {
    id: 4,
    name: "LinkedIn",
    designation: "Connect",
    image: "/linkedin-icon.png",
  },
];

export default function SocialMediaConnect() {
  return (
    <div className="flex flex-row items-center justify-center mb-10 w-full">
      <AnimatedTooltip items={people} />
    </div>
  );
}
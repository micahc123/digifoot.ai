"use client";
import { HeroParallax } from "../components/ui/hero-parallax";
import ChatInterface from '../components/ChatInterface';
import SocialMediaConnect from '../components/SocialMediaConnect';
import DataVisualization from '../components/DataVisualization';
import PrivacyScoreCard from '../components/PrivacyScoreCard';
import AccountStatistics from '../components/AccountStatistics';

const products = [
  {
    title: "Social Media Connect",
    link: "#",
    thumbnail: "/placeholder.svg",
  },
  {
    title: "Data Visualization",
    link: "#",
    thumbnail: "/placeholder.svg",
  },
  {
    title: "Privacy Score",
    link: "#",
    thumbnail: "/placeholder.svg",
  },
  {
    title: "Account Statistics",
    link: "#",
    thumbnail: "/placeholder.svg",
  },
  {
    title: "AI Chat",
    link: "#",
    thumbnail: "/placeholder.svg",
  },
];

export default function Dashboard() {
  return (
    <div>
      <HeroParallax products={products} />
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SocialMediaConnect />
          <DataVisualization />
          <PrivacyScoreCard />
          <AccountStatistics />
          <div className="md:col-span-2">
            <ChatInterface />
          </div>
        </div>
      </div>
    </div>
  );
}
import ChatInterface from '../components/ChatInterface';
import SocialMediaConnect from '../components/SocialMediaConnect';
import DataVisualization from '../components/DataVisualization';
import PrivacyScoreCard from '../components/PrivacyScoreCard';
import AccountStatistics from '../components/AccountStatistics';

export default function Analysis() {
  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-5xl font-bold mb-12 text-center text-gradient">AI Analysis Dashboard</h1>
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
  );
}
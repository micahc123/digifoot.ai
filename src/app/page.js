import SocialMediaConnect from '../components/SocialMediaConnect';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-6xl font-bold text-center mb-8 text-gradient animate-pulse">
        Welcome to digifoot.ai
      </h1>
      <p className="text-2xl text-center mb-12 animate-fade-in">
        Discover insights about your online presence through AI-powered analysis
      </p>
      <SocialMediaConnect />
    </div>
  );
}
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="glass-effect fixed w-full z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-3xl font-bold text-gradient animate-pulse">
            digifoot.ai
          </Link>
          <div className="flex space-x-6">
            {['Dashboard', 'Analysis', 'Settings'].map((item) => (
              <Link 
                key={item} 
                href={`/${item.toLowerCase()}`} 
                className="text-text hover:text-accent transition-colors hover-scale"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
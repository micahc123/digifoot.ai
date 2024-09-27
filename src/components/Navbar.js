import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-surface bg-opacity-80 backdrop-filter backdrop-blur-lg shadow-lg">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gradient">
            digifoot.ai
          </Link>
          <div className="flex space-x-6">
            {['Dashboard'].map((item) => (
              <Link 
                key={item} 
                href={item === 'Dashboard' ? '/dashboard' : `/${item.toLowerCase().replace(' ', '-')}`}
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
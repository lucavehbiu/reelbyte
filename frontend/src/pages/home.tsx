import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          Find Your Perfect{' '}
          <span className="gradient-purple-pink bg-clip-text text-transparent">
            Video Creator
          </span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Connect with professional video content creators for YouTube, Reels, Ads, and more.
          Your vision, their expertise.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link to="/browse">
            <Button size="lg" className="gradient-purple-pink">
              Browse Creators
            </Button>
          </Link>
          <Button size="lg" variant="outline">
            Start Selling
          </Button>
        </div>

        <div className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="text-2xl font-bold mb-2">10k+</h3>
            <p className="text-muted-foreground">Video Creators</p>
          </div>
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="text-2xl font-bold mb-2">50k+</h3>
            <p className="text-muted-foreground">Projects Completed</p>
          </div>
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="text-2xl font-bold mb-2">98%</h3>
            <p className="text-muted-foreground">Client Satisfaction</p>
          </div>
        </div>
      </div>
    </div>
  );
}

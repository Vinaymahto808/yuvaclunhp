import { useNavigate } from 'react-router-dom';
import { Play, Video, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VideoSection = () => {
  const navigate = useNavigate();

  // Sample videos - these would come from database
  const videos = [
    {
      id: 1,
      title: 'Annual Cultural Festival 2024',
      thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600',
      duration: '12:45',
      views: '1.2K',
    },
    {
      id: 2,
      title: 'Youth Sports Championship',
      thumbnail: 'https://images.unsplash.com/photo-1461896836934- voices-celebration-cropped?w=600',
      duration: '8:30',
      views: '856',
    },
    {
      id: 3,
      title: 'Community Service Day',
      thumbnail: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600',
      duration: '15:20',
      views: '2.1K',
    },
    {
      id: 4,
      title: 'Traditional Dance Performance',
      thumbnail: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=600',
      duration: '6:15',
      views: '3.4K',
    },
  ];

  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-main">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Video className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Video Hub</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Watch & <span className="text-primary">Relive</span>
            </h2>
            <p className="text-muted-foreground mt-2 max-w-lg">
              Catch up on all our events and activities through our video collection.
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/videos')} className="w-fit">
            Browse All Videos
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="group cursor-pointer"
              onClick={() => navigate('/videos')}
            >
              {/* Thumbnail */}
              <div className="relative overflow-hidden rounded-xl mb-3">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-slate-dark/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Play className="w-6 h-6 text-primary-foreground fill-primary-foreground ml-1" />
                  </div>
                </div>
                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-slate-dark/80 backdrop-blur-sm">
                  <span className="text-xs text-primary-foreground font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {video.duration}
                  </span>
                </div>
              </div>
              {/* Info */}
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {video.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{video.views} views</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoSection;

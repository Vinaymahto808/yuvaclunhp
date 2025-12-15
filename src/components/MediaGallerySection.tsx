import { useNavigate } from 'react-router-dom';
import { Image, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import img5 from '@/assets/Screenshot 2025-12-15 at 9.39.28 PM.png';
import img1 from '@/assets/img1.png';
import img2 from '@/assets/Screenshot 2025-12-15 at 9.36.10 PM.png';
import img3 from '@/assets/Screenshot 2025-12-15 at 9.36.59 PM.png';
import img4 from '@/assets/Screenshot 2025-12-15 at 9.37.38 PM.png';


const MediaGallerySection = () => {
  const navigate = useNavigate();

  // Local gallery images
  const galleryImages = [
    { id: 1, url: img1, title: 'युवा क्लब Activities' },
    { id: 2, url: img2, title: 'Community Event' },
    { id: 3, url: img3, title: 'Youth Gathering' },
    { id: 4, url: img4, title: 'Festival Celebration' },
    { id: 5, url: img5, title: 'Team Activities' },
  ];

  return (
    <section className="section-padding bg-background">
      <div className="container-main">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Image className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Photo Gallery</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Captured <span className="text-primary">Moments</span>
            </h2>
            <p className="text-muted-foreground mt-2 max-w-lg">
              Explore our collection of memories from events, festivals, and community gatherings.
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/gallery')} className="w-fit">
            View All Photos
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <div
              key={image.id}
              className={`relative group overflow-hidden rounded-xl cursor-pointer ${
                index === 0 ? 'md:row-span-2' : ''
              }`}
            >
              <img
                src={image.url}
                alt={image.title}
                className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                  index === 0 ? 'h-64 md:h-full' : 'h-48 md:h-64'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-primary-foreground font-semibold">{image.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MediaGallerySection;

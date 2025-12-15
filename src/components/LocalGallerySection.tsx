import { useState } from 'react';
import { Image, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import img1 from '@/assets/img1.png';
import img2 from '@/assets/Screenshot 2025-12-15 at 9.36.10 PM.png';
import img3 from '@/assets/Screenshot 2025-12-15 at 9.36.59 PM.png';
import img4 from '@/assets/Screenshot 2025-12-15 at 9.37.38 PM.png';
import img5 from '@/assets/Screenshot 2025-12-15 at 9.39.28 PM.png';

const LocalGallerySection = () => {
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);

  const galleryImages = [
    { id: 1, url: img1, title: 'युवा क्लब Activities' },
    { id: 2, url: img2, title: 'Community Event' },
    { id: 3, url: img3, title: 'Youth Gathering' },
    { id: 4, url: img4, title: 'Festival Celebration' },
    { id: 5, url: img5, title: 'Team Activities' },
  ];

  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-main">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Image className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Our Gallery</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            युवा क्लब <span className="text-primary">Memories</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the vibrant moments from our community events, festivals, and gatherings that bring us together as one family.
          </p>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <div
              key={image.id}
              className={`relative group overflow-hidden rounded-2xl cursor-pointer card-elevated hover:shadow-2xl transition-all duration-500 ${
                index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''
              }`}
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.url}
                alt={image.title}
                className={`w-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                  index === 0 ? 'h-64 lg:h-full' : 'h-64'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-dark/90 via-slate-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-primary-foreground font-bold text-lg mb-2">{image.title}</h3>
                <div className="w-12 h-1 bg-primary rounded-full"></div>
              </div>
              
              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center">
                  <Image className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-transparent border-0">
          {selectedImage && (
            <div className="relative">
              <button
                className="absolute top-4 right-4 z-10 p-2 bg-slate-dark/80 rounded-full text-primary-foreground hover:bg-slate-dark transition-colors"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="w-full max-h-[80vh] object-contain rounded-2xl"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-dark/90 to-transparent rounded-b-2xl">
                <h3 className="text-primary-foreground font-bold text-xl">{selectedImage.title}</h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default LocalGallerySection;
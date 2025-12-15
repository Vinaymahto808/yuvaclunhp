import { Users, Image, Video, MessageCircle } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    { icon: Users, value: '500+', label: 'Active Members' },
    { icon: Image, value: '2K+', label: 'Photos Shared' },
    { icon: Video, value: '150+', label: 'Videos Uploaded' },
    { icon: MessageCircle, value: '10K+', label: 'Messages Sent' },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-primary to-amber">
      <div className="container-main">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-foreground/20 mb-4">
                <stat.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-primary-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-primary-foreground/80 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;

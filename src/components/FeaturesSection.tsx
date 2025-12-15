import { useNavigate } from 'react-router-dom';
import { 
  Image, 
  Video, 
  MessageCircle, 
  Users, 
  BookOpen, 
  HelpCircle,
  ArrowRight 
} from 'lucide-react';

const FeaturesSection = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Image,
      title: 'Photo Gallery',
      description: 'Browse and share photos from events, festivals, and daily moments.',
      href: '/gallery',
      color: 'from-orange-500 to-amber-500',
    },
    {
      icon: Video,
      title: 'Video Hub',
      description: 'Watch recorded events, performances, and community highlights.',
      href: '/videos',
      color: 'from-rose-500 to-pink-500',
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Connect with community members in real-time conversations.',
      href: '/chat',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Join discussions and stay connected with fellow members.',
      href: '/chat',
      color: 'from-violet-500 to-purple-500',
    },
    {
      icon: BookOpen,
      title: 'Study Hub',
      description: 'Access study materials and educational resources shared by members.',
      href: '/student-hub',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: HelpCircle,
      title: 'Ask Doubts',
      description: 'Get help from the community on academic and personal queries.',
      href: '/student-hub',
      color: 'from-amber-500 to-yellow-500',
    },
  ];

  return (
    <section className="section-padding bg-background">
      <div className="container-main">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need, <span className="text-primary">One Place</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From sharing memories to learning together, our platform brings the community closer.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              onClick={() => navigate(feature.href)}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1"
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
                {feature.title}
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

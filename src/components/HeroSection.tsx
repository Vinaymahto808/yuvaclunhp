import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Users, Image, MessageCircle, Video, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';    

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  const backgroundImages = [
    '/hero-bg.png',
    '/img1.png',
    '/Screenshot 2025-12-15 at 9.36.10 PM.png',
    '/Screenshot 2025-12-15 at 9.36.59 PM.png',
    '/Screenshot 2025-12-15 at 9.37.38 PM.png',
    '/Screenshot 2025-12-15 at 9.39.28 PM.png'
  ];

  const heroContent = [
    {
      title: 'युवा क्लब',
      subtitle: 'Hopna Tola',
      mainText: 'युवाओं की शक्ति, संस्कृति की पहचान',
      subText: 'समुदाय, सहयोग और संस्कार के साथ उज्ज्वल भविष्य की ओर',
      actionText: 'जुड़ो • सीखो • आगे बढ़ो',
      welcomeText: 'युवा क्लब में Hopna Tola आपका स्वागत है ',
      badge: 'Welcome to our community'
    },
    {
      title: 'सामुदायिक',
      subtitle: 'एकता',
      mainText: 'एकजुट समुदाय, मजबूत भविष्य',
      subText: 'सांस्कृतिक उत्सवों और सामुदायिक सेवा के माध्यम से मजबूत रिश्ते बनाना',
      actionText: 'सेवा • सहयोग • समर्पण',
      welcomeText: 'संस्कृति संरक्षण में हमारा योगदान',
      badge: 'Community Unity'
    },
    {
      title: 'युवा',
      subtitle: 'शक्ति',
      mainText: 'नेतृत्व की नई पीढ़ी',
      subText: 'युवाओं को सशक्त बनाना, नेतृत्व विकसित करना और सार्थक संबंध बनाना',
      actionText: 'नेतृत्व • विकास • प्रगति',
      welcomeText: 'युवा शक्ति के साथ नए कल का निर्माण करें।',
      badge: 'Youth Power'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  const features = [
    { icon: Image, label: 'Photo Gallery', description: 'Share moments' },
    { icon: MessageCircle, label: 'Live Chat', description: 'Connect instantly' },
    { icon: Video, label: 'Video Hub', description: 'Watch events' },
    { icon: Users, label: 'Community', description: 'Grow together' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-20">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{ backgroundImage: `url(${backgroundImages[currentSlide]})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-dark/80 via-slate-dark/60 to-slate-dark/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-main py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-6 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-primary-foreground font-medium transition-all duration-500">
              {heroContent[currentSlide % heroContent.length].badge}
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 animate-slide-up transition-all duration-500" style={{ animationDelay: '0.1s' }}>
            {heroContent[currentSlide % heroContent.length].title}
            <span className="block bg-gradient-to-r from-primary to-amber-light bg-clip-text text-transparent">
              {heroContent[currentSlide % heroContent.length].subtitle}
            </span>
          </h1>

          {/* Content */}
          <div className="text-lg md:text-xl max-w-2xl mx-auto mb-8 animate-slide-up transition-all duration-500" style={{ animationDelay: '0.2s' }}>
            <h1 className='text-2xl text-primary-foreground mb-2'>{heroContent[currentSlide % heroContent.length].mainText} </h1>
            <h2 className='text-xl text-primary-foreground mb-2'>{heroContent[currentSlide % heroContent.length].subText}</h2>
            <h3 className='text-lg text-primary mb-4'>{heroContent[currentSlide % heroContent.length].actionText}</h3>
            <h1 className='text-xl text-primary-foreground'>{heroContent[currentSlide % heroContent.length].welcomeText}</h1>
          </div> 
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {user ? (
              <Button variant="hero" size="xl" onClick={() => navigate('/gallery')}>
                Explore Gallery
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <>
                <Button variant="hero" size="xl" onClick={() => navigate('/auth')}>
                  Join Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button variant="glass" size="xl" onClick={() => navigate('/gallery')}>
                  Explore
                </Button>
              </>
            )}
          </div>

          {/* Slide Indicators */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {backgroundImages.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-primary w-8' : 'bg-primary/30 w-2'
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {features.map((feature, index) => {
              const getHref = () => {
                switch(feature.label) {
                  case 'Photo Gallery': return '/gallery';
                  case 'Live Chat': return '/chat';
                  case 'Video Hub': return '/videos';
                  case 'Community': return '/chat';
                  default: return '/gallery';
                }
              };
              
              return (
                <div
                  key={feature.label}
                  onClick={() => navigate(getHref())}
                  className="p-4 md:p-6 rounded-xl bg-background/10 backdrop-blur-sm border border-border/20 hover:bg-background/20 hover:border-primary/30 transition-all duration-300 group cursor-pointer"
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }} 
                >
                  <feature.icon className="w-8 h-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-primary-foreground mb-1">{feature.label}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-primary animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

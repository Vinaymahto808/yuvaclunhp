import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const CTASection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) return null;

  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-main">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-dark to-slate-medium p-8 md:p-16">
          {/* Background Decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          {/* Content */}
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Join the community</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
              Ready to Be Part of Something <span className="text-primary">Special?</span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8">
              Connect with like-minded individuals, share your experiences, and be part of our growing community.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="xl" onClick={() => navigate('/auth')}>
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="glass" size="xl" onClick={() => navigate('/gallery')}>
                Explore First
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

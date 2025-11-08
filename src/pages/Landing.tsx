import { Button } from "@/components/ui/button";
import { Brain, Zap, Camera, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedBackground from "@/components/ui/animated-background";
import Globe3D from "@/components/landing/Globe3D";

const Landing = () => {
  return (
    <div className="min-h-screen space-background">
      {/* Navigation */}
      <nav className="backdrop-blur-md bg-black/30 border-b border-cyan-400/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-cyan-400" />
              <span className="text-xl font-bold text-white">
                HireGo AI
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors">Home</a>
              <a href="#features" className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors">Features</a>
              <a href="#employers" className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors">For Employers</a>
              <a href="#seekers" className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors">For Job Seekers</a>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/auth">
                <Button variant="ghost" className="text-gray-300 hover:text-white">Sign In</Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold">Get Started Free</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
        <AnimatedBackground />
        
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text Content */}
            <div className="space-y-8 z-10">
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                Meet the Future of Hiring —{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Powered by AI
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 leading-relaxed max-w-xl">
                HireGo AI connects companies with job-ready candidates within 30 minutes. 
                The fastest, smartest recruitment engine — built for the next generation of hiring.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/auth?mode=signup">
                  <Button 
                    size="lg" 
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-6 text-lg"
                  >
                    Get Candidates Instantly
                  </Button>
                </Link>
                <Link to="/auth?mode=signup">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 font-semibold px-8 py-6 text-lg"
                    style={{ boxShadow: "0 0 20px rgba(103, 232, 249, 0.3)" }}
                  >
                    Book a Demo
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: 3D Globe */}
            <div className="relative z-10">
              <Globe3D />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 space-background">
        <AnimatedBackground />
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold text-white">
              The AI Hiring Engine that Never Sleeps
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Powered by multi-agent intelligence — automating screening, matching, and selection.
            </p>
          </div>

          {/* Three Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Card 1: AI Candidate Screening */}
            <FeatureCard
              icon={<Brain className="h-8 w-8 text-cyan-400" />}
              title="AI Candidate Screening:"
              description="Automatically filters and rates profiles using video + data intelligence."
            />

            {/* Card 2: Instant Match Engine */}
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-cyan-400" />}
              title="Instant Match Engine:"
              description="Matches employers with pre-screened candidates in under 30 minutes."
            />

            {/* Card 3: Video Resume Platform */}
            <FeatureCard
              icon={<Camera className="h-8 w-8 text-cyan-400" />}
              title="Video Resume Platform:"
              description="Candidates express their personality, not just skills."
              hasSparkle
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 space-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div 
              className="backdrop-blur-md bg-gradient-to-r from-purple-600/10 via-cyan-400/10 to-purple-600/10 border-2 rounded-2xl p-12 text-center space-y-6"
              style={{
                borderColor: "hsl(191 97% 77% / 0.3)",
                boxShadow: "0 0 30px hsl(191 97% 77% / 0.2)",
              }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Ready to revolutionize your hiring?
              </h2>
              <p className="text-lg text-gray-300">
                Join forward-thinking companies using AI to find the perfect candidates faster.
              </p>
              <Link to="/auth?mode=signup">
                <Button 
                  size="lg" 
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-6 text-lg"
                >
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cyan-400/20 bg-black/50 backdrop-blur-md">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-400" />
              <span className="font-semibold text-white">HireGo AI</span>
            </div>
            <p className="text-sm text-gray-400">
              © 2025 HireGo AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  hasSparkle?: boolean;
}

const FeatureCard = ({ icon, title, description, hasSparkle }: FeatureCardProps) => {
  return (
    <div 
      className="relative group backdrop-blur-md bg-gray-900/50 p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105"
      style={{
        borderColor: "hsl(191 97% 77% / 0.3)",
        boxShadow: "0 0 15px hsl(191 97% 77% / 0.2)",
      }}
    >
      {hasSparkle && (
        <Sparkles className="absolute top-4 right-4 h-5 w-5 text-cyan-400 opacity-50" />
      )}
      
      <div 
        className="w-16 h-16 rounded-full border-2 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
        style={{
          borderColor: "hsl(191 97% 77%)",
          boxShadow: "0 0 10px hsl(191 97% 77% / 0.3)",
        }}
      >
        {icon}
      </div>
      
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
};

export default Landing;

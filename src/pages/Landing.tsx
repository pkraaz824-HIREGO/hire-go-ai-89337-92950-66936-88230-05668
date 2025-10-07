import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Users, Calendar, BarChart3, Zap, Target, FileCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Navigation */}
      <nav className="glass-card border-b border-border/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                HireGo AI
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-sm font-medium hover:text-primary transition-colors">Home</a>
              <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
              <a href="#employers" className="text-sm font-medium hover:text-primary transition-colors">For Employers</a>
              <a href="#seekers" className="text-sm font-medium hover:text-primary transition-colors">For Job Seekers</a>
              <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</a>
              <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</a>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/auth">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button className="bg-green-600 hover:bg-green-700 text-white">Get Started Free</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">AI-Powered Recruitment Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              Smarter Hiring.{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Faster Growth.
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              HireGo AI automates candidate screening, interview scheduling, and reporting so you hire the right talent effortlessly.
            </p>
            
            <div className="flex items-center gap-4 pt-4">
              <Link to="/auth?mode=signup">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white group">
                  Start Hiring
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/auth?mode=signup&role=candidate">
                <Button variant="outline" size="lg" className="border-2">
                  For Job Seekers
                </Button>
              </Link>
            </div>
          </div>

          {/* Glassy Dashboard Illustration */}
          <div className="relative">
            <Card className="glass-card border-primary/20 shadow-2xl transform hover:scale-105 transition-all duration-300">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Candidate Dashboard</h3>
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card p-4 rounded-lg border border-primary/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium">Active Candidates</span>
                    </div>
                    <p className="text-2xl font-bold">1,247</p>
                    <p className="text-xs text-green-600">+12.5% this week</p>
                  </div>
                  
                  <div className="glass-card p-4 rounded-lg border border-accent/10">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-4 w-4 text-accent" />
                      <span className="text-xs font-medium">Interviews Today</span>
                    </div>
                    <p className="text-2xl font-bold">24</p>
                    <p className="text-xs text-accent">8 completed</p>
                  </div>
                </div>

                <div className="glass-card p-4 rounded-lg border border-primary/10 space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    AI Match Score
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-accent w-[95%]"></div>
                      </div>
                      <span className="text-xs font-bold">95%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">John Doe - Senior Developer</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 glass-card p-3 rounded-lg border border-primary/10">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold">AI Recommendation</p>
                    <p className="text-xs text-muted-foreground">Schedule interview with top candidate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold">
              What HireGo AI Does for You
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Streamline your recruitment process with intelligent automation
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <FeatureCard
              icon={<Target className="h-6 w-6 text-primary" />}
              title="AI Candidate Screening"
              description="Automatically filter and rank candidates based on skills, experience, and culture fit using advanced machine learning algorithms."
            />
            <FeatureCard
              icon={<Calendar className="h-6 w-6 text-primary" />}
              title="Smart Interview Scheduling"
              description="Eliminate scheduling conflicts with AI-powered calendar coordination that finds the perfect time for everyone."
            />
            <FeatureCard
              icon={<BarChart3 className="h-6 w-6 text-primary" />}
              title="Automated Reports"
              description="Get instant insights with comprehensive analytics and automated reporting on candidate performance and hiring metrics."
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6 text-primary" />}
              title="Seamless Integration"
              description="Connect with your existing HR tools and ATS systems for a unified workflow without any technical complexity."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 backdrop-blur-sm border border-border rounded-2xl p-12 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to revolutionize your hiring?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join forward-thinking companies using AI to find the perfect candidates faster.
            </p>
            <Link to="/auth?mode=signup">
              <Button variant="gradient" size="lg" className="group">
                Get Started Free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-semibold">HireGoai</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 HireGoai. All rights reserved.
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
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="group glass-card p-8 rounded-2xl border border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
};

export default Landing;

import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, ArrowLeft, Upload, Check } from "lucide-react";

const steps = [
  { id: 1, title: "Basic Info", description: "Tell us about yourself" },
  { id: 2, title: "Skills", description: "Your expertise and experience" },
  { id: 3, title: "Resume", description: "Upload your resume" },
  { id: 4, title: "Video", description: "Optional video introduction" },
  { id: 5, title: "Assessment", description: "Quick skill check" },
];

const CandidateOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">HireGoai</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">Complete Your Profile</h1>
              <p className="text-muted-foreground">
                Step {currentStep} of {steps.length}
              </p>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {Math.round(progress)}% Complete
            </Badge>
          </div>
          <Progress value={progress} className="mb-6" />

          {/* Step Indicators */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 transition-all ${
                    step.id < currentStep
                      ? "bg-primary border-primary text-primary-foreground"
                      : step.id === currentStep
                      ? "border-primary text-primary"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {step.id < currentStep ? <Check className="h-5 w-5" /> : step.id}
                </div>
                <div className="text-center hidden sm:block">
                  <p className="text-xs font-medium">{step.title}</p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute w-full h-0.5 bg-border -z-10" style={{ left: '50%', top: '20px' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && <BasicInfoStep />}
            {currentStep === 2 && <SkillsStep />}
            {currentStep === 3 && <ResumeStep />}
            {currentStep === 4 && <VideoStep />}
            {currentStep === 5 && <AssessmentStep />}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          {currentStep < steps.length ? (
            <Button variant="hero" onClick={handleNext}>
              Next Step
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Link to="/candidate/dashboard">
              <Button variant="gradient">
                Complete Onboarding
                <Check className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

const BasicInfoStep = () => (
  <div className="space-y-4">
    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input id="firstName" placeholder="John" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input id="lastName" placeholder="Doe" />
      </div>
    </div>
    <div className="space-y-2">
      <Label htmlFor="location">Location</Label>
      <Input id="location" placeholder="San Francisco, CA" />
    </div>
    <div className="space-y-2">
      <Label htmlFor="desiredRole">Desired Role</Label>
      <Input id="desiredRole" placeholder="Frontend Developer" />
    </div>
    <div className="space-y-2">
      <Label htmlFor="bio">Professional Summary</Label>
      <Textarea
        id="bio"
        placeholder="Tell us about your professional background and career goals..."
        rows={4}
      />
    </div>
  </div>
);

const SkillsStep = () => {
  const [skills, setSkills] = useState<string[]>(["React", "TypeScript", "Tailwind CSS"]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="experience">Years of Experience</Label>
        <Input id="experience" type="number" placeholder="5" />
      </div>
      <div className="space-y-2">
        <Label>Skills & Technologies</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
        <Input placeholder="Add a skill and press enter..." />
        <p className="text-xs text-muted-foreground">
          Add your top skills to help us match you with relevant opportunities
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="portfolio">Portfolio/GitHub URL (Optional)</Label>
        <Input id="portfolio" type="url" placeholder="https://github.com/johndoe" />
      </div>
    </div>
  );
};

const ResumeStep = () => (
  <div className="space-y-4">
    <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
      <h3 className="font-semibold mb-2">Upload Your Resume</h3>
      <p className="text-sm text-muted-foreground mb-4">
        PDF, DOC, or DOCX up to 10MB
      </p>
      <Button variant="outline">Choose File</Button>
    </div>
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <Sparkles className="h-5 w-5 text-primary mt-0.5" />
        <div>
          <h4 className="font-semibold text-sm mb-1">AI Resume Parser</h4>
          <p className="text-xs text-muted-foreground">
            Our AI will automatically extract your skills, experience, and education from your resume to complete your profile
          </p>
        </div>
      </div>
    </div>
  </div>
);

const VideoStep = () => (
  <div className="space-y-4">
    <div className="bg-muted/50 rounded-lg p-8 text-center">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Upload className="h-8 w-8 text-primary" />
      </div>
      <h3 className="font-semibold mb-2">Record or Upload Video Introduction</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
        Stand out with a brief video introduction. This is optional but highly recommended to showcase your personality and communication skills.
      </p>
      <div className="flex gap-4 justify-center">
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Upload Video
        </Button>
        <Button variant="hero">
          Record Now
        </Button>
      </div>
    </div>
    <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
      <p className="text-xs text-muted-foreground">
        💡 <strong>Tip:</strong> Keep it under 60 seconds. Introduce yourself, highlight key skills, and explain what you're looking for.
      </p>
    </div>
  </div>
);

const AssessmentStep = () => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold mb-2">AI-Powered Skill Assessment</h3>
          <p className="text-sm text-muted-foreground">
            Complete a quick assessment to validate your skills. This helps us match you with the right opportunities and gives employers confidence in your abilities.
          </p>
        </div>
      </div>
    </div>

    <div className="space-y-4">
      <h4 className="font-semibold">Assessment Options</h4>
      
      <div className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer">
        <div className="flex items-center justify-between mb-2">
          <h5 className="font-medium">Quick Skills Quiz</h5>
          <Badge variant="secondary">10 min</Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Multiple choice questions tailored to your skills
        </p>
        <Button variant="outline" size="sm">Start Quiz</Button>
      </div>

      <div className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer">
        <div className="flex items-center justify-between mb-2">
          <h5 className="font-medium">Coding Challenge</h5>
          <Badge variant="secondary">30 min</Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Solve practical coding problems in your preferred language
        </p>
        <Button variant="outline" size="sm">Start Challenge</Button>
      </div>

      <div className="text-center pt-4">
        <Button variant="ghost" size="sm">
          Skip for now (you can take it later)
        </Button>
      </div>
    </div>
  </div>
);

export default CandidateOnboarding;

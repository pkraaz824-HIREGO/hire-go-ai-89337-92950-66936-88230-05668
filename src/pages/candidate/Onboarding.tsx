import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { CandidateRegistrationForm } from "@/components/candidate/CandidateRegistrationForm";

const CandidateOnboarding = () => {
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

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Welcome to HireGo AI!</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Complete your registration to start your AI-powered hiring journey. 
            After registration, you'll record a video introduction and answer role-specific interview questions.
          </p>
        </div>

        <CandidateRegistrationForm />

        <div className="mt-8 max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              What Happens Next?
            </h3>
            <ol className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="font-semibold text-primary">1.</span>
                <span>Complete this registration form with your details</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-primary">2.</span>
                <span>Record a live video introducing yourself (AI will evaluate your communication)</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-primary">3.</span>
                <span>Answer role-specific interview questions on video</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-primary">4.</span>
                <span>Get your AI-powered performance score and match with jobs</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateOnboarding;
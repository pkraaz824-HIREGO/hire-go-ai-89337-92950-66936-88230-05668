import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LiveInterviewRoom } from '@/components/interview/LiveInterviewRoom';
import { Sparkles, ArrowLeft, Users } from 'lucide-react';

const LiveInterview = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const interviewId = searchParams.get('id') || 'demo-interview';
  const userRole = (searchParams.get('role') as 'candidate' | 'employer') || 'candidate';
  const userName = searchParams.get('name') || 'User';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">HireGoai</span>
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Interview Info */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            Live Interview Session
          </h1>
          <p className="text-muted-foreground">
            Senior Frontend Developer Position
          </p>
        </div>

        {/* Live Interview Room */}
        <LiveInterviewRoom
          interviewId={interviewId}
          userRole={userRole}
          userName={userName}
        />
      </div>
    </div>
  );
};

export default LiveInterview;

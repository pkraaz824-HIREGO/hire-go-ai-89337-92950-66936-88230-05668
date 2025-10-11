import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, Briefcase, Search, MessageSquare, Calendar, UserCheck } from 'lucide-react';
import { CandidateFeedbackModal } from './CandidateFeedbackModal';

interface Candidate {
  id: string;
  name: string;
  status: 'selected' | 'rejected' | 'on_hold' | 'pending_decision';
  feedback: string;
}

interface JobPipelineEnhancedProps {
  title: string;
  applicants: number;
  shortlisted: number;
  interviewed: number;
  offered: number;
  candidates?: Candidate[];
}

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'selected':
      return 'default';
    case 'rejected':
      return 'destructive';
    case 'on_hold':
      return 'secondary';
    case 'pending_decision':
      return 'outline';
    default:
      return 'outline';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'selected':
      return '✓ Selected';
    case 'rejected':
      return '✗ Rejected';
    case 'on_hold':
      return '⏸ On Hold';
    case 'pending_decision':
      return '⏳ Pending';
    default:
      return status;
  }
};

export const JobPipelineEnhanced = ({
  title,
  applicants,
  shortlisted,
  interviewed,
  offered,
  candidates = [],
}: JobPipelineEnhancedProps) => {
  const [feedbackModal, setFeedbackModal] = useState<{
    isOpen: boolean;
    candidate: Candidate | null;
  }>({ isOpen: false, candidate: null });

  // Calculate final results
  const selected = candidates.filter((c) => c.status === 'selected').length;
  const rejected = candidates.filter((c) => c.status === 'rejected').length;
  const onHold = candidates.filter((c) => c.status === 'on_hold').length;
  const pending = candidates.filter((c) => c.status === 'pending_decision').length;

  // Calculate conversion rate (offered/applicants)
  const conversionRate = applicants > 0 ? Math.round((offered / applicants) * 100) : 0;

  const handleFeedbackSave = (candidateId: string, status: string, feedback: string) => {
    console.log('Saving feedback for candidate:', candidateId, status, feedback);
    // TODO: Implement actual save logic with Supabase
  };

  const openFeedbackModal = (candidate: Candidate) => {
    setFeedbackModal({ isOpen: true, candidate });
  };

  return (
    <div className="relative rounded-3xl p-8 overflow-hidden backdrop-blur-xl bg-gradient-to-br from-card/80 via-card/60 to-card/80 border-2 border-primary/20 shadow-[0_0_50px_rgba(59,130,246,0.15)]">
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      <div className="relative space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-foreground">{title}</h3>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
            <span className="text-sm font-semibold text-muted-foreground">
              {conversionRate}% Conversion
            </span>
            <ChevronRight className="h-4 w-4 text-primary" />
          </div>
        </div>

        {/* Funnel Visualization */}
        <div className="relative flex items-center gap-0">
          {/* Applied Stage */}
          <div className="relative flex-shrink-0" style={{ width: '20%' }}>
            <div className="relative rounded-l-full rounded-r-3xl h-32 bg-gradient-to-r from-[hsl(217,91%,35%)] to-[hsl(217,91%,50%)] flex flex-col items-center justify-center shadow-lg border-2 border-primary/30">
              <Briefcase className="h-6 w-6 text-white mb-1" />
              <div className="text-3xl font-bold text-white">{applicants}</div>
              <div className="text-xs font-semibold text-white/90 uppercase tracking-wide">Applied</div>
            </div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          {/* Shortlisted Stage */}
          <div className="relative flex-shrink-0 -ml-6" style={{ width: '18%' }}>
            <div className="relative rounded-3xl h-28 bg-gradient-to-r from-[hsl(217,91%,50%)] to-[hsl(217,91%,60%)] flex flex-col items-center justify-center shadow-lg border-2 border-primary/30">
              <div className="text-2xl font-bold text-white">{shortlisted}</div>
              <div className="text-xs font-semibold text-white/90 uppercase tracking-wide">Shortlisted</div>
            </div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
              <UserCheck className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          {/* Interviewed Stage */}
          <div className="relative flex-shrink-0 -ml-6" style={{ width: '16%' }}>
            <div className="relative rounded-3xl h-24 bg-gradient-to-r from-[hsl(200,91%,50%)] to-[hsl(191,97%,60%)] flex flex-col items-center justify-center shadow-lg border-2 border-accent/30">
              <div className="text-2xl font-bold text-white">{interviewed}</div>
              <div className="text-xs font-semibold text-white/90 uppercase tracking-wide">Interviewed</div>
            </div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          {/* Offered Stage */}
          <div className="relative flex-shrink-0 -ml-6" style={{ width: '14%' }}>
            <div className="relative rounded-3xl h-20 bg-gradient-to-r from-[hsl(191,97%,60%)] to-[hsl(191,97%,70%)] flex flex-col items-center justify-center shadow-lg border-2 border-accent/30">
              <div className="text-xl font-bold text-white">{offered}</div>
              <div className="text-xs font-semibold text-white/90 uppercase tracking-wide">Offered</div>
            </div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          {/* Final Results Section */}
          <div className="relative flex-shrink-0 ml-8 flex-1">
            <div className="rounded-2xl bg-muted/40 border border-border p-4 backdrop-blur-sm">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 text-center">
                Final Results
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-500/30">
                  <span className="text-xs font-bold text-green-700 dark:text-green-300">Selected</span>
                  <Badge className="bg-green-500 text-white font-bold">{selected}</Badge>
                </div>
                <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30">
                  <span className="text-xs font-bold text-red-700 dark:text-red-300">Rejected</span>
                  <Badge className="bg-red-500 text-white font-bold">{rejected}</Badge>
                </div>
                {(pending > 0 || onHold > 0) && (
                  <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-muted/60 border border-border">
                    <span className="text-xs font-bold text-muted-foreground">Pending</span>
                    <Badge variant="secondary" className="font-bold">{pending + onHold}</Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Candidate Details (Expandable) */}
        {candidates.length > 0 && (
          <details className="group mt-8">
            <summary className="cursor-pointer list-none flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
              <span>View Candidate Details</span>
              <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
            </summary>
            <div className="mt-4 space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-card/50 border border-border hover:border-primary/30 transition-all backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="font-semibold text-sm">{candidate.name}</span>
                    <Badge variant={getStatusBadgeVariant(candidate.status)}>
                      {getStatusLabel(candidate.status)}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openFeedbackModal(candidate)}
                    className="h-8 gap-1"
                  >
                    <MessageSquare className="h-3 w-3" />
                    Feedback
                  </Button>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>

      {/* Feedback Modal */}
      {feedbackModal.candidate && (
        <CandidateFeedbackModal
          isOpen={feedbackModal.isOpen}
          onClose={() => setFeedbackModal({ isOpen: false, candidate: null })}
          candidateName={feedbackModal.candidate.name}
          currentStatus={feedbackModal.candidate.status}
          currentFeedback={feedbackModal.candidate.feedback}
          onSave={(status, feedback) =>
            handleFeedbackSave(feedbackModal.candidate!.id, status, feedback)
          }
        />
      )}
    </div>
  );
};

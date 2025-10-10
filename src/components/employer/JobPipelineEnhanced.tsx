import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState<{
    isOpen: boolean;
    candidate: Candidate | null;
  }>({ isOpen: false, candidate: null });

  // Calculate final results
  const selected = candidates.filter((c) => c.status === 'selected').length;
  const rejected = candidates.filter((c) => c.status === 'rejected').length;
  const onHold = candidates.filter((c) => c.status === 'on_hold').length;
  const pending = candidates.filter((c) => c.status === 'pending_decision').length;

  const handleFeedbackSave = (candidateId: string, status: string, feedback: string) => {
    console.log('Saving feedback for candidate:', candidateId, status, feedback);
    // TODO: Implement actual save logic with Supabase
  };

  const openFeedbackModal = (candidate: Candidate) => {
    setFeedbackModal({ isOpen: true, candidate });
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pipeline Stats */}
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-primary">{applicants}</div>
            <div className="text-xs font-bold text-muted-foreground">Applied</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-accent">{shortlisted}</div>
            <div className="text-xs font-bold text-muted-foreground">Shortlisted</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-primary">{interviewed}</div>
            <div className="text-xs font-bold text-muted-foreground">Interviewed</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-accent">{offered}</div>
            <div className="text-xs font-bold text-muted-foreground">Offered</div>
          </div>
        </div>

        {/* Final Results Summary */}
        <div className="rounded-lg bg-muted/30 p-3 backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold">
            <span className="text-muted-foreground">Final Results:</span>
            <Badge variant="default" className="bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30">
              {selected} Selected
            </Badge>
            <Badge variant="destructive" className="bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30">
              {rejected} Rejected
            </Badge>
            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30">
              {onHold} On Hold
            </Badge>
            {pending > 0 && (
              <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30">
                {pending} Pending
              </Badge>
            )}
          </div>
        </div>

        {/* Summary Line */}
        <div className="text-center text-xs font-semibold text-muted-foreground">
          {applicants} Applied | {shortlisted} Shortlisted | {interviewed} Interviewed | {selected} Selected | {rejected} Rejected | {onHold + pending} Pending
        </div>

        {/* Candidate List (Expandable) */}
        {isExpanded && candidates.length > 0 && (
          <div className="space-y-2 border-t pt-4">
            <div className="text-sm font-bold mb-3">Candidate Status</div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-card border border-border hover:border-primary/30 transition-all"
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
          </div>
        )}

        {isExpanded && candidates.length === 0 && (
          <div className="text-center py-4 text-sm text-muted-foreground border-t">
            No candidates to review yet
          </div>
        )}
      </CardContent>

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
    </Card>
  );
};

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CandidateFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  currentStatus: string;
  currentFeedback: string;
  onSave: (status: string, feedback: string) => void;
}

export const CandidateFeedbackModal = ({
  isOpen,
  onClose,
  candidateName,
  currentStatus,
  currentFeedback,
  onSave,
}: CandidateFeedbackModalProps) => {
  const [status, setStatus] = useState(currentStatus);
  const [feedback, setFeedback] = useState(currentFeedback);

  const handleSave = () => {
    onSave(status, feedback);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Candidate Feedback</DialogTitle>
          <DialogDescription>
            Update status and add feedback for {candidateName}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="selected">✓ Selected</SelectItem>
                <SelectItem value="rejected">✗ Rejected</SelectItem>
                <SelectItem value="on_hold">⏸ On Hold</SelectItem>
                <SelectItem value="pending_decision">⏳ Pending Decision</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="feedback">Feedback Notes</Label>
            <Textarea
              id="feedback"
              placeholder="Add your feedback notes here..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[150px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="hero" onClick={handleSave}>
            Save Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Briefcase, DollarSign, Calendar, Users, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface JobDetailsModalProps {
  job: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  matchScore?: number;
  onApply?: () => void;
}

export const JobDetailsModal = ({ job, open, onOpenChange, matchScore, onApply }: JobDetailsModalProps) => {
  const [applying, setApplying] = useState(false);

  const handleApply = async () => {
    try {
      setApplying(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to apply for jobs",
          variant: "destructive",
        });
        return;
      }

      // Check if already applied
      const { data: existingApp } = await supabase
        .from('applications')
        .select('id')
        .eq('candidate_id', user.id)
        .eq('job_id', job.id)
        .maybeSingle();

      if (existingApp) {
        toast({
          title: "Already Applied",
          description: "You have already applied for this position",
        });
        return;
      }

      // Create application
      const { error } = await supabase
        .from('applications')
        .insert({
          candidate_id: user.id,
          job_id: job.id,
          status: 'applied',
          match_score: matchScore || 0,
        });

      if (error) throw error;

      toast({
        title: "Application Submitted! 🎉",
        description: "Your application has been sent to the employer",
      });

      onOpenChange(false);
      if (onApply) onApply();
    } catch (error: any) {
      console.error('Application error:', error);
      toast({
        title: "Application Failed",
        description: error.message || "Failed to submit application",
        variant: "destructive",
      });
    } finally {
      setApplying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{job.title}</DialogTitle>
              <DialogDescription className="text-base font-semibold">
                {job.company}
              </DialogDescription>
            </div>
            {matchScore && (
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-bold text-lg px-4 py-2">
                {matchScore}% Match
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Key Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">{job.location || 'Remote'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">{job.employment_type || 'Full-time'}</span>
            </div>
            {(job.salary_min || job.salary_max) && (
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">
                  ${job.salary_min || 0}k - ${job.salary_max || 0}k
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">{job.num_openings || 1} Opening{job.num_openings > 1 ? 's' : ''}</span>
            </div>
          </div>

          <Separator />

          {/* Description */}
          {job.description && (
            <div>
              <h3 className="font-bold text-lg mb-2">About the Role</h3>
              <p className="text-muted-foreground whitespace-pre-line">{job.description}</p>
            </div>
          )}

          {/* Responsibilities */}
          {job.job_responsibilities && (
            <div>
              <h3 className="font-bold text-lg mb-2">Responsibilities</h3>
              <p className="text-muted-foreground whitespace-pre-line">{job.job_responsibilities}</p>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h3 className="font-bold text-lg mb-2">Requirements</h3>
              <ul className="space-y-2">
                {job.requirements.map((req: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Qualifications */}
          {job.key_qualifications && (
            <div>
              <h3 className="font-bold text-lg mb-2">Key Qualifications</h3>
              <p className="text-muted-foreground whitespace-pre-line">{job.key_qualifications}</p>
            </div>
          )}

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <div>
              <h3 className="font-bold text-lg mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill: string) => (
                  <Badge key={skill} variant="outline" className="font-semibold">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Application Deadline */}
          {job.application_deadline && (
            <div className="flex items-center gap-2 text-sm bg-muted/50 p-3 rounded-lg">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">
                Application Deadline: {new Date(job.application_deadline).toLocaleDateString()}
              </span>
            </div>
          )}

          {/* Apply Button */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Close
            </Button>
            <Button
              onClick={handleApply}
              disabled={applying}
              variant="hero"
              className="flex-1"
            >
              {applying ? "Applying..." : "Apply Now"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

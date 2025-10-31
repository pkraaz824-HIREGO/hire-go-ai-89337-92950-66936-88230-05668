import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Search, Eye, Ban, CheckCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Candidate {
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  overall_candidate_score: number | null;
  years_of_experience: number;
  preferred_domain: string | null;
  avatar_url: string | null;
  profile_completion_status: string;
}

export default function CandidatesPanel() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, full_name, email, phone, overall_candidate_score, years_of_experience, preferred_domain, avatar_url, profile_completion_status')
        .eq('role', 'candidate')
        .order('full_name');

      if (error) throw error;
      setCandidates(data || []);
    } catch (error) {
      toast.error('Failed to load candidates');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCandidates = candidates.filter((candidate) =>
    candidate.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.preferred_domain?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidate Management</CardTitle>
        <CardDescription>View and manage all registered candidates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or domain..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading candidates...</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCandidates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      No candidates found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCandidates.map((candidate) => (
                    <TableRow key={candidate.user_id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={candidate.avatar_url || undefined} />
                            <AvatarFallback>
                              {candidate.full_name?.substring(0, 2).toUpperCase() || 'CN'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{candidate.full_name || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>{candidate.email}</TableCell>
                      <TableCell>{candidate.phone || 'N/A'}</TableCell>
                      <TableCell>
                        {candidate.overall_candidate_score ? (
                          <Badge variant={candidate.overall_candidate_score >= 80 ? 'default' : 'secondary'}>
                            {candidate.overall_candidate_score}/100
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">Not scored</span>
                        )}
                      </TableCell>
                      <TableCell>{candidate.years_of_experience} years</TableCell>
                      <TableCell>{candidate.preferred_domain || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={candidate.profile_completion_status === 'complete' ? 'default' : 'outline'}>
                          {candidate.profile_completion_status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="mt-4 text-sm text-muted-foreground">
          Total candidates: {filteredCandidates.length}
        </div>
      </CardContent>
    </Card>
  );
}

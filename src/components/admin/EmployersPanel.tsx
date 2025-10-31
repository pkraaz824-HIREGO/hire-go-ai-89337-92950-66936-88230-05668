import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Search, Eye, Building2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Employer {
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  company_name: string | null;
  industry: string | null;
  employee_count: string | null;
  website: string | null;
  avatar_url: string | null;
  job_count?: number;
}

export default function EmployersPanel() {
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadEmployers();
  }, []);

  const loadEmployers = async () => {
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, full_name, email, phone, company_name, industry, employee_count, website, avatar_url')
        .eq('role', 'employer')
        .order('company_name');

      if (profilesError) throw profilesError;

      // Get job counts for each employer
      const employersWithCounts = await Promise.all(
        (profilesData || []).map(async (employer) => {
          const { count } = await supabase
            .from('jobs')
            .select('*', { count: 'exact', head: true })
            .eq('employer_id', employer.user_id);

          return { ...employer, job_count: count || 0 };
        })
      );

      setEmployers(employersWithCounts);
    } catch (error) {
      toast.error('Failed to load employers');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployers = employers.filter((employer) =>
    employer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employer.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employer.industry?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employer Management</CardTitle>
        <CardDescription>View and manage all registered employers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, company, or industry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading employers...</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employer</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Active Jobs</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No employers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployers.map((employer) => (
                    <TableRow key={employer.user_id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={employer.avatar_url || undefined} />
                            <AvatarFallback>
                              {employer.full_name?.substring(0, 2).toUpperCase() || 'EM'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{employer.full_name || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span>{employer.company_name || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>{employer.email}</TableCell>
                      <TableCell>{employer.industry || 'N/A'}</TableCell>
                      <TableCell>
                        {employer.employee_count ? (
                          <Badge variant="outline">{employer.employee_count}</Badge>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge>{employer.job_count} jobs</Badge>
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
          Total employers: {filteredEmployers.length}
        </div>
      </CardContent>
    </Card>
  );
}

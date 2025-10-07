import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Calendar, Trophy, Sparkles } from 'lucide-react';

interface Stats {
  totalApplicants: number;
  shortlisted: number;
  interviewsScheduled: number;
  hired: number;
  aiRecommendations: number;
}

export const EmployerStats = () => {
  const [stats, setStats] = useState<Stats>({
    totalApplicants: 0,
    shortlisted: 0,
    interviewsScheduled: 0,
    hired: 0,
    aiRecommendations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get total applicants
      const { data: applications } = await supabase
        .from('applications')
        .select('*, jobs!inner(employer_id)')
        .eq('jobs.employer_id', user.id);

      const totalApplicants = applications?.length || 0;

      // Get shortlisted
      const shortlisted = applications?.filter(
        a => a.status === 'shortlisted' || a.status === 'interview_scheduled'
      ).length || 0;

      // Get interviews scheduled
      const { data: interviews } = await supabase
        .from('interviews')
        .select('*')
        .eq('employer_id', user.id)
        .neq('status', 'cancelled');

      const interviewsScheduled = interviews?.length || 0;

      // Get hired
      const hired = applications?.filter(a => a.status === 'offered').length || 0;

      // Get AI recommendations (high match score applications)
      const aiRecommendations = applications?.filter(
        a => (a.ai_recommendation_score || 0) >= 70
      ).length || 0;

      setStats({
        totalApplicants,
        shortlisted,
        interviewsScheduled,
        hired,
        aiRecommendations,
      });

    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Applicants',
      value: stats.totalApplicants,
      icon: Users,
      color: 'text-blue-500',
    },
    {
      title: 'Shortlisted',
      value: stats.shortlisted,
      icon: UserCheck,
      color: 'text-green-500',
    },
    {
      title: 'Interviews Scheduled',
      value: stats.interviewsScheduled,
      icon: Calendar,
      color: 'text-purple-500',
    },
    {
      title: 'Hired',
      value: stats.hired,
      icon: Trophy,
      color: 'text-yellow-500',
    },
    {
      title: 'AI Recommendations',
      value: stats.aiRecommendations,
      icon: Sparkles,
      color: 'text-pink-500',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
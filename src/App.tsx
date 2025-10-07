import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import CandidateDashboard from "./pages/candidate/DashboardWithTabs";
import CandidateProfile from "./pages/candidate/Profile";
import CandidateOnboarding from "./pages/candidate/Onboarding";
import VideoIntroduction from "./pages/candidate/VideoIntroduction";
import InterviewQuestions from "./pages/candidate/InterviewQuestions";
import EmployerDashboard from "./pages/employer/DashboardWithTabs";
import EmployerOnboarding from "./pages/employer/Onboarding";
import PostJob from "./pages/employer/PostJob";
import LiveInterview from "./pages/LiveInterview";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/candidate/dashboard" element={
              <ProtectedRoute allowedRole="candidate">
                <CandidateDashboard />
              </ProtectedRoute>
            } />
            <Route path="/candidate/profile" element={
              <ProtectedRoute allowedRole="candidate">
                <CandidateProfile />
              </ProtectedRoute>
            } />
            <Route path="/candidate/onboarding" element={
              <ProtectedRoute allowedRole="candidate">
                <CandidateOnboarding />
              </ProtectedRoute>
            } />
            <Route path="/candidate/video-introduction" element={
              <ProtectedRoute allowedRole="candidate">
                <VideoIntroduction />
              </ProtectedRoute>
            } />
            <Route path="/candidate/interview-questions" element={
              <ProtectedRoute allowedRole="candidate">
                <InterviewQuestions />
              </ProtectedRoute>
            } />
            <Route path="/employer/dashboard" element={
              <ProtectedRoute allowedRole="employer">
                <EmployerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/employer/onboarding" element={
              <ProtectedRoute allowedRole="employer">
                <EmployerOnboarding />
              </ProtectedRoute>
            } />
            <Route path="/employer/post-job" element={
              <ProtectedRoute allowedRole="employer">
                <PostJob />
              </ProtectedRoute>
            } />
            <Route path="/live-interview" element={<LiveInterview />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Wand2, Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(3, "Job title must be at least 3 characters"),
  employmentType: z.string().min(1, "Please select employment type"),
  jobCategory: z.string().min(1, "Please select job category"),
  skills: z.string().min(1, "Please enter required skills"),
  experienceLevel: z.string().min(1, "Please select experience level"),
  salaryMin: z.coerce.number().min(0, "Minimum salary must be positive"),
  salaryMax: z.coerce.number().min(0, "Maximum salary must be positive"),
  location: z.string().min(2, "Location is required"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  jobResponsibilities: z.string().optional(),
  keyQualifications: z.string().optional(),
  numOpenings: z.coerce.number().min(1, "Must have at least 1 opening").default(1),
  applicationDeadline: z.string().min(1, "Application deadline is required"),
  contactEmail: z.string().email("Invalid email address"),
});

export default function PostJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      employmentType: "",
      jobCategory: "",
      skills: "",
      experienceLevel: "",
      salaryMin: 0,
      salaryMax: 0,
      location: "",
      description: "",
      jobResponsibilities: "",
      keyQualifications: "",
      numOpenings: 1,
      applicationDeadline: "",
      contactEmail: "",
    },
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to post jobs",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    // @ts-ignore - Supabase types will auto-regenerate
    const { data: profileData } = await supabase
      // @ts-ignore
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    // @ts-ignore - Supabase types will auto-regenerate
    if (!profileData || profileData.role !== "employer") {
      toast({
        title: "Access Denied",
        description: "Only employers can post jobs",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    setProfile(profileData);
    // @ts-ignore - Supabase types will auto-regenerate
    form.setValue("contactEmail", profileData.email || "");
    // @ts-ignore - Supabase types will auto-regenerate
    form.setValue("location", profileData.city || "");
  };

  const generateJobDescription = async () => {
    const title = form.getValues("title");
    const skills = form.getValues("skills");
    const experienceLevel = form.getValues("experienceLevel");
    const location = form.getValues("location");
    const salaryMin = form.getValues("salaryMin");
    const salaryMax = form.getValues("salaryMax");

    if (!title || !skills || !experienceLevel || !location) {
      toast({
        title: "Missing Information",
        description: "Please fill in job title, skills, experience level, and location first",
        variant: "destructive",
      });
      return;
    }

    try {
      setGenerating(true);
      
      const salaryRange = `${salaryMin} - ${salaryMax}`;
      const skillsArray = skills.split(',').map(s => s.trim());

      const { data, error } = await supabase.functions.invoke('generate-job-description', {
        body: { 
          jobTitle: title,
          skills: skillsArray,
          experienceLevel,
          location,
          salaryRange
        }
      });

      if (error) throw error;

      form.setValue("description", data.description);
      
      toast({
        title: "Success!",
        description: "AI has generated a professional job description. You can edit it before posting.",
      });
    } catch (error: any) {
      console.error('Error generating description:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate job description. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>, isDraft = false) => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to post jobs",
          variant: "destructive",
        });
        return;
      }

      const skillsArray = values.skills.split(',').map(s => s.trim());

      // @ts-ignore - Supabase types will auto-regenerate
      const { error } = await supabase
        // @ts-ignore
        .from("jobs")
        // @ts-ignore
        .insert({
          // @ts-ignore
          employer_id: user.id,
          title: values.title,
          company: profile?.company_name || "Company Name",
          employment_type: values.employmentType,
          job_category: values.jobCategory,
          skills: skillsArray,
          experience_level: values.experienceLevel,
          salary_min: values.salaryMin,
          salary_max: values.salaryMax,
          location: values.location,
          description: values.description,
          job_responsibilities: values.jobResponsibilities,
          key_qualifications: values.keyQualifications,
          num_openings: values.numOpenings,
          application_deadline: values.applicationDeadline,
          contact_email: values.contactEmail,
          status: isDraft ? "draft" : "active",
          is_draft: isDraft,
        });

      if (error) throw error;

      toast({
        title: isDraft ? "Saved as Draft!" : "Job Posted Successfully!",
        description: isDraft ? "Your job has been saved as draft" : "Your job posting is now live",
      });

      navigate("/employer/dashboard");
    } catch (error: any) {
      toast({
        title: "Failed to Post Job",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card rounded-2xl shadow-2xl p-8 animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
              Post a New Job Opening
            </h1>
            <p className="text-muted-foreground text-lg">
              Create a compelling job posting powered by AI to attract top talent
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => onSubmit(data, false))} className="space-y-6">
              {/* Basic Job Information */}
              <div className="glass-card rounded-xl p-6 mb-6">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Job Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Frontend Developer, Sales Executive" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="employmentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employment Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Full-time">Full-time</SelectItem>
                            <SelectItem value="Part-time">Part-time</SelectItem>
                            <SelectItem value="Internship">Internship</SelectItem>
                            <SelectItem value="Contract">Contract</SelectItem>
                            <SelectItem value="Remote">Remote</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="jobCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Category *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Tech">Tech</SelectItem>
                            <SelectItem value="Sales">Sales</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="HR">HR</SelectItem>
                            <SelectItem value="Customer Support">Customer Support</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                            <SelectItem value="Design">Design</SelectItem>
                            <SelectItem value="Product">Product</SelectItem>
                            <SelectItem value="Operations">Operations</SelectItem>
                            <SelectItem value="Others">Others</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Required Skills *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., React, Node.js, Communication (comma-separated)" {...field} />
                        </FormControl>
                        <FormDescription>Enter skills separated by commas</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="experienceLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience Level *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select experience" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Entry Level (0-1 yr)">Entry Level (0-1 yr)</SelectItem>
                            <SelectItem value="Mid Level (2-5 yrs)">Mid Level (2-5 yrs)</SelectItem>
                            <SelectItem value="Senior (5+ yrs)">Senior (5+ yrs)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Bengaluru, Mumbai, Remote" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="salaryMin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Salary *</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="40000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="salaryMax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Salary *</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="70000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* AI Job Description Generator */}
              <div className="glass-card border-2 border-primary/30 rounded-xl p-6 mb-6 bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Wand2 className="h-5 w-5 text-primary animate-pulse" />
                      AI Job Description Generator
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">Let AI create a professional job description for you</p>
                  </div>
                  <Button 
                    type="button" 
                    onClick={generateJobDescription} 
                    disabled={generating}
                    variant="gradient"
                    size="lg"
                    className="hover:scale-105 transition-transform"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-5 w-5" />
                        🪄 Auto Generate
                      </>
                    )}
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Description *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Click 'Generate Description' to let AI create a professional job description, or write your own..." 
                          className="min-h-[300px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>AI-generated descriptions can be edited before posting</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Additional Details */}
              <div className="glass-card rounded-xl p-6 mb-6">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  Additional Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="numOpenings"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Openings *</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="applicationDeadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application Deadline *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Contact Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="hr@company.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border/50 -mx-8 -mb-8 px-8 py-6 mt-8">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => form.handleSubmit((data) => onSubmit(data, true))()}
                    disabled={loading}
                    size="lg"
                    className="flex-1 hover:scale-[1.02] transition-transform"
                  >
                    💾 Save as Draft
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    variant="gradient"
                    size="lg"
                    className="flex-1 hover:scale-[1.02] transition-transform shadow-lg"
                  >
                    {loading ? "Posting..." : "📢 Publish Job Now"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

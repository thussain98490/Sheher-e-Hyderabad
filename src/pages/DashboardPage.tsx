import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getSavedPlans, deleteSavedPlan, updateProfile } from '@/db/api';
import type { SavedPlan } from '@/types';
import { toast } from 'sonner';
import { Trash2, Calendar, Heart } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function DashboardPage() {
  const { user, profile, refreshProfile } = useAuth();
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [userType, setUserType] = useState<'tourist' | 'local'>('tourist');

  const getDashboardErrorMessage = (error: unknown) => {
    const message = error instanceof Error ? error.message : 'Unknown error';

    if (message.includes('saved_plans')) {
      return 'The saved_plans table is unavailable.';
    }

    if (message.toLowerCase().includes('jwt')) {
      return 'Authentication issue. Please sign in again.';
    }

    return `We could not load your saved plans. ${message}`;
  };

  const loadSavedPlans = async (userId: string) => {
    setLoading(true);
    setWarning(null);

    try {
      const data = await getSavedPlans(userId);
      setSavedPlans(data);
    } catch (error) {
      setSavedPlans([]);
      setWarning(getDashboardErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadSavedPlans(user.id);
  }, [user]);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setUserType(profile.user_type || 'tourist');
    }
  }, [profile]);

  const handleDeletePlan = async (id: string) => {
    try {
      await deleteSavedPlan(id);
      setSavedPlans((prev) => prev.filter((p) => p.id !== id));
      toast.success('Plan deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    try {
      await updateProfile(user.id, { name, user_type: userType });
      await refreshProfile();
      toast.success('Profile updated');
    } catch {
      toast.error('Update failed');
    }
  };

  const stats = [
    { label: 'Saved Plans', value: savedPlans.length, icon: Heart },
    { label: 'Total Days', value: savedPlans.reduce((a, p) => a + p.plan_data.days, 0), icon: Calendar },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto max-w-7xl px-4 py-10">

        {/* HEADER */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-2">Your Dashboard </h1>
          <p className="text-muted-foreground">
            Manage your trips and profile
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="hover:shadow-xl transition hover:-translate-y-1">
                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
                  </div>
                  <Icon className="h-10 w-10 text-primary opacity-30" />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* TABS */}
        <Tabs defaultValue="plans">
          <TabsList className="bg-muted p-1 rounded-xl flex justify-center mb-10 max-w-md mx-auto">
            <TabsTrigger value="plans" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
              My Plans
            </TabsTrigger>
            <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
              Profile
            </TabsTrigger>
          </TabsList>

          {/* PLANS */}
          <TabsContent value="plans">
            {warning && (
              <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {warning}
              </div>
            )}
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : savedPlans.length === 0 ? (
              <Card className="text-center py-12 shadow-md">
                <CardContent>
                  <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="mb-4">No saved plans yet</p>
                  <Button asChild>
                    <Link to="/planner">Create Plan</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-md">
                <CardContent className="p-0">
                  <Accordion type="single" collapsible className="w-full">
                    {savedPlans.map((plan, i) => (
                      <AccordionItem key={plan.id} value={plan.id} className="hover:bg-accent/20 transition">
                        
                        <div className="px-6 pt-6 pb-2 flex justify-between">
                          <div>
                            <p className="text-sm text-primary font-semibold">Plan {i + 1}</p>
                            <h3 className="text-lg font-bold">{plan.plan_name}</h3>
                          </div>
                          <Button size="icon" variant="destructive" onClick={() => handleDeletePlan(plan.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <AccordionTrigger className="px-6">
                          View Details
                        </AccordionTrigger>

                        <AccordionContent className="px-6 pb-6">
                          <p className="text-sm text-muted-foreground">
                            {plan.plan_data.days} days • {plan.plan_data.budget}
                          </p>
                        </AccordionContent>

                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* PROFILE */}
          <TabsContent value="profile">
            <Card className="shadow-md hover:shadow-lg transition">
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                
                <div>
                  <Label>Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} className="h-11" />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input value={profile?.email || ''} disabled className="bg-muted h-11" />
                </div>

                <div>
                  <Label>User Type</Label>
                  <RadioGroup value={userType} onValueChange={(v) => setUserType(v as any)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tourist" />
                      <Label>Tourist</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="local" />
                      <Label>Local</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button onClick={handleUpdateProfile} className="w-full h-11 hover:scale-[1.02] transition">
                  Update Profile
                </Button>

              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>

      </div>
    </MainLayout>
  );
}

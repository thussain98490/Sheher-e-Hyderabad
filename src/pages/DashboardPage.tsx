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
import { Trash2, Calendar, DollarSign, Heart } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import ErrorState from '@/components/common/ErrorState';

export default function DashboardPage() {
  const { user, profile, refreshProfile } = useAuth();
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [name, setName] = useState('');
  const [userType, setUserType] = useState<'tourist' | 'local'>('tourist');

  const getDashboardErrorMessage = (error: unknown) => {
    const message = error instanceof Error ? error.message : 'Unknown error';

    if (message.includes('saved_plans')) {
      return 'The saved_plans table is unavailable in Supabase. Run your initial schema migration and check that the table exists.';
    }

    if (message.toLowerCase().includes('jwt') || message.toLowerCase().includes('row-level security')) {
      return 'Your dashboard request was blocked by authentication or Supabase policies. Please sign in again and verify your RLS rules.';
    }

    return `We could not load your saved plans right now. ${message}`;
  };

  const loadSavedPlans = async (userId: string) => {
    setLoading(true);
    setError(null);
    setWarning(null);

    try {
      const data = await getSavedPlans(userId);
      setSavedPlans(data);
      setSelectedPlanId((currentSelectedPlanId) => {
        if (data.length === 0) return '';
        if (currentSelectedPlanId && data.some((plan) => plan.id === currentSelectedPlanId)) {
          return currentSelectedPlanId;
        }
        return data[0].id;
      });
    } catch (error) {
      console.error('Failed to load dashboard saved plans:', error);
      setSavedPlans([]);
      setSelectedPlanId('');
      setWarning(getDashboardErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      void loadSavedPlans(user.id);
    } else {
      setSavedPlans([]);
      setError(null);
      setWarning(null);
      setSelectedPlanId('');
      setLoading(false);
    }
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
      setSavedPlans((prev) => {
        const nextPlans = prev.filter((plan) => plan.id !== id);
        setSelectedPlanId((currentSelectedPlanId) => {
          if (currentSelectedPlanId !== id) return currentSelectedPlanId;
          return nextPlans[0]?.id ?? '';
        });
        return nextPlans;
      });
      toast.success('Plan deleted successfully');
    } catch (error) {
      toast.error('Failed to delete plan');
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    try {
      await updateProfile(user.id, { name, user_type: userType });
      await refreshProfile();
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const stats = [
    { label: 'Saved Plans', value: savedPlans.length, icon: Heart },
    { label: 'Total Days Planned', value: savedPlans.reduce((acc, plan) => acc + plan.plan_data.days, 0), icon: Calendar },
  ];
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Manage your trips and profile
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
                  </div>
                  <Icon className="h-12 w-12 text-primary opacity-20" />
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="plans">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="plans">My Plans</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="plans">
            {warning && (
              <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {warning}
              </div>
            )}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">Loading...</p>
              </div>
            ) : error ? (
              <ErrorState
                title="Dashboard unavailable"
                description={error}
                actionLabel="Retry"
                onAction={() => {
                  if (user) {
                    void loadSavedPlans(user.id);
                  }
                }}
              />
            ) : savedPlans.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground mb-4">No saved plans yet</p>
                  <Button asChild>
                    <Link to="/planner">Create Your First Plan</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-0">
                    <Accordion
                      type="single"
                      collapsible
                      value={selectedPlanId}
                      onValueChange={setSelectedPlanId}
                      className="w-full"
                    >
                      {savedPlans.map((plan, index) => (
                        <AccordionItem key={plan.id} value={plan.id} className="border-b last:border-b-0">
                          <div className="px-6 pt-6">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="text-sm font-semibold text-primary">Plan {index + 1}</p>
                                <CardTitle className="mt-1 text-xl">{plan.plan_name}</CardTitle>
                                <p className="mt-1 text-sm text-muted-foreground">
                                  Created on {new Date(plan.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  void handleDeletePlan(plan.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                              <div className="flex items-center text-sm">
                                <Calendar className="mr-2 h-4 w-4 text-primary" />
                                <span>{plan.plan_data.days} Days</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <DollarSign className="mr-2 h-4 w-4 text-primary" />
                                <span>{plan.plan_data.budget}</span>
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">Type: </span>
                                <span className="capitalize">{plan.plan_data.user_type}</span>
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">Interests: </span>
                                <span>{plan.plan_data.interests.join(', ')}</span>
                              </div>
                            </div>
                          </div>

                          <div className="px-6">
                            <AccordionTrigger className="py-5 text-sm font-semibold text-primary hover:no-underline">
                              {selectedPlanId === plan.id ? 'Hide full plan' : 'View full plan'}
                            </AccordionTrigger>
                          </div>

                          <AccordionContent className="px-6 pb-6">
                            <div className="space-y-3">
                              {plan.plan_data.itinerary.map((day: { day: number; activities: Array<{ time: string; name: string; type: string }> }) => (
                                <div key={day.day} className="border-l-2 border-primary pl-4">
                                  <p className="mb-2 font-semibold text-primary">Day {day.day}</p>
                                  <div className="space-y-1">
                                    {day.activities.map((activity: { time: string; name: string; type: string }, activityIndex: number) => (
                                      <p key={activityIndex} className="text-sm text-muted-foreground">
                                        {activity.time} - {activity.name} ({activity.type})
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">Name</Label>
                  <Input
                    id="profile-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-email">Email</Label>
                  <Input
                    id="profile-email"
                    value={profile?.email || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label>User Type</Label>
                  <RadioGroup value={userType} onValueChange={(value) => setUserType(value as 'tourist' | 'local')}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tourist" id="profile-tourist" />
                      <Label htmlFor="profile-tourist" className="font-normal cursor-pointer">
                        Tourist
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="local" id="profile-local" />
                      <Label htmlFor="profile-local" className="font-normal cursor-pointer">
                        Local
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input
                    value={profile?.role || ''}
                    disabled
                    className="bg-muted capitalize"
                  />
                </div>

                <Button onClick={handleUpdateProfile} className="w-full">
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

import { useState } from 'react';
import { Clock, MapPin, Sparkles, Utensils } from 'lucide-react';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import type { DayPlan, UserType } from '@/types';
import {
  buildPlanData,
  generateItinerary,
  interestOptions,
  saveGeneratedPlan,
  type Interest,
} from '@/services/tripPlannerService';
import { toast } from 'sonner';

export default function TripPlannerPage() {
  const { user } = useAuth();
  const [days, setDays] = useState(2);
  const [budget, setBudget] = useState([5000]);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [userType, setUserType] = useState<UserType>('tourist');
  const [itinerary, setItinerary] = useState<DayPlan[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [planName, setPlanName] = useState('');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  const toggleInterest = (interest: Interest) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((item) => item !== interest) : [...prev, interest]
    );
  };

  const handleGenerateItinerary = () => {
    setLoading(true);

    window.setTimeout(() => {
      const generatedItinerary = generateItinerary({
        days,
        budget: budget[0],
        interests,
        userType,
      });

      setItinerary(generatedItinerary);
      setLoading(false);
      toast.success('Area-based itinerary generated successfully!');
    }, 300);
  };

  const handleSavePlan = async () => {
    if (!user || !itinerary) return;

    if (!planName.trim()) {
      toast.error('Please enter a plan name');
      return;
    }

    const planData = buildPlanData(
      {
        days,
        budget: budget[0],
        interests,
        userType,
      },
      itinerary,
    );

    try {
      setSaving(true);
      await saveGeneratedPlan(user.id, planName.trim(), planData);

      toast.success('Plan saved successfully!');
      setSaveDialogOpen(false);
      setPlanName('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to save your plan right now.';
      toast.error('Failed to save plan', {
        description: message,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 flex items-center justify-center gap-2 text-4xl font-bold">
            <Sparkles className="h-8 w-8 text-primary" />
            Hyderabad Trip Planner
          </h1>
          <p className="text-lg text-muted-foreground">
            Generate a sample itinerary based on your preferences, then save and customize it.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            This planner uses nearby clustered suggestions, weighted variety, and unique stops for each generated plan.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Plan Your Trip</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Number of Days: {days}</Label>
                <Slider
                  value={[days]}
                  onValueChange={(value) => setDays(value[0])}
                  min={1}
                  max={7}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Budget: INR {budget[0]}</Label>
                <Slider
                  value={budget}
                  onValueChange={setBudget}
                  min={1000}
                  max={50000}
                  step={1000}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Interests</Label>
                <div className="space-y-2">
                  {interestOptions.map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox
                        id={interest}
                        checked={interests.includes(interest)}
                        onCheckedChange={() => toggleInterest(interest)}
                      />
                      <Label htmlFor={interest} className="cursor-pointer font-normal">
                        {interest}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>I am a</Label>
                <RadioGroup value={userType} onValueChange={(value) => setUserType(value as UserType)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tourist" id="planner-tourist" />
                    <Label htmlFor="planner-tourist" className="cursor-pointer font-normal">
                      Tourist
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="local" id="planner-local" />
                    <Label htmlFor="planner-local" className="cursor-pointer font-normal">
                      Local
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button onClick={handleGenerateItinerary} className="w-full" disabled={loading || interests.length === 0}>
                {loading ? 'Generating...' : 'Generate Sample Itinerary'}
              </Button>
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            {!itinerary ? (
              <Card className="flex h-full items-center justify-center">
                <CardContent className="py-12 text-center">
                  <Sparkles className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                  <p className="text-lg text-muted-foreground">
                    Select your preferences to generate a sample Hyderabad itinerary.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Your Itinerary</h2>
                  {user && (
                    <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>Save Plan</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Save Your Plan</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label htmlFor="plan-name">Plan Name</Label>
                            <Input
                              id="plan-name"
                              placeholder="My Hyderabad Trip"
                              value={planName}
                              onChange={(e) => setPlanName(e.target.value)}
                            />
                          </div>
                          <Button onClick={handleSavePlan} className="w-full" disabled={saving}>
                            {saving ? 'Saving...' : 'Save'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

                {itinerary.map((dayPlan) => (
                  <Card key={dayPlan.day} className="animate-fade-in">
                    <CardHeader>
                      <CardTitle className="text-primary">Day {dayPlan.day}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {dayPlan.activities.map((activity, index) => (
                        <div
                          key={`${dayPlan.day}-${activity.name}-${index}`}
                          className="flex gap-4 rounded-lg bg-accent/10 p-4 transition-colors hover:bg-accent/20"
                        >
                          <div className="flex-shrink-0">
                            <Clock className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="mb-2 flex items-start justify-between gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">{activity.time}</p>
                                <h4 className="text-lg font-semibold">{activity.name}</h4>
                                <p className="text-sm text-primary">{activity.type}</p>
                              </div>
                              {activity.type === 'Breakfast' || activity.type === 'Lunch' || activity.type === 'Dinner' ? (
                                <Utensils className="h-5 w-5 text-primary" />
                              ) : (
                                <MapPin className="h-5 w-5 text-primary" />
                              )}
                            </div>
                            {activity.location && (
                              <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>{activity.location}</span>
                              </div>
                            )}
                            {activity.description && (
                              <p className="text-sm text-muted-foreground">{activity.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

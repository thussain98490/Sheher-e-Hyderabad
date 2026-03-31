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
import { createSavedPlan } from '@/db/api';
import type { Activity, DayPlan, PlanData } from '@/types';
import { toast } from 'sonner';

type Interest = 'History' | 'Food' | 'Shopping' | 'Chill' | 'Adventure';
type PlannerActivityCategory = 'breakfast' | 'lunch' | 'dinner' | 'history' | 'shopping' | 'chill' | 'adventure';

interface PlannerStop {
  name: string;
  location: string;
  description: string;
}

interface AreaCluster {
  key: string;
  label: string;
  tags: Interest[];
  touristWeight: number;
  localWeight: number;
  breakfast: PlannerStop[];
  lunch: PlannerStop[];
  dinner: PlannerStop[];
  history: PlannerStop[];
  shopping: PlannerStop[];
  chill: PlannerStop[];
  adventure: PlannerStop[];
}

const interestOptions: Interest[] = ['History', 'Food', 'Shopping', 'Chill', 'Adventure'];

const plannerAreas: AreaCluster[] = [
  {
    key: 'old-city',
    label: 'Old City Heritage Circuit',
    tags: ['History', 'Food', 'Shopping'],
    touristWeight: 5,
    localWeight: 3,
    breakfast: [
      { name: 'Nimrah Cafe', location: 'Near Charminar', description: 'Fuel up with Irani chai and fresh Osmania biscuits before the old-city streets get busy.' },
      { name: 'Hotel Shadab Breakfast', location: 'Ghansi Bazaar', description: 'Start close to Charminar with a hearty local breakfast that keeps you inside the heritage core.' },
    ],
    lunch: [
      { name: 'Shadab Restaurant', location: 'Ghansi Bazaar', description: 'Break for Hyderabadi biryani and kebabs a few minutes from the main monuments.' },
      { name: 'Hotel Nayaab', location: 'Near Madina Circle', description: 'Stay in the same neighborhood for a classic old-city lunch stop without adding a long detour.' },
    ],
    dinner: [
      { name: 'Pista House', location: 'Charminar', description: 'Wrap up the day with haleem, kebabs, and bustling evening energy right in the same quarter.' },
      { name: 'Nimrah Rooftop Snacks', location: 'Charminar', description: 'Keep the evening relaxed with tea, snacks, and night views of the Charminar side of town.' },
    ],
    history: [
      { name: 'Charminar', location: 'Old City', description: 'Open the trip with Hyderabad’s iconic monument and the lanes that grew around it.' },
      { name: 'Mecca Masjid', location: 'Old City', description: 'Pair Charminar with the grand mosque next door to avoid zig-zagging across the city.' },
      { name: 'Chowmahalla Palace', location: 'Khilwat', description: 'Continue deeper into the old city with palace courtyards, royal halls, and museum galleries.' },
      { name: 'Purani Haveli', location: 'Dewan Devdi', description: 'Stay in the heritage belt and add a quieter palace stop with Nizam-era collections.' },
    ],
    shopping: [
      { name: 'Laad Bazaar', location: 'Charminar', description: 'Shop for bangles, pearls, and wedding accessories in the market sitting right beside the heritage sites.' },
      { name: 'Madina Market', location: 'Madina Circle', description: 'Browse local fabrics and street-side picks without leaving the old-city route.' },
    ],
    chill: [
      { name: 'Badshahi Ashurkhana Walk', location: 'Pathergatti', description: 'Slow the pace with a short heritage walk through quieter streets around the monument cluster.' },
      { name: 'Charminar Evening Viewpoint', location: 'Old City', description: 'End the afternoon nearby and watch the old city light up instead of crossing to another district.' },
    ],
    adventure: [
      { name: 'Old City Food Walk', location: 'Charminar to Pathergatti', description: 'Turn the evening into a walking food trail through dense lanes packed with local specialties.' },
    ],
  },
  {
    key: 'golconda-west',
    label: 'Golconda and Western Heritage',
    tags: ['History', 'Chill', 'Adventure'],
    touristWeight: 5,
    localWeight: 2,
    breakfast: [
      { name: 'Cafe 555 Breakfast', location: 'Masab Tank', description: 'Begin on the western side with a quick breakfast before heading uphill to the forts and tombs.' },
      { name: 'Tolichowki Breakfast Stop', location: 'Tolichowki', description: 'Stay close to the Golconda corridor and avoid backtracking into the city center early in the day.' },
    ],
    lunch: [
      { name: 'Spicy Venue', location: 'Jubilee Hills', description: 'Pause for lunch near the western corridor before continuing to nearby evening stops.' },
      { name: 'Bawarchi Westside Stop', location: 'Mehdipatnam', description: 'Keep the day compact with a lunch stop still connected to the Golconda side of town.' },
    ],
    dinner: [
      { name: "Ohri's Gufaa", location: 'Banjara Hills', description: 'Finish the west-side circuit with a themed dinner that is still close to your evening route.' },
      { name: 'Exotica', location: 'Banjara Hills', description: 'Stay on the same side of the city for dinner with skyline views after the heritage trail.' },
    ],
    history: [
      { name: 'Golconda Fort', location: 'Golconda', description: 'Dedicate the day to Hyderabad’s grand hill fort so the schedule stays focused and realistic.' },
      { name: 'Qutb Shahi Tombs', location: 'Ibrahim Bagh', description: 'Move just a few minutes away from Golconda to continue the same dynasty story without a city-wide jump.' },
      { name: 'Taramati Baradari', location: 'Ibrahim Bagh', description: 'Add a nearby heritage venue instead of forcing a distant monument into the same day.' },
    ],
    shopping: [
      { name: 'Inorbit Lifestyle Stop', location: 'Madhapur', description: 'If you want shopping on this day, shift toward the west-side commercial belt rather than crossing to the old city.' },
    ],
    chill: [
      { name: 'Durgam Cheruvu Boardwalk', location: 'Madhapur', description: 'Wind down west of the fort zone with a lakefront walk that fits naturally into the route.' },
      { name: 'Khajaguda Viewpoint', location: 'Khajaguda', description: 'Use sunset for a relaxed rocky viewpoint on the same western side of Hyderabad.' },
    ],
    adventure: [
      { name: 'Golconda Climb and Ramparts Trail', location: 'Golconda', description: 'Use the fort itself for a higher-energy session by exploring bastions and elevated viewpoints.' },
      { name: 'Hidden Castle Day Activity', location: 'Chevella Road', description: 'Stretch the western outing with an activity-heavy stop outside the main urban core.' },
    ],
  },
  {
    key: 'lake-central',
    label: 'Hussain Sagar and Central Hyderabad',
    tags: ['Chill', 'History', 'Food'],
    touristWeight: 4,
    localWeight: 4,
    breakfast: [
      { name: 'Alpha Hotel Breakfast', location: 'Secunderabad', description: 'Start near Secunderabad station with a practical breakfast before exploring the central lake zone.' },
      { name: 'Cafe Niloufer', location: 'Lakdikapul', description: 'Kick off the central-city day with one of Hyderabad’s most popular tea and bakery stops.' },
    ],
    lunch: [
      { name: 'Paradise Restaurant', location: 'Secunderabad', description: 'Keep lunch near Hussain Sagar so the day remains centered around the lake and museum belt.' },
      { name: 'Chutneys', location: 'Basheerbagh', description: 'Take a lighter lunch in the central corridor before heading into the evening waterfront stretch.' },
    ],
    dinner: [
      { name: 'Eat Street', location: 'Necklace Road', description: 'Stay by the waterfront for dinner instead of moving to a far-flung neighborhood late in the day.' },
      { name: 'Aish', location: 'Hussain Sagar', description: 'Close the day with dinner overlooking the lake you spent the afternoon around.' },
    ],
    history: [
      { name: 'Salar Jung Museum', location: 'Dar-ul-Shifa', description: 'Use the morning for a major museum visit before easing into the rest of the central-city circuit.' },
      { name: 'Birla Mandir', location: 'Hill Fort Road', description: 'Add a hilltop landmark that still stays connected to the Hussain Sagar side of the city.' },
      { name: 'State Museum', location: 'Public Gardens', description: 'Keep the route museum-focused without forcing a cross-city monument hop.' },
    ],
    shopping: [
      { name: 'General Bazaar', location: 'Secunderabad', description: 'Add an old-school market stop close to the station and lake corridor.' },
      { name: 'GVK One', location: 'Banjara Hills', description: 'If you want a modern shopping break, this mall fits better with the central-evening transition.' },
    ],
    chill: [
      { name: 'Lumbini Park', location: 'Tank Bund', description: 'Take an easy central break by the water before the evening crowd builds up.' },
      { name: 'Necklace Road', location: 'Hussain Sagar', description: 'Reserve the evening for a relaxed waterfront stretch instead of another long commute.' },
    ],
    adventure: [
      { name: 'Boat Ride to Buddha Statue', location: 'Hussain Sagar', description: 'Keep the activity tied to the lake zone with a short boat ride rather than a distant adventure park.' },
    ],
  },
  {
    key: 'banjara-jubilee',
    label: 'Banjara Hills and Jubilee Hills',
    tags: ['Food', 'Shopping', 'Chill'],
    touristWeight: 3,
    localWeight: 5,
    breakfast: [
      { name: 'Roastery Coffee House', location: 'Banjara Hills', description: 'Open a slower day in one of the city’s most café-friendly neighborhoods.' },
      { name: 'The Hole in the Wall Cafe', location: 'Jubilee Hills', description: 'Stay in the same upscale west-central belt with a breakfast stop that suits a relaxed day.' },
    ],
    lunch: [
      { name: 'Absolute Barbecues', location: 'Banjara Hills', description: 'Keep lunch close to your shopping and café circuit in the hills.' },
      { name: 'Olive Bistro Lunch', location: 'Durgam Cheruvu Fringe', description: 'If you are shifting toward the lake edge, this lunch stop keeps the route compact.' },
    ],
    dinner: [
      { name: 'Hard Rock Cafe', location: 'Jubilee Hills', description: 'Finish the day with live energy in the same entertainment-heavy neighborhood.' },
      { name: 'Tatva', location: 'Jubilee Hills', description: 'End with a calmer dinner option without leaving the western cafe strip.' },
    ],
    history: [
      { name: 'Kasu Brahmananda Reddy Park Walk', location: 'Jubilee Hills', description: 'Use a lighter cultural stop here, because this area works better for leisure than heavy monument-hopping.' },
    ],
    shopping: [
      { name: 'GVK One', location: 'Banjara Hills', description: 'Browse fashion and lifestyle brands without leaving the hill district.' },
      { name: 'Road No. 36 Boutiques', location: 'Jubilee Hills', description: 'Add local designer stores and concept shops in the same corridor.' },
    ],
    chill: [
      { name: 'KBR Park', location: 'Jubilee Hills', description: 'Slow the afternoon with greenery and walking trails close to the cafes and boutiques.' },
      { name: 'Durgam Cheruvu Cable Bridge View', location: 'Jubilee Hills Fringe', description: 'Shift toward sunset viewpoints that naturally connect to the western dining belt.' },
    ],
    adventure: [
      { name: 'Trampoline Park Session', location: 'Jubilee Hills', description: 'Add a light activity stop without breaking the day’s western-city flow.' },
    ],
  },
  {
    key: 'hitech-city',
    label: 'Madhapur and HiTech City',
    tags: ['Shopping', 'Adventure', 'Food'],
    touristWeight: 2,
    localWeight: 5,
    breakfast: [
      { name: 'Concu Breakfast', location: 'Jubilee Hills', description: 'Start near the HiTech belt with a modern café stop before malls and activity spots open fully.' },
      { name: 'Third Wave Coffee', location: 'Madhapur', description: 'Keep the tech-district day easy with a quick breakfast close to the first activity.' },
    ],
    lunch: [
      { name: 'The Street', location: 'Madhapur', description: 'Break for lunch inside the same commercial district instead of crossing to the old city.' },
      { name: 'Barbeque Nation', location: 'HiTech City', description: 'Choose a straightforward lunch stop that keeps the afternoon mall and activity plan nearby.' },
    ],
    dinner: [
      { name: 'Halo Cocktail Bar Dinner', location: 'Jubilee Hills', description: 'Wrap the tech-corridor day with dinner near the nightlife belt just next door.' },
      { name: 'Over The Moon', location: 'Gachibowli', description: 'Stay on the west-tech side for skyline dining after shopping and activity stops.' },
    ],
    history: [],
    shopping: [
      { name: 'Inorbit Mall', location: 'Madhapur', description: 'Use one of the city’s biggest malls when your route is already centered on the west-tech corridor.' },
      { name: 'Shilparamam', location: 'HiTech City', description: 'Balance modern shopping with crafts and performances in the same district.' },
      { name: 'Sarath City Capital Mall', location: 'Kondapur', description: 'If the day extends westward, keep shopping concentrated in the same side of the city.' },
    ],
    chill: [
      { name: 'Durgam Cheruvu Lakefront', location: 'Madhapur', description: 'Use the lakefront for a calmer break between shopping and dinner.' },
    ],
    adventure: [
      { name: 'Sky Zone Hyderabad', location: 'Madhapur', description: 'Add a proper activity stop in the same neighborhood rather than forcing a far-away outing.' },
      { name: 'Smaaash', location: 'Inorbit Mall', description: 'Keep the entertainment piece inside the same mall district to reduce travel time.' },
    ],
  },
  {
    key: 'ramoji-south-east',
    label: 'Ramoji and South-East Day',
    tags: ['Adventure', 'History', 'Chill'],
    touristWeight: 4,
    localWeight: 3,
    breakfast: [
      { name: 'Early Highway Breakfast', location: 'LB Nagar Side', description: 'Start early on the south-east corridor so the drive and entry timing stay manageable.' },
      { name: 'Cafe Bahar South Stop', location: 'Dilsukhnagar', description: 'Grab breakfast on the way out so the rest of the day stays focused on the same side of the city.' },
    ],
    lunch: [
      { name: 'Ramoji Food Court', location: 'Ramoji Film City', description: 'Stay inside the complex for lunch to avoid wasting the middle of the day on extra travel.' },
    ],
    dinner: [
      { name: 'Dinner on the Return Route', location: 'LB Nagar', description: 'Break the drive back with dinner before re-entering the busiest parts of the city.' },
    ],
    history: [
      { name: 'Ramoji Film City Studio Tour', location: 'Abdullahpurmet', description: 'Treat this as a full-zone day because the attraction itself is large enough to anchor the plan.' },
    ],
    shopping: [
      { name: 'Film City Souvenir Arcade', location: 'Ramoji Film City', description: 'Keep shopping tied to the attraction instead of pushing another distant market into the day.' },
    ],
    chill: [
      { name: 'Garden Walk at Ramoji', location: 'Ramoji Film City', description: 'Use the landscaped sections for a calmer break within the same destination.' },
    ],
    adventure: [
      { name: 'Ramoji Action and Set Experience', location: 'Ramoji Film City', description: 'Use the activity-heavy rides and sets to make the south-east day feel immersive.' },
      { name: 'Wonderla Hyderabad', location: 'Ravirala', description: 'If adventure is the main goal, build the day around the amusement park rather than mixing distant stops.' },
    ],
  },
];

function pickUniqueStop(stops: PlannerStop[], usedStops: Set<string>) {
  const uniqueStop = stops.find((stop) => !usedStops.has(stop.name));
  if (uniqueStop) {
    usedStops.add(uniqueStop.name);
    return uniqueStop;
  }

  return stops[0] ?? null;
}

function buildActivity(time: string, type: Activity['type'], stop: PlannerStop | null): Activity | null {
  if (!stop) return null;

  return {
    time,
    type,
    name: stop.name,
    location: stop.location,
    description: stop.description,
  };
}

function orderAreas(interests: Interest[], userType: 'tourist' | 'local') {
  const interestSet = new Set(interests);

  return [...plannerAreas].sort((a, b) => {
    const aScore =
      (userType === 'tourist' ? a.touristWeight : a.localWeight) +
      a.tags.filter((tag) => interestSet.has(tag)).length * 3;
    const bScore =
      (userType === 'tourist' ? b.touristWeight : b.localWeight) +
      b.tags.filter((tag) => interestSet.has(tag)).length * 3;

    return bScore - aScore;
  });
}

function buildAreaDayPlan(
  day: number,
  area: AreaCluster,
  interests: Interest[],
  usedStops: Set<string>,
  userType: 'tourist' | 'local',
): DayPlan {
  const selectedInterests = new Set(interests);
  const activities: Activity[] = [];

  const breakfastStop = pickUniqueStop(area.breakfast, usedStops);
  const lunchStop = pickUniqueStop(area.lunch, usedStops);
  const dinnerStop = pickUniqueStop(area.dinner, usedStops);

  const primaryCategory: PlannerActivityCategory =
    selectedInterests.has('History') || userType === 'tourist'
      ? 'history'
      : selectedInterests.has('Adventure')
        ? 'adventure'
        : selectedInterests.has('Shopping')
          ? 'shopping'
          : 'chill';

  const afternoonCategory: PlannerActivityCategory =
    selectedInterests.has('Shopping')
      ? 'shopping'
      : selectedInterests.has('Chill')
        ? 'chill'
        : selectedInterests.has('Adventure')
          ? 'adventure'
          : 'history';

  const eveningCategory: PlannerActivityCategory =
    selectedInterests.has('Chill')
      ? 'chill'
      : selectedInterests.has('Adventure')
        ? 'adventure'
        : selectedInterests.has('History')
          ? 'history'
          : 'shopping';

  const primaryStop = pickUniqueStop(area[primaryCategory], usedStops) ?? pickUniqueStop(area.history, usedStops);
  const afternoonStop =
    pickUniqueStop(area[afternoonCategory], usedStops) ??
    pickUniqueStop(area.shopping, usedStops) ??
    pickUniqueStop(area.chill, usedStops);
  const eveningStop =
    pickUniqueStop(area[eveningCategory], usedStops) ??
    pickUniqueStop(area.chill, usedStops) ??
    pickUniqueStop(area.adventure, usedStops);

  const potentialActivities = [
    buildActivity('8:00 AM', 'Breakfast', breakfastStop),
    buildActivity('10:00 AM', primaryCategory === 'shopping' ? 'Shopping' : primaryCategory === 'adventure' ? 'Entertainment' : primaryCategory === 'chill' ? 'Leisure' : 'Sightseeing', primaryStop),
    buildActivity('1:00 PM', 'Lunch', lunchStop),
    buildActivity('3:30 PM', afternoonCategory === 'shopping' ? 'Shopping' : afternoonCategory === 'adventure' ? 'Entertainment' : afternoonCategory === 'chill' ? 'Leisure' : 'Sightseeing', afternoonStop),
    buildActivity('6:00 PM', eveningCategory === 'shopping' ? 'Shopping' : eveningCategory === 'adventure' ? 'Entertainment' : eveningCategory === 'chill' ? 'Leisure' : 'Sightseeing', eveningStop),
    buildActivity('8:30 PM', 'Dinner', dinnerStop),
  ];

  for (const activity of potentialActivities) {
    if (activity && !activities.some((existing) => existing.name === activity.name)) {
      activities.push(activity);
    }
  }

  return { day, activities };
}

export default function TripPlannerPage() {
  const { user } = useAuth();
  const [days, setDays] = useState(2);
  const [budget, setBudget] = useState([5000]);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [userType, setUserType] = useState<'tourist' | 'local'>('tourist');
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

  const generateItinerary = () => {
    setLoading(true);

    window.setTimeout(() => {
      const rankedAreas = orderAreas(interests, userType);
      const usedStops = new Set<string>();
      const generatedItinerary: DayPlan[] = [];

      for (let day = 1; day <= days; day += 1) {
        const area = rankedAreas[(day - 1) % rankedAreas.length];
        generatedItinerary.push(buildAreaDayPlan(day, area, interests, usedStops, userType));
      }

      setItinerary(generatedItinerary);
      setLoading(false);
      toast.success('Area-based itinerary generated successfully!');
    }, 300);
  };

  const savePlan = async () => {
    if (!user || !itinerary) return;

    if (!planName.trim()) {
      toast.error('Please enter a plan name');
      return;
    }

    const planData: PlanData = {
      days,
      budget: `INR ${budget[0]}`,
      interests,
      user_type: userType,
      itinerary,
    };

    try {
      setSaving(true);
      await createSavedPlan({
        user_id: user.id,
        plan_name: planName.trim(),
        plan_data: planData,
      });

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
            This planner currently uses curated sample suggestions. Review the stops before treating it as a final travel plan.
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
                <RadioGroup value={userType} onValueChange={(value) => setUserType(value as 'tourist' | 'local')}>
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

              <Button onClick={generateItinerary} className="w-full" disabled={loading || interests.length === 0}>
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
                          <Button onClick={savePlan} className="w-full" disabled={saving}>
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
                          key={`${dayPlan.day}-${index}`}
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

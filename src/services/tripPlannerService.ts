import { createSavedPlan } from '@/db/api';
import type { Activity, DayPlan, PlanData, UserType } from '@/types';

export type Interest = 'History' | 'Food' | 'Shopping' | 'Chill' | 'Adventure';

export interface TripPlannerInput {
  days: number;
  budget: number;
  interests: Interest[];
  userType: UserType;
}

interface GeoPoint {
  lat: number;
  lng: number;
}

interface PlannerPlace {
  name: string;
  area: string;
  category: Interest | 'Breakfast' | 'Lunch' | 'Dinner';
  description: string;
  coordinates: GeoPoint;
  popularity: number;
}

interface AreaCluster {
  key: string;
  label: string;
  center: GeoPoint;
  touristWeight: number;
  localWeight: number;
  places: PlannerPlace[];
}

const NEARBY_RADIUS_KM = 4;

export const interestOptions: Interest[] = ['History', 'Food', 'Shopping', 'Chill', 'Adventure'];

const plannerAreas: AreaCluster[] = [
  {
    key: 'old-city',
    label: 'Old City',
    center: { lat: 17.3616, lng: 78.4747 },
    touristWeight: 5,
    localWeight: 3,
    places: [
      {
        name: 'Nimrah Cafe',
        area: 'Near Charminar',
        category: 'Breakfast',
        description: 'Start beside Charminar with Irani chai and Osmania biscuits before the lanes get crowded.',
        coordinates: { lat: 17.3619, lng: 78.4746 },
        popularity: 95,
      },
      {
        name: 'Hotel Shadab Breakfast',
        area: 'Ghansi Bazaar',
        category: 'Breakfast',
        description: 'Begin with a filling old-city breakfast close to the heritage walk route.',
        coordinates: { lat: 17.368, lng: 78.4738 },
        popularity: 90,
      },
      {
        name: 'Charminar',
        area: 'Old City',
        category: 'History',
        description: 'Open the day at Hyderabads most iconic landmark and explore the streets around it.',
        coordinates: { lat: 17.3616, lng: 78.4747 },
        popularity: 100,
      },
      {
        name: 'Mecca Masjid',
        area: 'Old City',
        category: 'History',
        description: 'Walk a short distance from Charminar to visit one of the citys grandest mosques.',
        coordinates: { lat: 17.3601, lng: 78.4736 },
        popularity: 92,
      },
      {
        name: 'Chowmahalla Palace',
        area: 'Khilwat',
        category: 'History',
        description: 'Continue through the old royal quarter with palace courtyards and Nizam-era halls.',
        coordinates: { lat: 17.3578, lng: 78.4717 },
        popularity: 88,
      },
      {
        name: 'Laad Bazaar',
        area: 'Charminar',
        category: 'Shopping',
        description: 'Shop for bangles, pearls, and wedding accessories beside the monument zone.',
        coordinates: { lat: 17.3614, lng: 78.4731 },
        popularity: 91,
      },
      {
        name: 'Madina Market',
        area: 'Madina Circle',
        category: 'Shopping',
        description: 'Browse fabrics and street-side finds without leaving the old-city route.',
        coordinates: { lat: 17.3681, lng: 78.4758 },
        popularity: 75,
      },
      {
        name: 'Badshahi Ashurkhana Walk',
        area: 'Pathergatti',
        category: 'Chill',
        description: 'Slow the pace with a quieter heritage walk through nearby lanes.',
        coordinates: { lat: 17.3641, lng: 78.4773 },
        popularity: 68,
      },
      {
        name: 'Old City Food Walk',
        area: 'Charminar to Pathergatti',
        category: 'Adventure',
        description: 'Turn the evening into a compact food trail through packed local lanes.',
        coordinates: { lat: 17.3632, lng: 78.4765 },
        popularity: 82,
      },
      {
        name: 'Shadab Restaurant',
        area: 'Ghansi Bazaar',
        category: 'Lunch',
        description: 'Pause for biryani and kebabs a few minutes from the main monuments.',
        coordinates: { lat: 17.368, lng: 78.4738 },
        popularity: 94,
      },
      {
        name: 'Hotel Nayaab',
        area: 'Near Madina Circle',
        category: 'Lunch',
        description: 'Keep lunch inside the same neighborhood with a classic old-city stop.',
        coordinates: { lat: 17.3687, lng: 78.4793 },
        popularity: 86,
      },
      {
        name: 'Pista House',
        area: 'Charminar',
        category: 'Dinner',
        description: 'End nearby with haleem, kebabs, and busy evening energy.',
        coordinates: { lat: 17.3617, lng: 78.4759 },
        popularity: 89,
      },
      {
        name: 'Nimrah Rooftop Snacks',
        area: 'Charminar',
        category: 'Dinner',
        description: 'Keep dinner light with snacks and night views around the monument.',
        coordinates: { lat: 17.3619, lng: 78.4746 },
        popularity: 78,
      },
    ],
  },
  {
    key: 'golconda-west',
    label: 'Golconda West',
    center: { lat: 17.3833, lng: 78.4011 },
    touristWeight: 5,
    localWeight: 2,
    places: [
      {
        name: 'Tolichowki Breakfast Stop',
        area: 'Tolichowki',
        category: 'Breakfast',
        description: 'Eat near the Golconda corridor so the day starts on the correct side of the city.',
        coordinates: { lat: 17.3992, lng: 78.4152 },
        popularity: 75,
      },
      {
        name: 'Golconda Fort',
        area: 'Golconda',
        category: 'History',
        description: 'Dedicate the morning to the grand hill fort, ramparts, and city views.',
        coordinates: { lat: 17.3833, lng: 78.4011 },
        popularity: 98,
      },
      {
        name: 'Qutb Shahi Tombs',
        area: 'Ibrahim Bagh',
        category: 'History',
        description: 'Move only a short distance from the fort to continue the same dynasty story.',
        coordinates: { lat: 17.3947, lng: 78.3963 },
        popularity: 87,
      },
      {
        name: 'Taramati Baradari',
        area: 'Ibrahim Bagh',
        category: 'History',
        description: 'Add a nearby heritage venue instead of jumping across the city.',
        coordinates: { lat: 17.3741, lng: 78.3984 },
        popularity: 70,
      },
      {
        name: 'Golconda Climb Trail',
        area: 'Golconda',
        category: 'Adventure',
        description: 'Use the fort stairs and elevated viewpoints for a higher-energy stop.',
        coordinates: { lat: 17.3837, lng: 78.4019 },
        popularity: 82,
      },
      {
        name: 'Khajaguda Viewpoint',
        area: 'Khajaguda',
        category: 'Chill',
        description: 'Catch sunset from a rocky viewpoint that still belongs to the western route.',
        coordinates: { lat: 17.4134, lng: 78.3847 },
        popularity: 73,
      },
      {
        name: 'Bawarchi Westside Stop',
        area: 'Mehdipatnam',
        category: 'Lunch',
        description: 'Keep lunch connected to the Golconda side instead of returning to the center.',
        coordinates: { lat: 17.3942, lng: 78.4372 },
        popularity: 78,
      },
      {
        name: "Ohri's Gufaa",
        area: 'Banjara Hills',
        category: 'Dinner',
        description: 'Finish the west-side circuit with a themed dinner close to the evening route.',
        coordinates: { lat: 17.4156, lng: 78.4347 },
        popularity: 84,
      },
    ],
  },
  {
    key: 'lake-central',
    label: 'Hussain Sagar Central',
    center: { lat: 17.4239, lng: 78.4738 },
    touristWeight: 4,
    localWeight: 4,
    places: [
      {
        name: 'Cafe Niloufer',
        area: 'Lakdikapul',
        category: 'Breakfast',
        description: 'Start with popular tea and bakery items before exploring the central lake side.',
        coordinates: { lat: 17.4041, lng: 78.4636 },
        popularity: 93,
      },
      {
        name: 'Salar Jung Museum',
        area: 'Dar-ul-Shifa',
        category: 'History',
        description: 'Use the morning for a major museum visit before moving toward the lake.',
        coordinates: { lat: 17.3713, lng: 78.4804 },
        popularity: 89,
      },
      {
        name: 'Birla Mandir',
        area: 'Hill Fort Road',
        category: 'History',
        description: 'Add a hilltop landmark connected naturally to the Hussain Sagar side.',
        coordinates: { lat: 17.4062, lng: 78.4691 },
        popularity: 86,
      },
      {
        name: 'General Bazaar',
        area: 'Secunderabad',
        category: 'Shopping',
        description: 'Browse an old-school market close to the station and lake corridor.',
        coordinates: { lat: 17.4399, lng: 78.4983 },
        popularity: 76,
      },
      {
        name: 'Lumbini Park',
        area: 'Tank Bund',
        category: 'Chill',
        description: 'Take an easy break near the water before the evening crowd builds up.',
        coordinates: { lat: 17.4103, lng: 78.4725 },
        popularity: 80,
      },
      {
        name: 'Boat Ride to Buddha Statue',
        area: 'Hussain Sagar',
        category: 'Adventure',
        description: 'Keep the activity tied to the lake with a short boat ride.',
        coordinates: { lat: 17.4239, lng: 78.4738 },
        popularity: 83,
      },
      {
        name: 'Paradise Restaurant',
        area: 'Secunderabad',
        category: 'Lunch',
        description: 'Keep lunch near the lake zone so the day remains compact.',
        coordinates: { lat: 17.4415, lng: 78.4872 },
        popularity: 90,
      },
      {
        name: 'Eat Street',
        area: 'Necklace Road',
        category: 'Dinner',
        description: 'Stay by the waterfront for dinner instead of moving far late in the day.',
        coordinates: { lat: 17.4244, lng: 78.4657 },
        popularity: 79,
      },
    ],
  },
  {
    key: 'banjara-jubilee',
    label: 'Banjara and Jubilee Hills',
    center: { lat: 17.4266, lng: 78.4128 },
    touristWeight: 3,
    localWeight: 5,
    places: [
      {
        name: 'Roastery Coffee House',
        area: 'Banjara Hills',
        category: 'Breakfast',
        description: 'Open a relaxed day in one of the citys cafe-friendly neighborhoods.',
        coordinates: { lat: 17.4155, lng: 78.4341 },
        popularity: 92,
      },
      {
        name: 'KBR Park',
        area: 'Jubilee Hills',
        category: 'Chill',
        description: 'Slow the afternoon with greenery and walking trails close to cafes and boutiques.',
        coordinates: { lat: 17.4252, lng: 78.4233 },
        popularity: 83,
      },
      {
        name: 'Kasu Brahmananda Reddy Park Walk',
        area: 'Jubilee Hills',
        category: 'History',
        description: 'Use a lighter cultural stop because this area is better for leisure than monument hopping.',
        coordinates: { lat: 17.4252, lng: 78.4233 },
        popularity: 70,
      },
      {
        name: 'GVK One',
        area: 'Banjara Hills',
        category: 'Shopping',
        description: 'Browse fashion and lifestyle brands without leaving the hill district.',
        coordinates: { lat: 17.4192, lng: 78.4484 },
        popularity: 82,
      },
      {
        name: 'Road No. 36 Boutiques',
        area: 'Jubilee Hills',
        category: 'Shopping',
        description: 'Add local designer stores and concept shops in the same corridor.',
        coordinates: { lat: 17.431, lng: 78.4075 },
        popularity: 76,
      },
      {
        name: 'Trampoline Park Session',
        area: 'Jubilee Hills',
        category: 'Adventure',
        description: 'Add a light activity stop without breaking the western-city flow.',
        coordinates: { lat: 17.4308, lng: 78.4097 },
        popularity: 70,
      },
      {
        name: 'Absolute Barbecues',
        area: 'Banjara Hills',
        category: 'Lunch',
        description: 'Keep lunch close to your shopping and cafe circuit in the hills.',
        coordinates: { lat: 17.4174, lng: 78.4358 },
        popularity: 86,
      },
      {
        name: 'Hard Rock Cafe',
        area: 'Jubilee Hills',
        category: 'Dinner',
        description: 'Finish the day with live energy in the same entertainment-heavy neighborhood.',
        coordinates: { lat: 17.4307, lng: 78.4083 },
        popularity: 84,
      },
    ],
  },
  {
    key: 'hitech-city',
    label: 'Madhapur and HiTech City',
    center: { lat: 17.4483, lng: 78.3915 },
    touristWeight: 2,
    localWeight: 5,
    places: [
      {
        name: 'Third Wave Coffee',
        area: 'Madhapur',
        category: 'Breakfast',
        description: 'Keep the tech-district day easy with a quick breakfast near the first activity.',
        coordinates: { lat: 17.4474, lng: 78.3917 },
        popularity: 82,
      },
      {
        name: 'Shilparamam',
        area: 'HiTech City',
        category: 'Shopping',
        description: 'Balance modern shopping with crafts and performances in the same district.',
        coordinates: { lat: 17.4526, lng: 78.3825 },
        popularity: 88,
      },
      {
        name: 'Inorbit Mall',
        area: 'Madhapur',
        category: 'Shopping',
        description: 'Use a major mall when your route is already centered on the west-tech corridor.',
        coordinates: { lat: 17.4346, lng: 78.3869 },
        popularity: 86,
      },
      {
        name: 'Durgam Cheruvu Lakefront',
        area: 'Madhapur',
        category: 'Chill',
        description: 'Use the lakefront for a calmer break between shopping and dinner.',
        coordinates: { lat: 17.4306, lng: 78.3894 },
        popularity: 81,
      },
      {
        name: 'Sky Zone Hyderabad',
        area: 'Madhapur',
        category: 'Adventure',
        description: 'Add an activity stop in the same neighborhood rather than forcing a far-away outing.',
        coordinates: { lat: 17.449, lng: 78.391 },
        popularity: 78,
      },
      {
        name: 'The Street',
        area: 'Madhapur',
        category: 'Lunch',
        description: 'Break for lunch inside the same commercial district.',
        coordinates: { lat: 17.4489, lng: 78.3907 },
        popularity: 80,
      },
      {
        name: 'Over The Moon',
        area: 'Gachibowli',
        category: 'Dinner',
        description: 'Stay on the west-tech side for skyline dining after shopping and activities.',
        coordinates: { lat: 17.4405, lng: 78.3554 },
        popularity: 82,
      },
    ],
  },
];

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function getDistanceInKm(first: GeoPoint, second: GeoPoint) {
  const earthRadiusKm = 6371;
  const latDifference = toRadians(second.lat - first.lat);
  const lngDifference = toRadians(second.lng - first.lng);

  const haversine =
    Math.sin(latDifference / 2) ** 2 +
    Math.cos(toRadians(first.lat)) *
      Math.cos(toRadians(second.lat)) *
      Math.sin(lngDifference / 2) ** 2;

  return 2 * earthRadiusKm * Math.asin(Math.sqrt(haversine));
}

export function getNearbyPlaces(places: PlannerPlace[], center: GeoPoint, radiusKm = NEARBY_RADIUS_KM) {
  return places.filter((place) => getDistanceInKm(center, place.coordinates) <= radiusKm);
}

export function filterByPreferences(places: PlannerPlace[], interests: Interest[]) {
  const selected = new Set(interests);

  return places.filter((place) => {
    if (place.category === 'Breakfast' || place.category === 'Lunch' || place.category === 'Dinner') {
      return selected.has('Food');
    }

    return selected.has(place.category);
  });
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function weightedShuffle(places: PlannerPlace[]) {
  return [...places].sort((first, second) => {
    const firstScore = first.popularity * 0.7 + Math.random() * 35;
    const secondScore = second.popularity * 0.7 + Math.random() * 35;
    return secondScore - firstScore;
  });
}

function getAreaScore(area: AreaCluster, interests: Interest[], userType: UserType) {
  const nearbyPlaces = getNearbyPlaces(area.places, area.center);
  const matchingPlaces = filterByPreferences(nearbyPlaces, interests);
  const baseScore = userType === 'tourist' ? area.touristWeight : area.localWeight;

  return baseScore + matchingPlaces.length * 2 + Math.random() * 2;
}

function orderAreas(interests: Interest[], userType: UserType) {
  return shuffle(plannerAreas)
    .map((area) => ({ area, score: getAreaScore(area, interests, userType) }))
    .sort((first, second) => second.score - first.score)
    .map((item) => item.area);
}

function getActivityType(category: PlannerPlace['category']): Activity['type'] {
  if (category === 'History') return 'Sightseeing';
  if (category === 'Shopping') return 'Shopping';
  if (category === 'Chill') return 'Leisure';
  if (category === 'Adventure') return 'Entertainment';
  return category;
}

function pickWeightedUnique(
  places: PlannerPlace[],
  category: PlannerPlace['category'],
  usedPlaceNames: Set<string>,
) {
  return weightedShuffle(places)
    .filter((place) => place.category === category)
    .find((place) => !usedPlaceNames.has(place.name));
}

function addActivity(
  activities: Activity[],
  time: string,
  place: PlannerPlace | undefined,
  usedPlaceNames: Set<string>,
) {
  if (!place || usedPlaceNames.has(place.name)) return;

  usedPlaceNames.add(place.name);
  activities.push({
    time,
    type: getActivityType(place.category),
    name: place.name,
    location: place.area,
    description: place.description,
  });
}

function getPreferredCategories(interests: Interest[], userType: UserType): Interest[] {
  const fallback: Interest[] = userType === 'tourist'
    ? ['History', 'Food', 'Shopping', 'Chill', 'Adventure']
    : ['Food', 'Shopping', 'Chill', 'Adventure', 'History'];

  const selected = interests.length > 0 ? interests : fallback;
  return [...new Set([...shuffle(selected), ...fallback])];
}

function buildDayPlan(day: number, area: AreaCluster, interests: Interest[], userType: UserType, usedPlaceNames: Set<string>): DayPlan {
  const nearbyPlaces = getNearbyPlaces(area.places, area.center);
  const preferredCategories = getPreferredCategories(interests, userType);
  const preferredPlaces = filterByPreferences(nearbyPlaces, preferredCategories);
  const placesForDay = preferredPlaces.length > 0 ? preferredPlaces : nearbyPlaces;
  const activities: Activity[] = [];

  addActivity(activities, '8:00 AM', pickWeightedUnique(nearbyPlaces, 'Breakfast', usedPlaceNames), usedPlaceNames);

  const firstMainCategory = preferredCategories.find((category) => category !== 'Food') ?? 'History';
  const secondMainCategory = preferredCategories.find((category) => category !== 'Food' && category !== firstMainCategory) ?? 'Chill';
  const thirdMainCategory =
    preferredCategories.find(
      (category) => category !== 'Food' && category !== firstMainCategory && category !== secondMainCategory,
    ) ?? 'Shopping';

  addActivity(activities, '10:00 AM', pickWeightedUnique(placesForDay, firstMainCategory, usedPlaceNames), usedPlaceNames);
  addActivity(activities, '1:00 PM', pickWeightedUnique(nearbyPlaces, 'Lunch', usedPlaceNames), usedPlaceNames);
  addActivity(activities, '3:30 PM', pickWeightedUnique(placesForDay, secondMainCategory, usedPlaceNames), usedPlaceNames);
  addActivity(activities, '6:00 PM', pickWeightedUnique(placesForDay, thirdMainCategory, usedPlaceNames), usedPlaceNames);
  addActivity(activities, '8:30 PM', pickWeightedUnique(nearbyPlaces, 'Dinner', usedPlaceNames), usedPlaceNames);

  if (activities.length < 4) {
    for (const place of weightedShuffle(placesForDay)) {
      addActivity(activities, 'Flexible Stop', place, usedPlaceNames);
      if (activities.length >= 4) break;
    }
  }

  return { day, activities };
}

export function generateItinerary({ days, interests, userType }: TripPlannerInput): DayPlan[] {
  const rankedAreas = orderAreas(interests, userType);
  const usedPlaceNames = new Set<string>();

  return Array.from({ length: days }, (_, index) => {
    const area = rankedAreas[index % rankedAreas.length];
    return buildDayPlan(index + 1, area, interests, userType, usedPlaceNames);
  });
}

export function buildPlanData(input: TripPlannerInput, itinerary: DayPlan[]): PlanData {
  return {
    days: input.days,
    budget: `INR ${input.budget}`,
    interests: input.interests,
    user_type: input.userType,
    itinerary,
  };
}

export async function saveGeneratedPlan(userId: string, planName: string, planData: PlanData) {
  return createSavedPlan({
    user_id: userId,
    plan_name: planName,
    plan_data: planData,
  });
}

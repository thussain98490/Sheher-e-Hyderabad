export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

export type UserRole = 'user' | 'admin';
export type UserType = 'tourist' | 'local';

export interface Profile {
  id: string;
  email: string;
  name?: string;
  user_type?: UserType;
  role: UserRole;
  created_at: string;
}

export interface Place {
  id: string;
  name: string;
  category: string;
  description?: string;
  image_url?: string;
  timings?: string;
  entry_fee?: string;
  best_time?: string;
  rating?: number;
  location?: string;
  created_at: string;
}

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  description?: string;
  image_url?: string;
  price?: string;
  rating?: number;
  location?: string;
  created_at: string;
}

export interface Shopping {
  id: string;
  name: string;
  category: string;
  description?: string;
  image_url?: string;
  location?: string;
  timings?: string;
  created_at: string;
}

export interface Entertainment {
  id: string;
  name: string;
  category: string;
  description?: string;
  image_url?: string;
  location?: string;
  timings?: string;
  price?: string;
  created_at: string;
}

export interface Event {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  date: string;
  location?: string;
  category?: string;
  created_at: string;
}

export interface Package {
  id: string;
  name: string;
  type: UserType;
  duration: string;
  budget: string;
  places: string[];
  description?: string;
  image_url?: string;
  created_at: string;
}

export interface SavedPlan {
  id: string;
  user_id: string;
  plan_name: string;
  plan_data: PlanData;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'reviewed';
  created_at: string;
}

export interface PlanData {
  days: number;
  budget: string;
  interests: string[];
  user_type: UserType;
  itinerary: DayPlan[];
}

export interface DayPlan {
  day: number;
  activities: Activity[];
}

export interface Activity {
  time: string;
  type: string;
  name: string;
  location?: string;
  description?: string;
}

export interface PlannerInput {
  days: number;
  budget: number;
  interests: string[];
  user_type: UserType;
}

import { supabase } from './supabase';
import type {
  Profile,
  Place,
  FoodItem,
  Shopping,
  Entertainment,
  Event,
  Package,
  SavedPlan,
  ContactMessage,
} from '@/types';
import type { User } from '@supabase/supabase-js';

type PaginationParams = {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
};

type PaginatedResponse<T> = {
  data: T[];
  total: number;
};

function normalizeSupabaseError(error: unknown, fallbackMessage: string) {
  if (!error) {
    return new Error(fallbackMessage);
  }

  if (error instanceof Error) {
    return error;
  }

  if (typeof error === 'object') {
    const maybeMessage = 'message' in error ? error.message : null;
    const maybeDetails = 'details' in error ? error.details : null;
    const maybeHint = 'hint' in error ? error.hint : null;
    const maybeCode = 'code' in error ? error.code : null;

    const parts = [maybeMessage, maybeDetails, maybeHint, maybeCode]
      .filter((part): part is string => typeof part === 'string' && part.trim().length > 0);

    if (parts.length > 0) {
      return new Error(parts.join(' | '));
    }
  }

  if (typeof error === 'string' && error.trim()) {
    return new Error(error);
  }

  return new Error(fallbackMessage);
}

function getRange(page: number, pageSize: number) {
  const from = (Math.max(page, 1) - 1) * pageSize;
  const to = from + pageSize - 1;
  return { from, to };
}

// Profiles
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  
  if (error) throw error;
  return data as Profile | null;
}

export async function createProfileIfMissing(user: User) {
  const existingProfile = await getProfile(user.id);

  if (existingProfile) {
    return existingProfile;
  }

  const profilePayload = {
    id: user.id,
    email: user.email ?? '',
    name: typeof user.user_metadata?.name === 'string' ? user.user_metadata.name : null,
    user_type:
      user.user_metadata?.user_type === 'local' || user.user_metadata?.user_type === 'tourist'
        ? user.user_metadata.user_type
        : 'tourist',
    role: 'user' as const,
  };

  const { data, error } = await supabase
    .from('profiles')
    .insert(profilePayload)
    .select()
    .maybeSingle();

  if (error) throw normalizeSupabaseError(error, 'Unable to create your profile record.');
  return data as Profile | null;
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data as Profile | null;
}

export async function getAllProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getAllProfilesPaginated({
  page = 1,
  pageSize = 10,
  searchTerm = '',
}: PaginationParams = {}): Promise<PaginatedResponse<Profile>> {
  const { from, to } = getRange(page, pageSize);
  let query = supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  const trimmed = searchTerm.trim();
  if (trimmed) {
    query = query.or(`name.ilike.%${trimmed}%,email.ilike.%${trimmed}%`);
  }

  const { data, error, count } = await query.range(from, to);
  if (error) throw error;
  return {
    data: Array.isArray(data) ? (data as Profile[]) : [],
    total: count ?? 0,
  };
}

export async function updateUserRole(userId: string, role: 'user' | 'admin') {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data as Profile | null;
}

// Places
export async function getPlaces(category?: string) {
  let query = supabase
    .from('places')
    .select('*')
    .order('rating', { ascending: false });
  
  if (category) {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getPlacesPaginated({
  page = 1,
  pageSize = 10,
  searchTerm = '',
}: PaginationParams = {}): Promise<PaginatedResponse<Place>> {
  const { from, to } = getRange(page, pageSize);
  let query = supabase
    .from('places')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  const trimmed = searchTerm.trim();
  if (trimmed) {
    query = query.or(`name.ilike.%${trimmed}%,category.ilike.%${trimmed}%`);
  }

  const { data, error, count } = await query.range(from, to);
  if (error) throw error;
  return {
    data: Array.isArray(data) ? (data as Place[]) : [],
    total: count ?? 0,
  };
}

export async function getPlaceById(id: string) {
  const { data, error } = await supabase
    .from('places')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) throw error;
  return data as Place | null;
}

export async function createPlace(place: Omit<Place, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('places')
    .insert(place)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data as Place | null;
}

export async function updatePlace(id: string, updates: Partial<Place>) {
  const { data, error } = await supabase
    .from('places')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data as Place | null;
}

export async function deletePlace(id: string) {
  const { error } = await supabase
    .from('places')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// Food Items
export async function getFoodItems(category?: string) {
  let query = supabase
    .from('food_items')
    .select('*')
    .order('rating', { ascending: false });
  
  if (category) {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getFoodItemsPaginated({
  page = 1,
  pageSize = 10,
  searchTerm = '',
}: PaginationParams = {}): Promise<PaginatedResponse<FoodItem>> {
  const { from, to } = getRange(page, pageSize);
  let query = supabase
    .from('food_items')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  const trimmed = searchTerm.trim();
  if (trimmed) {
    query = query.or(`name.ilike.%${trimmed}%,category.ilike.%${trimmed}%`);
  }

  const { data, error, count } = await query.range(from, to);
  if (error) throw error;
  return {
    data: Array.isArray(data) ? (data as FoodItem[]) : [],
    total: count ?? 0,
  };
}

export async function getFoodItemById(id: string) {
  const { data, error } = await supabase
    .from('food_items')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) throw error;
  return data as FoodItem | null;
}

export async function createFoodItem(item: Omit<FoodItem, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('food_items')
    .insert(item)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data as FoodItem | null;
}

export async function updateFoodItem(id: string, updates: Partial<FoodItem>) {
  const { data, error } = await supabase
    .from('food_items')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data as FoodItem | null;
}

export async function deleteFoodItem(id: string) {
  const { error } = await supabase
    .from('food_items')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// Shopping
export async function getShopping(category?: string) {
  let query = supabase
    .from('shopping')
    .select('*')
    .order('name', { ascending: true });
  
  if (category) {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getShoppingPaginated({
  page = 1,
  pageSize = 10,
  searchTerm = '',
}: PaginationParams = {}): Promise<PaginatedResponse<Shopping>> {
  const { from, to } = getRange(page, pageSize);
  let query = supabase
    .from('shopping')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  const trimmed = searchTerm.trim();
  if (trimmed) {
    query = query.or(`name.ilike.%${trimmed}%,category.ilike.%${trimmed}%`);
  }

  const { data, error, count } = await query.range(from, to);
  if (error) throw error;
  return {
    data: Array.isArray(data) ? (data as Shopping[]) : [],
    total: count ?? 0,
  };
}

export async function getShoppingById(id: string) {
  const { data, error } = await supabase
    .from('shopping')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) throw error;
  return data as Shopping | null;
}

export async function createShopping(item: Omit<Shopping, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('shopping')
    .insert(item)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data as Shopping | null;
}

export async function updateShopping(id: string, updates: Partial<Shopping>) {
  const { data, error } = await supabase
    .from('shopping')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data as Shopping | null;
}

export async function deleteShopping(id: string) {
  const { error } = await supabase
    .from('shopping')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// Entertainment
export async function getEntertainment(category?: string) {
  let query = supabase
    .from('entertainment')
    .select('*')
    .order('name', { ascending: true });
  
  if (category) {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getEntertainmentPaginated({
  page = 1,
  pageSize = 10,
  searchTerm = '',
}: PaginationParams = {}): Promise<PaginatedResponse<Entertainment>> {
  const { from, to } = getRange(page, pageSize);
  let query = supabase
    .from('entertainment')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  const trimmed = searchTerm.trim();
  if (trimmed) {
    query = query.or(`name.ilike.%${trimmed}%,category.ilike.%${trimmed}%`);
  }

  const { data, error, count } = await query.range(from, to);
  if (error) throw error;
  return {
    data: Array.isArray(data) ? (data as Entertainment[]) : [],
    total: count ?? 0,
  };
}

export async function getEntertainmentById(id: string) {
  const { data, error } = await supabase
    .from('entertainment')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) throw error;
  return data as Entertainment | null;
}

export async function createEntertainment(item: Omit<Entertainment, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('entertainment')
    .insert(item)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data as Entertainment | null;
}

export async function updateEntertainment(id: string, updates: Partial<Entertainment>) {
  const { data, error } = await supabase
    .from('entertainment')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data as Entertainment | null;
}

export async function deleteEntertainment(id: string) {
  const { error } = await supabase
    .from('entertainment')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// Events
export async function getEvents(category?: string) {
  let query = supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true });
  
  if (category) {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getEventsPaginated({
  page = 1,
  pageSize = 10,
  searchTerm = '',
}: PaginationParams = {}): Promise<PaginatedResponse<Event>> {
  const { from, to } = getRange(page, pageSize);
  let query = supabase
    .from('events')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  const trimmed = searchTerm.trim();
  if (trimmed) {
    query = query.or(`name.ilike.%${trimmed}%,category.ilike.%${trimmed}%,location.ilike.%${trimmed}%`);
  }

  const { data, error, count } = await query.range(from, to);
  if (error) throw error;
  return {
    data: Array.isArray(data) ? (data as Event[]) : [],
    total: count ?? 0,
  };
}

export async function getEventById(id: string) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) throw error;
  return data as Event | null;
}

export async function createEvent(event: Omit<Event, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('events')
    .insert(event)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data as Event | null;
}

export async function updateEvent(id: string, updates: Partial<Event>) {
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data as Event | null;
}

export async function deleteEvent(id: string) {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// Packages
export async function getPackages(type?: 'tourist' | 'local') {
  let query = supabase
    .from('packages')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (type) {
    query = query.eq('type', type);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function getPackagesPaginated({
  page = 1,
  pageSize = 10,
  searchTerm = '',
}: PaginationParams = {}): Promise<PaginatedResponse<Package>> {
  const { from, to } = getRange(page, pageSize);
  let query = supabase
    .from('packages')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  const trimmed = searchTerm.trim();
  if (trimmed) {
    query = query.or(`name.ilike.%${trimmed}%,description.ilike.%${trimmed}%`);
  }

  const { data, error, count } = await query.range(from, to);
  if (error) throw error;
  return {
    data: Array.isArray(data) ? (data as Package[]) : [],
    total: count ?? 0,
  };
}

export async function getPackageById(id: string) {
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) throw error;
  return data as Package | null;
}

export async function createPackage(pkg: Omit<Package, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('packages')
    .insert(pkg)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data as Package | null;
}

export async function updatePackage(id: string, updates: Partial<Package>) {
  const { data, error } = await supabase
    .from('packages')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data as Package | null;
}

export async function deletePackage(id: string) {
  const { error } = await supabase
    .from('packages')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export async function getContactMessages() {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw normalizeSupabaseError(error, 'Unable to load contact messages.');
  return Array.isArray(data) ? (data as ContactMessage[]) : [];
}

export async function getContactMessagesPaginated({
  page = 1,
  pageSize = 10,
  searchTerm = '',
}: PaginationParams = {}): Promise<PaginatedResponse<ContactMessage>> {
  const { from, to } = getRange(page, pageSize);
  let query = supabase
    .from('contact_messages')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  const trimmed = searchTerm.trim();
  if (trimmed) {
    query = query.or(`name.ilike.%${trimmed}%,email.ilike.%${trimmed}%,message.ilike.%${trimmed}%`);
  }

  const { data, error, count } = await query.range(from, to);
  if (error) throw normalizeSupabaseError(error, 'Unable to load contact messages.');
  return {
    data: Array.isArray(data) ? (data as ContactMessage[]) : [],
    total: count ?? 0,
  };
}

export async function getNewContactMessagesCount() {
  const { count, error } = await supabase
    .from('contact_messages')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'new');

  if (error) throw normalizeSupabaseError(error, 'Unable to load new messages count.');
  return count ?? 0;
}

export async function updateContactMessageStatus(id: string, status: ContactMessage['status']) {
  const { data, error } = await supabase
    .from('contact_messages')
    .update({ status })
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) throw normalizeSupabaseError(error, 'Unable to update contact message status.');
  return data as ContactMessage | null;
}

// Saved Plans
export async function getSavedPlans(userId: string) {
  try {
    const { data, error } = await supabase
      .from('saved_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw normalizeSupabaseError(error, 'Unable to load saved plans.');
    }

    return Array.isArray(data) ? data : [];
  } catch (error) {
    throw normalizeSupabaseError(error, 'Unable to load saved plans.');
  }
}

export async function createSavedPlan(plan: Omit<SavedPlan, 'id' | 'created_at'>) {
  try {
    const payload = {
      id: crypto.randomUUID(),
      ...plan,
    };

    const { data, error } = await supabase
      .from('saved_plans')
      .insert(payload)
      .select()
      .maybeSingle();

    if (error) {
      throw normalizeSupabaseError(error, 'Unable to save your plan.');
    }

    return data as SavedPlan | null;
  } catch (error) {
    throw normalizeSupabaseError(error, 'Unable to save your plan.');
  }
}

export async function deleteSavedPlan(id: string) {
  const { error } = await supabase
    .from('saved_plans')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// Contact messages
export async function createContactMessage(message: Omit<ContactMessage, 'id' | 'status' | 'created_at'>) {
  try {
    const { error } = await supabase
      .from('contact_messages')
      .insert(message);

    if (error) {
      throw normalizeSupabaseError(error, 'Unable to send your message.');
    }

    return null;
  } catch (error) {
    throw normalizeSupabaseError(error, 'Unable to send your message.');
  }
}

// Dashboard Stats
export async function getDashboardStats() {
  const [placesRes, foodRes, shoppingRes, entertainmentRes, eventsRes, packagesRes] = await Promise.all([
    supabase.from('places').select('id', { count: 'exact', head: true }),
    supabase.from('food_items').select('id', { count: 'exact', head: true }),
    supabase.from('shopping').select('id', { count: 'exact', head: true }),
    supabase.from('entertainment').select('id', { count: 'exact', head: true }),
    supabase.from('events').select('id', { count: 'exact', head: true }),
    supabase.from('packages').select('id', { count: 'exact', head: true }),
  ]);

  return {
    places: placesRes.count || 0,
    food: foodRes.count || 0,
    shopping: shoppingRes.count || 0,
    entertainment: entertainmentRes.count || 0,
    events: eventsRes.count || 0,
    packages: packagesRes.count || 0,
  };
}

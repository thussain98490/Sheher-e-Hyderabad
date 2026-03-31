import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import { matchPath } from 'react-router-dom';

export type RouteAccess = 'public' | 'authenticated' | 'admin';

export interface RouteConfig {
  name: string;
  path: string;
  title: string;
  description: string;
  access: RouteAccess;
  Component: LazyExoticComponent<ComponentType>;
}

const HomePage = lazy(() => import('./pages/MarketingHomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const FoodPage = lazy(() => import('./pages/FoodPage'));
const FoodDetailPage = lazy(() => import('./pages/FoodDetailPage'));
const PlacesPage = lazy(() => import('./pages/PlacesPage'));
const PlaceDetailPage = lazy(() => import('./pages/PlaceDetailPage'));
const ShoppingPage = lazy(() => import('./pages/ShoppingPage'));
const ShoppingDetailPage = lazy(() => import('./pages/ShoppingDetailPage'));
const EntertainmentPage = lazy(() => import('./pages/EntertainmentPage'));
const EntertainmentDetailPage = lazy(() => import('./pages/EntertainmentDetailPage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const EventDetailPage = lazy(() => import('./pages/EventDetailPage'));
const CulturePage = lazy(() => import('./pages/CulturePage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PlannerPage = lazy(() => import('./pages/TripPlannerPage'));
const PackagesPage = lazy(() => import('./pages/PackagesPage'));
const PackageDetailPage = lazy(() => import('./pages/PackageDetailPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const ForbiddenPage = lazy(() => import('./pages/ForbiddenPage'));
const NotFoundPage = lazy(() => import('./pages/NotFound'));

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    title: 'Discover Hyderabad',
    description: 'Plan your Hyderabad trip with local guides, food recommendations, attractions, events, and curated packages.',
    access: 'public',
    Component: HomePage,
  },
  {
    name: 'Login',
    path: '/login',
    title: 'Login',
    description: 'Log in to save itineraries, manage your profile, and continue planning your Hyderabad trip.',
    access: 'public',
    Component: LoginPage,
  },
  {
    name: 'Register',
    path: '/register',
    title: 'Create Account',
    description: 'Create an account to save travel plans, manage your preferences, and personalize your Hyderabad experience.',
    access: 'public',
    Component: RegisterPage,
  },
  {
    name: 'Food',
    path: '/food',
    title: 'Food and Drinks',
    description: 'Browse restaurants, cafes, biryani spots, and street food across Hyderabad.',
    access: 'public',
    Component: FoodPage,
  },
  {
    name: 'Food Detail',
    path: '/food/:id',
    title: 'Food Guide',
    description: 'View details, ratings, and location information for Hyderabad food destinations.',
    access: 'public',
    Component: FoodDetailPage,
  },
  {
    name: 'Places',
    path: '/places',
    title: 'Places to Visit',
    description: 'Explore monuments, museums, parks, and religious landmarks across Hyderabad.',
    access: 'public',
    Component: PlacesPage,
  },
  {
    name: 'Place Detail',
    path: '/places/:id',
    title: 'Place Details',
    description: 'View timings, fees, ratings, and location information for Hyderabad attractions.',
    access: 'public',
    Component: PlaceDetailPage,
  },
  {
    name: 'Shopping',
    path: '/shopping',
    title: 'Shopping Guide',
    description: 'Find malls, bazaars, handicraft shops, and shopping destinations in Hyderabad.',
    access: 'public',
    Component: ShoppingPage,
  },
  {
    name: 'Shopping Detail',
    path: '/shopping/:id',
    title: 'Shopping Details',
    description: 'View details and practical information for Hyderabad shopping destinations.',
    access: 'public',
    Component: ShoppingDetailPage,
  },
  {
    name: 'Entertainment',
    path: '/entertainment',
    title: 'Entertainment',
    description: 'Discover movie theaters, nightlife, gaming zones, and entertainment options in Hyderabad.',
    access: 'public',
    Component: EntertainmentPage,
  },
  {
    name: 'Entertainment Detail',
    path: '/entertainment/:id',
    title: 'Entertainment Details',
    description: 'View pricing, timings, and location details for Hyderabad entertainment venues.',
    access: 'public',
    Component: EntertainmentDetailPage,
  },
  {
    name: 'Events',
    path: '/events',
    title: 'Events',
    description: 'Track upcoming festivals, exhibitions, and public events in Hyderabad.',
    access: 'public',
    Component: EventsPage,
  },
  {
    name: 'Event Detail',
    path: '/events/:id',
    title: 'Event Details',
    description: 'View dates, venue information, and event descriptions for Hyderabad happenings.',
    access: 'public',
    Component: EventDetailPage,
  },
  {
    name: 'Culture',
    path: '/culture',
    title: 'Culture',
    description: 'Learn about Hyderabadi culture, language, festivals, traditions, and daily life.',
    access: 'public',
    Component: CulturePage,
  },
  {
    name: 'Contact',
    path: '/contact',
    title: 'Contact',
    description: 'Send a message, ask a question, or share feedback with the Sheher-e-Hyderabad team.',
    access: 'public',
    Component: ContactPage,
  },
  {
    name: 'Planner',
    path: '/planner',
    title: 'Trip Planner',
    description: 'Generate and save a sample Hyderabad itinerary based on your trip length, budget, and interests.',
    access: 'authenticated',
    Component: PlannerPage,
  },
  {
    name: 'Packages',
    path: '/packages',
    title: 'Travel Packages',
    description: 'Browse curated Hyderabad travel packages for tourists and locals.',
    access: 'public',
    Component: PackagesPage,
  },
  {
    name: 'Package Detail',
    path: '/packages/:id',
    title: 'Package Details',
    description: 'Review everything included in a predefined Hyderabad package before choosing it.',
    access: 'public',
    Component: PackageDetailPage,
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
    title: 'Dashboard',
    description: 'Manage your saved plans, profile, and travel preferences.',
    access: 'authenticated',
    Component: DashboardPage,
  },
  {
    name: 'Admin',
    path: '/admin',
    title: 'Admin Panel',
    description: 'Manage site content, user roles, and operational data.',
    access: 'admin',
    Component: AdminPage,
  },
  {
    name: 'Forbidden',
    path: '/403',
    title: 'Access Denied',
    description: 'You do not have permission to access this page.',
    access: 'public',
    Component: ForbiddenPage,
  },
  {
    name: 'Not Found',
    path: '/404',
    title: 'Page Not Found',
    description: 'The page you are looking for could not be found.',
    access: 'public',
    Component: NotFoundPage,
  },
];

export function getRouteForPath(pathname: string) {
  return routes.find((route) => matchPath({ path: route.path, end: true }, pathname));
}

export default routes;

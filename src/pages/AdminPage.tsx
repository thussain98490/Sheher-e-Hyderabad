import { useState, useEffect } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  getPlacesPaginated,
  createPlace,
  updatePlace,
  deletePlace,
  getFoodItemsPaginated,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
  getShoppingPaginated,
  createShopping,
  updateShopping,
  deleteShopping,
  getEntertainmentPaginated,
  createEntertainment,
  updateEntertainment,
  deleteEntertainment,
  getEventsPaginated,
  createEvent,
  updateEvent,
  deleteEvent,
  getPackagesPaginated,
  createPackage,
  updatePackage,
  deletePackage,
  getContactMessagesPaginated,
  getNewContactMessagesCount,
  updateContactMessageStatus,
  getDashboardStats,
  getAllProfilesPaginated,
  updateUserRole,
} from '@/db/api';
import { supabase } from '@/db/supabase';
import type { Place, FoodItem, Profile, Package, ContactMessage, Shopping, Entertainment, Event } from '@/types';
import { toast } from 'sonner';
import { Trash2, Plus, MapPin, Utensils, Users, BarChart, Briefcase, Mail, Pencil } from 'lucide-react';
import ErrorState from '@/components/common/ErrorState';

export default function AdminPage() {
  const PAGE_SIZE = 8;
  type AdminTab = 'places' | 'food' | 'shopping' | 'entertainment' | 'events' | 'packages' | 'messages' | 'users';
  const [places, setPlaces] = useState<Place[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [shoppingItems, setShoppingItems] = useState<Shopping[]>([]);
  const [entertainmentItems, setEntertainmentItems] = useState<Entertainment[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeTab, setActiveTab] = useState<AdminTab>('places');
  const [placesSearchTerm, setPlacesSearchTerm] = useState('');
  const [foodSearchTerm, setFoodSearchTerm] = useState('');
  const [packagesSearchTerm, setPackagesSearchTerm] = useState('');
  const [shoppingSearchTerm, setShoppingSearchTerm] = useState('');
  const [entertainmentSearchTerm, setEntertainmentSearchTerm] = useState('');
  const [eventsSearchTerm, setEventsSearchTerm] = useState('');
  const [messagesSearchTerm, setMessagesSearchTerm] = useState('');
  const [usersSearchTerm, setUsersSearchTerm] = useState('');
  const [placesPage, setPlacesPage] = useState(1);
  const [foodPage, setFoodPage] = useState(1);
  const [shoppingPage, setShoppingPage] = useState(1);
  const [entertainmentPage, setEntertainmentPage] = useState(1);
  const [eventsPage, setEventsPage] = useState(1);
  const [packagesPage, setPackagesPage] = useState(1);
  const [messagesPage, setMessagesPage] = useState(1);
  const [usersPage, setUsersPage] = useState(1);
  const [placesTotal, setPlacesTotal] = useState(0);
  const [foodTotal, setFoodTotal] = useState(0);
  const [shoppingTotal, setShoppingTotal] = useState(0);
  const [entertainmentTotal, setEntertainmentTotal] = useState(0);
  const [eventsTotal, setEventsTotal] = useState(0);
  const [packagesTotal, setPackagesTotal] = useState(0);
  const [messagesTotal, setMessagesTotal] = useState(0);
  const [usersTotal, setUsersTotal] = useState(0);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [stats, setStats] = useState({ places: 0, food: 0, shopping: 0, entertainment: 0, events: 0, packages: 0 });
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAdminErrorMessage = (error: unknown) => {
    const message = error instanceof Error ? error.message : 'Unknown error';

    if (message.toLowerCase().includes('row-level security') || message.toLowerCase().includes('policy')) {
      return 'Admin access is blocked by Supabase policies. Apply the latest admin/profile policy migration and try again.';
    }

    if (message.toLowerCase().includes('profiles')) {
      return `The admin panel could not read profile data. ${message}`;
    }

    return `We could not load admin data right now. ${message}`;
  };

  const loadStats = async () => {
    const statsData = await getDashboardStats();
    setStats(statsData);
  };

  const loadPlaces = async () => {
    setTabLoading(true);
    try {
      const { data, total } = await getPlacesPaginated({
        page: placesPage,
        pageSize: PAGE_SIZE,
        searchTerm: placesSearchTerm,
      });
      setPlaces(data);
      setPlacesTotal(total);
    } finally {
      setTabLoading(false);
    }
  };

  const loadFood = async () => {
    setTabLoading(true);
    try {
      const { data, total } = await getFoodItemsPaginated({
        page: foodPage,
        pageSize: PAGE_SIZE,
        searchTerm: foodSearchTerm,
      });
      setFoodItems(data);
      setFoodTotal(total);
    } finally {
      setTabLoading(false);
    }
  };

  const loadShopping = async () => {
    setTabLoading(true);
    try {
      const { data, total } = await getShoppingPaginated({
        page: shoppingPage,
        pageSize: PAGE_SIZE,
        searchTerm: shoppingSearchTerm,
      });
      setShoppingItems(data);
      setShoppingTotal(total);
    } finally {
      setTabLoading(false);
    }
  };

  const loadEntertainment = async () => {
    setTabLoading(true);
    try {
      const { data, total } = await getEntertainmentPaginated({
        page: entertainmentPage,
        pageSize: PAGE_SIZE,
        searchTerm: entertainmentSearchTerm,
      });
      setEntertainmentItems(data);
      setEntertainmentTotal(total);
    } finally {
      setTabLoading(false);
    }
  };

  const loadEvents = async () => {
    setTabLoading(true);
    try {
      const { data, total } = await getEventsPaginated({
        page: eventsPage,
        pageSize: PAGE_SIZE,
        searchTerm: eventsSearchTerm,
      });
      setEvents(data);
      setEventsTotal(total);
    } finally {
      setTabLoading(false);
    }
  };

  const loadPackages = async () => {
    setTabLoading(true);
    try {
      const { data, total } = await getPackagesPaginated({
        page: packagesPage,
        pageSize: PAGE_SIZE,
        searchTerm: packagesSearchTerm,
      });
      setPackages(data);
      setPackagesTotal(total);
    } finally {
      setTabLoading(false);
    }
  };

  const loadMessages = async () => {
    setTabLoading(true);
    try {
      const { data, total } = await getContactMessagesPaginated({
        page: messagesPage,
        pageSize: PAGE_SIZE,
        searchTerm: messagesSearchTerm,
      });
      setContactMessages(data);
      setMessagesTotal(total);
    } finally {
      setTabLoading(false);
    }
  };

  const loadNewMessagesCount = async () => {
    try {
      const count = await getNewContactMessagesCount();
      setNewMessagesCount(count);
    } catch {
      // no-op for badge count
    }
  };

  const loadUsers = async () => {
    setTabLoading(true);
    try {
      const { data, total } = await getAllProfilesPaginated({
        page: usersPage,
        pageSize: PAGE_SIZE,
        searchTerm: usersSearchTerm,
      });
      setProfiles(data);
      setUsersTotal(total);
    } finally {
      setTabLoading(false);
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await loadStats();
        await loadPlaces();
        await loadNewMessagesCount();
        setError(null);
      } catch (loadError) {
        console.error('Failed to initialize admin page:', loadError);
        setError(getAdminErrorMessage(loadError));
      } finally {
        setLoading(false);
      }
    };
    void bootstrap();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('admin-contact-messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'contact_messages' },
        () => {
          toast.info('New contact message received');
          void loadNewMessagesCount();
          if (activeTab === 'messages') {
            void loadMessages();
          }
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [activeTab]);

  useEffect(() => {
    if (loading) return;
    const run = async () => {
      try {
        if (activeTab === 'places') await loadPlaces();
        if (activeTab === 'food') await loadFood();
        if (activeTab === 'shopping') await loadShopping();
        if (activeTab === 'entertainment') await loadEntertainment();
        if (activeTab === 'events') await loadEvents();
        if (activeTab === 'packages') await loadPackages();
        if (activeTab === 'messages') await loadMessages();
        if (activeTab === 'users') await loadUsers();
      } catch (loadError) {
        const message = loadError instanceof Error ? loadError.message : 'Unknown error';
        toast.error(`Failed to load ${activeTab}`, { description: message });
      }
    };
    void run();
  }, [
    activeTab,
    loading,
    placesPage,
    foodPage,
    shoppingPage,
    entertainmentPage,
    eventsPage,
    packagesPage,
    messagesPage,
    usersPage,
    placesSearchTerm,
    foodSearchTerm,
    shoppingSearchTerm,
    entertainmentSearchTerm,
    eventsSearchTerm,
    packagesSearchTerm,
    messagesSearchTerm,
    usersSearchTerm,
  ]);

  const handleDeletePlace = async (id: string) => {
    try {
      await deletePlace(id);
      await Promise.all([loadPlaces(), loadStats()]);
      toast.success('Place deleted successfully');
    } catch (error) {
      toast.error('Failed to delete place');
    }
  };

  const handleDeleteFoodItem = async (id: string) => {
    try {
      await deleteFoodItem(id);
      await Promise.all([loadFood(), loadStats()]);
      toast.success('Food item deleted successfully');
    } catch (error) {
      toast.error('Failed to delete food item');
    }
  };

  const handleDeleteShopping = async (id: string) => {
    try {
      await deleteShopping(id);
      await Promise.all([loadShopping(), loadStats()]);
      toast.success('Shopping item deleted successfully');
    } catch {
      toast.error('Failed to delete shopping item');
    }
  };

  const handleDeleteEntertainment = async (id: string) => {
    try {
      await deleteEntertainment(id);
      await Promise.all([loadEntertainment(), loadStats()]);
      toast.success('Entertainment item deleted successfully');
    } catch {
      toast.error('Failed to delete entertainment item');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteEvent(id);
      await Promise.all([loadEvents(), loadStats()]);
      toast.success('Event deleted successfully');
    } catch {
      toast.error('Failed to delete event');
    }
  };

  const handleDeletePackage = async (id: string) => {
    try {
      await deletePackage(id);
      await Promise.all([loadPackages(), loadStats()]);
      toast.success('Package deleted successfully');
    } catch (error) {
      toast.error('Failed to delete package');
    }
  };

  const handleUpdateUserRole = async (userId: string, role: 'user' | 'admin') => {
    try {
      await updateUserRole(userId, role);
      await loadUsers();
      toast.success('User role updated successfully');
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const handleUpdateContactStatus = async (messageId: string, status: ContactMessage['status']) => {
    try {
      await updateContactMessageStatus(messageId, status);
      await loadMessages();
      await loadNewMessagesCount();
      toast.success('Message status updated successfully');
    } catch (error) {
      toast.error('Failed to update message status');
    }
  };

  const statsCards = [
    { label: 'Places', value: stats.places, icon: MapPin, color: 'text-primary' },
    { label: 'Food Items', value: stats.food, icon: Utensils, color: 'text-secondary' },
    { label: 'Packages', value: stats.packages, icon: Briefcase, color: 'text-primary' },
    { label: 'Messages', value: messagesTotal, icon: Mail, color: 'text-secondary' },
    { label: 'Users', value: usersTotal, icon: Users, color: 'text-primary' },
    { label: 'Total Content', value: stats.places + stats.food + stats.shopping + stats.entertainment + stats.events + stats.packages, icon: BarChart, color: 'text-secondary' },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
          <p className="text-lg text-muted-foreground">
            Manage content and users
          </p>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <p className="text-lg text-muted-foreground">Loading admin data...</p>
          </div>
        ) : error ? (
          <ErrorState title="Admin data unavailable" description={error} />
        ) : (
          <>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {statsCards.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.label}>
                    <CardContent className="p-6 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                      </div>
                      <Icon className={`h-12 w-12 ${stat.color} opacity-20`} />
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as AdminTab)}>
          <TabsList className="grid w-full max-w-6xl mx-auto grid-cols-8 mb-8">
            <TabsTrigger value="places">Places</TabsTrigger>
            <TabsTrigger value="food">Food</TabsTrigger>
            <TabsTrigger value="shopping">Shopping</TabsTrigger>
            <TabsTrigger value="entertainment">Entertainment</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="packages">Packages</TabsTrigger>
            <TabsTrigger value="messages">
              Messages {newMessagesCount > 0 ? `(${newMessagesCount})` : ''}
            </TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="places">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Manage Places</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Place
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Place</DialogTitle>
                      </DialogHeader>
                      <PlaceForm onSuccess={() => void Promise.all([loadPlaces(), loadStats()])} />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    placeholder="Search places by name or category..."
                    value={placesSearchTerm}
                    onChange={(event) => {
                      setPlacesSearchTerm(event.target.value);
                      setPlacesPage(1);
                    }}
                  />
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {places.map((place) => (
                      <TableRow key={place.id}>
                        <TableCell className="font-medium">{place.name}</TableCell>
                        <TableCell>{place.category}</TableCell>
                        <TableCell>{place.rating}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="icon">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Edit Place</DialogTitle>
                                </DialogHeader>
                                <PlaceForm initialData={place} onSuccess={() => void Promise.all([loadPlaces(), loadStats()])} />
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDeletePlace(place.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <PaginationControls
                  page={placesPage}
                  setPage={setPlacesPage}
                  total={placesTotal}
                  pageSize={PAGE_SIZE}
                  loading={tabLoading && activeTab === 'places'}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="food">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Manage Food Items</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Food Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Food Item</DialogTitle>
                      </DialogHeader>
                      <FoodForm onSuccess={() => void Promise.all([loadFood(), loadStats()])} />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    placeholder="Search food by name or category..."
                    value={foodSearchTerm}
                    onChange={(event) => {
                      setFoodSearchTerm(event.target.value);
                      setFoodPage(1);
                    }}
                  />
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {foodItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.price}</TableCell>
                        <TableCell>{item.rating}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="icon">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Edit Food Item</DialogTitle>
                                </DialogHeader>
                                <FoodForm initialData={item} onSuccess={() => void Promise.all([loadFood(), loadStats()])} />
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDeleteFoodItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <PaginationControls
                  page={foodPage}
                  setPage={setFoodPage}
                  total={foodTotal}
                  pageSize={PAGE_SIZE}
                  loading={tabLoading && activeTab === 'food'}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shopping">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Manage Shopping</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Shopping Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Shopping Item</DialogTitle>
                      </DialogHeader>
                      <ShoppingForm onSuccess={() => void Promise.all([loadShopping(), loadStats()])} />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    placeholder="Search shopping by name or category..."
                    value={shoppingSearchTerm}
                    onChange={(event) => {
                      setShoppingSearchTerm(event.target.value);
                      setShoppingPage(1);
                    }}
                  />
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shoppingItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="icon">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Edit Shopping Item</DialogTitle>
                                </DialogHeader>
                                <ShoppingForm initialData={item} onSuccess={() => void Promise.all([loadShopping(), loadStats()])} />
                              </DialogContent>
                            </Dialog>
                            <Button variant="destructive" size="icon" onClick={() => handleDeleteShopping(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <PaginationControls
                  page={shoppingPage}
                  setPage={setShoppingPage}
                  total={shoppingTotal}
                  pageSize={PAGE_SIZE}
                  loading={tabLoading && activeTab === 'shopping'}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="entertainment">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Manage Entertainment</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Entertainment Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Entertainment Item</DialogTitle>
                      </DialogHeader>
                      <EntertainmentForm onSuccess={() => void Promise.all([loadEntertainment(), loadStats()])} />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    placeholder="Search entertainment by name or category..."
                    value={entertainmentSearchTerm}
                    onChange={(event) => {
                      setEntertainmentSearchTerm(event.target.value);
                      setEntertainmentPage(1);
                    }}
                  />
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entertainmentItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.price}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="icon">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Edit Entertainment Item</DialogTitle>
                                </DialogHeader>
                                <EntertainmentForm initialData={item} onSuccess={() => void Promise.all([loadEntertainment(), loadStats()])} />
                              </DialogContent>
                            </Dialog>
                            <Button variant="destructive" size="icon" onClick={() => handleDeleteEntertainment(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <PaginationControls
                  page={entertainmentPage}
                  setPage={setEntertainmentPage}
                  total={entertainmentTotal}
                  pageSize={PAGE_SIZE}
                  loading={tabLoading && activeTab === 'entertainment'}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Manage Events</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Event
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Event</DialogTitle>
                      </DialogHeader>
                      <EventForm onSuccess={() => void Promise.all([loadEvents(), loadStats()])} />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    placeholder="Search events..."
                    value={eventsSearchTerm}
                    onChange={(event) => {
                      setEventsSearchTerm(event.target.value);
                      setEventsPage(1);
                    }}
                  />
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((eventItem) => (
                      <TableRow key={eventItem.id}>
                        <TableCell className="font-medium">{eventItem.name}</TableCell>
                        <TableCell>{eventItem.category}</TableCell>
                        <TableCell>{eventItem.date}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="icon">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Edit Event</DialogTitle>
                                </DialogHeader>
                                <EventForm initialData={eventItem} onSuccess={() => void Promise.all([loadEvents(), loadStats()])} />
                              </DialogContent>
                            </Dialog>
                            <Button variant="destructive" size="icon" onClick={() => handleDeleteEvent(eventItem.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <PaginationControls
                  page={eventsPage}
                  setPage={setEventsPage}
                  total={eventsTotal}
                  pageSize={PAGE_SIZE}
                  loading={tabLoading && activeTab === 'events'}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Manage Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    placeholder="Search users by name or email..."
                    value={usersSearchTerm}
                    onChange={(event) => {
                      setUsersSearchTerm(event.target.value);
                      setUsersPage(1);
                    }}
                  />
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profiles.map((profile: { id: string; name?: string; email: string; role: 'user' | 'admin' }) => (
                      <TableRow key={profile.id}>
                        <TableCell className="font-medium">{profile.name || 'N/A'}</TableCell>
                        <TableCell>{profile.email}</TableCell>
                        <TableCell className="capitalize">{profile.role}</TableCell>
                        <TableCell>
                          <Select
                            value={profile.role}
                            onValueChange={(value: string) => handleUpdateUserRole(profile.id, value as 'user' | 'admin')}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <PaginationControls
                  page={usersPage}
                  setPage={setUsersPage}
                  total={usersTotal}
                  pageSize={PAGE_SIZE}
                  loading={tabLoading && activeTab === 'users'}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="packages">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Manage Packages</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Package
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Package</DialogTitle>
                      </DialogHeader>
                      <PackageForm onSuccess={() => void Promise.all([loadPackages(), loadStats()])} />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    placeholder="Search packages by name or description..."
                    value={packagesSearchTerm}
                    onChange={(event) => {
                      setPackagesSearchTerm(event.target.value);
                      setPackagesPage(1);
                    }}
                  />
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {packages.map((pkg) => (
                      <TableRow key={pkg.id}>
                        <TableCell className="font-medium">{pkg.name}</TableCell>
                        <TableCell className="capitalize">{pkg.type}</TableCell>
                        <TableCell>{pkg.duration}</TableCell>
                        <TableCell>{pkg.budget}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="icon">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Edit Package</DialogTitle>
                                </DialogHeader>
                                <PackageForm initialData={pkg} onSuccess={() => void Promise.all([loadPackages(), loadStats()])} />
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDeletePackage(pkg.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <PaginationControls
                  page={packagesPage}
                  setPage={setPackagesPage}
                  total={packagesTotal}
                  pageSize={PAGE_SIZE}
                  loading={tabLoading && activeTab === 'packages'}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Contact Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    placeholder="Search messages by name, email, or content..."
                    value={messagesSearchTerm}
                    onChange={(event) => {
                      setMessagesSearchTerm(event.target.value);
                      setMessagesPage(1);
                    }}
                  />
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contactMessages.map((message) => (
                      <TableRow key={message.id}>
                        <TableCell className="font-medium">{message.name}</TableCell>
                        <TableCell>{message.email}</TableCell>
                        <TableCell className="max-w-sm truncate">{message.message}</TableCell>
                        <TableCell className="capitalize">{message.status}</TableCell>
                        <TableCell>
                          <Select
                            value={message.status}
                            onValueChange={(value: string) => handleUpdateContactStatus(message.id, value as ContactMessage['status'])}
                          >
                            <SelectTrigger className="w-36">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="reviewed">Reviewed</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <PaginationControls
                  page={messagesPage}
                  setPage={setMessagesPage}
                  total={messagesTotal}
                  pageSize={PAGE_SIZE}
                  loading={tabLoading && activeTab === 'messages'}
                />
              </CardContent>
            </Card>
          </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </MainLayout>
  );
}

function PaginationControls({
  page,
  setPage,
  total,
  pageSize,
  loading,
}: {
  page: number;
  setPage: (next: number) => void;
  total: number;
  pageSize: number;
  loading: boolean;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canGoPrev = page > 1 && !loading;
  const canGoNext = page < totalPages && !loading;

  return (
    <div className="mt-4 flex items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">
        {loading ? 'Loading...' : `Page ${page} of ${totalPages} (${total} total)`}
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canGoPrev}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canGoNext}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function PlaceForm({ onSuccess, initialData }: { onSuccess: () => void; initialData?: Place }) {
  const [formData, setFormData] = useState({
    name: initialData?.name ?? '',
    category: initialData?.category ?? '',
    description: initialData?.description ?? '',
    image_url: initialData?.image_url ?? '',
    timings: initialData?.timings ?? '',
    entry_fee: initialData?.entry_fee ?? '',
    best_time: initialData?.best_time ?? '',
    rating: initialData?.rating ?? 4.0,
    location: initialData?.location ?? '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (initialData?.id) {
        await updatePlace(initialData.id, formData);
        toast.success('Place updated successfully');
      } else {
        await createPlace(formData);
        toast.success('Place added successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error(initialData?.id ? 'Failed to update place' : 'Failed to add place');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="place-name">Name</Label>
        <Input
          id="place-name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="place-category">Category</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Historical">Historical</SelectItem>
            <SelectItem value="Religious">Religious</SelectItem>
            <SelectItem value="Parks">Parks</SelectItem>
            <SelectItem value="Museums">Museums</SelectItem>
            <SelectItem value="Getaways">Getaways</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="place-description">Description</Label>
        <Textarea
          id="place-description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="place-location">Location</Label>
        <Input
          id="place-location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />
      </div>
      <Button type="submit" className="w-full">{initialData?.id ? 'Update Place' : 'Add Place'}</Button>
    </form>
  );
}

function FoodForm({ onSuccess, initialData }: { onSuccess: () => void; initialData?: FoodItem }) {
  const [formData, setFormData] = useState({
    name: initialData?.name ?? '',
    category: initialData?.category ?? '',
    description: initialData?.description ?? '',
    image_url: initialData?.image_url ?? '',
    price: initialData?.price ?? '',
    rating: initialData?.rating ?? 4.0,
    location: initialData?.location ?? '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (initialData?.id) {
        await updateFoodItem(initialData.id, formData);
        toast.success('Food item updated successfully');
      } else {
        await createFoodItem(formData);
        toast.success('Food item added successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error(initialData?.id ? 'Failed to update food item' : 'Failed to add food item');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="food-name">Name</Label>
        <Input
          id="food-name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="food-category">Category</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Street Food">Street Food</SelectItem>
            <SelectItem value="Restaurants">Restaurants</SelectItem>
            <SelectItem value="Cafes">Cafes</SelectItem>
            <SelectItem value="Biryani">Biryani</SelectItem>
            <SelectItem value="Desserts">Desserts</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="food-description">Description</Label>
        <Textarea
          id="food-description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="food-price">Price</Label>
        <Input
          id="food-price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          placeholder="Rs. 200-500"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="food-location">Location</Label>
        <Input
          id="food-location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />
      </div>
      <Button type="submit" className="w-full">{initialData?.id ? 'Update Food Item' : 'Add Food Item'}</Button>
    </form>
  );
}

function PackageForm({ onSuccess, initialData }: { onSuccess: () => void; initialData?: Package }) {
  const [formData, setFormData] = useState({
    name: initialData?.name ?? '',
    type: initialData?.type ?? ('tourist' as 'tourist' | 'local'),
    duration: initialData?.duration ?? '',
    budget: initialData?.budget ?? '',
    places: initialData?.places?.join(', ') ?? '',
    description: initialData?.description ?? '',
    image_url: initialData?.image_url ?? '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        places: formData.places
          .split(',')
          .map((place) => place.trim())
          .filter(Boolean),
      };
      if (initialData?.id) {
        await updatePackage(initialData.id, payload);
        toast.success('Package updated successfully');
      } else {
        await createPackage(payload);
        toast.success('Package added successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error(initialData?.id ? 'Failed to update package' : 'Failed to add package');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="package-name">Name</Label>
        <Input
          id="package-name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="package-type">Type</Label>
        <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as 'tourist' | 'local' })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tourist">Tourist</SelectItem>
            <SelectItem value="local">Local</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="package-duration">Duration</Label>
        <Input
          id="package-duration"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          placeholder="3 Days"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="package-budget">Budget</Label>
        <Input
          id="package-budget"
          value={formData.budget}
          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
          placeholder="INR 12000"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="package-places">Places</Label>
        <Textarea
          id="package-places"
          value={formData.places}
          onChange={(e) => setFormData({ ...formData, places: e.target.value })}
          placeholder="Charminar, Mecca Masjid, Laad Bazaar"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="package-description">Description</Label>
        <Textarea
          id="package-description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <Button type="submit" className="w-full">{initialData?.id ? 'Update Package' : 'Add Package'}</Button>
    </form>
  );
}

function ShoppingForm({ onSuccess, initialData }: { onSuccess: () => void; initialData?: Shopping }) {
  const [formData, setFormData] = useState({
    name: initialData?.name ?? '',
    category: initialData?.category ?? '',
    description: initialData?.description ?? '',
    image_url: initialData?.image_url ?? '',
    location: initialData?.location ?? '',
    timings: initialData?.timings ?? '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (initialData?.id) {
        await updateShopping(initialData.id, formData);
        toast.success('Shopping item updated successfully');
      } else {
        await createShopping(formData);
        toast.success('Shopping item added successfully');
      }
      onSuccess();
    } catch {
      toast.error(initialData?.id ? 'Failed to update shopping item' : 'Failed to add shopping item');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Name" required />
      <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="Category" required />
      <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Location" />
      <Input value={formData.timings} onChange={(e) => setFormData({ ...formData, timings: e.target.value })} placeholder="Timings" />
      <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description" />
      <Button type="submit" className="w-full">{initialData?.id ? 'Update Shopping Item' : 'Add Shopping Item'}</Button>
    </form>
  );
}

function EntertainmentForm({ onSuccess, initialData }: { onSuccess: () => void; initialData?: Entertainment }) {
  const [formData, setFormData] = useState({
    name: initialData?.name ?? '',
    category: initialData?.category ?? '',
    description: initialData?.description ?? '',
    image_url: initialData?.image_url ?? '',
    location: initialData?.location ?? '',
    timings: initialData?.timings ?? '',
    price: initialData?.price ?? '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (initialData?.id) {
        await updateEntertainment(initialData.id, formData);
        toast.success('Entertainment item updated successfully');
      } else {
        await createEntertainment(formData);
        toast.success('Entertainment item added successfully');
      }
      onSuccess();
    } catch {
      toast.error(initialData?.id ? 'Failed to update entertainment item' : 'Failed to add entertainment item');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Name" required />
      <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="Category" required />
      <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Location" />
      <Input value={formData.timings} onChange={(e) => setFormData({ ...formData, timings: e.target.value })} placeholder="Timings" />
      <Input value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="Price" />
      <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description" />
      <Button type="submit" className="w-full">{initialData?.id ? 'Update Entertainment Item' : 'Add Entertainment Item'}</Button>
    </form>
  );
}

function EventForm({ onSuccess, initialData }: { onSuccess: () => void; initialData?: Event }) {
  const [formData, setFormData] = useState({
    name: initialData?.name ?? '',
    category: initialData?.category ?? '',
    description: initialData?.description ?? '',
    image_url: initialData?.image_url ?? '',
    location: initialData?.location ?? '',
    date: initialData?.date ?? '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (initialData?.id) {
        await updateEvent(initialData.id, formData);
        toast.success('Event updated successfully');
      } else {
        await createEvent(formData);
        toast.success('Event added successfully');
      }
      onSuccess();
    } catch {
      toast.error(initialData?.id ? 'Failed to update event' : 'Failed to add event');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Name" required />
      <Input value={formData.category ?? ''} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="Category" />
      <Input value={formData.location ?? ''} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Location" />
      <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
      <Textarea value={formData.description ?? ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description" />
      <Button type="submit" className="w-full">{initialData?.id ? 'Update Event' : 'Add Event'}</Button>
    </form>
  );
}

import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent } from '@/components/ui/card';

export default function CulturePage() {
  const sections = [
    {
      title: 'Local Slang',
      content: 'Hyderabadi Hindi is a unique dialect blending Urdu, Telugu, and Hindi. Common phrases include "Hau" (Yes), "Nakko" (No), "Baigan" (Nonsense), "Potti" (Let\'s go), and "Bindaas" (Carefree).',
    },
    {
      title: 'Traditions',
      content: 'Hyderabad celebrates both Hindu and Muslim festivals with equal fervor. Bonalu, Bathukamma, Ganesh Chaturthi, Ramadan, and Eid are celebrated with grand processions and community gatherings.',
    },
    {
      title: 'Festivals',
      content: 'Major festivals include Bonalu (honoring Goddess Mahakali), Bathukamma (floral festival), Ganesh Chaturthi, Ramadan, Eid, and Diwali. The Deccan Festival showcases the city\'s cultural heritage.',
    },
    {
      title: 'Lifestyle',
      content: 'Hyderabadis are known for their warm hospitality and laid-back attitude. The city seamlessly blends old-world charm with modern IT culture, creating a unique cosmopolitan lifestyle.',
    },
    {
      title: 'Food Culture',
      content: 'Hyderabadi cuisine is world-famous, especially the biryani. The city\'s food culture reflects its Nizami heritage with dishes like haleem, nihari, paya, and Osmania biscuits with Irani chai.',
    },
    {
      title: 'Ganga-Jamuni Tehzeeb',
      content: 'This term represents the harmonious coexistence of Hindu and Muslim cultures in Hyderabad. It\'s visible in architecture, language, festivals, and daily life, making the city truly unique.',
    },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Culture</h1>
          <p className="text-lg text-muted-foreground">
            Discover Hyderabad's rich cultural heritage and traditions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4 text-primary">{section.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{section.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 bg-accent/10">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-4 text-center">Languages Spoken</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4">
                <p className="text-2xl font-bold text-primary">Telugu</p>
                <p className="text-sm text-muted-foreground">Official Language</p>
              </div>
              <div className="p-4">
                <p className="text-2xl font-bold text-primary">Urdu</p>
                <p className="text-sm text-muted-foreground">Widely Spoken</p>
              </div>
              <div className="p-4">
                <p className="text-2xl font-bold text-primary">Hindi</p>
                <p className="text-sm text-muted-foreground">Common Language</p>
              </div>
              <div className="p-4">
                <p className="text-2xl font-bold text-primary">English</p>
                <p className="text-sm text-muted-foreground">Business & IT</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

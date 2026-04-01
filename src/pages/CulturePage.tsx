import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent } from '@/components/ui/card';

export default function CulturePage() {
  const sections = [
    {
      title: '🗣️ Local Slang',
      content: [
        'Blend of Urdu, Telugu & Hindi', 
        'Words like “Hau” (Yes) and “Nakko” (No) are commonly used' , 
        'Slang: Baigan, Mast, Bindaas', 
      ],
    },
    {
      title: '🧬 Traditions',
      content: [
        'Celebration of both Hindu & Muslim festivals',
        'Strong community bonding',
        'Rich cultural diversity across the city',
      ],
    },
    {
      title: '🎉 Festivals',
      content: [
        'Bonalu & Bathukamma',
        'Ganesh Chaturthi & Diwali',
        'Ramadan & Eid celebrations',
      ],
    },
    {
      title: '🌆 Lifestyle',
      content: [
        'Warm hospitality & friendly people',
        'Blend of tradition & modern IT culture',
        'Cosmopolitan and relaxed lifestyle',
      ],
    },
    {
      title: '🍽️ Food Culture',
      content: [
        'Famous for Hyderabadi Biryani',
        'Dishes: Haleem, Nihari, Paya',
        'Irani chai & Osmania biscuits',
      ],
    },
    {
      title: '🤝 Ganga-Jamuni Tehzeeb',
      content: [
        'Harmony of Hindu & Muslim cultures',
        'Visible in language & traditions',
        'Defines Hyderabad’s unique identity',
      ],
    },

    // NEW SECTIONS 🔥
    {
      title: '🏛️ Heritage & Architecture',
      content: [
        'Iconic monuments like Charminar & Golconda Fort',
        'Blend of Mughal, Persian & Qutb Shahi styles',
        'Historic palaces, mosques & heritage sites',
      ],
    },
    {
      title: '🎭 Arts & Crafts',
      content: [
        'Famous Bidriware metal craft',
        'Traditional pearls & jewelry',
        'Rich Deccani art heritage',
      ],
    },
    {
      title: '🛍️ Local Markets',
      content: [
        'Laad Bazaar for bangles & pearls',
        'Charminar street shopping experience',
        'Colorful and vibrant street culture',
      ],
    },
    {
      title: '🎶 Music & Dance',
      content: [
        'Influence of classical & folk traditions',
        'Qawwali and Sufi music culture',
        'Festive cultural performances',
      ],
    },
    {
      title: '🎬 Modern Culture',
      content: [
        'Tollywood film industry presence',
        'Growing café & nightlife scene',
        'Blend of tradition with modern lifestyle',
      ],
    },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-3">
            Explore <span className="text-primary">Hyderabad's Culture</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            From old city traditions to modern lifestyles, Hyderabad offers a unique cultural blend you won't find anywhere else.
          </p>
        </div>

        {/* Culture Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((section, index) => (
            <Card
              key={index}
              className="transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-primary">
                  {section.title}
                </h2>

                <ul className="space-y-2 text-sm text-muted-foreground">
                  {section.content.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Languages Section */}
        <Card className="mt-12 bg-accent/10">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Languages Spoken
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { name: 'Telugu', desc: 'Official Language' },
                { name: 'Urdu', desc: 'Widely Spoken' },
                { name: 'Hindi', desc: 'Common Language' },
                { name: 'English', desc: 'Business & IT' },
              ].map((lang, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-background shadow-sm hover:shadow-md transition"
                >
                  <p className="text-xl font-bold text-primary">
                    {lang.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {lang.desc}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Did You Know Section 🔥 */}
        <Card className="mt-10 border border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-3 text-primary">
              Did You Know?
            </h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Hyderabad is known as the “City of Pearls”.</li>
              <li>• Hyderabadi Biryani has a royal Nizami origin.</li>
              <li>• One of India's fastest-growing IT hubs.</li>
              <li>• Charminar is over 400 years old.</li>
              <li>• Hyderabad has one of the largest film studios in the world (Ramoji Film City).</li>
            </ul>
          </CardContent>
        </Card>

      </div>
    </MainLayout>
  );
}
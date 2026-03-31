INSERT INTO public.packages (id, name, type, duration, budget, places, description, image_url)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Hyderabad Heritage Day Tour',
    'tourist',
    '1 Day',
    'Rs. 2,500 - Rs. 4,000',
    '["Charminar", "Mecca Masjid", "Chowmahalla Palace", "Laad Bazaar"]'::jsonb,
    'A compact heritage circuit covering the old city landmarks, palace history, and local shopping in one easy day.',
    'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Royal Hyderabad Weekend',
    'tourist',
    '2 Days',
    'Rs. 6,000 - Rs. 9,000',
    '["Golconda Fort", "Qutb Shahi Tombs", "Salar Jung Museum", "Hussain Sagar"]'::jsonb,
    'A balanced weekend package for first-time visitors who want monuments, museums, and a relaxed evening by the lake.',
    'https://images.unsplash.com/photo-1588413335653-2a6fb4f60f13?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Local Food and Bazaar Trail',
    'local',
    '1 Day',
    'Rs. 1,500 - Rs. 3,000',
    '["Shah Ghouse", "Madina Building", "Laad Bazaar", "Nimrah Cafe"]'::jsonb,
    'Designed for Hyderabad locals who want a quick city refresh with iconic food stops and classic market vibes.',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Family Leisure Escape',
    'local',
    '2 Days',
    'Rs. 4,000 - Rs. 7,000',
    '["Nehru Zoological Park", "Ramoji Film City", "Tank Bund", "Lumbini Park"]'::jsonb,
    'A family-friendly package focused on easy travel, kid-friendly attractions, and flexible time for meals and breaks.',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80'
  )
ON CONFLICT (id) DO NOTHING;

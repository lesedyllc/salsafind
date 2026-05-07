// Default Philadelphia salsa event data
// Used as fallback when no Eventbrite API key is configured

const DEFAULT_CITY = 'Philadelphia, PA';

const PHILADELPHIA_EVENTS = [
  {
    id: 'phi-thu-weekly',
    title: 'Thursday Salsa Social',
    type: 'social',
    isRecurring: true,
    recurringDays: [4],
    startTime: '21:00',
    endTime: '02:00',
    displayTime: 'Thu 9:00 PM – 2:00 AM',
    venue: 'La Paloma Lounge',
    address: '1215 South St, Philadelphia, PA 19147',
    phone: '(215) 555-0147',
    website: '#',
    cost: 'Free before 9:30 PM · $10 after',
    description: "Philadelphia's most beloved weekly salsa social. Every Thursday the floor heats up with NY On2 and LA On1 salsa. Free beginner lesson at 8:30 PM. DJ spins salsa, bachata, and merengue all night. Dance shoes recommended.",
    images: [
      'https://loremflickr.com/400/260/salsa,dancing?lock=1',
      'https://loremflickr.com/400/260/latin,dance,night?lock=2'
    ],
    relevanceScore: 98,
    source: 'Facebook',
    level: 'All levels',
    dresscode: 'Smart casual'
  },
  {
    id: 'phi-fri-weekly',
    title: 'Friday Latin Night',
    type: 'social',
    isRecurring: true,
    recurringDays: [5],
    startTime: '22:00',
    endTime: '03:00',
    displayTime: 'Fri 10:00 PM – 3:00 AM',
    venue: 'Club Caliente',
    address: '1234 N Broad St, Philadelphia, PA 19121',
    phone: '(215) 555-0234',
    website: '#',
    cost: '$10 advance · $15 at door',
    description: 'The hottest Friday Latin night in Philly! Two rooms: salsa/bachata and reggaeton/cumbia. Professional dancers perform at midnight. Must be 21+. VIP tables available. Advance tickets on Eventbrite.',
    images: [
      'https://loremflickr.com/400/260/salsa,club,latin?lock=3',
      'https://loremflickr.com/400/260/dancing,nightclub?lock=4'
    ],
    relevanceScore: 96,
    source: 'Eventbrite',
    level: 'All levels',
    dresscode: 'Dressy / no sneakers'
  },
  {
    id: 'phi-sat-social',
    title: 'Saturday Salsa & Bachata Social',
    type: 'social',
    isRecurring: true,
    recurringDays: [6],
    startTime: '20:00',
    endTime: '01:00',
    displayTime: 'Sat 8:00 PM – 1:00 AM',
    venue: 'Ritmo Latino Bar & Grill',
    address: '902 Washington Ave, Philadelphia, PA 19147',
    phone: '(215) 555-0902',
    website: '#',
    cost: '$5 cover',
    description: 'Chill Saturday salsa and bachata social in South Philly. Great vibe for intermediate to advanced dancers. Outdoor deck open in warm weather. Delicious Latin food and cocktails. Friendly crowd, welcoming to all.',
    images: [
      'https://loremflickr.com/400/260/salsa,bachata,dance?lock=5',
      'https://loremflickr.com/400/260/latin,music,bar?lock=6'
    ],
    relevanceScore: 94,
    source: 'Instagram',
    level: 'Intermediate – Advanced',
    dresscode: 'Casual'
  },
  {
    id: 'phi-class-tue',
    title: 'Salsa 101: Beginner Series',
    type: 'class',
    isRecurring: true,
    recurringDays: [2],
    startTime: '19:00',
    endTime: '20:30',
    displayTime: 'Tue 7:00 PM – 8:30 PM',
    venue: 'Philadelphia Dance Arts',
    address: '220 N 13th St, Philadelphia, PA 19107',
    phone: '(215) 555-0220',
    website: '#',
    cost: '$20/class · $70/month (4 classes)',
    description: 'Start your salsa journey! Covers basic steps, timing (On1 and On2), leading & following, and foundational turn patterns. No partner needed. 8-week series, drop-ins welcome. Shoes with smooth soles recommended.',
    images: [
      'https://loremflickr.com/400/260/dance,class,studio?lock=7',
      'https://loremflickr.com/400/260/salsa,lesson,beginner?lock=8'
    ],
    relevanceScore: 92,
    source: 'Eventbrite',
    level: 'Beginner',
    dresscode: 'Comfortable clothes, dance shoes or smooth-soled shoes'
  },
  {
    id: 'phi-class-wed',
    title: 'Intermediate Salsa: Shine Technique',
    type: 'class',
    isRecurring: true,
    recurringDays: [3],
    startTime: '20:00',
    endTime: '21:30',
    displayTime: 'Wed 8:00 PM – 9:30 PM',
    venue: 'Philadelphia Dance Arts',
    address: '220 N 13th St, Philadelphia, PA 19107',
    phone: '(215) 555-0220',
    website: '#',
    cost: '$25/class · $90/month',
    description: 'Master your individual style and footwork. Focuses on salsa shines, body movement, arm styling, and musicality. Partner work in the second half. Prerequisite: 6+ months of salsa experience.',
    images: [
      'https://loremflickr.com/400/260/dance,footwork,latin?lock=9',
      'https://loremflickr.com/400/260/salsa,technique,studio?lock=10'
    ],
    relevanceScore: 90,
    source: 'Eventbrite',
    level: 'Intermediate',
    dresscode: 'Comfortable clothes, dance shoes'
  },
  {
    id: 'phi-intensive-may16',
    title: 'All-Styles Salsa Intensive Weekend',
    type: 'class',
    isRecurring: false,
    specificDates: ['2026-05-16', '2026-05-17'],
    startTime: '10:00',
    endTime: '18:00',
    displayTime: 'Sat–Sun May 16–17 · 10:00 AM – 6:00 PM',
    venue: 'Broad Street Arts Center',
    address: '601 N Broad St, Philadelphia, PA 19123',
    phone: '(215) 555-0601',
    website: '#',
    cost: '$85/day · $150/full weekend',
    description: 'Two days of intensive workshops covering NY On2, LA On1, and Colombian-style salsa. Taught by guest instructors from NYC. All levels welcome. Social dancing follows each day\'s workshops. Lunch not included.',
    images: [
      'https://loremflickr.com/400/260/salsa,workshop,intensive?lock=11',
      'https://loremflickr.com/400/260/dance,weekend,class?lock=12'
    ],
    relevanceScore: 89,
    source: 'Eventbrite',
    level: 'All levels',
    dresscode: 'Comfortable clothes, dance shoes'
  },
  {
    id: 'phi-festival-may22',
    title: 'Philadelphia Latin Arts Festival',
    type: 'event',
    isRecurring: false,
    specificDates: ['2026-05-22', '2026-05-23', '2026-05-24'],
    startTime: '12:00',
    endTime: '22:00',
    displayTime: 'May 22–24 · 12:00 PM – 10:00 PM',
    venue: "Penn's Landing Pavilion",
    address: '101 S Christopher Columbus Blvd, Philadelphia, PA 19106',
    phone: '(215) 555-0101',
    website: '#',
    cost: '$20/day · $45 weekend pass · Kids 12 & under free',
    description: "Philadelphia's biggest Latin arts celebration! Three days of live music, salsa performances, dance workshops, food vendors, and art exhibitions. Saturday features a salsa competition open to all levels. Grammy-nominated performers headlining Saturday night.",
    images: [
      'https://loremflickr.com/400/260/latin,festival,music?lock=13',
      'https://loremflickr.com/400/260/salsa,performance,stage?lock=14'
    ],
    relevanceScore: 95,
    source: 'Eventbrite',
    level: 'All levels',
    dresscode: 'Casual / festive'
  },
  {
    id: 'phi-outdoor-may31',
    title: "Outdoor Salsa at Penn's Landing",
    type: 'social',
    isRecurring: false,
    specificDates: ['2026-05-31'],
    startTime: '15:00',
    endTime: '20:00',
    displayTime: 'Sun May 31 · 3:00 PM – 8:00 PM',
    venue: "Penn's Landing Waterfront",
    address: '101 S Christopher Columbus Blvd, Philadelphia, PA 19106',
    phone: '(215) 555-0101',
    website: '#',
    cost: 'Free',
    description: 'Dance salsa beside the Delaware River with the Philly skyline as your backdrop. Monthly outdoor social bringing the community together for sunset dancing. Live DJ. No registration needed — just show up and dance!',
    images: [
      'https://loremflickr.com/400/260/outdoor,dance,waterfront?lock=15',
      'https://loremflickr.com/400/260/salsa,outdoor,summer?lock=16'
    ],
    relevanceScore: 93,
    source: 'Facebook',
    level: 'All levels',
    dresscode: 'Casual'
  },
  {
    id: 'phi-afrocuban-may30',
    title: 'Afro-Cuban Roots & Rumba Workshop',
    type: 'class',
    isRecurring: false,
    specificDates: ['2026-05-30'],
    startTime: '14:00',
    endTime: '17:00',
    displayTime: 'Sat May 30 · 2:00 PM – 5:00 PM',
    venue: 'Passyunk Dance Studio',
    address: '1712 E Passyunk Ave, Philadelphia, PA 19148',
    phone: '(215) 555-1712',
    website: '#',
    cost: '$35',
    description: 'Explore the African roots of salsa. This special workshop covers Afro-Cuban movement vocabulary, rumba, and clave rhythms with a guest instructor from Havana. Limited to 20 participants — register early!',
    images: [
      'https://loremflickr.com/400/260/afrocuban,rumba,dance?lock=17',
      'https://loremflickr.com/400/260/cuban,dance,class?lock=18'
    ],
    relevanceScore: 88,
    source: 'Instagram',
    level: 'Intermediate – Advanced',
    dresscode: 'Comfortable clothes, bare feet or soft-soled shoes'
  },
  {
    id: 'phi-gala-jun05',
    title: 'Grand Latin Gala: Summer Opening Night',
    type: 'event',
    isRecurring: false,
    specificDates: ['2026-06-05'],
    startTime: '19:00',
    endTime: '02:00',
    displayTime: 'Fri Jun 5 · 7:00 PM – 2:00 AM',
    venue: 'The Crystal Ballroom',
    address: '333 S Front St, Philadelphia, PA 19147',
    phone: '(215) 555-0333',
    website: '#',
    cost: '$45 advance · $55 door · VIP $85',
    description: "Philadelphia's grandest annual Latin gala. Champagne reception, professional dance showcase, and social dancing till 2 AM on a stunning marble floor. Salsa, bachata, and cha-cha. Black tie optional. VIP includes reserved seating and open bar.",
    images: [
      'https://loremflickr.com/400/260/gala,ballroom,elegant?lock=19',
      'https://loremflickr.com/400/260/latin,dance,gala?lock=20'
    ],
    relevanceScore: 91,
    source: 'Eventbrite',
    level: 'All levels',
    dresscode: 'Black tie optional / cocktail attire'
  }
];

// City-specific default data map
const CITY_DEFAULT_DATA = {
  'philadelphia': PHILADELPHIA_EVENTS,
  'philadelphia, pa': PHILADELPHIA_EVENTS,
  'philly': PHILADELPHIA_EVENTS
};

function getDefaultEventsForCity(city) {
  const key = city.toLowerCase().trim();
  return CITY_DEFAULT_DATA[key] || null;
}

// Filter events by date
function filterEventsByDate(events, dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  const dayOfWeek = date.getDay();

  return events.filter(event => {
    if (event.isRecurring) {
      return event.recurringDays.includes(dayOfWeek);
    }
    if (event.specificDates) {
      return event.specificDates.includes(dateStr);
    }
    return false;
  });
}

// Filter events by type
function filterEventsByType(events, type) {
  if (type === 'all') return events;
  return events.filter(e => e.type === type);
}

// Sort events by relevance score descending
function sortByRelevance(events) {
  return [...events].sort((a, b) => b.relevanceScore - a.relevanceScore);
}

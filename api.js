// Eventbrite API integration
// Set your private token in the Settings modal to enable live event search

const EVENTBRITE_BASE = 'https://www.eventbriteapi.com/v3';
const SALSA_KEYWORDS = ['salsa', 'latin dance', 'bachata', 'salsa social', 'latin night'];

async function searchEventbrite(city, dateStr, apiKey) {
  if (!apiKey) return null;

  const startDT = `${dateStr}T00:00:00`;
  const endDT = `${dateStr}T23:59:59`;

  const params = new URLSearchParams({
    'q': 'salsa dancing',
    'location.address': city,
    'location.within': '25mi',
    'start_date.range_start': startDT,
    'start_date.range_end': endDT,
    'expand': 'venue,organizer',
    'sort_by': 'date',
    'page_size': '20'
  });

  try {
    const res = await fetch(`${EVENTBRITE_BASE}/events/search/?${params}`, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    if (!res.ok) throw new Error(`Eventbrite error: ${res.status}`);
    const data = await res.json();
    return data.events ? data.events.map(normalizeEventbriteEvent) : [];
  } catch (err) {
    console.warn('Eventbrite API failed:', err.message);
    return null;
  }
}

function normalizeEventbriteEvent(ev) {
  const venue = ev.venue || {};
  const addr = venue.address || {};
  const fullAddress = [
    addr.address_1,
    addr.city,
    addr.region,
    addr.postal_code
  ].filter(Boolean).join(', ');

  const start = ev.start?.local || '';
  const end = ev.end?.local || '';
  const startTime = start ? formatTime(start) : '';
  const endTime = end ? formatTime(end) : '';

  const isFree = ev.is_free;
  const minPrice = ev.ticket_availability?.minimum_ticket_price?.display;
  const cost = isFree ? 'Free' : (minPrice ? `From ${minPrice}` : 'See event page');

  const img1 = ev.logo?.url || `https://loremflickr.com/400/260/salsa,dance?lock=${ev.id?.slice(-2) || 99}`;

  const type = classifyEventbriteType(ev.name?.text || '', ev.description?.text || '');

  return {
    id: `eb-${ev.id}`,
    title: ev.name?.text || 'Salsa Event',
    type,
    isRecurring: false,
    specificDates: [start.slice(0, 10)],
    startTime: start.slice(11, 16),
    endTime: end.slice(11, 16),
    displayTime: startTime + (endTime ? ` – ${endTime}` : ''),
    venue: venue.name || '',
    address: fullAddress,
    phone: '',
    website: ev.url || '#',
    cost,
    description: ev.description?.text?.slice(0, 300) || '',
    images: [img1, `https://loremflickr.com/400/260/latin,dance?lock=${ev.id?.slice(-3) || 88}`],
    relevanceScore: scoreEventbriteEvent(ev),
    source: 'Eventbrite',
    level: 'All levels',
    dresscode: ''
  };
}

function classifyEventbriteType(title, desc) {
  const text = (title + ' ' + desc).toLowerCase();
  if (/class|lesson|workshop|beginner|intermediate|technique/.test(text)) return 'class';
  if (/social|milonga|practica/.test(text)) return 'social';
  return 'event';
}

function scoreEventbriteEvent(ev) {
  const text = ((ev.name?.text || '') + ' ' + (ev.description?.text || '')).toLowerCase();
  let score = 70;
  if (text.includes('salsa')) score += 20;
  if (text.includes('latin')) score += 5;
  if (text.includes('bachata')) score += 3;
  if (ev.is_free) score += 2;
  return Math.min(score, 98);
}

function formatTime(isoStr) {
  if (!isoStr) return '';
  const [, timePart] = isoStr.split('T');
  if (!timePart) return '';
  const [h, m] = timePart.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
}

// Generate social media deep search links for a city + date
function getSocialSearchLinks(city, dateStr) {
  const cityEnc = encodeURIComponent(city);
  const q = encodeURIComponent(`salsa dancing ${city}`);
  const dateLabel = new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const citySlug = city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

  return [
    {
      name: 'Eventbrite',
      icon: 'eventbrite',
      color: '#f05537',
      url: `https://www.eventbrite.com/d/${citySlug}/salsa-dancing--events/`
    },
    {
      name: 'Facebook Events',
      icon: 'facebook',
      color: '#1877f2',
      url: `https://www.facebook.com/search/events/?q=salsa+dancing+${cityEnc}`
    },
    {
      name: 'Meetup',
      icon: 'meetup',
      color: '#ed1c40',
      url: `https://www.meetup.com/find/?keywords=salsa+dancing&location=${cityEnc}`
    },
    {
      name: 'Google Search',
      icon: 'google',
      color: '#4285f4',
      url: `https://www.google.com/search?q=salsa+dancing+${cityEnc}+${encodeURIComponent(dateLabel)}`
    },
    {
      name: 'X / Twitter',
      icon: 'twitter',
      color: '#000000',
      url: `https://x.com/search?q=salsa+dancing+${cityEnc}&f=live`
    },
    {
      name: 'Instagram',
      icon: 'instagram',
      color: '#e1306c',
      url: `https://www.instagram.com/explore/tags/${citySlug.replace(/-/g, '')}salsa/`
    }
  ];
}

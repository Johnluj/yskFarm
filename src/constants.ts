import { NavItem, Stat, Service, Feature, Achievement } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' },
];

export const STATS: Stat[] = [
  { label: 'Birds Managed', value: '7000', suffix: '+', description: 'Healthy broiler production' },
  { label: 'Farm Facility', value: '10', suffix: ' Acres', description: 'Modern agricultural infrastructure' },
  { label: 'Operations', value: '2023', description: 'Trusted since start of operations' },
  { label: 'Supply Capacity', value: '100', suffix: '%', description: 'Commercial scale reliability' },
];

export const FEATURES: Feature[] = [
  {
    title: 'Hygienic Farm Environment',
    description: 'Strict biosecurity measures and clean facilities for healthy birds.',
    icon: 'ShieldCheck',
  },
  {
    title: 'Healthy Bird Management',
    description: 'Professional veterinary supervision and high-quality feed protocols.',
    icon: 'HeartPulse',
  },
  {
    title: 'Reliable Commercial Supply',
    description: 'Consistent volume for hotels, restaurants, and caterers.',
    icon: 'Truck',
  },
  {
    title: 'Quality Frozen Chicken',
    description: 'Modern processing and fast freezing to lock in freshness.',
    icon: 'Snowflake',
  },
  {
    title: 'Experienced Operations',
    description: 'Led by industry professionals with a passion for excellence.',
    icon: 'Star',
  },
  {
    title: 'Customer Satisfaction',
    description: 'Dedicated support and timely deliveries for all our partners.',
    icon: 'Users',
  },
];

export const SERVICES: Service[] = [
  {
    id: 'broiler-production',
    title: 'Commercial Broiler Production',
    description: 'We specialize in the intensive production of high-quality broiler chickens, raised under strict hygienic conditions to ensure optimal growth and health.',
    imageUrl: '/src/assets/images/poultry_farm_hero_1779029633495.png',
    features: ['Modern ventilated housing', 'Standard feeding protocols', 'Vaccination schedules', 'Bio-security control'],
  },
  {
    id: 'frozen-chicken',
    title: 'Frozen Chicken Supply',
    description: 'Our processed chicken is frozen immediately after processing to maintain peak freshness and nutritional value for our diverse client base.',
    imageUrl: '/src/assets/images/frozen_chicken_display_1779029651003.png',
    features: ['Hygienic processing', 'Quick-freeze technology', 'Standard packaging', 'Consistent supply'],
  },
  {
    id: 'brooding-services',
    title: 'Poultry Brooding Services',
    description: 'Expert brooding management for day-old chicks, ensuring a strong foundation for healthy birds with low mortality rates.',
    imageUrl: '/src/assets/images/poultry_management_1779029687347.png',
    features: ['Temperature control', 'Litter management', 'Early-stage nutrition', 'Close monitoring'],
  },
  {
    id: 'bulk-supply',
    title: 'Bulk Poultry Supply',
    description: 'Large-scale distribution services designed for distributors, hotels, and large-scale caterers across Ibadan and beyond.',
    imageUrl: '/src/assets/images/poultry_farm_facility_1779029672411.png',
    features: ['Wholesale pricing', 'Efficient logistics', 'Scheduled deliveries', 'Flexible orders'],
  },
];

export const TIMELINE: Achievement[] = [
  {
    year: '2023',
    title: 'Foundation',
    description: 'YSK Poultry Farm was established with a vision to revolutionize poultry production in Ibadan.',
  },
  {
    year: '2024',
    title: 'Expansion',
    description: 'Increased capacity to 7,000+ birds and established modern processing units.',
  },
  {
    year: '2025',
    title: 'Supply Excellence',
    description: 'Partnered with major hotels and restaurants as a preferred poultry supplier.',
  },
  {
    year: 'Present',
    title: 'Innovation',
    description: 'Implementing sustainable farming practices and expanding our commercial reach.',
  },
];

export const CONTACT_INFO = {
  phone: '09131201229',
  whatsapp: '2349131201229',
  email: 'info@yskpoultry.com',
  address: 'Road 5, Lamona, Oluhunda Akobo Ibadan, Nigeria',
  hours: 'Mon - Sat: 8:00 AM - 6:00 PM',
};

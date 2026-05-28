import { NavItem, Stat, Service, Feature, Achievement } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' },
];

export const STATS: Stat[] = [
  { label: 'Birds Managed', value: '20000', suffix: '+', description: 'Healthy broiler production' },
  { label: 'Farm Facility', value: '10', suffix: ' Acres', description: 'Modern agricultural infrastructure' },
  { label: 'Operations', value: '2016', description: 'Trusted since start of operations' },
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
    title: 'Maize & Cashew Crops',
    description: 'Diversified cultivation producing top-grade yellow corn and raw cashew nuts.',
    icon: 'Sprout',
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
    imageUrl: '/images/poultry_1.jpg',
    features: ['Modern ventilated housing', 'Standard feeding protocols', 'Vaccination schedules', 'Bio-security control'],
  },
  {
    id: 'maize-production',
    title: 'Maize Production',
    description: 'Professional scale cultivation of top-quality yellow corn, harvested using standard practices to serve food processing and wholesale agro-allied markets.',
    imageUrl: '/images/maize_farm.webp',
    features: ['High-yield Maize varieties', 'Modern grain storage silo', 'Wholesale commodity supply', 'Standard processing'],
  },
  {
    id: 'cashew-production',
    title: 'Cashew Cultivation',
    description: 'Organic Cashew cultivation producing premium raw cashew nuts for local processing and export markets.',
    imageUrl: '/images/cashew_nuts.jpg',
    features: ['Organic farming practices', 'Expert orchard management', 'Quality sorting', 'Reliable supply chain'],
  },
  {
    id: 'brooding-services',
    title: 'Poultry Brooding Services',
    description: 'Expert brooding management for day-old chicks, ensuring a strong foundation for healthy birds with low mortality rates.',
    imageUrl: '/images/poultry_4.jpg',
    features: ['Temperature control', 'Litter management', 'Early-stage nutrition', 'Close monitoring'],
  },
  {
    id: 'bulk-supply',
    title: 'Bulk Poultry Supply',
    description: 'Large-scale distribution services designed for distributors, hotels, and large-scale caterers across Ibadan and beyond.',
    imageUrl: '/images/poultry_5.jpg',
    features: ['Wholesale pricing', 'Efficient logistics', 'Scheduled deliveries', 'Flexible orders'],
  },
];

export const TIMELINE: Achievement[] = [
  {
    year: '2016',
    title: 'Foundation',
    description: 'YSJ Farm Limited was established with a vision to revolutionize poultry production in Ibadan.',
  },
  {
    year: '2024',
    title: 'Expansion',
    description: 'Increased bird capacity to 20,000+ birds and expanded operations into Maize & Cashew crops.',
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
  email: 'info@ysjpoultry.com',
  address: 'Road 5, Lamona, Oluhunda Akobo Ibadan, Nigeria',
  hours: 'Mon - Sat: 8:00 AM - 6:00 PM',
};

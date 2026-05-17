export interface NavItem {
  label: string;
  href: string;
}

export interface Stat {
  label: string;
  value: string;
  suffix?: string;
  description?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  features: string[];
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface Achievement {
  year: string;
  title: string;
  description: string;
}

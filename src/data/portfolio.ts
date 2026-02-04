// src/data/portfolio.ts
export interface Project {
  slug: string;
  title: string;
  client: string;
  category: string;
  services: string[];
  description: string;
  challenge: string;
  solution: string;
  results: string[];
  image: string;
  gallery: string[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
  featured: boolean;
}

export const categories = [
  "All",
  "Drone Videography",
  "Photography",
  "Video Production",
  "Digital Marketing",
  "Branding",
  "Complete Package"
];

export const projects: Project[] = [
  {
    slug: "shivalik-heights",
    title: "Shivalik Heights Launch Campaign",
    client: "Shivalik Group",
    category: "Complete Package",
    services: ["Drone Videography", "Photography", "Video Production", "Digital Marketing"],
    description: "Complete marketing package for a premium residential project launch in Ahmedabad West.",
    challenge: "Shivalik Group needed to create buzz for their new premium residential project in a competitive market with multiple launches happening simultaneously.",
    solution: "We created a comprehensive marketing campaign including stunning drone videos, professional photography, cinematic walkthrough videos, and targeted digital ads on Facebook and Google.",
    results: [
      "3x increase in enquiries compared to previous project",
      "2.5 lakh video views in first month",
      "45% lower cost per lead",
      "85% of units sold in 6 months"
    ],
    image: "/images/portfolio/shivalik-heights.jpg",
    gallery: [
      "/images/portfolio/shivalik-1.jpg",
      "/images/portfolio/shivalik-2.jpg",
      "/images/portfolio/shivalik-3.jpg"
    ],
    testimonial: {
      quote: "NovaFusion transformed our project marketing. The drone videos generated 3x more enquiries than we expected!",
      author: "Rajesh Patel",
      role: "Director, Shivalik Group"
    },
    featured: true
  },
  {
    slug: "gokul-residency",
    title: "Gokul Residency Photography",
    client: "Gokul Developers",
    category: "Photography",
    services: ["Photography", "Virtual Staging"],
    description: "Premium photography for a luxury apartment complex with virtual staging for unsold units.",
    challenge: "Empty apartments were difficult to sell as buyers couldn't visualize the living space.",
    solution: "Professional HDR photography combined with photorealistic virtual staging to showcase the potential of each unit.",
    results: [
      "118% increase in listing views",
      "40% faster sales cycle",
      "Premium pricing maintained"
    ],
    image: "/images/portfolio/gokul-residency.jpg",
    gallery: [],
    featured: true
  },
  {
    slug: "safal-paradise",
    title: "Safal Paradise Drone Film",
    client: "Safal Constructions",
    category: "Drone Videography",
    services: ["Drone Videography"],
    description: "Cinematic drone film showcasing a township project with extensive amenities.",
    challenge: "Showcase the scale and amenities of a large township project that's difficult to appreciate from ground level.",
    solution: "Created a 3-minute cinematic drone film with smooth aerial movements highlighting the project's scale, green spaces, and premium amenities.",
    results: [
      "50,000+ YouTube views",
      "Used in all sales presentations",
      "Featured in property exhibitions"
    ],
    image: "/images/portfolio/safal-paradise.jpg",
    gallery: [],
    featured: true
  },
  {
    slug: "aryan-towers",
    title: "Aryan Towers Digital Campaign",
    client: "Aryan Builders",
    category: "Digital Marketing",
    services: ["Digital Marketing", "Social Media"],
    description: "Lead generation campaign for affordable housing project targeting first-time buyers.",
    challenge: "Reach first-time home buyers in the 25-35 age group with limited marketing budget.",
    solution: "Targeted Facebook and Instagram campaigns with compelling creatives, lead magnets, and automated WhatsApp follow-ups.",
    results: [
      "500+ qualified leads in 2 months",
      "₹150 cost per lead",
      "28% lead to site visit conversion"
    ],
    image: "/images/portfolio/aryan-towers.jpg",
    gallery: [],
    featured: false
  },
  {
    slug: "maple-greens",
    title: "Maple Greens Brand Identity",
    client: "Maple Developers",
    category: "Branding",
    services: ["Branding", "Logo Design", "Marketing Collateral"],
    description: "Complete brand identity for a new eco-friendly residential project.",
    challenge: "Create a brand that communicates eco-friendliness and premium living for a new developer.",
    solution: "Developed a fresh brand identity with nature-inspired elements, complete with logo, color palette, brochures, and signage.",
    results: [
      "Strong brand recognition",
      "Consistent visual identity across all touchpoints",
      "Premium positioning achieved"
    ],
    image: "/images/portfolio/maple-greens.jpg",
    gallery: [],
    featured: false
  },
  {
    slug: "skyview-apartments",
    title: "Skyview Apartments Video Tour",
    client: "Skyview Realty",
    category: "Video Production",
    services: ["Video Production", "Walkthrough Video"],
    description: "Professional walkthrough video for a high-rise residential project.",
    challenge: "Help NRI buyers visualize the property without visiting in person.",
    solution: "Created detailed walkthrough videos with professional voiceover, floor plans overlay, and amenities showcase.",
    results: [
      "30% of sales to NRI buyers",
      "Reduced site visit requirements",
      "Videos shared 500+ times"
    ],
    image: "/images/portfolio/skyview-apartments.jpg",
    gallery: [],
    featured: false
  }
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(p => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter(p => p.featured);
}

export function getProjectsByCategory(category: string): Project[] {
  if (category === "All") return projects;
  return projects.filter(p => p.category === category);
}

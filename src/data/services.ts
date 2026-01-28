// src/data/services.ts
export interface Service {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  shortDesc: string;
  icon: string;
  image: string;
  features: string[];
  benefits: { title: string; desc: string }[];
  process: { step: string; title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  metaTitle: string;
  metaDesc: string;
}

export const services: Service[] = [
  {
    slug: "drone-videography",
    title: "Real Estate Drone Videography in Ahmedabad",
    shortTitle: "Drone Videography",
    description: "Capture stunning aerial views of your properties with our professional drone videography services. We create cinematic footage that showcases your real estate projects from breathtaking angles, helping you attract more buyers and stand out in the competitive Ahmedabad market.",
    shortDesc: "Cinematic aerial shots that showcase properties from stunning angles.",
    icon: "🚁",
    image: "/images/services/drone.jpg",
    features: [
      "4K Ultra HD aerial footage",
      "Licensed and insured drone pilots",
      "360° panoramic views",
      "Smooth cinematic movements",
      "Day and twilight shoots",
      "Quick 3-5 day delivery"
    ],
    benefits: [
      { title: "Stand Out", desc: "Aerial views make your property listings 3x more engaging than competitors" },
      { title: "Show Scale", desc: "Showcase the full scope of your project including surroundings and amenities" },
      { title: "Build Trust", desc: "Professional footage builds credibility with potential buyers" },
      { title: "More Leads", desc: "Properties with drone videos receive 68% more enquiries" }
    ],
    process: [
      { step: "01", title: "Consultation", desc: "We discuss your project and plan the best shots" },
      { step: "02", title: "Site Survey", desc: "Our team visits the location for planning" },
      { step: "03", title: "Drone Shoot", desc: "Professional aerial filming with 4K cameras" },
      { step: "04", title: "Editing", desc: "Color grading and cinematic editing" },
      { step: "05", title: "Delivery", desc: "Final videos in multiple formats" }
    ],
    faqs: [
      { q: "Do you have DGCA certification for drone flying?", a: "Yes, all our drone pilots are DGCA certified and we have all necessary permissions for commercial drone operations." },
      { q: "Can you shoot at construction sites?", a: "Absolutely! We regularly shoot at under-construction projects to showcase progress and scale." },
      { q: "What's the turnaround time?", a: "Standard delivery is 3-5 business days. Rush delivery available for urgent projects." }
    ],
    metaTitle: "Drone Videography Services Ahmedabad | Real Estate Aerial Shoots",
    metaDesc: "Professional drone videography for real estate in Ahmedabad. 4K aerial videos, licensed pilots, quick delivery. Get stunning property videos that sell faster."
  },
  {
    slug: "photography",
    title: "Real Estate Photography Services in Ahmedabad",
    shortTitle: "Property Photography",
    description: "Professional real estate photography that captures every detail of your properties. Our expert photographers use advanced equipment and techniques to create stunning images that attract buyers and accelerate sales in the Ahmedabad real estate market.",
    shortDesc: "Professional photography that captures every detail beautifully.",
    icon: "📸",
    image: "/images/services/photography.jpg",
    features: [
      "High-resolution images",
      "Professional lighting setup",
      "Wide-angle architecture shots",
      "HDR photography",
      "Twilight/golden hour shoots",
      "Virtual staging available"
    ],
    benefits: [
      { title: "First Impression", desc: "90% of buyers start their search online - great photos matter" },
      { title: "Faster Sales", desc: "Properties with professional photos sell 32% faster" },
      { title: "Higher Value", desc: "Quality images justify premium pricing" },
      { title: "More Views", desc: "Listings with pro photos get 118% more views" }
    ],
    process: [
      { step: "01", title: "Booking", desc: "Schedule the shoot at your convenience" },
      { step: "02", title: "Preparation", desc: "Tips shared for property preparation" },
      { step: "03", title: "Photo Shoot", desc: "2-3 hour professional session" },
      { step: "04", title: "Editing", desc: "Color correction and enhancement" },
      { step: "05", title: "Delivery", desc: "Web and print-ready images" }
    ],
    faqs: [
      { q: "How many photos will we receive?", a: "Typically 25-50 edited photos depending on property size. We capture all key areas and angles." },
      { q: "Do you provide virtual staging?", a: "Yes, we offer virtual staging for empty properties to help buyers visualize the space." },
      { q: "Can you shoot model apartments?", a: "Yes, we specialize in model apartment and sample flat photography." }
    ],
    metaTitle: "Real Estate Photography Ahmedabad | Property Photo Services",
    metaDesc: "Professional real estate photography in Ahmedabad. HDR images, virtual staging, quick delivery. Make your properties stand out with stunning photos."
  },
  {
    slug: "video-production",
    title: "Real Estate Video Production in Ahmedabad",
    shortTitle: "Video Production",
    description: "Create compelling property walkthrough videos and virtual tours that engage potential buyers. Our video production team crafts cinematic content that tells your property's story and drives more enquiries for your Ahmedabad real estate projects.",
    shortDesc: "Compelling walkthrough videos and virtual tours.",
    icon: "🎬",
    image: "/images/services/video.jpg",
    features: [
      "Cinematic walkthrough videos",
      "Virtual tour creation",
      "Professional voiceover",
      "Background music licensing",
      "Motion graphics & titles",
      "Social media edits"
    ],
    benefits: [
      { title: "Engagement", desc: "Videos keep viewers engaged 5x longer than photos" },
      { title: "Emotional Connect", desc: "Video storytelling creates emotional connection with buyers" },
      { title: "Virtual Visits", desc: "Buyers can tour properties from anywhere" },
      { title: "Shareability", desc: "Videos are shared 12x more than text and images" }
    ],
    process: [
      { step: "01", title: "Script", desc: "Develop the video narrative and shot list" },
      { step: "02", title: "Production", desc: "Professional video shoot on location" },
      { step: "03", title: "Voiceover", desc: "Professional narration recording" },
      { step: "04", title: "Editing", desc: "Cinematic editing with music" },
      { step: "05", title: "Delivery", desc: "Multiple formats for all platforms" }
    ],
    faqs: [
      { q: "How long are the videos?", a: "Typically 2-3 minutes for full walkthroughs, plus 30-60 second versions for social media." },
      { q: "Do you provide voiceover?", a: "Yes, professional voiceover in Hindi and English is included." },
      { q: "Can you add my branding?", a: "Absolutely! We include your logo, contact details, and brand colors." }
    ],
    metaTitle: "Real Estate Video Production Ahmedabad | Property Videos",
    metaDesc: "Professional property video production in Ahmedabad. Walkthrough videos, virtual tours, social media content. Engage buyers with cinematic real estate videos."
  },
  {
    slug: "digital-marketing",
    title: "Real Estate Digital Marketing in Ahmedabad",
    shortTitle: "Digital Marketing",
    description: "Data-driven digital marketing campaigns that generate quality leads for your real estate projects. We specialize in Facebook, Instagram, and Google ads optimized specifically for the Ahmedabad property market.",
    shortDesc: "Data-driven campaigns that generate quality leads.",
    icon: "📱",
    image: "/images/services/marketing.jpg",
    features: [
      "Facebook & Instagram Ads",
      "Google Ads management",
      "Lead generation campaigns",
      "Audience targeting",
      "A/B testing optimization",
      "Monthly performance reports"
    ],
    benefits: [
      { title: "Qualified Leads", desc: "Target the right audience with precise demographics" },
      { title: "Cost Effective", desc: "Better ROI than traditional advertising" },
      { title: "Measurable", desc: "Track every rupee spent and lead generated" },
      { title: "Scalable", desc: "Easily scale campaigns based on results" }
    ],
    process: [
      { step: "01", title: "Strategy", desc: "Define target audience and goals" },
      { step: "02", title: "Creative", desc: "Design high-converting ad creatives" },
      { step: "03", title: "Launch", desc: "Set up and launch campaigns" },
      { step: "04", title: "Optimize", desc: "Continuous testing and improvement" },
      { step: "05", title: "Report", desc: "Weekly/monthly performance reports" }
    ],
    faqs: [
      { q: "What's the minimum ad budget?", a: "We recommend starting with ₹30,000-50,000/month for effective campaigns, plus our management fee." },
      { q: "How soon will we see results?", a: "Initial leads typically start coming within the first week. Campaigns optimize over 2-4 weeks." },
      { q: "Do you handle lead follow-up?", a: "We deliver qualified leads to you. We can also set up automated WhatsApp responses." }
    ],
    metaTitle: "Real Estate Digital Marketing Ahmedabad | Property Ads",
    metaDesc: "Expert real estate digital marketing in Ahmedabad. Facebook ads, Google ads, lead generation. Get quality property leads with data-driven campaigns."
  },
  {
    slug: "branding",
    title: "Real Estate Branding & Design in Ahmedabad",
    shortTitle: "Branding & Design",
    description: "Build a powerful brand identity for your real estate projects. From logo design to complete marketing collateral, we create cohesive visual identities that establish trust and recognition in the Ahmedabad property market.",
    shortDesc: "Complete brand identity for real estate projects.",
    icon: "🎨",
    image: "/images/services/branding.jpg",
    features: [
      "Logo design",
      "Brand identity system",
      "Brochure design",
      "Hoarding & signage design",
      "Social media templates",
      "Presentation design"
    ],
    benefits: [
      { title: "Recognition", desc: "Stand out with a unique visual identity" },
      { title: "Trust", desc: "Professional branding builds buyer confidence" },
      { title: "Consistency", desc: "Unified look across all touchpoints" },
      { title: "Premium Image", desc: "Quality design commands premium prices" }
    ],
    process: [
      { step: "01", title: "Discovery", desc: "Understand your vision and market" },
      { step: "02", title: "Concepts", desc: "Present multiple design directions" },
      { step: "03", title: "Refinement", desc: "Iterate based on feedback" },
      { step: "04", title: "Finalize", desc: "Complete the brand system" },
      { step: "05", title: "Delivery", desc: "All files and brand guidelines" }
    ],
    faqs: [
      { q: "How many logo concepts do you provide?", a: "We present 3-4 initial concepts and refine your chosen direction until perfect." },
      { q: "Do you design brochures?", a: "Yes, we create everything from single-page flyers to detailed project brochures." },
      { q: "Can you design for print and digital?", a: "Absolutely! All designs are optimized for both print and digital use." }
    ],
    metaTitle: "Real Estate Branding Ahmedabad | Property Brand Design",
    metaDesc: "Professional real estate branding in Ahmedabad. Logo design, brochures, marketing collateral. Build a powerful brand for your property projects."
  },
  {
    slug: "web-development",
    title: "Real Estate Website Development in Ahmedabad",
    shortTitle: "Web Development",
    description: "High-converting websites designed specifically for real estate projects and builders. We create fast, mobile-friendly, SEO-optimized websites that generate leads and showcase your properties beautifully in the Ahmedabad market.",
    shortDesc: "High-converting websites for builders.",
    icon: "🌐",
    image: "/images/services/web.jpg",
    features: [
      "Mobile-responsive design",
      "Property listing system",
      "Lead capture forms",
      "WhatsApp integration",
      "SEO optimization",
      "Fast loading speed"
    ],
    benefits: [
      { title: "24/7 Sales", desc: "Your website works round the clock generating leads" },
      { title: "Credibility", desc: "Professional website establishes trust" },
      { title: "SEO Traffic", desc: "Rank on Google for property searches" },
      { title: "Analytics", desc: "Track visitor behavior and conversions" }
    ],
    process: [
      { step: "01", title: "Planning", desc: "Define sitemap and features" },
      { step: "02", title: "Design", desc: "Create visual mockups" },
      { step: "03", title: "Development", desc: "Build the website" },
      { step: "04", title: "Content", desc: "Add property content and images" },
      { step: "05", title: "Launch", desc: "Go live and monitor" }
    ],
    faqs: [
      { q: "How long does website development take?", a: "Typically 2-4 weeks depending on complexity and content readiness." },
      { q: "Can I update content myself?", a: "Yes, we build with easy-to-use content management so you can update properties." },
      { q: "Do you provide hosting?", a: "Yes, we offer reliable hosting with SSL certificate and daily backups." }
    ],
    metaTitle: "Real Estate Website Development Ahmedabad | Builder Websites",
    metaDesc: "Professional real estate website development in Ahmedabad. Fast, mobile-friendly, SEO-optimized property websites that generate leads."
  }
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find(s => s.slug === slug);
}

export function getAllServiceSlugs(): string[] {
  return services.map(s => s.slug);
}

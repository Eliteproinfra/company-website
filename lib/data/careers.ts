export type JobListing = {
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
};

export const jobListings: JobListing[] = [
  { title: "GM - Sales", department: "Sales", location: "Gurgaon", type: "Full Time", experience: "7-10 years" },
  { title: "AGM Sales", department: "Sales", location: "Gurgaon", type: "Full Time", experience: "4-7 years" },
  {
    title: "Tele Caller Sales",
    department: "Sales",
    location: "Gurgaon",
    type: "Full Time",
    experience: "0-6 months",
  },
  { title: "Sales Manager", department: "Sales", location: "Gurgaon", type: "Full Time", experience: "2-4 years" },
];

export const cultureHighlights = [
  {
    icon: "fas fa-gem",
    title: "Luxury Exposure",
    description: "Premium projects with HNIs & investors.",
  },
  {
    icon: "fas fa-bolt",
    title: "Dynamic Culture",
    description: "Collaborative culture & mentorship.",
  },
  {
    icon: "fas fa-arrow-up-right-dots",
    title: "Growth & Learning",
    description: "Growth-focused performance rewards.",
  },
  {
    icon: "fas fa-medal",
    title: "Recognition",
    description: "Transparent process & quick updates.",
  },
];

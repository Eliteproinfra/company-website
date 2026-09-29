export type JobListing = {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  /** Opening paragraph shown under "Job Description". */
  summary: string;
  qualifications: string[];
  responsibilities: string[];
  /** Bullet glyph used on live for this posting ("*" or "•"). */
  bullet: "*" | "•";
};

/** Live career.php job accordion, content verbatim (ids are live's apply-button ids). */
export const jobListings: JobListing[] = [
  {
    id: 5,
    title: "GM -Sales",
    department: "Sales",
    location: "Gurugram",
    type: "Full Time",
    experience: "7-10 years",
    bullet: "*",
    summary:
      "The General Manager Sales Marketing will be based in Gurgaon and is a senior-level full-time position. The role requires 7 to 10 years of experience in sales and marketing within the real estate sector. The ideal candidate will lead strategic initiatives, manage sales pipelines, and develop B2B/B2C sales strategies to drive business growth and strengthen the company's market position.",
    qualifications: [
      "Extensive experience in sales pipeline management to ensure the company meets its sales targets efficiently and effectively (Mandatory skill).",
      "Proven track record in strategic leadership to develop and implement sales and marketing strategies that align with company goals (Mandatory skill).",
      "Expertise in creating and executing successful B2B/B2C sales strategies tailored to the real estate industry (Mandatory skill).",
      "Proficiency in CRM software such as Salesforce to manage customer relationships and analyze sales performance.",
      "Demonstrated ability in data-driven decision making to optimize sales processes and enhance customer engagement.",
      "Strong negotiation and communication skills to build and maintain relationships with clients and stakeholders.",
      "Exceptional organizational skills with the ability to manage multiple projects simultaneously and meet deadlines.",
      "Analytical mindset with the capability to assess market trends and adjust strategies accordingly to maintain competitive edge.",
    ],
    responsibilities: [
      "Lead the development and implementation of comprehensive sales and marketing strategies to increase market share and achieve company objectives.",
      "Manage and optimize the sales pipeline to ensure efficient progress from lead generation to deal closure.",
      "Develop and sustain strong relationships with clients and partners, ensuring high levels of customer satisfaction.",
      "Collaborate with other departments to enhance product offerings and support overall business objectives.",
      "Conduct regular market analysis to identify new business opportunities and stay ahead of industry trends.",
      "Oversee the performance of sales teams, providing mentorship and guidance to drive peak performance.",
      "Prepare and present detailed sales reports and forecasts to senior management for informed decision-making.",
      "Ensure compliance with company policies and industry regulations to maintain corporate integrity and ethical standards.",
    ],
  },
  {
    id: 4,
    title: "AGM Sales",
    department: "Sales",
    location: "Gurugram",
    type: "Full Time",
    experience: "4-7 years",
    bullet: "*",
    summary:
      "We are seeking a dynamic AGM in Real Estate Sales to join our senior management team in Gurgaon. This full-time position is ideal for individuals with a rich experience that ranges from 4 to 7 years in the real estate domain. The successful candidate will be entrusted with driving sales strategies and managing a team to achieve targeted sales goals in the commercial real estate sector.",
    qualifications: [
      "Extensive experience of 4 to 7 years in real estate sales is required to drive successful sales strategies and achieve business goals.",
      "Proven expertise in Residential & commercial real estate (Mandatory skill) to effectively manage and close high-value deals.",
      "Exceptional leadership skills to mentor and inspire a team of sales professionals towards achieving collective targets.",
      "Strong negotiation and closing skills to engage with high-profile clients and stakeholders effectively.",
      "Ability to analyze market trends and apply findings to sales strategies to capture emerging opportunities.",
      "Excellent communication and interpersonal skills to foster strong relationships with clients and partners.",
      "Proficient in conducting sales presentations and proposals to showcase unique value propositions to potential clients.",
      "Real estate sales expertise (Mandatory skill) to maintain an edge in an extremely competitive market sector.",
    ],
    responsibilities: [
      "Develop and implement strategic sales plans to achieve business objectives and expand market share within the residential & commercial real estate sector.",
      "Lead and manage the sales team, providing direction and support to achieve individual and team sales targets effectively.",
      "Foster and maintain relationships with key stakeholders to strengthen the position of the company in the real estate industry.",
      "Identify new business opportunities and develop relationships with potential clients to grow the client base.",
      "Analyze market dynamics, forecasting trends to optimize sales strategies and secure competitive advantages.",
      "Conduct thorough market research to identify client needs and develop tailored sales solutions accordingly.",
      "Ensure compliance with company policies and industry regulations while executing sales operations.",
      "Prepare and present sales reports to the senior management, providing insights into market performance and improvement areas.",
    ],
  },
  {
    id: 3,
    title: "Tele Caller Sales",
    department: "Sales",
    location: "Gurugram",
    type: "Full Time",
    experience: "0-6 months",
    bullet: "•",
    summary:
      "We are looking for a motivated Tele-caller - Real Estate Sales to join our team in Gurgaon. This full-time role is ideal for candidates with 0 to 6 months of experience in sales or customer interaction. The candidate will be responsible for connecting with potential clients, generating leads, and supporting the sales team in achieving business targets in the real estate sector.",
    qualifications: [
      "0 to 6 months of experience in tele-calling, sales, or customer support.",
      "Basic understanding of real estate (Residential/Commercial) is preferred.",
      "Strong communication and convincing skills to engage potential clients effectively.",
      "Ability to handle outbound and inbound calls professionally.",
      "Good interpersonal skills to build rapport with clients.",
      "Target-oriented mindset with the ability to work under pressure.",
      "Basic knowledge of MS Office/CRM tools for data management.",
      "Positive attitude and willingness to learn and grow in the real estate industry.",
    ],
    responsibilities: [
      "Make outbound calls to potential clients and generate leads for the sales team.",
      "Handle inbound inquiries and provide accurate information about projects.",
      "Understand client requirements and schedule site visits or meetings.",
      "Maintain and update client databases and call records regularly.",
      "Follow up with interested prospects to convert leads into site visits.",
      "Coordinate with the sales team to ensure smooth client handling.",
      "Achieve daily/weekly/monthly calling and lead generation targets.",
      "Maintain professional communication and represent the company effectively.",
    ],
  },
  {
    id: 2,
    title: "Sales Manager",
    department: "Sales",
    location: "Gurugram",
    type: "Full Time",
    experience: "2-4 years",
    bullet: "•",
    summary:
      "We are seeking a results-driven Sales Manager – Real Estate to join our team in Gurgaon. This full-time role is ideal for candidates with 2 to 4 years of experience in real estate sales. The candidate will be responsible for driving sales performance, managing a team, and achieving revenue targets in the residential and commercial real estate segment.",
    qualifications: [
      "2 to 4 years of experience in real estate sales is required.",
      "Strong knowledge of residential & commercial real estate (Mandatory skill).",
      "Proven ability to handle end-to-end sales and close deals.",
      "Team handling experience with strong leadership and motivational skills.",
      "Excellent communication, negotiation, and interpersonal skills.",
      "Ability to understand client requirements and offer suitable solutions.",
      "Target-driven mindset with a strong focus on revenue generation.",
      "Basic knowledge of CRM tools and sales reporting.",
    ],
    responsibilities: [
      "Manage and drive sales for residential & commercial real estate projects.",
      "Lead, mentor, and monitor the performance of the sales team.",
      "Generate leads through various channels and ensure timely follow-ups.",
      "Conduct client meetings, site visits, and close deals effectively.",
      "Develop and implement sales strategies to achieve monthly targets.",
      "Build and maintain strong relationships with clients and channel partners.",
      "Track market trends and competitor activities to identify opportunities.",
      "Prepare sales reports and share regular updates with management.",
      "Ensure smooth coordination between clients and internal teams.",
    ],
  },
];

/** Live "Departments" filter list (counts as printed on live). */
export const departments = [
  { label: "All Openings", filter: null, count: jobListings.length },
  { label: "Admin", filter: "Admin", count: 0 },
  { label: "Sales", filter: "Sales", count: jobListings.filter((j) => j.department === "Sales").length },
  { label: "Marketing", filter: "Marketing", count: 0 },
];

/** Live "Redefining Work Culture" `.talent-card`s. */
export const cultureHighlights = [
  {
    icon: "fas fa-users",
    title: "Dynamic Culture",
    description: "Collaborative environment that values innovation and initiative.",
  },
  {
    icon: "fas fa-gem",
    title: "Luxury Exposure",
    description: "Work on high-value projects with HNIs, NRIs, and global investors.",
  },
  {
    icon: "fas fa-trophy",
    title: "Recognition",
    description: "Competitive compensation, performance incentives, and awards.",
  },
  {
    icon: "fas fa-graduation-cap",
    title: "Growth & Learning",
    description: "Ongoing mentorship and market insights to sharpen your edge.",
  },
];

/** Live "Life at Elite Pro Infra" `.gallery-item`s (self-hosted copies of its Unsplash photos). */
export const careerGallery = [
  { image: "/images/bg/career-strategy-meet.jpg", caption: "Annual Strategy Meet" },
  { image: "/images/bg/life-culture.jpg", caption: "Collaborative Workspace" },
  { image: "/images/bg/sales-team.jpg", caption: "Awards & Recognition" },
];

/** Live apply-modal "Why work with us" points. */
export const applyPoints = [
  { icon: "fas fa-star", text: "Premium projects with HNIs & investors" },
  { icon: "fas fa-users", text: "Collaborative culture & mentorship" },
  { icon: "fas fa-chart-line", text: "Growth-focused performance rewards" },
  { icon: "fas fa-shield-alt", text: "Transparent process & quick updates" },
];

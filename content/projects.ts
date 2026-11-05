// The projects page is generated from this list. Newest first.
//
// To add a screenshot: drop the file in /public/projects/ and set
//   image: { src: "/projects/thing.png", alt: "what it shows" }

export type Project = {
  title: string;
  when: string;
  description: string;
  stack: string[];
  github?: string;
  live?: string;
  image?: { src: string; alt: string };
};

export const projects: Project[] = [
  {
    title: "Video Looper",
    when: "2025 – now",
    description:
      "A web app for looping sections of videos. Custom player with keyboard controls and timeline scrubbing, media on S3 and CloudFront, sign-in with Supabase.",
    stack: ["React", "Tailwind", "Express", "AWS", "Supabase"],
    live: "https://videolooper.io",
  },
  {
    title: "Cost of Living Explorer",
    when: "2025",
    description:
      "Scrapes rent and price data from public listings and lets you compare cities side by side, through a REST API and a React front end.",
    stack: ["Python", "Flask", "React", "PostgreSQL"],
    github: "https://github.com/fredguevs/cost-of-living",
  },
  {
    title: "Journaling & habit tracker",
    when: "2025",
    description:
      "My senior capstone at Michigan, in a team of four. We ran usability tests with 20+ people and went through three prototypes.",
    stack: ["React", "Flask", "MySQL"],
  },
  {
    title: "Asteroids",
    when: "2024",
    description: "Asteroids in the browser, in plain JavaScript.",
    stack: ["JavaScript"],
    github: "https://github.com/fredguevs/asteroids-web-game",
  },
];

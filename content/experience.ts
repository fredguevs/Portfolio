// The experience page is generated from this. Newest first.

export type Job = {
  company: string;
  href?: string;
  role: string;
  when: string;
  where: string;
  // A paragraph or two about the job, in plain words. The resume has the bullet points.
  about: string[];
  // A picture shown under the entry. Only the conveyor exists so far.
  illustration?: "conveyor";
};

export const jobs: Job[] = [
  {
    company: "KNAPP",
    href: "https://www.knapp.com",
    role: "Software Engineer",
    when: "Mar 2026 – now",
    where: "Kennesaw, GA",
    about: [
      "KNAPP builds automated warehouses, and I work on the software that keeps them running: distributed C++ applications, Oracle databases, and Linux systems behind some very busy operations. A lot of my job is figuring out what went wrong. When something breaks in production, I follow it through the logs, the database, and the code until I find the root cause and get things moving again.",
      "I also write Python and Bash tools to automate troubleshooting workflows, and I spend a lot of time in large codebases and workflow engines, working out how they behave, validating fixes, and supporting deployments. I work closely with controls engineers and customer teams to resolve integration issues across the system.",
      "Most recently, I've been supporting Walmart's Next Generation Fulfillment center expansions, troubleshooting the distributed control components that route totes and cartons through those sites.",
    ],
    illustration: "conveyor",
  },
];

export const education = {
  school: "University of Michigan",
  degree: "B.S. Computer Science",
  when: "2021 – 2025",
  where: "Ann Arbor, MI",
};

export const skills: { label: string; items: string }[] = [
  { label: "Languages", items: "C++, C, Python, JavaScript/TypeScript, SQL, PL/SQL" },
  { label: "Frameworks", items: "React, Node.js, Express, Flask, Tailwind" },
  { label: "Data & cloud", items: "PostgreSQL, MySQL, Oracle, Supabase, AWS" },
  { label: "Tools", items: "Git, Linux, Azure DevOps" },
];

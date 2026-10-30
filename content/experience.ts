// The experience page is generated from this. Newest first.

export type Job = {
  company: string;
  href?: string;
  role: string;
  when: string;
  where: string;
  points: string[];
  // A picture shown under the entry. Only the conveyor exists so far.
  illustration?: "conveyor";
};

export const jobs: Job[] = [
  {
    company: "KNAPP",
    href: "https://www.knapp.com",
    role: "Software Systems Engineer I",
    when: "Mar 2026 – now",
    where: "Kennesaw, GA",
    points: [
      "Write and debug C++ application logic and XML-based Logistix workflows for warehouse control systems.",
      "Track down production failures through Linux logs and traces, Oracle SQL and the C++ code.",
      "Manage 500+ integration test cases, configuration changes and defects in Azure DevOps.",
      "Supported Walmart's NGL warehouse expansion, troubleshooting distributed warehouse control components.",
      "Built Bash, Python and Oracle SQL scripts for automated test workloads and performance diagnostics.",
      "Ran high-volume tests at 700+ totes and 1,400+ carton-routing messages an hour.",
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

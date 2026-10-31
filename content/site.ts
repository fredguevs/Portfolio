import type { IconName } from "@/components/Icon";

// Everything about "me" that shows up in more than one place lives here.

export const site = {
  name: "Frederick Guevara",
  description: "Frederick Guevara's personal site.",
};

export type ElsewhereLink = {
  label: string;
  href: string;
  display: string;
  icon: IconName;
};

export const elsewhere: ElsewhereLink[] = [
  { label: "Email", href: "mailto:fredguevs@gmail.com", display: "fredguevs@gmail.com", icon: "envelope" },
  { label: "GitHub", href: "https://github.com/fredguevs", display: "github.com/fredguevs", icon: "globe" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/fredguevs",
    display: "linkedin.com/in/fredguevs",
    icon: "globe",
  },
];

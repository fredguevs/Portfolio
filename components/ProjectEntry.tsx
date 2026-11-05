import type { Project } from "@/content/projects";

export function ProjectEntry({ project }: { project: Project }) {
  const { title, when, description, stack, github, live, image } = project;
  const domain = live ? new URL(live).hostname : null;

  return (
    <li>
      {image ? (
        // Plain <img>: the site is a static export, and these are small.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image.src} alt={image.alt} loading="lazy" className="mb-4 w-full" />
      ) : null}
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h2 className="font-pixel text-[1.375rem]">
          {title}
          {domain ? (
            <>
              {" – "}
              <a href={live}>{domain}</a>
            </>
          ) : null}
        </h2>
        <span className="text-[0.875rem] text-muted">{when}</span>
      </div>
      <p className="mt-2">{description}</p>
      <p className="mt-2 text-[0.875rem] text-muted">
        {stack.join(" · ")}
        {github ? (
          <>
            {" — "}
            <a href={github}>code</a>
          </>
        ) : null}
        {live ? (
          <>
            {" — "}
            <a href={live}>try it</a>
          </>
        ) : null}
      </p>
    </li>
  );
}

import type { TimelineEntry } from "../types/portfolio";

export const timeline = [
  {
    year: "2018",
    title: "First line of code",
    short: "Python, curiosity, and a family laptop that almost didn't survive.",
    detail:
      "Started with Python tutorials at 16. Built a script to batch-download anime episodes. Realized computers would do exactly what you told them — no more, no less. Broke the family laptop running an infinite loop. No regrets.",
  },
  {
    year: "2020",
    title: "First freelance project",
    short: "Built a local business website for ₹3,000. It shipped.",
    detail:
      "Designed and built a static site for a local textile shop using HTML, CSS, and a bit of jQuery. Delivered it in two weeks. That ₹3,000 felt more real than any exam score — it was proof that the work had value beyond grades.",
  },
  {
    year: "2021",
    title: "Manufacturing Scheduling System",
    short: "First real engineering project — messy, overbuilt, and formative.",
    detail:
      "Built a production scheduling tool for a small factory over summer break. It was overengineered and under-documented. But it ran in production for 8 months and taught me more than any course about what software in the real world actually means.",
  },
  {
    year: "2022",
    title: "Healthcare Internship",
    short: "Backend engineering at a Bangalore healthtech startup.",
    detail:
      "Joined as a backend intern. Built data pipelines, learned API design under production constraints, and discovered what engineering culture actually looks like — standups, oncall, postmortems, and technical disagreements handled with grace.",
  },
  {
    year: "2023 – now",
    title: "Backend Engineering Journey",
    short: "Systems, scale, and building things that matter.",
    detail:
      "Studying CS formally while working on real engineering problems. Deep focus on distributed systems, API design, and the intersection of good engineering and good product thinking. Interested in teams building at the frontier of what's technically possible.",
  },
] satisfies readonly TimelineEntry[];

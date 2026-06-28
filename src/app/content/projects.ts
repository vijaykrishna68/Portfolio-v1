import type { JournalArticle, PlaygroundItem, Project, TimelineEntry } from "../types/portfolio";

export const projects = [
  {
    num: "01",
    title: "Manufacturing Intelligence Platform",
    year: "2021 – 2022",
    description:
      "A real-time production scheduling system that replaced manual Excel-based workflows across three factory floors. Processes 50,000+ scheduling events daily with sub-100ms response times.",
    challenge:
      "Modeling complex constraint satisfaction — machines with maintenance windows, operators with shift constraints, materials with lead times — into a scheduling algorithm production managers could actually trust.",
    stack: ["Go", "PostgreSQL", "Redis", "gRPC", "React"],
    impact: "73% reduction in scheduling conflicts. 14 hours/week of manual replanning eliminated.",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1400&h=900&fit=crop&auto=format&q=80",
    imageAlt: "Software engineer working on industrial scheduling system",
    flip: false,
  },
  {
    num: "02",
    title: "Clinical Data Pipeline",
    year: "2022 – 2023",
    description:
      "HIPAA-compliant ingestion pipeline for a healthtech startup, aggregating patient vitals from 12 IoT device types into a unified API consumed by clinicians and ML models in real time.",
    challenge:
      "Event sourcing architecture that supports historical replay for model training while maintaining the strict audit trail required for FDA compliance — without sacrificing real-time latency.",
    stack: ["Python", "FastAPI", "Apache Kafka", "TimescaleDB", "Docker"],
    impact: "Data latency dropped from 45 minutes to under 8 seconds for 1,200 daily active patients.",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1400&h=900&fit=crop&auto=format&q=80",
    imageAlt: "Healthcare technology interface showing patient data",
    flip: true,
  },
  {
    num: "03",
    title: "Multi-Tenant API Gateway",
    year: "2023 – Present",
    description:
      "API gateway for a B2B SaaS platform handling authentication, rate limiting, request routing, and deep observability across 200+ customer integrations.",
    challenge:
      "A fair rate limiting system across customers with wildly different traffic patterns — without adding more than 5ms to the hot path. Solved with a sliding-window counter in Redis with per-customer burst budgets.",
    stack: ["Rust", "Redis", "Nginx", "Prometheus", "Grafana"],
    impact: "12M requests/day, 99.97% uptime, 4.2ms median gateway overhead.",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1400&h=900&fit=crop&auto=format&q=80",
    imageAlt: "Server infrastructure and networking equipment in a data center",
    flip: false,
  },
] satisfies readonly Project[];

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

export const journal = [
  {
    id: 1,
    title: "The Hidden Cost of React Context",
    excerpt:
      "Context is a great concept but a frequent performance trap. Here's why it re-renders more than you expect, and what to reach for when your component tree grows.",
    date: "Jun 12, 2025",
    readTime: "8 min",
    tag: "Frontend",
    featured: true,
  },
  {
    id: 2,
    title: "Understanding B-Trees From First Principles",
    excerpt: "Why databases use B-Trees for indexes, starting from binary search trees and building up to why they win at disk I/O.",
    date: "May 3, 2025",
    readTime: "12 min",
    tag: "Databases",
    featured: false,
  },
  {
    id: 3,
    title: "Designing Better APIs",
    excerpt: "Predictable naming, consistent errors, and the principle of least surprise — what separates a good API from a painful one.",
    date: "Apr 19, 2025",
    readTime: "6 min",
    tag: "Architecture",
    featured: false,
  },
  {
    id: 4,
    title: "Why HashMaps Feel Magical",
    excerpt: "From hash functions to collision resolution — a peek under the hood of one of computing's most elegant structures.",
    date: "Mar 7, 2025",
    readTime: "7 min",
    tag: "CS Fundamentals",
    featured: false,
  },
] satisfies readonly JournalArticle[];

export const playground = [
  {
    id: 1,
    title: "Sorting Algorithm Visualizer",
    tag: "Visualization",
    desc: "Watch bubble sort, quicksort, and merge sort compete in real-time.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=700&fit=crop&auto=format&q=80",
    gridClass: "col-start-1 col-span-2 row-start-1 row-span-2",
    mobileClass: "col-span-2 row-span-2",
  },
  {
    id: 2,
    title: "Browser Terminal",
    tag: "Prototype",
    desc: "A fully functional terminal emulator in a browser tab.",
    image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&h=500&fit=crop&auto=format&q=80",
    gridClass: "col-start-3 col-span-1 row-start-1 row-span-1",
    mobileClass: "col-span-1 row-span-1",
  },
  {
    id: 3,
    title: "Graph Explorer",
    tag: "Algorithm",
    desc: "Interactive BFS and DFS on user-defined graphs.",
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&h=500&fit=crop&auto=format&q=80",
    gridClass: "col-start-4 col-span-1 row-start-1 row-span-1",
    mobileClass: "col-span-1 row-span-1",
  },
  {
    id: 4,
    title: "DNS Resolution Explainer",
    tag: "Explainer",
    desc: "Step-by-step walkthrough of how a DNS query resolves across the internet.",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=900&h=450&fit=crop&auto=format&q=80",
    gridClass: "col-start-3 col-span-2 row-start-2 row-span-1",
    mobileClass: "col-span-2 row-span-1",
  },
] satisfies readonly PlaygroundItem[];
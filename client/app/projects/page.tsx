import Image from "next/image";
import { PageIntro } from "@/components/page-intro";

export const metadata = { title: "Projects" };

const projects = [
  {
    number: "01",
    title: "TikTok Content Automation",
    type: "Content workflow",
    image: "/assets/projects/tiktok-content-automation.png",
    description: "An automated workflow for turning content ideas into a consistent short-form publishing pipeline, reducing repetitive production and scheduling work.",
    role: "I designed the automation flow, connected the content stages, and organized the process for repeatable publishing.",
    outcome: "A reusable system that makes content production more consistent and easier to manage.",
    tools: ["Automation", "AI content", "Workflow design"],
  },
  {
    number: "02",
    title: "Sales Lead Generation System",
    type: "Business automation",
    image: "/assets/projects/sales-lead-generation.png",
    description: "A lead-generation workflow created to discover, organize, and qualify potential customers before outreach.",
    role: "I mapped the prospecting process and built the logic for collecting, filtering, and prioritizing useful lead information.",
    outcome: "A clearer sales pipeline that reduces manual research and helps focus attention on stronger opportunities.",
    tools: ["Lead research", "Data enrichment", "Process automation"],
  },
  {
    number: "03",
    title: "Custom AI Chatbot for Websites",
    type: "AI implementation",
    image: "/assets/projects/website-ai-chatbot.png",
    description: "A customizable website assistant designed to answer visitor questions using a business's own information and support content.",
    role: "I shaped the conversation flow, knowledge structure, and website experience around practical customer questions.",
    outcome: "An always-available support experience that helps visitors find answers and connect with the business faster.",
    tools: ["AI chatbot", "Knowledge base", "Web integration"],
  },
];

export default function ProjectsPage() {
  return (
    <main>
      <PageIntro eyebrow="Selected work" title="Automation built around real business needs." description="Three projects exploring how AI, structured workflows, and thoughtful implementation can save time and improve digital experiences." />
      <section className="card-grid">
        {projects.map((project) => (
          <article className="project-card" key={project.number}>
            <div className="project-card__visual">
              <Image src={project.image} alt={`${project.title} project illustration`} fill sizes="(max-width: 820px) 100vw, 33vw" />
              <span>{project.number}</span>
            </div>
            <p className="eyebrow">{project.type}</p>
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            <dl className="project-card__details">
              <div><dt>My role</dt><dd>{project.role}</dd></div>
              <div><dt>Outcome</dt><dd>{project.outcome}</dd></div>
            </dl>
            <ul className="tag-list" aria-label={`${project.title} tools`}>
              {project.tools.map((tool) => <li key={tool}>{tool}</li>)}
            </ul>
          </article>
        ))}
      </section>
    </main>
  );
}

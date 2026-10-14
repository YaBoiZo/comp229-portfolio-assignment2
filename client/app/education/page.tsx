import { PageIntro } from "@/components/page-intro";

export const metadata = { title: "Education" };

export default function EducationPage() {
  return (
    <main>
      <PageIntro eyebrow="Education" title="Business experience, strengthened by software and AI." description="My education combines a practical business foundation with current studies in software engineering and artificial intelligence." />
      <section className="timeline">
        <article>
          <span>July 2025 — 2028</span>
          <div>
            <p className="timeline__status">In progress</p>
            <h2>Artificial Intelligence – Software Engineering Technology</h2>
            <p>Centennial College</p>
            <p>Developing practical skills in software development, web technologies, artificial intelligence, and building technology solutions for real-world needs.</p>
          </div>
        </article>
        <article>
          <span>February — October 2022</span>
          <div>
            <p className="timeline__status">Completed · 95% average</p>
            <h2>Business Management Diploma</h2>
            <p>Oxford College of Arts, Business and Technology</p>
            <p>Studied human resources, marketing, business law, small-business management, planning, bookkeeping, financial accounting, Microsoft Excel, QuickBooks, and Microsoft Access.</p>
          </div>
        </article>
      </section>
    </main>
  );
}

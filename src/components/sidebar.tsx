import { FileText, Mail } from "lucide-react";

import { cvUrl, email, social } from "@/lib/config";
import { useScrollSpy } from "@/lib/use-scroll-spy";
import "@/styles/sidebar.css";

const sections = [
  { id: "blogs", label: "Writing" },
  { id: "experience", label: "Experience" },
  { id: "opensource", label: "Open source" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Work" },
  { id: "contact", label: "Contact" },
];

const SECTION_IDS = sections.map((section) => section.id);

export const Sidebar = () => {
  const active = useScrollSpy(SECTION_IDS);

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-intro">
          <h1 className="sidebar-name">
            Avisek
            <br />
            <em>Ray</em>
          </h1>
          <p className="sidebar-role">
            Software Engineer
            <br />
            EnhanceAI Art
          </p>
          <p className="sidebar-tagline">
            Database, backend design and frontend engineering.
          </p>
        </div>

        <nav aria-label="Sections" className="sidebar-nav">
          <ul>
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={active === section.id ? "location" : undefined}
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="sidebar-bottom">
        <ul className="sidebar-links">
          <li>
            <a
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sidebar-link sidebar-link-primary"
            >
              <FileText className="sidebar-icon" />
              Resume
            </a>
          </li>
          {social.map(({ label, href, icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="sidebar-link"
              >
                <img
                  src={icon}
                  alt=""
                  width={16}
                  height={16}
                  className="sidebar-icon"
                />
                {label}
              </a>
            </li>
          ))}
        </ul>
        <a href={`mailto:${email}`} className="sidebar-email">
          <Mail className="sidebar-icon" />
          {email}
        </a>
      </div>
    </aside>
  );
};

"use client";

import { ProjectDetailView, ProjectDetailViewProps } from "@/components/ui/project-detail-view";

const projectData: ProjectDetailViewProps = {
  breadcrumbs: [
    { label: "Client Projects", href: "#" },
    { label: "Website Redesign for Client X", href: "#" },
  ],
  title: "Website Redesign for Client X",
  status: "In Progress",
  assignees: [
    { name: "Achmad Hakim", avatarUrl: "https://i.pravatar.cc/150?u=achmad" },
    { name: "Samantha Emanuel", avatarUrl: "https://i.pravatar.cc/150?u=samantha" },
  ],
  dateRange: { start: "June 3, 2025", end: "June 28, 2025" },
  tags: [
    { label: "Design", variant: "destructive" },
    { label: "Client Work", variant: "secondary" },
  ],
  description:
    "This comprehensive project focuses on delivering a complete website redesign solution for Client X that transforms their digital presence into a modern, high-performing platform. The initiative encompasses extensive user research, competitive analysis, and stakeholder interviews to establish clear objectives and success metrics. Our multidisciplinary team will execute a phased approach starting with discovery and strategy, moving through conceptual design and iterative prototyping, culminating in a polished final deliverable. Key priorities include improving site navigation, optimizing mobile responsiveness, enhancing visual hierarchy, and implementing a scalable design system. The redesign aims to increase user engagement, reduce bounce rates, and drive higher conversion rates while maintaining brand consistency across all touchpoints. Regular client checkpoints ensure alignment with business goals throughout the development lifecycle.",
  attachments: [
    { name: "ClientX_UI_Redesign.pdf", size: "4.8 Mb", type: "pdf" },
    { name: "Homepage_Mockup.fig", size: "12.4 Mb", type: "figma" },
    { name: "Design_System_Guidelines.pdf", size: "8.2 Mb", type: "pdf" },
    { name: "User_Research_Findings.pdf", size: "6.5 Mb", type: "pdf" },
  ],
  subTasks: [
    { id: 1, task: "Schedule initial client meeting", category: "Discovery", status: "Completed", dueDate: "June 3, 2025" },
    { id: 2, task: "Gather business goals and user needs", category: "Discovery", status: "Completed", dueDate: "June 4, 2025" },
    { id: 3, task: "Review current website performance", category: "Discovery", status: "In Progress", dueDate: "June 5, 2025" },
    { id: 4, task: "Create low-fidelity wireframes", category: "Design", status: "In Progress", dueDate: "June 10, 2025" },
    { id: 5, task: "Design system & component library", category: "Design", status: "Pending", dueDate: "June 15, 2025" },
    { id: 6, task: "High-fidelity prototype & client review", category: "Delivery", status: "Pending", dueDate: "June 28, 2025" },
    { id: 7, task: "Conduct user testing sessions", category: "Research", status: "Pending", dueDate: "June 12, 2025" },
    { id: 8, task: "Develop mobile responsive layouts", category: "Design", status: "Pending", dueDate: "June 18, 2025" },
    { id: 9, task: "Create animation & interaction specs", category: "Design", status: "Pending", dueDate: "June 20, 2025" },
    { id: 10, task: "Prepare developer handoff documentation", category: "Delivery", status: "Pending", dueDate: "June 25, 2025" },
    { id: 11, task: "Final QA and design polish", category: "Delivery", status: "Pending", dueDate: "June 27, 2025" },
    { id: 12, task: "Project presentation and sign-off", category: "Delivery", status: "Pending", dueDate: "June 30, 2025" },
  ],
};

export default function TaskPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#000000", padding: "40px 48px", fontFamily: "var(--font-primary), var(--font-secondary), system-ui, sans-serif" }}>
      {/* Component - full width and height */}
      <div style={{ width: "100%", maxWidth: "100%" }}>
        <ProjectDetailView {...projectData} />
      </div>
    </div>
  );
}

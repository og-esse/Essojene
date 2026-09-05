import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-experience-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './experince.component.html',
  styleUrl: './experince.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class ExperienceSectionComponent {
  experiences = [
    {
      role: 'Senior Software Engineer – Investments Mega Journey',
      company: 'Royal Bank of Canada',
      duration: 'January 2026 – Present',
      description: [
        'Lead backend and platform development for the Investments Mega Journey, designing Java/Spring Boot REST APIs with contract-first request/response schemas for RRSP/TFSA tax-savings calculations and returning-user state determination.',
        "Built an enterprise middleware/orchestration layer that adapts and transforms internal tax-projection requests into a third-party calculation engine's request format, then maps responses back into internal DTOs and MongoDB documents, bridging protocol and data-model gaps between internal and external systems.",
        'Implemented resilience patterns for downstream service calls, including retry with exponential backoff for transient database timeouts and centralized exception handling to keep the service stable under partial failures.',
        'Secured all endpoints with OAuth2 resource-server/JWT authentication and externalized secrets via HashiCorp Vault, meeting bank-grade security and governance standards.',
        'Maintained an 80% JaCoCo test-coverage threshold across services using Mockito unit tests and WireMock-backed integration tests to validate downstream service behavior.',
        'Engineered Splunk dashboards with AI-driven anomaly detection to automate application health monitoring, reducing manual triaging by 60%.',
        'Accelerated delivery timelines by 30 days by integrating generative AI into development workflows, including code generation, automated testing, and developer tooling.',
        'Mentored engineers on API design and secure coding practices, reducing the recurrence of code-level bugs.',
      ],
      stack: [
        'Java',
        'Spring Boot',
        'REST APIs',
        'OAuth2/JWT',
        'MongoDB',
        'Mockito',
        'WireMock',
        'JaCoCo',
        'HashiCorp Vault',
        'Splunk',
        'AI/ML',
      ],
    },

    {
      role: 'Frontend Developer – Investments Mobile',
      company: 'Royal Bank of Canada',
      duration: 'July 2025 – December 2025',
      description: [
        'Led the modernization of the Investments Mobile Menu, replacing fragile legacy screens with a scalable Angular 20 solution with advisor-aware logic.',
        'Refactored legacy overrides to resolve long-standing UI stability issues, significantly reducing regression bugs in the Investments vertical.',
        'Drove the Angular 19 → 20 upgrade and build pipeline optimization—reducing build times and eliminating deployment bottlenecks.',
        'Partnered with backend teams to implement shared GraphQL patterns, unlocking future features and reducing duplicate network calls.',
        'Worked across frontend and API integration layers to align client state, request contracts, and backend response models.',
      ],
      stack: ['Angular', 'TypeScript', 'NX', 'GraphQL', 'CI/CD'],
    },
    {
      role: 'Frontend Developer – RIG Design System',
      company: 'Royal Bank of Canada',
      duration: 'Feb 2025 – July 2025',
      description: [
        'Developed accessible, reusable UI components (Angular + React) for 7,000+ enterprise developers.',
        'Enhanced component performance using Lighthouse and WCAG audits to ensure compliance with internal risk policies.',
        'Led onboarding via Storybook and refined cross-team coding standards for security and maintainability.',
      ],
      stack: ['Angular', 'React', 'Storybook', 'TypeScript', 'WCAG 2.1'],
    },
    {
      role: 'Frontend Developer – Home Equity Tools',
      company: 'Royal Bank of Canada',
      duration: 'July 2023 – Feb 2025',
      description: [
        'Developed RBC’s mortgage renewal app (React/Node.js), increasing conversion by 40%.',
        'Reduced load time by 30% using code-splitting, caching, and lazy loading to prevent service degradation.',
        'Integrated GraphQL to eliminate over-fetching and improve data reliability.',
      ],
      stack: ['React', 'Node.js', 'GraphQL', 'Jest', 'Cypress', 'Lighthouse'],
    },
    {
      role: 'Automations Analyst',
      company: 'Royal Bank of Canada',
      duration: 'May 2022 – Aug 2022',
      description: [
        'Developed complex automation workflows using Blue Prism, REST APIs, and SQL, successfully automating high-volume Foreign Cash Services tasks and reducing processing time by 80%.',
        'Produced weekly operational and risk reports for leadership, tracking automation health, failures, and remediation status.',
        'Built end-to-end regression testing pipelines with Python and Selenium to streamline QA processes.',
      ],
      stack: ['Python', 'SQL', 'Blue Prism', 'REST APIs', 'Jenkins'],
    },
    {
      role: 'Technical Systems Analyst',
      company: 'Royal Bank of Canada',
      duration: 'May 2021 – Aug 2021',
      description: [
        'Served as frontline triage for enterprise video-conferencing incidents (Webex), resolving an average of 12 user-impacting issues per day.',
        'Acted as the focal point for technical troubleshooting, communicating status updates to business users and escalating critical system failures.',
        'Conducted security audits and penetration testing to identify vulnerabilities in internal apps.',
      ],
      stack: [
        'Incident Response',
        'Triage',
        'Angular',
        'Firebase',
        'Security Audits',
      ],
    },
    {
      role: 'Project Coordinator',
      company: 'Wilfrid Laurier University',
      duration: 'September 2021 – June 2023',
      description: [
        'Managed internal dev teams building software tools for campus operations.',
        'Presented demos and insights to academic and operational stakeholders.',
      ],
      stack: ['Jira', 'Trello', 'HTML', 'CSS', 'JavaScript'],
    },
    {
      role: 'Web Engineer Intern',
      company: 'Evrlinx',
      duration: 'May 2020 – Aug 2020',
      description: [
        'Supported Angular frontend development and TypeScript refactors.',
      ],
      stack: ['Angular', 'TypeScript', 'HTML', 'CSS'],
    },
  ];
}

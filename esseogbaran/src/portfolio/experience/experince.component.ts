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
        'Lead front-end and platform development for the Investments Mega Journey, delivering Angular and React customer journeys and Java/Spring Boot REST APIs for business-critical investment experiences.',
        'Co-led backend and platform development, designing and deploying contract-first Java/Spring Boot REST APIs for RRSP/TFSA tax-savings calculations and returning-user state determination.',
        'Migrated the mutual fund web application to the Prism theme and standardized styling across multiple applications using CSS variables and RIG SCSS helpers, improving visual consistency and maintainability.',
        'Enabled light and dark mode across the entire Investments Mega Journey on web and mobile, improving visual consistency, accessibility, and user experience across investment flows.',
        'Led Angular, Nx, and RIG design-system upgrades, aligning investment applications with current platform standards and reducing end-of-life framework risk.',
        'Built front-end flows and an enterprise middleware/orchestration layer for a tax-savings calculator, adapting internal tax-projection requests into a third-party calculation engine format and mapping responses back into internal DTOs and MongoDB document models.',
        'Identified, troubleshot, and resolved application defects across UI and service layers, implementing retry policies with exponential backoff, centralized error handling, and clear failure states for customer-facing journeys.',
        'Designed asynchronous Kafka/ESS event publishers across eligibility and investment-document services for account selection, discovery, consent, and client review, keeping event publishing off the critical path of client-facing flows.',
        'Implemented 15+ Google Analytics and ESS events across questionnaire, recommendation, and onboarding journeys, connecting UI interactions with backend events to give stakeholders consistent funnel visibility.',
        'Secured endpoints with OAuth2/JWT and implemented HashiCorp Vault secrets management across embedded-advice, eligibility, and document services; upgraded dependencies to address known vulnerabilities.',
        'Improved screen-reader labels, ARIA semantics, and focus management across investment journeys, including iOS and Android benefits-drawer focus and swipe behaviour.',
        'Refactored the Investment Menu into a modular Angular architecture with reusable questionnaire, recommendation-results, and shared component libraries, reducing duplication across squads and helping subsequent features ship in days rather than weeks.',
        'Expanded automated coverage for assisted discovery, benefits/onboarding, and webhook event handling with Jest, Cypress, Mockito, WireMock, and JaCoCo; resolved returning-user state and analytics-tagging defects and removed unreliable timer-based behaviour.',
        'Built Splunk dashboards and monitoring views to improve observability, production support, and prioritised defect investigation, reducing manual triaging by 60%.',
        'Accelerated delivery timelines by 30 days by applying AI-assisted development workflows for code generation, automated testing, documentation support, and developer tooling.',
        'Mentor engineers through code reviews and team discussions on front-end implementation patterns, API design, accessibility, secure coding, and root-cause analysis.',
      ],
      stack: [
        'Angular',
        'React',
        'TypeScript',
        'HTML',
        'SCSS',
        'CSS Variables',
        'Nx',
        'RIG Design System',
        'Prism',
        'Spring Boot',
        'Java',
        'MongoDB',
        'Kafka',
        'Google Analytics',
        'HashiCorp Vault',
        'SQL',
        'GitHub Actions',
        'Splunk',
        'Python',
        'GraphQL',
        'Storybook',
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

import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-experience-section',
  standalone: true,
  imports: [CommonModule],
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
        'Acting as the primary technical lead for production incidents; engineered custom Splunk dashboards with AI-driven anomaly detection to monitor application health and preemptively resolve issues.',
        'Built automation guardrails that reduced average triage time by 20%, accelerating root cause analysis and saving engineering hours.',
        'Architecting a scalable Angular 20 + NGRX platform with resilient state management, accessible UI foundations, and future-proofed module boundaries.',
        'Orchestrating technical retrospectives for the engineering team, identifying technology gaps and implementing preventative fixes to harden the application against failure.',
        'Spearheading performance uplift efforts—reducing bundle size, optimizing change detection, and implementing shared data patterns that improve app responsiveness.',
        'Mentoring developers across multiple RBC journeys on secure coding practices, vulnerability remediation, and root cause analysis.',
      ],
      stack: [
        'Angular',
        'TypeScript',
        'Splunk',
        'Python',
        'NGRX',
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

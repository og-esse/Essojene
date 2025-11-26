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
      role: 'Senior Frontend Developer – Investments Mega Journey',
      company: 'Royal Bank of Canada',
      duration: 'January 2026 – Present',
      description: [
        'Operating as the primary frontend owner for RBC’s Investments Mega Journey, independently leading feature delivery, technical decisions, and modernization initiatives across multiple product streams.',
        'Architecting a scalable Angular 20 + NGRX platform with resilient state management, accessible UI foundations, and future-proofed module boundaries for long-term growth.',
        'Collaborating closely with designers, product managers, and backend teams to translate complex financial logic into intuitive, user-centric experiences used by small business employees across Canada.',
        'Spearheading performance uplift efforts—reducing bundle size, optimizing change detection, and implementing shared data/query patterns that cut redundant network calls and improve app responsiveness.',
        'Establishing and enforcing modernization guardrails by removing legacy anti-patterns, standardizing workspace structure, and introducing clear component/data flow conventions adopted by partner teams.',
        'Leading technical discovery for new investment tools, breaking down ambiguous problems into actionable engineering plans and de-risking delivery through prototypes, RFCs, and spike investigations.',
        'Mentoring developers across multiple RBC journeys, reviewing complex PRs, and supporting engineers in adopting scalable frontend patterns, testing strategies, and accessibility best practices.',
      ],
      stack: [
        'Angular',
        'TypeScript',
        'RxJS',
        'NGRX',
        'GraphQL',
        'Storybook',
        'Jira',
      ],
    },

    {
      role: 'Frontend Developer – Investments Mega Journey',
      company: 'Royal Bank of Canada',
      duration: 'July 2025 – December 2025',
      description: [
        'Led the modernization of the Investments Mobile Menu, replacing fragile legacy screens with a fully accessible, scalable Angular 20 solution with advisor-aware logic and dynamic product pathways.',
        'Refactored and removed deprecated RIG and legacy overrides, resolving long-standing layout inconsistencies and improving UI stability across the entire Investments vertical.',
        'Drove the Angular 19 → 20 upgrade, NX workspace cleanup, and build pipeline optimization—reducing build times, eliminating regressions, and preparing the codebase for multi-team contribution.',
        'Partnered with design, product, and backend teams to achieve UX parity with Wealthsimple-class competitor flows and align RBC’s investments experience with modern expectations.',
        'Improved app performance, reduced bundle size, and implemented shared GraphQL patterns to unlock future features and reduce duplicate calls across journeys.',
        'Mentored junior developers and established repeatable patterns for component structure, data flow, and RIG alignment across mobile and web platforms.',
      ],
      stack: ['Angular', 'TypeScript', 'NX', 'RIG', 'GraphQL'],
    },
    {
      role: 'Frontend Developer – RIG Design System',
      company: 'Royal Bank of Canada',
      duration: 'Feb 2025 – July 2025',
      description: [
        'Developed accessible, reusable UI components (Angular + React) for 7,000+ enterprise developers.',
        'Enhanced component performance using Lighthouse and WCAG audits.',
        'Led onboarding via Storybook and contributed to Open Foundation Framework (OFF).',
        'Mentored contributors and refined cross-team standards.',
      ],
      stack: ['Angular', 'React', 'Storybook', 'FIGMA', 'TypeScript'],
    },
    {
      role: 'Frontend Developer – Home Equity Tools',
      company: 'Royal Bank of Canada',
      duration: 'July 2023 – Feb 2025',
      description: [
        'Developed RBC’s mortgage renewal app (React/Node.js), increasing conversion by 40%.',
        'Built advisor-facing onboarding tools and streamlined financial decision flows.',
        'Reduced load time by 30% using code-splitting, caching, and lazy loading.',
        'Integrated GraphQL to eliminate over-fetching and improve data reliability.',
      ],
      stack: ['React', 'Node.js', 'GraphQL', 'Jest', 'Cypress', 'Lighthouse'],
    },
    {
      role: 'Software Engineer Intern',
      company: 'Royal Bank of Canada',
      duration: 'May 2022 – Aug 2022',
      description: [
        'Optimized React/Next.js apps for 10,000+ concurrent users with caching and CDN delivery.',
        'Improved accessibility compliance using ARIA roles and Axe tools.',
      ],
      stack: ['React', 'Next.js', 'ARIA', 'Axe'],
    },
    {
      role: 'Automation Developer Intern',
      company: 'Royal Bank of Canada',
      duration: 'May 2022 – June 2022',
      description: [
        'Built end-to-end regression testing pipelines with Python and Selenium.',
        'Streamlined QA processes using GitHub Actions and Jenkins automation.',
      ],
      stack: ['Python', 'Selenium', 'Jenkins', 'GitHub Actions'],
    },
    {
      role: 'Software Engineer Intern',
      company: 'Royal Bank of Canada',
      duration: 'May 2021 – Aug 2021',
      description: [
        'Built Angular/Firebase apps and resolved memory leaks for performance uplift.',
        'Conducted security audits and penetration testing.',
      ],
      stack: ['Angular', 'TypeScript', 'Firebase'],
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

  education = [
    {
      school: 'Wilfrid Laurier University',
      degree: 'Bachelor of Computer Science, Honours',
      duration: 'Sept 2019 – June 2023',
      achievements: [
        'Cindy Colvin Women in Computer Science Scholarship',
        'Fashion Tech Hackathon: WINNER - Connected Community Challenge, Best Use of Virtual Fashion, Best Domain',
      ],
    },
    {
      school: 'University of Waterloo',
      program: 'Career Accelerator Program: Secure Coding',
      duration: 'Oct 2024 – Feb 2025',
      achievements: [
        'Developing secure coding techniques, applying SDLC principles with CodeQL, and engaging in real-world case studies to enhance cybersecurity skills.',
        'Participating in hands-on labs and industry projects while receiving career coaching to support professional growth.',
      ],
    },
  ];
}

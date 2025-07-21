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
      role: 'Frontend Engineer – Sponsor Portal',
      company: 'Royal Bank of Canada',
      duration: 'July 2025 – Present',
      description: [
        'Building Sponsor Portal, an investment tool helping employees of smaller companies access RBC-managed opportunities like RRSPs and group plans.',
        'Collaborating closely with clients and internal stakeholders to define UX and technical requirements.',
        'Driving feature ownership end-to-end from discovery to deployment, with an emphasis on scalability and user experience.',
        'Demonstrating leadership by proactively identifying technical debt and introducing process improvements across teams.',
      ],
      stack: ['Angular', 'TypeScript', 'RxJS', 'NGRX', 'Jira'],
    },
    {
      role: 'Frontend Developer – RIG Design System',
      company: 'Royal Bank of Canada',
      duration: 'Feb 2025 – July 2025',
      description: [
        'Developed and maintained reusable UI components in Angular and React for RBC’s design system, used by 7,000+ developers enterprise-wide.',
        'Enhanced accessibility and performance benchmarks using Lighthouse and WCAG guidelines.',
        'Led component library documentation and integration using Storybook and Open Foundation Framework (OFF).',
        'Mentored junior devs and shaped onboarding materials for new contributors to RIG.',
      ],
      stack: ['Angular', 'React', 'Storybook', 'FIGMA', 'TypeScript'],
    },
    {
      role: 'Frontend Developer – Home Equity Tools',
      company: 'Royal Bank of Canada',
      duration: 'July 2023 – Feb 2025',
      description: [
        'Built and enhanced RBC’s mortgage renewal tool (React/Node.js), leading to a 40% increase in conversion rates.',
        'Delivered a Mortgage Advisor Portal to help advisors initiate mortgage journeys for clients and streamline onboarding.',
        'Improved app performance by 30% through code-splitting, caching, and Lighthouse optimization.',
        'Led cross-team reviews and integrated GraphQL to reduce data over-fetching by 25%.',
        'Acted as team lead during release cycles and contributed to strategic product planning.',
      ],
      stack: ['React', 'Node.js', 'GraphQL', 'Jest', 'Cypress', 'Lighthouse'],
    },
    {
      role: 'Software Engineer Intern',
      company: 'Royal Bank of Canada',
      duration: 'May 2022 – Aug 2022',
      description: [
        'Optimized SPAs (React/Next.js) to support 10,000+ concurrent users.',
        'Improved API latency by 15% using caching strategies.',
        'Ensured accessibility compliance (WCAG 2.1 AA) with ARIA roles and Axe testing.',
      ],
      stack: ['React', 'Next.js', 'ARIA', 'Axe'],
    },
    {
      role: 'Automation Developer Intern',
      company: 'Royal Bank of Canada',
      duration: 'May 2022 – June 2022',
      description: [
        'Created regression test suites and automated pipelines using Python and Selenium.',
        'Improved QA throughput and coverage across agile sprint cycles.',
      ],
      stack: ['Python', 'Selenium', 'Jenkins', 'GitHub Actions'],
    },
    {
      role: 'Software Engineer Intern',
      company: 'Royal Bank of Canada',
      duration: 'May 2021 – Aug 2021',
      description: [
        'Developed Angular/TypeScript applications backed by Firebase.',
        'Improved runtime efficiency by resolving memory leaks.',
        'Conducted penetration testing and improved app security posture.',
      ],
      stack: ['Angular', 'TypeScript', 'Firebase'],
    },
    {
      role: 'Project Coordinator',
      company: 'Wilfrid Laurier University',
      duration: 'September 2021 – June 2023',
      description: [
        'Managed software development timelines and student developer teams.',
        'Led the design and delivery of internal web tools.',
        'Presented product demos and insights to stakeholders regularly.',
      ],
      stack: ['Jira', 'Trello', 'HTML', 'CSS', 'JavaScript'],
    },
    {
      role: 'Web Engineer Intern',
      company: 'Evrlinx',
      duration: 'May 2020 – Aug 2020',
      description: [
        'Assisted in frontend development using Angular and TypeScript.',
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
    },
  ];
}

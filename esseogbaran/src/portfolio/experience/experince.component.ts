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
      role: 'Senior Frontend Developer – Sponsor Portal',
      company: 'Royal Bank of Canada',
      duration: 'January 2026 – Present',
      description: [
        'Leading frontend development for RBC’s group investment tools serving small business employees.',
        'Driving scalable Angular/NGRX architecture with modern error handling and accessibility patterns.',
        'Refining performance and delivering upgrades for long-term platform growth.',
        'Mentoring engineers and ensuring team alignment with modernization practices.',
      ],
      stack: ['Angular', 'TypeScript', 'RxJS', 'NGRX', 'Jira'],
    },
    {
      role: 'Frontend Developer – Modernization Mega Project (MMP)',
      company: 'Royal Bank of Canada',
      duration: 'September 2025 – December 2025',
      description: [
        'Refactored legacy UI components and removed deprecated RIG overrides causing layout issues.',
        'Modernized the Investments Mobile Menu with advisor logic, icons, and full UX parity.',
        'Led Angular 19 to 20 upgrade, NX refactor, and RIG infrastructure enhancements.',
        'Improved build time, deploy speed, and scalability while eliminating regression risks.',
      ],
      stack: ['Angular', 'TypeScript', 'NX', 'RIG', 'GraphQL'],
    },

    {
      role: 'Frontend Developer – Investments Mega Journey',
      company: 'Royal Bank of Canada',
      duration: 'July 2025',
      description: [
        'Built reusable error-handling system for backup credentials with banners, inline messages, and a11y focus.',
        'Integrated OTP verification and masked inputs across profile-edit flows.',
        'Improved validation UX and state management using NGRX.',
        'Enhanced OTP flows with resend limits, error states, and validation refactor.',
        'Improved accessibility for multilingual users across EN/FR flows.',
        'Supported other squads through PR reviews and upstream validation improvements.',
      ],
      stack: ['Angular', 'TypeScript', 'NGRX', 'RxJS', 'WCAG', 'GraphQL'],
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

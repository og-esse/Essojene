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
      role: 'Frontend Software Engineer',
      company: 'Royal Bank of Canada',
      duration: 'July 2023 – Present',
      description: [
        'Built a mortgage renewal app (React/Node.js) improving conversion by 40%.',
        'Integrated GraphQL to reduce data over-fetching by 25%.',
        'Led cross-team API reviews for a reusable component library used by 7,000+ devs.',
        'Reduced page load time by 30% via code-splitting and caching.',
        'Mentored 3 junior engineers, merged 200+ PRs, increased test coverage to 90%+ with Jest/Cypress.',
      ],
      stack: ['React', 'Node.js', 'GraphQL', 'Jest', 'Cypress', 'Lighthouse'],
    },
    {
      role: 'Front-End Developer',
      company: 'RBC Digital',
      duration: 'Feb 2023 – Present',
      description: [
        'Built scalable UI components for RBC’s internal design system.',
        'Created reusable Angular/React components using Storybook.',
        'Optimized accessibility and Lighthouse performance.',
        'Collaborated with backend team using Kafka.',
        'Mentored junior devs and contributed to onboarding docs.',
      ],
      stack: ['Angular', 'React', 'Storybook', 'Kafka', 'TypeScript'],
    },
    {
      role: 'Software Engineer Intern',
      company: 'Royal Bank of Canada',
      duration: 'May 2022 – Aug 2022',
      description: [
        'Optimized SPAs (React/Next.js) to handle 10,000+ concurrent users.',
        'Cut server response time by 15% via API caching.',
        'Achieved WCAG 2.1 AA compliance for portals using ARIA and automated testing.',
      ],
      stack: ['React', 'Next.js', 'ARIA', 'Axe'],
    },
    {
      role: 'Automation Developer',
      company: 'RBC',
      duration: 'May 2022 – Feb 2023',
      description: [
        'Automated testing pipelines and regression suites.',
        'Improved QA efficiency with Python and Selenium.',
        'Coordinated tasks with cross-functional teams in agile sprints.',
      ],
      stack: ['Python', 'Selenium', 'Jenkins', 'GitHub Actions'],
    },
    {
      role: 'Software Engineer Intern',
      company: 'Royal Bank of Canada',
      duration: 'May 2021 – Aug 2021',
      description: [
        'Built Angular/TypeScript apps with Firebase backend.',
        'Debugged memory leaks, improving runtime by 20%.',
        'Conducted penetration testing and security audits on web apps.',
      ],
      stack: ['Angular', 'TypeScript', 'Firebase'],
    },
    {
      role: 'Web Engineer Intern',
      company: 'Evrlinx',
      duration: 'May 2020 – Aug 2020',
      description: [
        'Assisted in developing and maintaining web apps using TypeScript and Angular.',
      ],
      stack: ['Angular', 'TypeScript'],
    },
    {
      role: 'Project Coordinator (Co-op)',
      company: 'Wilfrid Laurier University',
      duration: '2021 – 2022',
      description: [
        'Led development initiatives on internal web tools.',
        'Managed student teams and project timelines.',
        'Presented findings and product demos to stakeholders.',
      ],
      stack: ['Jira', 'Trello', 'HTML', 'CSS', 'JavaScript'],
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

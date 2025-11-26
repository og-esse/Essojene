import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PortfolioCardComponent } from '../project-card/portfolio-card.component';

interface Project {
  title: string;
  description: string;
  link: string;
  tags: string[];
}

@Component({
  selector: 'app-portfolio-section',
  standalone: true,
  imports: [CommonModule, PortfolioCardComponent, RouterModule],
  templateUrl: './portfolio-section.component.html',
  styleUrls: ['./portfolio-section.component.scss'],
})
export class PortfolioSectionComponent {
  selectedTag = 'All';

  tags = [
    'All',
    'TypeScript',
    'Next.js',
    'OpenAI API',
    'React',
    'Node.js',
    'GraphQL',
    'Angular',
    'GameDev',
  ];

  projects: Project[] = [
    {
      title: 'JNGYM (Game)',
      description:
        'Side-scrolling fitness-themed game built with Phaser + Angular for JNNJ.',
      link: 'https://jngym.jnclo.com/',
      tags: ['Angular', 'TypeScript', 'GameDev'],
    },
    {
      title: 'Swag Shooter (Game)',
      description:
        'A pixel shooter exploring themes of rebellion and cyber youth.',
      link: 'https://punksta.jnclo.com/',
      tags: ['Angular', 'TypeScript', 'GameDev'],
    },

    {
      title: 'AI Code Review Bot',
      description: 'Slack-integrated tool using OpenAI to analyze PRs.',
      link: '#',
      tags: ['OpenAI API', 'Node.js', 'TypeScript'],
    },
    {
      title: 'Fashion Tech Hack',
      description: 'Hackathon-winning fashion design app with React + GraphQL.',
      link: 'https://devpost.com/software/amberx',
      tags: ['React', 'GraphQL'],
    },
    {
      title: 'Dev Portfolio Builder',
      description:
        'Next.js app to build beautiful portfolios with MDX support.',
      link: '#',
      tags: ['Next.js', 'TypeScript'],
    },
  ];

  workProjects: Project[] = [
    {
      title: 'Investments Menu Rebuild',
      description:
        'Rebuilt the “Open an Investment Account” journey (TFSA, RRSP, RESP, etc.) in the RBC app, replacing a legacy flow with a streamlined, accessible experience that brought us in line with top competitors like Wealthsimple and increased completion rates from ~30% to ~70% in the first month after launch.',
      link: '',
      tags: ['Angular', 'NGRX', 'Design System'],
    },
    {
      title: 'Sponsor Portal Secondary Credentials',
      description:
        'Implemented secondary credential and one-time passcode (OTP) flows in the Sponsor Portal used by employers to manage group plans, hardening authentication, reducing support friction for access issues, and aligning the experience with RBC’s security standards.',
      link: '',
      tags: ['Angular', 'TypeScript', 'Security'],
    },
    {
      title: 'RIG Design System',
      description:
        'Contributed to the RIG design system used across RBC by building reusable, performance-tuned Angular components, documenting them in Storybook, and onboarding teams—helping developers save up to ~7 hours per week by standardizing patterns instead of rebuilding UI from scratch.',
      link: '',
      tags: ['Design System', 'Angular', 'React'],
    },
    {
      title: 'Mortgage Renewal Tool',
      description:
        'Delivered the digital mortgage renewal experience that lets clients renew online instead of visiting a branch, simplifying advisor workflows and driving a ~40% lift in renewal conversions.',
      link: '',
      tags: ['React', 'Node.js', 'GraphQL'],
    },
  ];

  get filteredProjects(): Project[] {
    if (this.selectedTag === 'All') {
      return this.projects;
    }
    return this.projects.filter((project) =>
      project.tags.includes(this.selectedTag)
    );
  }

  setFilter(tag: string): void {
    this.selectedTag = tag;
  }

  trackByTitle(index: number, project: Project): string {
    return project.title;
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PortfolioCardComponent } from '../project-card/portfolio-card.component';

interface Project {
  title: string;
  description: string;
  link: string;
  githubUrl?: string;
  tags: string[];
  featured?: boolean;
  highlights?: string[];
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
    'REST API',
    'Spring Boot',
    'Highcharts',
    'Angular',
    'Python',
    'MCP',
    'FastAPI',
    'Supabase',
    'Digital Art',
    'GameDev',
  ];

  projects: Project[] = [
    {
      title: 'MCP Model Serving POC',
      description:
        'Python proof of concept serving a churn-risk model through a versioned FastAPI endpoint with API-key auth and an MCP predict tool. Includes a local training script, portable model artifact, typed request/response contracts, and a documented Databricks export path.',
      link: '/projects/mcp-model-serving-poc',
      githubUrl:
        'https://github.com/og-esse/Essojene/tree/main/mcp-model-serving-poc',
      tags: ['Python', 'MCP', 'FastAPI'],
      featured: true,
      highlights: [
        'Trains and loads a portable churn-risk model artifact',
        'Exposes a versioned /v1/predict API with API-key auth',
        'Wraps the same prediction contract as an MCP predict_churn tool',
      ],
    },

    {
      title: 'CYK Website',
      description:
        'Cyber-youth lifestyle site built with Angular, Stripe, Supabase, MailerLite, Resend, and Node.js. Designed as the main home for CYK content, drops, and community-facing experiments.',
      link: 'https://cyk.life',
      githubUrl: 'https://github.com/og-esse/jnwrld-practice-game',
      tags: [
        'Angular',
        'Stripe',
        'Supabase',
        'MailerLite',
        'Resend',
        'Node.js',
      ],
    },
    {
      title: 'CYK Signal Feed',
      description:
        'Anonymous wall where people can share thoughts live, built as a lightweight community feed for CYK with a simple posting flow and real-time social energy.',
      link: 'https://cyk.life/cyk-signal-feed',
      tags: ['Angular', 'Supabase', 'TypeScript'],
    },
    {
      title: 'Artist web experience for CYK',
      description:
        'Interactive CYK web experience built around fast, expressive browser-based storytelling and experimental digital culture.',
      link: 'https://realdealrebel.cyk.life/',
      tags: ['Angular', 'TypeScript'],
    },
    {
      title: 'Dollhouse Dress-Up Game',
      description:
        'Browser-based dress-up game for CYK. Built the interactive experience and created the visual assets by drawing the graphics in Sketchbook and FireAlpaca.',
      link: 'https://dollhouse.cyk.life/',
      tags: ['Angular', 'TypeScript', 'GameDev', 'Digital Art'],
    },

    {
      title: 'AI Code Review Assistant',
      description:
        'Built a Slack-integrated AI assistant using OpenAI APIs to analyze pull requests, detect code smells, and generate actionable feedback. Implemented prompt-engineered workflows, context-aware analysis, and automated review summaries to reduce manual code review effort.',
      link: '/assistant',
      githubUrl: 'https://github.com/og-esse/Essojene',
      tags: ['OpenAI API', 'Node.js', 'TypeScript'],
    },
    {
      title: 'JNGYM (Game)',
      description:
        'Side-scrolling fitness-themed game built with Phaser + Angular for JNNJ.',
      link: 'https://jngym.jnclo.com/',
      githubUrl: 'https://github.com/og-esse/jnwrld-practice-game',
      tags: ['Angular', 'TypeScript', 'GameDev'],
    },
    {
      title: 'Swag Shooter (Game)',
      description:
        'A pixel shooter exploring themes of rebellion and cyber youth.',
      link: 'https://punksta.jnclo.com/',
      githubUrl: 'https://github.com/og-esse/jnwrld-practice-game',
      tags: ['Angular', 'TypeScript', 'GameDev'],
    },

    {
      title: 'Fashion Tech Hack',
      description: 'Hackathon-winning fashion design app with React + GraphQL.',
      link: 'https://devpost.com/software/amberx',
      tags: ['React', 'GraphQL'],
    },
  ];

  workProjects: Project[] = [
    {
      title: 'Embedded Advice Tax Savings Calculator',
      description:
        'Worked front to back on RBC’s Embedded Advice initiative to digitize financial advice inside self-serve investment flows. Built Angular UI, Highcharts visualizations, Spring Boot REST APIs, and integrations across multiple APIs to provide clients with contextual, real-time tax-savings insights for financial decisions.',
      link: '',
      tags: ['Angular', 'Spring Boot', 'REST API', 'Highcharts'],
    },
    {
      title: 'Investment Account Discovery Assistant',
      description:
        'Built an assisted-discovery experience to help users choose the right investment account type, using prompt-engineering concepts to guide decision-making in a clearer, more personalized flow. Led the frontend delivery for the initiative, earned a promotion during the work, and shipped the project ahead of schedule.',
      link: '',
      tags: ['Angular', 'TypeScript', 'REST API'],
    },
    {
      title: 'Investments Menu Rebuild',
      description:
        'Rebuilt the “Open an Investment Account” journey (TFSA, RRSP, RESP, etc.) in the RBC app, replacing a legacy flow with a streamlined, accessible experience that brought us in line with top competitors like Wealthsimple and increased completion rates from ~30% to ~70% in the first month after launch.',
      link: '',
      tags: ['Angular', 'Spring Boot', 'Design System'],
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

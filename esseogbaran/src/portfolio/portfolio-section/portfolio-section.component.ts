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
      title: 'Mortgage Renewal Tool',
      description: 'Boosted renewal conversion rate by 40% for RBC clients.',
      link: '#',
      tags: ['TypeScript', 'Angular'],
    },
    {
      title: 'AI Code Review Bot',
      description: 'Slack-integrated tool using OpenAI to analyze PRs.',
      link: '#',
      tags: ['OpenAI API', 'Node.js', 'TypeScript'],
    },
    {
      title: 'Virtual Fashion Hack',
      description: 'Hackathon-winning fashion design app with React + GraphQL.',
      link: '#',
      tags: ['React', 'GraphQL'],
    },
    {
      title: 'Dev Portfolio Builder',
      description:
        'Next.js app to build beautiful portfolios with MDX support.',
      link: '#',
      tags: ['Next.js', 'TypeScript'],
    },
    {
      title: 'JNNJ: Cyber Youth Game',
      description: 'Pixel-style Phaser + Angular game for your brand JNNJ.',
      link: '#',
      tags: ['Angular', 'TypeScript', 'GameDev'],
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

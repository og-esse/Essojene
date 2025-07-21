export interface Project {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  githubUrl?: string;
  liveUrl?: string;
}

export const PROJECTS: Project[] = [
  {
    title: 'AI Code Review Tool',
    description: 'GPT-4 integrated tool that reduced PR review time by 35%.',
    tags: ['TypeScript', 'Next.js', 'OpenAI API'],
    imageUrl: 'assets/images/code-review-tool.jpg',
    githubUrl: 'https://github.com/you/code-review',
    liveUrl: 'https://yourliveproject.com',
  },
  {
    title: 'Mortgage Renewal App',
    description: 'React/Node.js app that improved conversions by 40%.',
    tags: ['React', 'Node.js', 'GraphQL'],
    imageUrl: 'assets/images/mortgage-app.jpg',
    githubUrl: 'https://github.com/you/mortgage-app',
    liveUrl: 'https://rbc.com/mortgage-renewal',
  },
  // Add more projects here
];

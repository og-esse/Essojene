import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './education.component.html',
  styleUrl: './education.component.scss',
})
export class EducationComponent {
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

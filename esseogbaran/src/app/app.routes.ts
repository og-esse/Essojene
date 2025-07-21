import { Routes } from '@angular/router';
import { LandingPageComponent } from 'src/landing-page/landing-page.component';
import { EducationComponent } from 'src/portfolio/education/education.component';
import { ExperienceSectionComponent } from 'src/portfolio/experience/experince.component';
import { PortfolioSectionComponent } from '../portfolio/portfolio-section/portfolio-section.component';

export const appRoutes: Routes = [
  { path: '', component: LandingPageComponent }, // Directly load landing page at root
  { path: 'portfolio', component: PortfolioSectionComponent },
  { path: 'landingPage', component: LandingPageComponent },
  { path: 'experience', component: ExperienceSectionComponent },
  { path: 'education', component: EducationComponent },
];

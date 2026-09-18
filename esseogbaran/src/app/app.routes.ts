import { Routes } from '@angular/router';
import { AssistantComponent } from 'src/assistant/assistant.component';
import { LandingPageComponent } from 'src/landing-page/landing-page.component';
import { EducationComponent } from 'src/portfolio/education/education.component';
import { ExperienceSectionComponent } from 'src/portfolio/experience/experince.component';
import { FxPricingEngineComponent } from 'src/portfolio/fx-pricing-engine/fx-pricing-engine.component';
import { McpModelServingComponent } from 'src/portfolio/mcp-model-serving/mcp-model-serving.component';
import { PortfolioSectionComponent } from '../portfolio/portfolio-section/portfolio-section.component';

export const appRoutes: Routes = [
  { path: '', component: LandingPageComponent }, // Directly load landing page at root
  { path: 'assistant', component: AssistantComponent },
  { path: 'portfolio', component: PortfolioSectionComponent },
  {
    path: 'projects/automated-fx-pricing-engine',
    component: FxPricingEngineComponent,
  },
  { path: 'projects/mcp-model-serving-poc', component: McpModelServingComponent },
  { path: 'landingPage', component: LandingPageComponent },
  { path: 'experience', component: ExperienceSectionComponent },
  { path: 'education', component: EducationComponent },
];

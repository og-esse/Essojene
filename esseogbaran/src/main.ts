import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { appRoutes } from './app/app.routes';
import 'zone.js'; // if not already

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    provideRouter(appRoutes),
    provideAnimations(),
    ...(appConfig.providers || []),
  ],
}).catch((err) => console.error(err));

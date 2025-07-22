import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import 'zone.js';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app/app-routing.module';
import { provideRouter } from '@angular/router';

bootstrapApplication(AppComponent, {providers: [provideHttpClient(withInterceptorsFromDi()), provideRouter(routes)]})
  .catch((err) => console.error(err));
;

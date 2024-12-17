import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideAnimations} from "@angular/platform-browser/animations"

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { errorsInterceptor } from './_interceptor/errors.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { jwtInterceptor } from './_interceptor/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorsInterceptor,jwtInterceptor])),
    provideAnimations(),
    provideToastr({
      positionClass: 'toast-bottom-right',
    }), provideAnimationsAsync()
  ]
};

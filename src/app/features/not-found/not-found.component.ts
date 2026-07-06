import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RESPONSE_INIT } from '../../core/tokens/response.token';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-24 text-center">
      <p class="text-7xl font-bold text-primary sm:text-8xl">404</p>
      <h1 class="mt-6 text-2xl font-semibold text-foreground sm:text-3xl">Page not found</h1>
      <p class="mt-3 max-w-md text-muted-foreground">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <a
        routerLink="/"
        class="mt-8 inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Back to home
      </a>
    </div>
  `,
  styles: [':host { display: block; }']
})
export class NotFoundComponent {
  private readonly responseState = inject(RESPONSE_INIT, { optional: true });

  constructor() {
    if (this.responseState) {
      this.responseState.status = 404;
    }
  }
}

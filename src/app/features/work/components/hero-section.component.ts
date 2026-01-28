import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      <div class="relative z-10 flex flex-col items-center px-4 text-center">
        <h1
          @fadeInUp
          class="mb-6 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-5xl font-bold text-transparent sm:text-7xl md:text-8xl lg:text-9xl pb-2 hover:underline underline-offset-8 decoration-2 decoration-primary"
        >
          Feature Showcase
        </h1>
        <p
          @fadeInUp
          class="mb-12 max-w-2xl text-lg text-muted-foreground sm:text-xl"
        >
          Explore a few professional work and side projects
        </p>
        <button
          @fadeInUp
          type="button"
          (click)="scrollToProjects()"
          class="group flex flex-col items-center gap-3 rounded-lg px-6 py-3 transition-all hover:bg-accent"
          aria-label="Scroll to projects"
        >
          <span class="text-sm font-medium text-foreground">Scroll to explore</span>
          <svg
            class="h-6 w-6 animate-bounce text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }

    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    .animate-bounce {
      animation: bounce 2s infinite;
    }
  `],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class HeroSectionComponent {
  scrollToProjects(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    }
  }
}

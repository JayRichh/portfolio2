import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactFormComponent } from '@shared/components/feature/contact-form/contact-form.component';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, ContactFormComponent],
  template: `
    <section class="contact-page">
      <div class="contact-container">
        <h1 class="contact-title">Get In Touch</h1>
        <p class="contact-description">
          Have a project in mind or want to discuss opportunities? I'd love to hear from you.
        </p>
        <app-contact-form />
      </div>
    </section>
  `,
  styles: [`
    .contact-page {
      min-height: 100vh;
      padding: 8rem 1rem 3rem;
      background: hsl(var(--background));
    }

    .contact-container {
      width: min(1200px, 100%);
      margin: 0 auto;
      background: hsl(var(--card));
      border-radius: 0.5rem;
      padding: 2rem 1rem 2.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .contact-title {
      font-size: clamp(2rem, 5vw, 3rem);
      font-weight: 700;
      text-align: center;
      margin-bottom: 1rem;
      color: hsl(var(--foreground));
    }

    .contact-description {
      font-size: 1.125rem;
      line-height: 1.6;
      color: hsl(var(--muted-foreground));
      text-align: center;
      margin: 0 auto 2rem;
      max-width: 700px;
    }

    @media (min-width: 640px) {
      .contact-container {
        padding: 3rem 2rem 3.5rem;
      }
    }

    @media (min-width: 1024px) {
      .contact-container {
        padding: 4rem 3rem 4.5rem;
      }
    }
  `]
})
export class ContactPageComponent {}

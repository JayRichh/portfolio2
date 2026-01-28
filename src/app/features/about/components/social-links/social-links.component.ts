import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-social-links',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="social-section">
      <div class="social-container">
        <div class="social-grid">
          <a
            href="https://github.com/jayrichh"
            target="_blank"
            rel="noopener noreferrer"
            class="social-link"
            aria-label="Visit my GitHub"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
              <path d="M9 18c-4.51 2-5-2-7-2"/>
            </svg>
          </a>

          <a
            href="https://linkedin.com/in/jay-richardson-nz"
            target="_blank"
            rel="noopener noreferrer"
            class="social-link"
            aria-label="Visit my LinkedIn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect width="4" height="12" x="2" y="9"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
          </a>

          <a
            href="https://bsky.app/profile/jayrich.bsky.social"
            target="_blank"
            rel="noopener noreferrer"
            class="social-link"
            aria-label="Visit my Bluesky"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z"/>
              <polyline points="15,9 18,12 15,15"/>
              <polyline points="9,9 6,12 9,15"/>
            </svg>
          </a>

          <a
            href="mailto:web@jayrich.dev"
            class="social-link"
            aria-label="Send me an email"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect width="20" height="16" x="2" y="4" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .social-section {
      width: 100%;
      padding: 3rem 1rem;
      background: hsl(var(--background));
    }

    .social-container {
      max-width: 56rem;
      margin: 0 auto;
    }

    .social-grid {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
    }

    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 3.5rem;
      height: 3.5rem;
      border-radius: 50%;
      background: hsl(var(--card));
      border: 1px solid hsl(var(--border));
      color: hsl(var(--foreground));
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      text-decoration: none;
    }

    .social-link:hover {
      transform: scale(1.1);
      background: hsl(var(--primary));
      color: hsl(var(--primary-foreground));
      border-color: hsl(var(--primary));
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1),
                  0 2px 4px -2px rgb(0 0 0 / 0.1);
    }

    .social-link:active {
      transform: scale(0.9);
    }

    .social-link svg {
      flex-shrink: 0;
    }
  `]
})
export class SocialLinksComponent {}

import { FeatureDetail } from './../../../../data/projectData';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hero-quadrant',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="hero-quadrant">
      <div class="hero-container">
        <h1 class="hero-name">
          <span class="hero-greeting">Hi, I'm</span>
          <span class="first-name">JAYDEN</span>
          <span class="last-name">RICHARDSON</span>
        </h1>

        <nav class="hero-nav">
          <a routerLink="/about" class="hero-nav-link">
            About
          </a>
          <a routerLink="/code" class="hero-nav-link">
            Code
          </a>
          <a routerLink="/work" class="hero-nav-link">
            Featured
          </a>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="2" y1="12" x2="22" y2="12"></line>
          </svg>
          <a href="https://codepen.io/JayRichh" target="_blank" rel="noopener noreferrer" class="hero-nav-link">
            CodePen
          </a>
          <a href="https://github.com/JayRichh" target="_blank" rel="noopener noreferrer" class="hero-nav-link">
            GitHub
          </a>
        </nav>

        <p class="hero-subtitle">
          Full Stack Developer building enterprise applications with modern web technologies. <br><br>
          Specializing in Vue, React, Angular, and .NET solutions.
        </p>

        <div class="hero-social">
          <a
            href="https://github.com/jayrichh"
            target="_blank"
            rel="noopener noreferrer"
            class="social-icon"
            aria-label="GitHub"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
              <path d="M9 18c-4.51 2-5-2-7-2"/>
            </svg>
          </a>

          <a
            href="https://linkedin.com/in/jay-richardson-nz"
            target="_blank"
            rel="noopener noreferrer"
            class="social-icon"
            aria-label="LinkedIn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect width="4" height="12" x="2" y="9"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
          </a>

          <a
            href="https://codepen.io/JayRichh"
            target="_blank"
            rel="noopener noreferrer"
            class="social-icon"
            aria-label="CodePen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"/>
              <polyline points="2 17 12 22 22 17"/>
              <polyline points="2 12 12 17 22 12"/>
            </svg>
          </a>

          <a
            href="mailto:web@jayrich.dev"
            class="social-icon"
            aria-label="Email"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero-quadrant {
      position: relative;
      min-width: 100%;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      overflow-x: hidden;
      background: hsl(var(--background));
    }

    .hero-container {
      position: relative;
      min-width: 100vw;
      padding: clamp(1rem, 2vh, 3rem);
      padding-top: clamp(6rem, 10vh, 12rem);
      padding-bottom: clamp(2rem, 5vh, 6rem);
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: space-between;
      gap: clamp(2rem, 3vh, 4rem);
    }

    /* Hero Name - Top Left Quadrant */
    .hero-name {
      font-size: clamp(3rem, 10vw, 7rem);
      font-weight: 900;
      line-height: 0.95;
      letter-spacing: -0.02em;
      color: hsl(var(--foreground));
      flex: 0 1 auto;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      min-width: 0;
    }

    .hero-greeting {
      font-size: clamp(1rem, 2vw, 1.25rem);
      font-weight: 400;
      color: hsl(var(--muted-foreground));
      letter-spacing: 0.025em;
      margin-bottom: 0.5rem;
      display: block;
    }

    .first-name,
    .last-name {
      display: block;
      white-space: nowrap;
    }

    /* Hero Navigation - Top Right Quadrant */
    .hero-nav {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      flex: 1 1 auto;
      align-items: flex-start;
    }

    .hero-nav-link {
      font-size: clamp(1.5rem, 3vw, 3rem);
      font-weight: 700;
      color: hsl(var(--foreground) / 0.7);
      text-decoration: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      padding: 0.25rem 0;
      min-height: 44px;
      display: flex;
      align-items: center;
    }

    .hero-nav-link::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background: hsl(var(--primary));
      transition: width 0.3s ease;
    }

    .hero-nav-link:hover {
      color: hsl(var(--primary));
      transform: translateX(8px);
    }

    .hero-nav-link:hover::after {
      width: 100%;
    }

    /* Hero Subtitle - Left Middle Quadrant */
    .hero-subtitle {
      font-size: clamp(1rem, 2vw, 1.25rem);
      line-height: 1.6;
      color: hsl(var(--muted-foreground));
      flex: 1 1 100%;
      max-width: 600px;
      margin-top: clamp(2rem, 3vh, 5rem);
      margin-bottom: 0;
    }

    /* Hero Social Icons - Bottom Right Quadrant */
    .hero-social {
      display: flex;
      gap: 1rem;
      flex: 1 1 auto;
      align-items: flex-start;
    }

    .social-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: hsl(var(--card));
      border: 1px solid hsl(var(--border));
      color: hsl(var(--foreground));
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      text-decoration: none;
    }

    .social-icon:hover {
      transform: scale(1.1);
      background: hsl(var(--primary));
      color: hsl(var(--primary-foreground));
      border-color: hsl(var(--primary));
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1),
                  0 2px 4px -2px rgb(0 0 0 / 0.1);
    }

    .social-icon:active {
      transform: scale(0.95);
    }

    .social-icon svg {
      flex-shrink: 0;
    }

    /* Tablet Breakpoint (640px+) */
    @media (min-width: 640px) {
      .hero-quadrant {
        padding: clamp(2rem, 4vh, 5rem) clamp(1.5rem, 3vw, 4rem);
      }

      .hero-container {
        gap: clamp(2.5rem, 3vh, 4rem);
        padding: clamp(1.5rem, 2vh, 3rem);
      }

      .hero-nav {
        align-items: flex-end;
        margin-top: 0;
      }

      .hero-social {
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        gap: 1rem;
      }
    }

    /* Desktop Breakpoint (1024px+) */
    @media (min-width: 1024px) {
      .hero-quadrant {
        min-height: 100vh;
      }

      .hero-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto auto;
        row-gap: clamp(2rem, 3vh, 4rem);
        column-gap: clamp(6rem, 8vw, 12rem);
        align-items: start;
        padding-top: clamp(8rem, 12vh, 14rem);
        padding-bottom: clamp(4rem, 6vh, 8rem);
      }

      .hero-name {
        grid-column: 1;
        grid-row: 1;
        font-size: clamp(3.5rem, 7vw, 10rem);
        max-width: none;
        align-self: start;
      }

      .hero-nav {
        grid-column: 2;
        grid-row: 1;
        align-items: flex-end;
        justify-self: end;
      }

      .hero-subtitle {
        grid-column: 1;
        grid-row: 2;
        max-width: 600px;
        margin-top: 0;
      }

      .hero-social {
        grid-column: 2;
        grid-row: 2;
        justify-self: end;
        align-items: flex-start;
        align-self: center;
      }
    }

    /* Ultrawide Breakpoint (1536px+) */
    @media (min-width: 1536px) {
      .hero-container {
        max-width: 1800px;
        row-gap: clamp(3rem, 4vh, 6rem);
        column-gap: clamp(8rem, 9vw, 14rem);
      }

      .hero-name {
        font-size: clamp(4rem, 8vw, 11rem);
      }
    }

    /* Large Desktop / 1440p and 4k (2560px+) */
    @media (min-width: 2560px) {
      .hero-container {
        padding-top: clamp(8rem, 12vh, 18rem);
        padding-bottom: clamp(3rem, 6vh, 10rem);
        row-gap: clamp(3rem, 5vh, 8rem);
        column-gap: clamp(8rem, 10vw, 16rem);
      }

      .hero-name {
        font-size: clamp(5rem, 7vw, 10rem);
        margin-bottom: 1rem;
      }

      .hero-greeting {
        font-size: clamp(1.25rem, 2vw, 1.5rem);
        margin-bottom: 0.5rem;
      }

      .hero-nav-link {
        font-size: clamp(2rem, 3vw, 3rem);
      }

      .hero-subtitle {
        font-size: clamp(1.25rem, 2vw, 1.5rem);
        max-width: 700px;
      }

      .social-icon {
        width: 48px;
        height: 48px;
      }

      .social-icon svg {
        width: 26px;
        height: 26px;
      }
    }

    /* Ultra-tall viewports (vertical monitors, portrait tablets) */
    @media (min-height: 1200px) and (min-width: 1024px) {
      .hero-container {
        padding-top: clamp(6rem, 10vh, 14rem);
        padding-bottom: clamp(6rem, 10vh, 14rem);
      }
    }

    /* High DPI / Retina Displays */
    @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
      .hero-name {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
    }

    /* Reduced Motion */
    @media (prefers-reduced-motion: reduce) {
      .hero-nav-link,
      .hero-nav-link::after {
        transition: none;
      }
    }

    /* Focus Styles for Accessibility */
    .hero-nav-link:focus-visible,
    .social-icon:focus-visible {
      outline: 2px solid hsl(var(--primary));
      outline-offset: 4px;
    }
  `]
})
export class HeroQuadrantComponent {}

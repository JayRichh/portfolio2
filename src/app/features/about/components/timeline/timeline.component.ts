import { Component, signal, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

interface TimelineItem {
  readonly year: string;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly side: 'left' | 'right';
}

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="timeline-section">
      <div class="timeline-container">
        <h2 class="timeline-title">Experience Timeline</h2>

        <div class="timeline-wrapper" #timelineWrapper>
          <div class="timeline-line" [style.height.%]="scrollProgress()"></div>

          <div
            *ngFor="let item of timelineItems; let i = index"
            class="timeline-item"
            [class.timeline-item-left]="item.side === 'left'"
            [class.timeline-item-right]="item.side === 'right'"
            @fadeInSlide
          >
            <div class="timeline-content">
              <div class="timeline-year">{{ item.year }}</div>
              <h3 class="timeline-item-title">{{ item.title }}</h3>
              <p class="timeline-description">{{ item.description }}</p>
            </div>

            <div class="timeline-dot">
              <div class="timeline-icon" [innerHTML]="item.icon"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .timeline-section {
      width: 100%;
      padding: 6rem 1rem;
      background: hsl(var(--background));
    }

    .timeline-container {
      max-width: 56rem;
      margin: 0 auto;
    }

    .timeline-title {
      font-size: 2rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 6rem;
      color: hsl(var(--foreground));
    }

    @media (min-width: 640px) {
      .timeline-title {
        font-size: 2.5rem;
      }
    }

    .timeline-wrapper {
      position: relative;
      padding: 0 0;
      margin-top: 6rem;
    }

    .timeline-line {
      position: absolute;
      left: 50%;
      top: 6rem;
      width: 2px;
      background: hsl(var(--primary));
      transform: translateX(-50%);
      transition: height 0.3s ease-out;
      z-index: 0;
    }

    @media (max-width: 767px) {
      .timeline-line {
        left: 1rem;
      }
    }

    .timeline-item {
      position: relative;
      margin-bottom: 3rem;
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 2rem;
      align-items: center;
    }

    @media (max-width: 767px) {
      .timeline-item {
        grid-template-columns: auto 1fr;
        gap: 1rem;
        padding-left: 0;
      }
    }

    .timeline-dot {
      grid-column: 2;
      width: 6rem;
      height: 6rem;
      background: hsl(var(--card));
      border: 2px solid hsl(var(--border));
      border-radius: 50%;
      z-index: 1;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      align-self: center;
      justify-self: center;
    }

    @media (max-width: 767px) {
      .timeline-dot {
        grid-column: 1;
        width: 3rem;
        height: 3rem;
      }
    }

    .timeline-item:hover .timeline-dot {
      transform: scale(1.1);
      border-color: hsl(var(--primary));
      box-shadow: 0 0 0 4px hsl(var(--primary) / 0.2), 0 10px 15px -3px rgb(0 0 0 / 0.1);
    }

    .timeline-icon {
      color: hsl(var(--primary));
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .timeline-icon :global(svg) {
      width: 2rem;
      height: 2rem;
    }

    @media (max-width: 767px) {
      .timeline-icon :global(svg) {
        width: 1.5rem;
        height: 1.5rem;
      }
    }

    .timeline-item-left .timeline-content {
      grid-column: 1;
      grid-row: 1;
      text-align: right;
    }

    .timeline-item-left .timeline-dot {
      grid-column: 2;
      grid-row: 1;
    }

    .timeline-item-right .timeline-content {
      grid-column: 3;
      grid-row: 1;
      text-align: left;
    }

    .timeline-item-right .timeline-dot {
      grid-column: 2;
      grid-row: 1;
    }

    @media (max-width: 767px) {
      .timeline-item-left .timeline-content,
      .timeline-item-right .timeline-content {
        grid-column: 2;
        grid-row: 1;
        text-align: left;
      }

      .timeline-item-left .timeline-dot,
      .timeline-item-right .timeline-dot {
        grid-column: 1;
        grid-row: 1;
      }
    }

    .timeline-content {
      background: hsl(var(--card));
      padding: 1.5rem;
      border-radius: 0.75rem;
      border: 1px solid hsl(var(--border) / 0.5);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }

    .timeline-content:hover {
      transform: scale(1.02);
      border-color: hsl(var(--border));
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
                  0 4px 6px -4px rgb(0 0 0 / 0.1);
    }

    .timeline-year {
      font-size: 0.875rem;
      font-weight: 700;
      color: hsl(var(--primary));
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }

    .timeline-item-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: hsl(var(--foreground));
      margin-bottom: 0.75rem;
      line-height: 1.3;
    }

    .timeline-description {
      font-size: 0.9375rem;
      color: hsl(var(--muted-foreground));
      line-height: 1.6;
    }
  `],
  animations: [
    trigger('fadeInSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('600ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class TimelineComponent implements OnInit, OnDestroy {
  @ViewChild('timelineWrapper', { read: ElementRef }) timelineWrapper?: ElementRef;

  readonly scrollProgress = signal(0);

  private scrollListener?: () => void;

  readonly timelineItems: readonly TimelineItem[] = [
    {
      year: '2025 - Present',
      title: 'Software Engineer',
      description: 'Developing software solutions at Geotechnics, building robust applications and driving technical excellence in geotechnical engineering software.',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
      side: 'right'
    },
    {
      year: '2022 - 2024',
      title: 'Software Developer',
      description: 'Developed scalable software for project and operations management, collaborating with teams to deliver user-centric tools.',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
      side: 'left'
    },
    {
      year: '2022',
      title: 'Web Developer',
      description: 'Built full-stack applications using HTML, CSS, JavaScript, and the MERN stack, focusing on best practices for robust solutions.',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',
      side: 'right'
    },
    {
      year: '2020 - 2022',
      title: 'Estimator',
      description: 'Quoted and designed control systems, improved internal processes, and delivered tailored solutions through strong client relationships.',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>',
      side: 'left'
    },
    {
      year: '2020',
      title: 'Industrial Electrician',
      description: 'Led electrical installations in the dairy industry, mentoring apprentices and ensuring accurate equipment calibration.',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
      side: 'right'
    },
    {
      year: '2019',
      title: 'Electrical Apprentice',
      description: 'Certified in instrumentation while maintaining systems, with a focus on improving reliability and process efficiency.',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>',
      side: 'left'
    },
    {
      year: '2013 - 2018',
      title: 'Fire Systems Engineer',
      description: 'Managed fire detection system installations, ensuring compliance with NZ codes and training apprentices on safety protocols.',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>',
      side: 'right'
    }
  ];

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.scrollListener = this.updateScrollProgress.bind(this);
      window.addEventListener('scroll', this.scrollListener, { passive: true });
      this.updateScrollProgress();
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined' && this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }

  private updateScrollProgress(): void {
    if (!this.timelineWrapper) return;

    const element = this.timelineWrapper.nativeElement;
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementHeight = element.offsetHeight;

    const scrollStart = rect.top + window.scrollY - windowHeight * 0.8;
    const scrollEnd = rect.top + window.scrollY + elementHeight - windowHeight * 0.2;
    const scrollDistance = scrollEnd - scrollStart;
    const currentScroll = window.scrollY;

    const progress = Math.min(
      Math.max((currentScroll - scrollStart) / scrollDistance, 0),
      1
    );

    this.scrollProgress.set(progress * 100);
  }
}

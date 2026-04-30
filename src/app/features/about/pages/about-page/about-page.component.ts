import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopSectionComponent } from '../../components/top-section/top-section.component';
import { TimelineComponent } from '../../components/timeline/timeline.component';
import { HobbiesComponent } from '../../components/hobbies/hobbies.component';
import { SocialLinksComponent } from '../../components/social-links/social-links.component';
import { ScrollIndicatorComponent } from '../../components/scroll-indicator/scroll-indicator.component';
import { ExploreNavComponent, ExploreNavLink } from '@shared/components/feature/explore-nav/explore-nav.component';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [
    CommonModule,
    TopSectionComponent,
    TimelineComponent,
    HobbiesComponent,
    SocialLinksComponent,
    ScrollIndicatorComponent,
    ExploreNavComponent
  ],
  template: `
    <div class="about-page">
      <app-top-section />
      <app-timeline />
      <app-hobbies />
      <app-social-links />
      <app-explore-nav [links]="navLinks" />
      <app-scroll-indicator />
    </div>
  `,
  styles: [`
    .about-page {
      position: relative;
      min-height: 100vh;
      background: hsl(var(--background));
      overflow-x: hidden;
    }
  `]
})
export class AboutPageComponent {
  readonly navLinks: ExploreNavLink[] = [
    {
      label: 'View My Projects',
      route: '/code',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
      variant: 'primary'
    },
    {
      label: 'Work Experience',
      route: '/work',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
      variant: 'secondary'
    }
  ];
}

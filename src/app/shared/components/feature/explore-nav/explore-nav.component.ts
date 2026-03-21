import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface ExploreNavLink {
  readonly label: string;
  readonly route: string;
  readonly icon: string;
  readonly variant: 'primary' | 'secondary' | 'tertiary';
  readonly onClick?: (event: Event) => void;
}

@Component({
  selector: 'app-explore-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './explore-nav.component.html',
  styleUrl: './explore-nav.component.scss'
})
export class ExploreNavComponent {
  @Input() links: ExploreNavLink[] = [];

  handleClick(event: Event, link: ExploreNavLink): void {
    if (link.onClick) {
      link.onClick(event);
    }
  }
}

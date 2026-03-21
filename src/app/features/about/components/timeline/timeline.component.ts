import { Component, signal, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { TIMELINE_ITEMS } from './timeline.data';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
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

  readonly timelineItems = TIMELINE_ITEMS;

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

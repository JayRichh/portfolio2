import { Component, signal, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
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
export class TimelineComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('timelineWrapper', { read: ElementRef }) timelineWrapper?: ElementRef<HTMLElement>;
  @ViewChildren('dot', { read: ElementRef }) dots?: QueryList<ElementRef<HTMLElement>>;

  readonly scrollProgress = signal(0);
  readonly lineTop = signal(0);
  readonly lineMaxHeight = signal(0);

  private scrollListener?: () => void;
  private resizeListener?: () => void;
  private dotsSubscription?: { unsubscribe(): void };

  readonly timelineItems = TIMELINE_ITEMS;

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.scrollListener = this.updateScrollProgress.bind(this);
      this.resizeListener = this.measureLineBounds.bind(this);
      window.addEventListener('scroll', this.scrollListener, { passive: true });
      window.addEventListener('resize', this.resizeListener);
      this.updateScrollProgress();
    }
  }

  ngAfterViewInit(): void {
    this.dotsSubscription = this.dots?.changes.subscribe(() => this.measureLineBounds());
    requestAnimationFrame(() => this.measureLineBounds());
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      if (this.scrollListener) window.removeEventListener('scroll', this.scrollListener);
      if (this.resizeListener) window.removeEventListener('resize', this.resizeListener);
    }
    this.dotsSubscription?.unsubscribe();
  }

  private measureLineBounds(): void {
    if (!this.timelineWrapper || !this.dots || this.dots.length === 0) return;

    const wrapperRect = this.timelineWrapper.nativeElement.getBoundingClientRect();
    const firstDot = this.dots.first.nativeElement.getBoundingClientRect();
    const lastDot = this.dots.last.nativeElement.getBoundingClientRect();

    const firstTop = firstDot.top - wrapperRect.top;
    const lastBottom = lastDot.bottom - wrapperRect.top;

    this.lineTop.set(Math.max(0, firstTop));
    this.lineMaxHeight.set(Math.max(0, lastBottom - firstTop));
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

import { Component, signal, OnInit, OnDestroy, AfterViewInit, ViewChild, ViewChildren, QueryList, ElementRef, Output, EventEmitter, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { projectData, Project } from '@data/projectData';
import { groupProjectsByFramework } from '@data/techUtils';
import { ImageTooltipComponent } from '@shared/components/ui/image-tooltip/image-tooltip.component';
import { ScrollIndicatorComponent } from '@features/about/components/scroll-indicator/scroll-indicator.component';

interface FrameworkGroup {
  readonly framework: string;
  readonly projects: readonly Project[];
  readonly totalCount: number;
}

@Component({
  selector: 'app-framework-showcase',
  standalone: true,
  imports: [CommonModule, RouterModule, ImageTooltipComponent, ScrollIndicatorComponent],
  templateUrl: './framework-showcase.component.html',
  styleUrl: './framework-showcase.component.scss'
})
export class FrameworkShowcaseComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(ImageTooltipComponent) tooltip!: ImageTooltipComponent;
  @ViewChildren('projectItem') projectItems!: QueryList<ElementRef<HTMLElement>>;
  @Output() projectClick = new EventEmitter<Project>();

  readonly frameworkGroups = signal<FrameworkGroup[]>([]);
  readonly totalProjects = signal(0);

  private showTimeout: number | null = null;
  private hideTimeout: number | null = null;
  private currentProject: Project | null = null;
  private currentFrameworkProjects: Project[] = [];

  private readonly zone = inject(NgZone);
  private rafId: number | null = null;
  private mediaQuery: MediaQueryList | null = null;
  private mediaListener: ((e: MediaQueryListEvent) => void) | null = null;
  private scrollListener: (() => void) | null = null;
  private resizeListener: (() => void) | null = null;
  private itemsSubscription: { unsubscribe(): void } | null = null;
  private readonly maxOpacity = 0.35;
  private readonly siblingOpacity = 0.15;

  ngOnInit(): void {
    const grouped = groupProjectsByFramework(projectData);
    const groups: FrameworkGroup[] = [];
    let total = 0;

    for (const [framework, projects] of grouped) {
      if (framework !== 'Other' && projects.length > 0) {
        groups.push({
          framework,
          projects,
          totalCount: projects.length
        });
        total += projects.length;
      }
    }

    this.frameworkGroups.set(groups);
    this.totalProjects.set(total);
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;

    this.mediaQuery = window.matchMedia('(max-width: 767px)');
    this.mediaListener = (e: MediaQueryListEvent) => this.toggleFadeEffect(e.matches);
    this.mediaQuery.addEventListener('change', this.mediaListener);

    this.itemsSubscription = this.projectItems.changes.subscribe(() => {
      if (this.mediaQuery?.matches) this.requestUpdate();
    });

    this.toggleFadeEffect(this.mediaQuery.matches);
  }

  ngOnDestroy(): void {
    this.detachListeners();
    this.itemsSubscription?.unsubscribe();
    if (this.mediaQuery && this.mediaListener) {
      this.mediaQuery.removeEventListener('change', this.mediaListener);
    }
  }

  private toggleFadeEffect(active: boolean): void {
    if (active) {
      this.attachListeners();
      this.requestUpdate();
    } else {
      this.detachListeners();
      this.clearOpacities();
    }
  }

  private attachListeners(): void {
    if (this.scrollListener || typeof window === 'undefined') return;
    this.zone.runOutsideAngular(() => {
      this.scrollListener = () => this.requestUpdate();
      this.resizeListener = () => this.requestUpdate();
      window.addEventListener('scroll', this.scrollListener, { passive: true });
      window.addEventListener('resize', this.resizeListener);
    });
  }

  private detachListeners(): void {
    if (typeof window === 'undefined') return;
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
      this.scrollListener = null;
    }
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
      this.resizeListener = null;
    }
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private requestUpdate(): void {
    if (this.rafId !== null) return;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      this.updateOpacities();
    });
  }

  private updateOpacities(): void {
    if (!this.projectItems || typeof window === 'undefined') return;

    const items = this.projectItems.toArray();
    if (items.length === 0) return;

    const viewportCenter = window.innerHeight / 2;
    const viewportHeight = window.innerHeight;
    const offscreenBuffer = viewportHeight * 0.5;

    let focusIdx = -1;
    let focusDist = Infinity;

    items.forEach((ref, i) => {
      const rect = ref.nativeElement.getBoundingClientRect();
      if (rect.bottom < -offscreenBuffer || rect.top > viewportHeight + offscreenBuffer) return;
      const itemCenter = rect.top + rect.height / 2;
      const distance = Math.abs(itemCenter - viewportCenter);
      if (distance < focusDist) {
        focusDist = distance;
        focusIdx = i;
      }
    });

    items.forEach((ref, i) => {
      const bg = ref.nativeElement.querySelector<HTMLElement>('.project-bg');
      if (!bg) return;

      let opacity = 0;
      if (focusIdx !== -1) {
        if (i === focusIdx) {
          opacity = this.maxOpacity;
        } else if (i === focusIdx - 1 || i === focusIdx + 1) {
          opacity = this.siblingOpacity;
        }
      }
      bg.style.opacity = String(opacity);
    });
  }

  private clearOpacities(): void {
    this.projectItems?.forEach(ref => {
      const bg = ref.nativeElement.querySelector<HTMLElement>('.project-bg');
      if (bg) bg.style.opacity = '';
    });
  }

  onProjectHover(project: Project, event: MouseEvent): void {
    if (this.hideTimeout !== null) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    if (this.showTimeout !== null) {
      clearTimeout(this.showTimeout);
    }

    if (this.currentProject !== project) {
      this.currentProject = project;

      this.showTimeout = window.setTimeout(() => {
        if (this.tooltip && this.currentProject === project) {
          const group = this.frameworkGroups().find(g =>
            g.projects.some(p => p.title === project.title)
          );

          if (group) {
            this.currentFrameworkProjects = group.projects as Project[];
            const projectIndex = this.currentFrameworkProjects.findIndex(p => p.title === project.title);

            const tooltipItems = this.currentFrameworkProjects.map(p => ({
              imageUrl: p.imgUrl,
              title: p.title
            }));

            this.tooltip.show(tooltipItems, projectIndex);
            this.tooltip.updatePosition(event.clientX, event.clientY);
          }
        }
      }, 100);
    } else {
      if (this.tooltip) {
        this.tooltip.updatePosition(event.clientX, event.clientY);
      }
    }
  }

  onProjectMove(event: MouseEvent): void {
    if (this.tooltip) {
      this.tooltip.updatePosition(event.clientX, event.clientY);
    }
  }

  onProjectLeave(): void {
    if (this.showTimeout !== null) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }

    if (this.hideTimeout !== null) {
      clearTimeout(this.hideTimeout);
    }

    this.hideTimeout = window.setTimeout(() => {
      this.currentProject = null;
      if (this.tooltip) {
        this.tooltip.hide();
      }
      this.hideTimeout = null;
    }, 150);
  }

  onProjectClick(event: Event, project: Project): void {
    event.preventDefault();

    if (this.showTimeout !== null) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }

    if (this.hideTimeout !== null) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    if (this.tooltip) {
      this.tooltip.hide();
    }

    this.projectClick.emit(project);
  }
}

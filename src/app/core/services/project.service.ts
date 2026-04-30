import { Injectable, signal, computed, inject } from '@angular/core';
import { projectData, Project } from '../../data/projectData';
import { filterProjectsByTech, sortProjectsByDate } from '../../data/techUtils';
import { BrowserPlatformService } from './browser-platform.service';

const CACHE_KEY = 'project-page-state';
const CACHE_VERSION = 1;

interface ProjectPageCache {
  selectedTech: string[];
  sortByRecent: boolean;
  timestamp: number;
  version: number;
}

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly platform = inject(BrowserPlatformService);

  readonly selectedTech = signal<string[]>([]);
  readonly sortByRecent = signal<boolean>(false);
  readonly shouldAnimate = signal<boolean>(true);

  private readonly loadedImages = new Set<string>();

  readonly filteredProjects = computed(() => {
    const tech = this.selectedTech();
    const sortRecent = this.sortByRecent();
    let projects = tech.length > 0
      ? filterProjectsByTech([...projectData], tech)
      : [...projectData];
    if (sortRecent) projects = sortProjectsByDate(projects, false);
    return projects;
  });

  setSelectedTech(tech: string[]): void {
    this.selectedTech.set(tech);
    this.saveState();
  }

  setSortByRecent(value: boolean): void {
    this.sortByRecent.set(value);
    this.saveState();
  }

  markImageLoaded(url: string): void {
    this.loadedImages.add(url);
  }

  isImageLoaded(url: string): boolean {
    return this.loadedImages.has(url);
  }

  markFreshNavigation(): void {
    this.shouldAnimate.set(true);
  }

  markReturnNavigation(): void {
    this.shouldAnimate.set(false);
  }

  loadState(): boolean {
    const cached = this.platform.session.get(CACHE_KEY);
    if (!cached) return false;
    try {
      const data: ProjectPageCache = JSON.parse(cached);
      if (data.version !== CACHE_VERSION) {
        this.clearState();
        return false;
      }
      this.selectedTech.set(data.selectedTech);
      this.sortByRecent.set(data.sortByRecent);
      return true;
    } catch {
      return false;
    }
  }

  saveState(): void {
    const cache: ProjectPageCache = {
      selectedTech: this.selectedTech(),
      sortByRecent: this.sortByRecent(),
      timestamp: Date.now(),
      version: CACHE_VERSION
    };
    this.platform.session.set(CACHE_KEY, JSON.stringify(cache));
  }

  clearState(): void {
    this.platform.session.remove(CACHE_KEY);
    this.selectedTech.set([]);
    this.sortByRecent.set(false);
  }

  clearImageCache(): void {
    if (this.loadedImages.size > 100) this.loadedImages.clear();
  }

  preloadTopImages(count: number = 6): void {
    if (!this.platform.isBrowser) return;
    const topProjects = this.filteredProjects().slice(0, count);
    topProjects.forEach(project => {
      if (!this.isImageLoaded(project.imgUrl)) {
        const img = new Image();
        img.src = project.imgUrl;
        img.onload = () => this.markImageLoaded(project.imgUrl);
      }
    });
  }
}

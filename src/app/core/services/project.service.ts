import { Injectable, signal, computed } from '@angular/core';
import { projectData, Project } from '../../data/projectData';
import { filterProjectsByTech, sortProjectsByDate } from '../../data/techUtils';

const CACHE_KEY = 'project-page-state';
const CACHE_VERSION = 1;

interface ProjectPageCache {
  selectedTech: string[];
  sortByRecent: boolean;
  timestamp: number;
  version: number;
}

interface LoadedImages {
  [url: string]: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProjectService {
  readonly selectedTech = signal<string[]>([]);
  readonly sortByRecent = signal<boolean>(false);
  readonly shouldAnimate = signal<boolean>(true);

  private loadedImagesMap = new Map<string, boolean>();
  private lastFilterKey = '';
  private cachedFilteredProjects: Project[] = [];

  readonly filteredProjects = computed(() => {
    const tech = this.selectedTech();
    const sortRecent = this.sortByRecent();

    const filterKey = `${tech.sort().join(',')}-${sortRecent}`;

    if (filterKey === this.lastFilterKey && this.cachedFilteredProjects.length > 0) {
      return this.cachedFilteredProjects;
    }

    let projects = [...projectData];

    if (tech.length > 0) {
      projects = filterProjectsByTech(projects, tech);
    }

    if (sortRecent) {
      projects = sortProjectsByDate(projects, false);
    }

    this.lastFilterKey = filterKey;
    this.cachedFilteredProjects = projects;
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
    this.loadedImagesMap.set(url, true);
  }

  isImageLoaded(url: string): boolean {
    return this.loadedImagesMap.has(url) && this.loadedImagesMap.get(url) === true;
  }

  markFreshNavigation(): void {
    this.shouldAnimate.set(true);
  }

  markReturnNavigation(): void {
    this.shouldAnimate.set(false);
  }

  loadState(): boolean {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (!cached) return false;

      const data: ProjectPageCache = JSON.parse(cached);

      if (data.version !== CACHE_VERSION) {
        this.clearState();
        return false;
      }

      this.selectedTech.set(data.selectedTech);
      this.sortByRecent.set(data.sortByRecent);
      return true;
    } catch (error) {
      console.error('Failed to load project state:', error);
      return false;
    }
  }

  saveState(): void {
    try {
      const cache: ProjectPageCache = {
        selectedTech: this.selectedTech(),
        sortByRecent: this.sortByRecent(),
        timestamp: Date.now(),
        version: CACHE_VERSION
      };

      sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
      console.error('Failed to save project state:', error);
    }
  }

  clearState(): void {
    try {
      sessionStorage.removeItem(CACHE_KEY);
      this.selectedTech.set([]);
      this.sortByRecent.set(false);
      this.lastFilterKey = '';
      this.cachedFilteredProjects = [];
    } catch (error) {
      console.error('Failed to clear project state:', error);
    }
  }

  clearImageCache(): void {
    if (this.loadedImagesMap.size > 100) {
      this.loadedImagesMap.clear();
    }
  }

  preloadTopImages(count: number = 6): void {
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

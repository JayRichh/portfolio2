import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChildren,
  QueryList,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';

interface HobbyDetail {
  readonly imageUrl: string;
  readonly title: string;
  readonly description: string;
  readonly link?: string;
}

interface HobbyGroup {
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly details: readonly HobbyDetail[];
}

interface CardOffset {
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

interface FloatingCardState {
  x: number;
  y: number;
  isHovered: boolean;
  mouseX: number;
  mouseY: number;
  circleX: number;
  circleY: number;
  isFlipped: boolean;
}

const lerp = (start: number, end: number, t: number): number => {
  t = Math.max(0, Math.min(1, t));
  return start * (1 - t) + end * t;
};

@Component({
  selector: 'app-hobbies',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hobbies-section">
      <div class="hobbies-container">
        <h2 class="hobbies-title">Currently</h2>

        <div
          *ngFor="let group of hobbyGroups; let groupIndex = index"
          class="hobby-group-wrapper"
          #groupWrapper
        >
          <div class="hobby-group-sticky">
            <div class="hobby-group-blur"></div>

            <div class="hobby-group-content">
              <div class="group-icon" [innerHTML]="group.icon"></div>
              <p class="group-description">{{ group.description }}</p>
            </div>

            <div class="floating-cards-container">
              <div
                *ngFor="let detail of group.details; let i = index"
                class="floating-card"
                [class.flipped]="cardStates()[groupIndex][i].isFlipped"
                [style.transform]="getCardTransform(groupIndex, i)"
                [style.z-index]="cardStates()[groupIndex][i].isHovered ? 50 : 10 + i"
                (mouseenter)="onCardHover(groupIndex, i, true)"
                (mouseleave)="onCardHover(groupIndex, i, false)"
                (mousemove)="onCardMouseMove(groupIndex, i, $event)"
              >
                <div class="card-inner">
                  <div class="card-front">
                    <img
                      [src]="detail.imageUrl"
                      [alt]="detail.title"
                      class="card-image"
                      [style.object-position]="getImagePosition(detail.title)"
                      loading="lazy"
                    />
                  </div>

                  <div class="card-back">
                    <div class="card-back-content">
                      <h3 class="card-back-title">{{ detail.title }}</h3>
                      <p class="card-back-description">{{ detail.description }}</p>
                    </div>

                    <div class="card-back-actions" *ngIf="detail.link">
                      <a
                        [href]="detail.link"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="card-link"
                        (click)="$event.stopPropagation()"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                          <polyline points="15 3 21 3 21 9"/>
                          <line x1="10" x2="21" y1="14" y2="3"/>
                        </svg>
                        Open Link
                      </a>
                    </div>

                    <div
                      *ngIf="cardStates()[groupIndex][i].isHovered"
                      class="floating-circle"
                      [style.left.px]="cardStates()[groupIndex][i].circleX"
                      [style.top.px]="cardStates()[groupIndex][i].circleY"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hobbies-section {
      width: 100%;
      padding: 4rem 0;
      background: hsl(var(--background));
      overflow-x: hidden;
    }

    .hobbies-container {
      width: 100%;
      max-width: 100%;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .hobbies-title {
      font-size: 2.5rem;
      font-weight: 800;
      text-align: center;
      margin-bottom: 0;
      color: hsl(var(--primary));
    }

    @media (min-width: 640px) {
      .hobbies-title {
        font-size: 3rem;
      }
    }

    @media (min-width: 768px) {
      .hobbies-title {
        font-size: 3.75rem;
      }
    }

    .hobby-group-wrapper {
      position: relative;
      min-height: 80vh;
      margin-bottom: 5rem;
      overflow: hidden;
    }

    .hobby-group-sticky {
      position: sticky;
      top: 25%;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 80vh;
      overflow: hidden;
    }

    .hobby-group-blur {
      position: absolute;
      inset: 0;
      width: 500px;
      height: 300px;
      margin: auto;
      background: radial-gradient(circle, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0.9) 100%);
      mix-blend-mode: multiply;
      filter: blur(50px);
      border-radius: 1rem;
      pointer-events: none;
    }

    .hobby-group-content {
      position: relative;
      z-index: 20;
      text-align: center;
      padding: 2rem;
      pointer-events: none;
    }

    .group-icon {
      margin: 0 auto 1.5rem;
      width: 5rem;
      height: 5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: hsl(var(--primary));
    }

    .group-icon :deep(svg) {
      width: 100%;
      height: 100%;
      stroke: currentColor;
      stroke-width: 2;
      fill: none;
    }

    .group-description {
      max-width: 32rem;
      margin: 0 auto;
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      line-height: 1.4;
      color: hsl(var(--secondary));
      -webkit-text-stroke: 1px rgba(0, 0, 0, 0.2);
    }

    @media (prefers-color-scheme: dark) {
      .group-description {
        filter: invert(1);
      }
    }

    .floating-cards-container {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .floating-card {
      position: absolute;
      width: 320px;
      height: 400px;
      cursor: pointer;
      transition: z-index 0.3s;
      perspective: 1000px;
    }

    @media (max-width: 768px) {
      .floating-card {
        width: 240px;
        height: 300px;
      }
    }

    .card-inner {
      position: relative;
      width: 100%;
      height: 100%;
      transition: transform 0.6s;
      transform-style: preserve-3d;
    }

    .floating-card.flipped .card-inner {
      transform: rotateY(180deg);
    }

    .card-front,
    .card-back {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      border-radius: 0.75rem;
      overflow: hidden;
      background: hsl(var(--card));
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1),
                  0 2px 4px -2px rgb(0 0 0 / 0.1);
    }

    .card-back {
      transform: rotateY(180deg);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 1.5rem;
      background: hsl(var(--card));
      background-opacity: 0.9;
    }

    @media (min-width: 768px) {
      .card-back {
        padding: 2rem;
      }
    }

    .card-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .card-back-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .card-back-title {
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: 0.02em;
      color: hsl(var(--primary));
      margin-bottom: 1rem;
    }

    @media (min-width: 768px) {
      .card-back-title {
        font-size: 1.875rem;
        margin-bottom: 1.5rem;
      }
    }

    .card-back-description {
      font-size: 0.875rem;
      font-weight: 500;
      letter-spacing: 0.01em;
      line-height: 1.6;
      color: hsl(var(--card-foreground));
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    @media (min-width: 768px) {
      .card-back-description {
        font-size: 1.125rem;
      }
    }

    .card-back-actions {
      display: flex;
      justify-content: center;
      gap: 0.75rem;
    }

    .card-link {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: 7rem;
      padding: 0.5rem 1rem;
      background: hsl(var(--primary));
      color: hsl(var(--primary-foreground));
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      text-decoration: none;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.1);
      transition: all 0.2s;
    }

    @media (min-width: 768px) {
      .card-link {
        width: 9rem;
        padding: 0.75rem 1.5rem;
        font-size: 0.875rem;
      }
    }

    .card-link:hover {
      transform: scale(1.05);
      opacity: 0.9;
    }

    .card-link:active {
      transform: scale(0.95);
    }

    .floating-circle {
      position: absolute;
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      background: hsl(var(--primary));
      opacity: 0.5;
      pointer-events: none;
    }

    @media (min-width: 768px) {
      .floating-circle {
        width: 1.5rem;
        height: 1.5rem;
      }
    }
  `]
})
export class HobbiesComponent implements OnInit, OnDestroy {
  @ViewChildren('groupWrapper') groupWrappers!: QueryList<ElementRef>;

  private scrollListener?: () => void;
  private animationFrames: number[] = [];
  private isMobile = false;
  private cardOffsets: CardOffset[][] = [];

  readonly cardStates = signal<FloatingCardState[][]>([]);

  readonly hobbyGroups: readonly HobbyGroup[] = [
    {
      title: 'Web',
      description: 'Turning imagination into web experiences.',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>',
      details: [
        {
          title: 'BopGL',
          description: 'WebGL visualizer with vinyl record simulation. Realtime audio visualization, presets, customization, and track management.',
          imageUrl: '/images/fib.png',
          link: 'https://jayrichh.github.io/BopGL/'
        },
        {
          title: 'PomoDev - Pomodoro Timer Extension',
          description: 'Chrome extension built with React, TypeScript, and Vite, featuring customizable timers, task management, and themes.',
          imageUrl: '/images/pomodev3.png',
          link: 'https://github.com/JayRichh/pomodev'
        },
        {
          title: 'CodePen Visualizations',
          description: 'Interactive p5.js and three.js sketches exploring mathematical patterns and physics simulations.',
          imageUrl: '/images/codepen.png',
          link: 'https://codepen.io/JayRichh/'
        },
        {
          title: 'BopGL: WebGL Visualizer',
          description: 'Dynamic Audio Visualizer with Vinyl Record Simulation, Realtime Audio Analysis, Customization, and Track Management.',
          imageUrl: '/images/codepen2.png',
          link: 'https://codepen.io/JayRichh/'
        },
        {
          title: 'Plane Curves',
          description: 'Visualizing mathematical curves using JavaScript and sliders for real-time adjustments.',
          imageUrl: '/images/codepen1.png',
          link: 'https://codepen.io/JayRichh/pen/LYoWVOd'
        }
      ]
    },
    {
      title: 'Bop',
      description: 'Exploring digital sets and experimenting with breakdowns.',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
      details: [
        {
          title: 'boppin #4 - breakcore/jungle mix',
          description: 'Heavy breakcore/jungle mix to get things moving.',
          imageUrl: '/images/bop10.jpg',
          link: ''
        },
        {
          title: 'Deep House¹',
          description: 'Favorite deep house bops with a side of slap.',
          imageUrl: 'https://i1.sndcdn.com/artworks-UmWeZOwLJLslGQl3-4KM17g-t500x500.jpg',
          link: ''
        },
        {
          title: 'boppin⁹ - tech house mix',
          description: 'A tech house mix to keep the groove going.',
          imageUrl: 'https://i1.sndcdn.com/artworks-2NUCC15k0vZt2UaT-RzCrkA-t500x500.jpg',
          link: ''
        },
        {
          title: 'filthy dnb mix',
          description: 'Filthy DnB featuring Slimzee, Boylan & Riko Dan.',
          imageUrl: '/images/bop2.webp',
          link: ''
        },
        {
          title: 'deep / tech house',
          description: 'yes.',
          imageUrl: '/images/boppin.png',
          link: ''
        }
      ]
    },
    {
      title: 'Vid',
      description: 'Learning fusion animation and filter effects.',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>',
      details: [
        {
          title: 'boppin #2 - trap/phonk & dub mix',
          description: 'Filthy bassline bangers with visuals by sin, Cesco, and KAYO TECHNICS.',
          imageUrl: '/images/bop6.webp',
          link: 'https://www.youtube.com/watch?v=fgbDN1JoZlQ'
        },
        {
          title: 'nostalgic threads: lofi house mix',
          description: 'Grab a coffee for this relaxed lofi house mix (Mall Grab, DJ Seinfeld, COMPUTER DATA).',
          imageUrl: '/images/bop3.webp',
          link: 'https://www.youtube.com/watch?v=L1u9QnXwnKY'
        },
        {
          title: 'tech house mix',
          description: 'One of my favorite genres in electronic music.',
          imageUrl: '/images/bop7.webp',
          link: 'https://www.youtube.com/watch?v=Q8kDiOnF--M'
        },
        {
          title: 'deep / tech house',
          description: 'yes.',
          imageUrl: '/images/bopp12.webp',
          link: 'https://www.youtube.com/watch?v=W4Qjp16epXA'
        },
        {
          title: 'cereal sessions¹ - weekend lofi house mix',
          description: 'Throwback vibes with nostalgic lofi house beats.',
          imageUrl: '/images/bop4.webp',
          link: 'https://www.youtube.com/watch?v=_CE-sFoYTn8'
        }
      ]
    },
    {
      title: 'Gam',
      description: 'Exploring virtual worlds and strategic challenges.',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/><rect width="20" height="12" x="2" y="6" rx="2"/></svg>',
      details: [
        {
          title: 'Satisfactory',
          description: 'First-person factory building game set on an alien planet. Automate resource gathering, processing, and manufacturing.',
          imageUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/526870/header.jpg',
          link: 'https://www.satisfactorygame.com/'
        },
        {
          title: 'Counter-Strike',
          description: 'Tactical first-person shooter with a focus on team-based gameplay and strategic gunfights.',
          imageUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg',
          link: 'https://www.counter-strike.net/'
        },
        {
          title: 'Borderlands Series',
          description: 'Action RPG first-person shooter with a unique cel-shaded art style, known for its vast array of weapons and humorous storylines.',
          imageUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/397540/header.jpg',
          link: 'https://borderlands.com/'
        },
        {
          title: 'Fallout 4',
          description: 'Post-apocalyptic open-world RPG set in a retro-futuristic Boston. Explore, craft, and shape the wasteland.',
          imageUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/377160/header.jpg',
          link: 'https://fallout.bethesda.net/en/games/fallout-4'
        },
        {
          title: 'Risk of Rain 2',
          description: 'Roguelike third-person shooter with procedurally generated levels and increasing difficulty over time.',
          imageUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/632360/header.jpg',
          link: 'https://www.riskofrain.com/'
        }
      ]
    }
  ];

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.isMobile = window.innerWidth <= 768;
      this.initializeCardOffsetsOnce();
      this.initializeCardStates();
      this.scrollListener = this.updateCardPositions.bind(this);
      window.addEventListener('scroll', this.scrollListener, { passive: true });
      setTimeout(() => this.updateCardPositions(), 100);
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined' && this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
    this.animationFrames.forEach(id => cancelAnimationFrame(id));
  }

  private initializeCardOffsetsOnce(): void {
    this.cardOffsets = this.hobbyGroups.map(group => {
      const total = group.details.length;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      return group.details.map((_, index) => {
        const horizontalSpread = this.isMobile
          ? viewportWidth * 0.5
          : viewportWidth * 0.9;
        const verticalSpread = this.isMobile
          ? viewportHeight * 0.7
          : viewportHeight * 0.5;

        const cardWidth = this.isMobile ? 240 : 320;
        const cardHeight = this.isMobile ? 300 : 400;

        let baseX: number;
        let baseY: number;

        if (this.isMobile) {
          baseX = ((index % 2) / 1) * (horizontalSpread / 2) - horizontalSpread / 4;
          baseY = Math.floor(index / 2) * (cardHeight + 20);
        } else {
          baseX = (index / (total - 1)) * horizontalSpread - horizontalSpread / 2;
          baseY = (Math.random() - 0.5) * verticalSpread;
        }

        const noise = {
          x: (Math.random() - 0.5) * (viewportWidth * (this.isMobile ? 0.05 : 0.1)),
          y: (Math.random() - 0.5) * (viewportHeight * (this.isMobile ? 0.05 : 0.1))
        };

        return {
          x: baseX + noise.x,
          y: baseY + noise.y,
          rotation: (Math.random() - 0.5) * (this.isMobile ? 5 : 10),
          scale: 0.95 + Math.random() * 0.1
        };
      });
    });
  }

  private initializeCardStates(): void {
    const states = this.hobbyGroups.map(group =>
      group.details.map(() => ({
        x: 0,
        y: 0,
        isHovered: false,
        mouseX: 0,
        mouseY: 0,
        circleX: 0,
        circleY: 0,
        isFlipped: false
      }))
    );
    this.cardStates.set(states);
  }

  private updateCardPositions(): void {
    if (!this.groupWrappers || this.groupWrappers.length === 0) return;

    const newStates = this.cardStates().map((groupCards, groupIndex) => {
      const wrapper = this.groupWrappers.toArray()[groupIndex];
      if (!wrapper) return groupCards;

      const rect = wrapper.nativeElement.getBoundingClientRect();
      const progress = this.getScrollProgress(rect);

      return groupCards.map((card, cardIndex) => {
        const offset = this.cardOffsets[groupIndex][cardIndex];

        const expansionStart = 0;
        const expansionEnd = this.isMobile ? 0.9 : 0.7;
        const scrollFactor = Math.max(0, Math.min(1, (progress - expansionStart) / (expansionEnd - expansionStart)));

        return {
          ...card,
          x: offset.x * scrollFactor,
          y: offset.y * scrollFactor
        };
      });
    });

    this.cardStates.set(newStates);
  }

  private getScrollProgress(rect: DOMRect): number {
    const windowHeight = window.innerHeight;
    const elementTop = rect.top;
    const elementHeight = rect.height;
    return (windowHeight - elementTop) / (windowHeight + elementHeight);
  }

  getCardTransform(groupIndex: number, cardIndex: number): string {
    const state = this.cardStates()[groupIndex]?.[cardIndex];
    const offset = this.cardOffsets[groupIndex]?.[cardIndex];
    if (!state || !offset) return '';

    return `translate(${state.x}px, ${state.y}px) rotate(${offset.rotation}deg) scale(${offset.scale})`;
  }

  onCardHover(groupIndex: number, cardIndex: number, isHovered: boolean): void {
    const newStates = [...this.cardStates()];
    newStates[groupIndex][cardIndex] = {
      ...newStates[groupIndex][cardIndex],
      isHovered,
      isFlipped: isHovered
    };
    this.cardStates.set(newStates);

    if (!isHovered) {
      this.animationFrames.forEach(id => cancelAnimationFrame(id));
      this.animationFrames = [];
    }
  }

  onCardMouseMove(groupIndex: number, cardIndex: number, event: MouseEvent): void {
    const state = this.cardStates()[groupIndex][cardIndex];
    if (!state.isHovered) return;

    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const newStates = [...this.cardStates()];
    newStates[groupIndex][cardIndex] = {
      ...newStates[groupIndex][cardIndex],
      mouseX,
      mouseY
    };
    this.cardStates.set(newStates);

    this.animateCircle(groupIndex, cardIndex, rect);
  }

  private animateCircle(groupIndex: number, cardIndex: number, rect: DOMRect): void {
    const animate = () => {
      const state = this.cardStates()[groupIndex][cardIndex];
      if (!state.isHovered) return;

      const cardWidth = this.isMobile ? 240 : 320;
      const cardHeight = this.isMobile ? 300 : 400;
      const circleSize = this.isMobile ? 16 : 24;

      const scaleX = cardWidth / rect.width;
      const scaleY = cardHeight / rect.height;

      const scaledX = state.mouseX * scaleX;
      const scaledY = state.mouseY * scaleY;

      const targetX = scaledX - circleSize / 2;
      const targetY = scaledY - circleSize / 2;

      const newX = lerp(state.circleX, targetX, 0.2);
      const newY = lerp(state.circleY, targetY, 0.2);

      const newStates = [...this.cardStates()];
      newStates[groupIndex][cardIndex] = {
        ...newStates[groupIndex][cardIndex],
        circleX: newX,
        circleY: newY
      };
      this.cardStates.set(newStates);

      const frameId = requestAnimationFrame(animate);
      this.animationFrames.push(frameId);
    };

    animate();
  }

  getImagePosition(title: string): string {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('satisfactory') || lowerTitle.includes('borderlands')) {
      return 'center 30%';
    }
    if (lowerTitle.includes('risk of rain')) {
      return 'center 60%';
    }
    return 'center 40%';
  }
}

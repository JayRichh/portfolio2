export interface HobbyDetail {
  readonly imageUrl: string;
  readonly title: string;
  readonly description: string;
  readonly link?: string;
}

export interface HobbyGroup {
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly details: readonly HobbyDetail[];
}

export const HOBBY_GROUPS: readonly HobbyGroup[] = [
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
        title: 'Deep House\u00b9',
        description: 'Favorite deep house bops with a side of slap.',
        imageUrl: 'https://i1.sndcdn.com/artworks-UmWeZOwLJLslGQl3-4KM17g-t500x500.jpg',
        link: ''
      },
      {
        title: 'boppin\u2079 - tech house mix',
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
        title: 'cereal sessions\u00b9 - weekend lofi house mix',
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

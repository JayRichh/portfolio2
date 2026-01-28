export const CODE_CONSTANTS = {
  EXTERNAL_LINKS: {
    CODEPEN: 'https://codepen.io/jayrichh',
    GITHUB: 'https://github.com/JayRichh',
  },
  LOADING: {
    INITIAL_DELAY: 300,
    PRELOAD_IMAGE_COUNT: 6,
  },
  GRID_BREAKPOINTS: {
    MOBILE: 1,
    TABLET: 2,
    DESKTOP: 3,
  },
  DISPLAY: {
    TECH_LIMIT: 5,
  },
  ANIMATION: {
    INITIAL_OPACITY: 0,
    FINAL_OPACITY: 1,
    DURATION: 0.3,
    STAGGER_DELAY: 0.05,
  },
  IMAGE: {
    QUALITY: 90,
  },
} as const;

export const PAGE_METADATA = {
  TITLE: 'Projects | Jayden Richardson',
  DESCRIPTION: 'Web development projects showcasing various technologies and approaches',
} as const;

# Portfolio 2.0 - Angular

Modern Angular application migrated from Next.js, following 2025 best practices with standalone components, signals, and feature-based architecture.

## Tech Stack

- **Angular 18+** - Latest standalone components architecture
- **TypeScript 5** - Strict mode enabled
- **SCSS + Tailwind CSS** - Hybrid styling approach
- **RxJS 7** - Reactive state management
- **Signals** - Fine-grained reactivity

## Design System

### Themes
Three themes with dark/light modes:
1. **Earthy Luxe** (Default) - Champagne/terracotta/sage palette
2. **Classic Green** - Original design with green accents
3. **Desert Warmth** - Peach/persian orange earth tones

### Typography
- **Primary Font**: Montserrat (400, 500, 600, 700)
- **Fallback**: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)

## Project Structure

```
src/
├── app/
│   ├── core/                    # Singleton services, guards, interceptors
│   ├── shared/                  # Reusable components, directives, pipes
│   │   ├── components/
│   │   │   ├── ui/             # UI library components
│   │   │   └── feature/        # Feature-specific reusables
│   │   ├── directives/
│   │   ├── pipes/
│   │   └── utils/
│   ├── features/               # Feature modules (lazy loaded)
│   │   ├── home/
│   │   ├── about/
│   │   ├── code/
│   │   ├── work/
│   │   ├── learnings/
│   │   └── wordmap/
│   ├── layout/                 # Layout components
│   │   ├── header/
│   │   ├── footer/
│   │   └── navigation/
│   └── data/                   # Static data
├── assets/
│   ├── images/
│   └── icons/
└── styles/
    ├── _themes.scss
    ├── _global.scss
    └── styles.scss
```

## Getting Started

### Prerequisites
- Node.js 18+ or 20+ (LTS versions recommended)
- npm 9+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build:prod

# Run tests
npm test
```

### Development Server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Features

### Routes
- `/` - Home (hero, contact, social)
- `/about` - Tech stack, timeline, hobbies
- `/code` - Project portfolio with filtering
- `/work` - Work experience sticky scroll

### Responsive Design
- Full viewport usage on all devices
- Mobile-first approach
- Support for xs (475px) to 10xl (10240px) breakpoints
- Mobile bottom navigation with safe-area support
- Touch targets: minimum 44px (iOS standard)

## Angular 2025 Best Practices

1. **Standalone Components** - No NgModules unless necessary
2. **Signal-based Reactivity** - Fine-grained change detection
3. **Feature-based Structure** - Self-contained modules
4. **Immutability** - Readonly inputs, predictable state
5. **Strong Typing** - Explicit types everywhere
6. **Modern inject()** - Preferred over constructor injection

## Resources

- [Angular Style Guide](https://angular.dev/style-guide)
- [Angular Signals](https://angular.dev/guide/signals)
- [Standalone Components](https://angular.dev/guide/components/importing)
- [RxJS Documentation](https://rxjs.dev/guide/overview)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [SCSS Documentation](https://sass-lang.com/documentation)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

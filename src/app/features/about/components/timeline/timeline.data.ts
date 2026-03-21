export interface TimelineItem {
  readonly year: string;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly side: 'left' | 'right';
}

export const TIMELINE_ITEMS: readonly TimelineItem[] = [
  {
    year: '2025 - Present',
    title: 'Software Engineer',
    description: 'Developing software solutions at Geotechnics, building robust applications and driving technical excellence in geotechnical engineering software.',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    side: 'right'
  },
  {
    year: '2022 - 2024',
    title: 'Software Developer',
    description: 'Developed scalable software for project and operations management, collaborating with teams to deliver user-centric tools.',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    side: 'left'
  },
  {
    year: '2022',
    title: 'Web Developer',
    description: 'Built full-stack applications using HTML, CSS, JavaScript, and the MERN stack, focusing on best practices for robust solutions.',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',
    side: 'right'
  },
  {
    year: '2020 - 2022',
    title: 'Estimator',
    description: 'Quoted and designed control systems, improved internal processes, and delivered tailored solutions through strong client relationships.',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>',
    side: 'left'
  },
  {
    year: '2020',
    title: 'Industrial Electrician',
    description: 'Led electrical installations in the dairy industry, mentoring apprentices and ensuring accurate equipment calibration.',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    side: 'right'
  },
  {
    year: '2019',
    title: 'Electrical Apprentice',
    description: 'Certified in instrumentation while maintaining systems, with a focus on improving reliability and process efficiency.',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>',
    side: 'left'
  },
  {
    year: '2013 - 2018',
    title: 'Fire Systems Engineer',
    description: 'Managed fire detection system installations, ensuring compliance with NZ codes and training apprentices on safety protocols.',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>',
    side: 'right'
  }
];

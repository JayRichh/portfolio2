import 'dotenv/config';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { getYearContributions, getLanguageStats, YearContributions, LanguageStats } from '../api/github/_core';

interface Snapshot {
  version: number;
  generatedAt: string | null;
  yearData: YearContributions[];
  languageData: LanguageStats | null;
}

const SNAPSHOT_VERSION = 2;
const YEARS_TO_FETCH = 5;
const OUTPUT_PATH = resolve(__dirname, '../public/assets/github-snapshot.json');

function writeSnapshot(snapshot: Snapshot): void {
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(snapshot, null, 2));
}

async function main(): Promise<void> {
  if (!process.env['GITHUB_TOKEN']) {
    console.warn('⚠️  GITHUB_TOKEN not set — writing empty snapshot placeholder (live API will be used at runtime)');
    writeSnapshot({
      version: SNAPSHOT_VERSION,
      generatedAt: null,
      yearData: [],
      languageData: null,
    });
    return;
  }

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: YEARS_TO_FETCH }, (_, i) => currentYear - i);

  console.log(`📊 Fetching GitHub snapshot for years: ${years.join(', ')}`);

  const started = Date.now();

  const [languageData, ...yearResults] = await Promise.all([
    getLanguageStats().catch(err => {
      console.warn(`⚠️  Language stats failed: ${err.message}`);
      return null;
    }),
    ...years.map(year =>
      getYearContributions(year).catch(err => {
        console.warn(`⚠️  Year ${year} failed: ${err.message}`);
        return null;
      })
    ),
  ]);

  const yearData = yearResults
    .filter((y): y is YearContributions => y !== null)
    .sort((a, b) => b.year - a.year);

  const elapsed = ((Date.now() - started) / 1000).toFixed(1);

  writeSnapshot({
    version: SNAPSHOT_VERSION,
    generatedAt: new Date().toISOString(),
    yearData,
    languageData,
  });

  console.log(`✅ Snapshot generated in ${elapsed}s → ${OUTPUT_PATH}`);
  console.log(`   Years: ${yearData.length}/${years.length}  Languages: ${languageData?.languages.length ?? 0}`);
}

main().catch(err => {
  console.error('❌ Snapshot generation failed:', err.message);
  console.warn('⚠️  Writing empty snapshot so build can continue');
  try {
    writeSnapshot({
      version: SNAPSHOT_VERSION,
      generatedAt: null,
      yearData: [],
      languageData: null,
    });
  } catch {
    /* ignore */
  }
  process.exit(0);
});

import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
  computed,
  effect,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';
import { LanguageStats, Language } from '../../../../../core/models/github.models';
import { InfoTooltipComponent } from '../../../../../shared/components/ui/info-tooltip/info-tooltip.component';
import { ChartTooltipComponent } from '../../../../../shared/components/ui/chart-tooltip/chart-tooltip.component';

interface PieSlice extends Language {
  mergedLanguages?: ReadonlyArray<Language>;
}

const TOP_N = 8;
const OTHER_COLOR = 'hsl(215, 16%, 55%)';

@Component({
  selector: 'app-language-donut',
  standalone: true,
  imports: [CommonModule, InfoTooltipComponent, ChartTooltipComponent],
  templateUrl: './language-donut.component.html',
  styleUrls: ['./language-donut.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageDonutComponent implements AfterViewInit {
  @ViewChild('svgContainer') svgContainer!: ElementRef<SVGSVGElement>;
  @ViewChild('tooltip') tooltip!: ChartTooltipComponent;

  readonly data = input.required<LanguageStats>();

  private svg?: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private viewReady = false;
  readonly highlightedSlice = signal<string | null>(null);

  constructor() {
    effect(() => {
      this.data();
      if (this.viewReady && this.svg) this.updateChart();
    });
  }

  readonly pieSlices = computed<PieSlice[]>(() => {
    const langs = this.data().languages;
    if (langs.length <= TOP_N) return langs.map(l => ({ ...l }));

    const top = langs.slice(0, TOP_N).map(l => ({ ...l }));
    const rest = langs.slice(TOP_N);
    const size = rest.reduce((s, l) => s + l.size, 0);
    const percentage = Math.round(rest.reduce((s, l) => s + l.percentage, 0) * 10) / 10;
    const lineCount = rest.reduce((s, l) => s + l.lineCount, 0);
    const fileCount = rest.reduce((s, l) => s + l.fileCount, 0);

    return [
      ...top,
      { name: 'Other', size, percentage, color: OTHER_COLOR, lineCount, fileCount, mergedLanguages: rest },
    ];
  });

  private readonly mergedLanguageNames = computed(() => {
    const other = this.pieSlices().find(s => s.name === 'Other');
    return new Set(other?.mergedLanguages?.map(l => l.name) ?? []);
  });

  readonly fullList = computed<ReadonlyArray<Language & { sliceName: string }>>(() => {
    const merged = this.mergedLanguageNames();
    return this.data().languages.map(l => ({
      ...l,
      sliceName: merged.has(l.name) ? 'Other' : l.name,
    }));
  });

  ngAfterViewInit(): void {
    this.createChart();
    this.viewReady = true;
  }

  formatNumber(num: number): string {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toLocaleString();
  }

  formatPercent(value: number): string {
    if (value >= 10) return `${Math.round(value)}%`;
    if (value >= 0.1) return `${value.toFixed(1)}%`;
    return '<0.1%';
  }

  onLanguageHover(sliceName: string): void {
    this.highlightedSlice.set(sliceName);
    this.highlightSegment(sliceName);
  }

  onLanguageLeave(): void {
    this.highlightedSlice.set(null);
    this.unhighlightAllSegments();
  }

  private createChart(): void {
    const data = this.pieSlices();
    const size = 450;
    const center = [size / 2, size / 2];

    this.svg = d3.select(this.svgContainer.nativeElement)
      .attr('viewBox', `0 0 ${size} ${size}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const arc = d3.arc<d3.PieArcDatum<PieSlice>>()
      .innerRadius(100)
      .outerRadius(180)
      .padAngle(0.02)
      .cornerRadius(4);

    const pie = d3.pie<PieSlice>()
      .value(d => d.percentage)
      .sort(null);

    const chartGroup = this.svg.append('g')
      .attr('class', 'chart-group')
      .attr('transform', `translate(${center[0]}, ${center[1]})`);

    chartGroup.selectAll('path')
      .data(pie(data))
      .join('path')
      .attr('d', arc)
      .attr('fill', d => d.data.color)
      .attr('class', 'donut-segment')
      .attr('data-name', d => d.data.name)
      .on('mouseenter', (event, d) => {
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr('transform', 'scale(1.08)');
        this.highlightedSlice.set(d.data.name);
        this.showTooltipFor(event, d.data);
      })
      .on('mousemove', (event) => {
        this.tooltip.updatePosition(event.clientX, event.clientY);
      })
      .on('mouseleave', (event) => {
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr('transform', 'scale(1)');
        this.highlightedSlice.set(null);
        this.tooltip.hide();
      });

    chartGroup.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.3em')
      .attr('class', 'center-number')
      .style('font-size', '3rem')
      .style('font-weight', '700')
      .style('fill', 'hsl(var(--foreground))')
      .text(this.data().languages.length);
  }

  private showTooltipFor(event: MouseEvent, slice: PieSlice): void {
    if (slice.name === 'Other' && slice.mergedLanguages?.length) {
      const items = slice.mergedLanguages
        .slice(0, 12)
        .map(l => ({ label: l.name, value: this.formatPercent(l.percentage) }));
      const remaining = slice.mergedLanguages.length - items.length;
      if (remaining > 0) items.push({ label: `+${remaining} more`, value: '' });
      this.tooltip.show(event.clientX, event.clientY, {
        title: `Other (${this.formatPercent(slice.percentage)})`,
        items,
      });
    } else {
      this.tooltip.show(event.clientX, event.clientY, {
        title: slice.name,
        items: [
          { label: 'Percentage', value: this.formatPercent(slice.percentage) },
          { label: 'Lines', value: this.formatNumber(slice.lineCount) },
          { label: 'Files', value: this.formatNumber(slice.fileCount) },
        ],
      });
    }
  }

  private updateChart(): void {
    if (!this.svg) return;
    this.svg.selectAll('*').remove();
    this.createChart();
  }

  private highlightSegment(sliceName: string): void {
    this.svg?.selectAll<SVGPathElement, d3.PieArcDatum<PieSlice>>('.donut-segment')
      .filter(d => d.data.name === sliceName)
      .transition()
      .duration(200)
      .attr('transform', 'scale(1.08)');
  }

  private unhighlightAllSegments(): void {
    this.svg?.selectAll('.donut-segment')
      .transition()
      .duration(200)
      .attr('transform', 'scale(1)');
  }
}

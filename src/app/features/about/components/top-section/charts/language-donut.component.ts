import {
  Component,
  input,
  signal,
  computed,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';
import { LanguageStats, Language } from '../../../../../core/models/github.models';
import { InfoTooltipComponent } from '../../../../../shared/components/ui/info-tooltip/info-tooltip.component';
import { ChartTooltipComponent } from '../../../../../shared/components/ui/chart-tooltip/chart-tooltip.component';

@Component({
  selector: 'app-language-donut',
  standalone: true,
  imports: [CommonModule, InfoTooltipComponent, ChartTooltipComponent],
  templateUrl: './language-donut.component.html',
  styleUrls: ['./language-donut.component.scss']
})
export class LanguageDonutComponent implements AfterViewInit, OnChanges {
  @ViewChild('svgContainer') svgContainer!: ElementRef<SVGSVGElement>;
  @ViewChild('tooltip') tooltip!: ChartTooltipComponent;

  readonly data = input.required<LanguageStats>();

  private svg?: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  readonly highlightedLanguage = signal<string | null>(null);

  readonly topLanguages = computed(() => {
    const primaryLanguages = ['TypeScript', 'JavaScript', 'Python', 'CSS', 'HTML', 'SCSS', 'Shell'];
    const langs = this.data().languages;

    const primary = langs.filter(l => primaryLanguages.includes(l.name));
    const others = langs.filter(l => !primaryLanguages.includes(l.name) && l.percentage >= 1);

    return [...primary, ...others].slice(0, 10);
  });

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange && this.svg) {
      this.updateChart();
    }
  }

  formatNumber(num: number): string {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toLocaleString();
  }

  onLanguageHover(name: string): void {
    this.highlightedLanguage.set(name);
    this.highlightSegment(name);
  }

  onLanguageLeave(): void {
    this.highlightedLanguage.set(null);
    this.unhighlightAllSegments();
  }

  private createChart(): void {
    const data = this.topLanguages();
    const size = 450;
    const width = size;
    const height = size;
    const center = [width / 2, height / 2];

    this.svg = d3.select(this.svgContainer.nativeElement)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const innerRadius = 100;
    const outerRadius = 180;

    const arc = d3.arc<d3.PieArcDatum<Language>>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .padAngle(0.02)
      .cornerRadius(4);

    const pie = d3.pie<Language>()
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
        this.highlightedLanguage.set(d.data.name);

        const lang = d.data;
        this.tooltip.show(event.clientX, event.clientY, {
          title: lang.name,
          items: [
            { label: 'Percentage', value: `${lang.percentage}%` },
            { label: 'Lines', value: this.formatNumber(lang.lineCount) },
            { label: 'Files', value: this.formatNumber(lang.fileCount) }
          ]
        });
      })
      .on('mousemove', (event) => {
        this.tooltip.updatePosition(event.clientX, event.clientY);
      })
      .on('mouseleave', (event) => {
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr('transform', 'scale(1)');
        this.highlightedLanguage.set(null);
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

  private updateChart(): void {
    if (!this.svg) return;

    this.svg.selectAll('*').remove();
    this.createChart();
  }

  private highlightSegment(name: string): void {
    this.svg?.selectAll<SVGPathElement, d3.PieArcDatum<Language>>('.donut-segment')
      .filter(d => d.data.name === name)
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

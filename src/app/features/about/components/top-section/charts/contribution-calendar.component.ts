import {
  Component,
  input,
  output,
  computed,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';
import { YearContributions, ContributionDay } from '../../../../../core/models/github.models';
import { InfoTooltipComponent } from '../../../../../shared/components/ui/info-tooltip/info-tooltip.component';
import { ChartTooltipComponent } from '../../../../../shared/components/ui/chart-tooltip/chart-tooltip.component';

interface MonthPosition {
  x: number;
  month: string;
}

@Component({
  selector: 'app-contribution-calendar',
  standalone: true,
  imports: [CommonModule, InfoTooltipComponent, ChartTooltipComponent],
  templateUrl: './contribution-calendar.component.html',
  styleUrls: ['./contribution-calendar.component.scss']
})
export class ContributionCalendarComponent implements AfterViewInit, OnChanges {
  @ViewChild('svgContainer') svgContainer!: ElementRef<SVGSVGElement>;
  @ViewChild('tooltip') tooltip!: ChartTooltipComponent;

  readonly data = input.required<YearContributions>();
  readonly isLoadingYear = input<boolean>(false);
  readonly currentYearIndex = input<number>(0);
  readonly totalYears = input<number>(1);

  readonly previousYear = output<void>();
  readonly nextYear = output<void>();

  private svg?: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private readonly cellSize = 16;
  private readonly cellGap = 3;

  readonly isLoadingPrevious = computed(() =>
    this.isLoadingYear() && this.currentYearIndex() < this.totalYears() - 1
  );

  readonly isLoadingNext = computed(() =>
    this.isLoadingYear() && this.currentYearIndex() > 0
  );

  readonly levels = [0, 1, 2, 3, 4];

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange && this.svg) {
      this.updateChart();
    }
  }

  canGoPrevious(): boolean {
    return this.currentYearIndex() < this.totalYears() - 1;
  }

  canGoNext(): boolean {
    return this.currentYearIndex() > 0;
  }

  formatNumber(num: number): string {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toLocaleString();
  }

  getColor(level: number): string {
    const colors = [
      'hsl(var(--muted))',
      'hsl(var(--primary) / 0.3)',
      'hsl(var(--primary) / 0.5)',
      'hsl(var(--primary) / 0.7)',
      'hsl(var(--primary))'
    ];
    return colors[level] || colors[0];
  }

  onPreviousYear(): void {
    if (!this.isLoadingYear() && this.canGoPrevious()) {
      this.previousYear.emit();
    }
  }

  onNextYear(): void {
    if (!this.isLoadingYear() && this.canGoNext()) {
      this.nextYear.emit();
    }
  }

  private createChart(): void {
    const data = this.data();
    const weeks = this.groupByWeek(data.contributions);

    const width = weeks.length * (this.cellSize + this.cellGap);
    const height = 7 * (this.cellSize + this.cellGap) + 20;

    this.svg = d3.select(this.svgContainer.nativeElement)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const monthPositions = this.getMonthPositions(weeks);

    const mutedForeground = getComputedStyle(document.documentElement)
      .getPropertyValue('--muted-foreground')
      .trim();

    this.svg.append('g')
      .attr('class', 'months')
      .selectAll('text')
      .data(monthPositions)
      .join('text')
      .attr('x', d => d.x)
      .attr('y', 10)
      .attr('class', 'month-label')
      .attr('fill', `hsl(${mutedForeground})`)
      .attr('font-size', '0.75rem')
      .attr('font-family', 'var(--font-sans)')
      .text(d => d.month);

    const weeksGroup = this.svg.append('g')
      .attr('class', 'weeks')
      .attr('transform', 'translate(0, 20)');

    weeksGroup.selectAll('g')
      .data(weeks)
      .join('g')
      .attr('transform', (d, i) => `translate(${i * (this.cellSize + this.cellGap)}, 0)`)
      .selectAll('rect')
      .data(d => d)
      .join('rect')
      .attr('y', (d, i) => i * (this.cellSize + this.cellGap))
      .attr('width', this.cellSize)
      .attr('height', this.cellSize)
      .attr('rx', 2)
      .attr('fill', d => this.getColor(d.value))
      .attr('class', 'contribution-cell')
      .on('mouseenter', (event, d) => {
        d3.select(event.currentTarget)
          .attr('stroke', 'hsl(var(--foreground))')
          .attr('stroke-width', 1.5);

        const date = new Date(d.day).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
        const contributions = d.value === 0 ? 'No' : d.value.toString();
        const plural = d.value === 1 ? 'contribution' : 'contributions';

        this.tooltip.show(event.clientX, event.clientY, {
          title: date,
          items: [
            { label: 'Contributions', value: `${contributions} ${plural}` }
          ]
        });
      })
      .on('mousemove', (event) => {
        this.tooltip.updatePosition(event.clientX, event.clientY);
      })
      .on('mouseleave', (event) => {
        d3.select(event.currentTarget)
          .attr('stroke', 'none');
        this.tooltip.hide();
      });
  }

  private updateChart(): void {
    if (!this.svg) return;

    this.svg.selectAll('*').remove();
    this.createChart();
  }

  private groupByWeek(days: readonly ContributionDay[]): ContributionDay[][] {
    const weeks: ContributionDay[][] = [];
    const daysArray = [...days];

    for (let i = 0; i < daysArray.length; i += 7) {
      weeks.push(daysArray.slice(i, i + 7));
    }

    return weeks;
  }

  private getMonthPositions(weeks: ContributionDay[][]): MonthPosition[] {
    const months: MonthPosition[] = [];
    const seenMonths = new Set<string>();

    weeks.forEach((week, weekIndex) => {
      if (week.length === 0) return;

      const firstDay = new Date(week[0].day);
      const monthKey = `${firstDay.getFullYear()}-${firstDay.getMonth()}`;

      if (firstDay.getDate() <= 7 && !seenMonths.has(monthKey)) {
        seenMonths.add(monthKey);
        months.push({
          x: weekIndex * (this.cellSize + this.cellGap),
          month: firstDay.toLocaleDateString('en-US', { month: 'short' })
        });
      }
    });

    return months;
  }
}

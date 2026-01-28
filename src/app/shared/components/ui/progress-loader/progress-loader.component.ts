import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-loader.component.html',
  styleUrls: ['./progress-loader.component.scss']
})
export class ProgressLoaderComponent {
  readonly progress = input.required<number>();
  readonly message = input<string>('');
  readonly compact = input<boolean>(false);

  readonly displayMessage = computed(() => {
    if (this.message()) {
      return this.message();
    }

    const prog = this.progress();
    if (prog < 10) return 'Initializing connection...';
    if (prog < 20) return 'Connecting to GitHub API...';
    if (prog < 30) return 'Fetching recent contributions...';
    if (prog < 40) return 'Processing contribution data...';
    if (prog < 50) return 'Analyzing contribution patterns...';
    if (prog < 60) return 'Organizing contribution history...';
    if (prog < 70) return 'Fetching repository data...';
    if (prog < 80) return 'Processing language statistics...';
    if (prog < 90) return 'Analyzing code distribution...';
    if (prog < 95) return 'Finalizing data processing...';
    if (prog < 100) return 'Preparing visualization...';
    return 'Complete';
  });
}

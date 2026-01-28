import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-learnings-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-background">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-foreground mb-4">Learnings</h1>
        <p class="text-muted-foreground">Learnings page placeholder</p>
      </div>
    </div>
  `,
  styles: []
})
export class LearningsPageComponent {}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hero-quadrant',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hero-quadrant.component.html',
  styleUrl: './hero-quadrant.component.scss'
})
export class HeroQuadrantComponent {}

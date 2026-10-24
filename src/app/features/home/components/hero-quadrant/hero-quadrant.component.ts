import { Component, ChangeDetectionStrategy } from '@angular/core';

import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-hero-quadrant',
    imports: [RouterModule],
    templateUrl: './hero-quadrant.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './hero-quadrant.component.scss'
})
export class HeroQuadrantComponent {}

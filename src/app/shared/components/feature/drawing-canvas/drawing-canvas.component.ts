import { Component, AfterViewInit, ViewChild, ElementRef, signal, computed, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { SliderComponent } from '@shared/components/ui/slider/slider.component';
import { BrowserPlatformService } from '@core/services/browser-platform.service';
import { BrushType, BrushTypeOption } from '../contact-form/models/brush-type.interface';

const STORAGE_KEY = 'savedDrawing';
const PRESET_COLORS = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF'];

const BRUSH_TYPES: readonly BrushTypeOption[] = [
  { type: 'normal', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 22a5 5 0 0 1-2-4"/><path d="M12 13a3 3 0 0 0 0-6H9v6"/><path d="M12 13a3 3 0 0 1 0 6H9v-6"/></svg>', label: 'Normal' },
  { type: 'rainbow', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364-.707-.707M6.343 6.343l-.707-.707m12.728 0-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"/></svg>', label: 'Rainbow' },
  { type: 'symmetry', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m17 17 4-4-4-4"/><path d="m7 7-4 4 4 4"/><path d="M3 13h18M3 11h18"/></svg>', label: 'Symmetry' },
  { type: 'pattern', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="18" cy="18" r="3"/></svg>', label: 'Pattern' },
  { type: 'eraser', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>', label: 'Eraser' }
];

@Component({
  selector: 'app-drawing-canvas',
  standalone: true,
  imports: [CommonModule, ButtonComponent, SliderComponent],
  templateUrl: './drawing-canvas.component.html',
  styleUrls: ['./drawing-canvas.component.scss']
})
export class DrawingCanvasComponent implements AfterViewInit {
  @ViewChild('canvas') canvasRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasContainer') canvasContainerRef?: ElementRef<HTMLDivElement>;

  readonly drawingChange = output<string | null>();

  private readonly platform = inject(BrowserPlatformService);
  private ctx?: CanvasRenderingContext2D | null;

  readonly brushColor = signal('#000000');
  readonly brushSize = signal(2);
  readonly brushType = signal<BrushType>('normal');
  readonly isDrawing = signal(false);
  readonly cursorPosition = signal({ x: 0, y: 0 });
  readonly isOverCanvas = signal(false);
  readonly isBrushMenuOpen = signal(false);
  readonly isColorPickerOpen = signal(false);
  readonly alertMessage = signal<string | null>(null);
  readonly canvasUsed = signal(false);

  readonly brushTypes = BRUSH_TYPES;
  readonly presetColors = PRESET_COLORS;

  readonly currentBrush = computed(() => this.brushTypes.find(b => b.type === this.brushType()));
  readonly currentBrushIcon = computed(() => this.currentBrush()?.icon ?? '');
  readonly currentBrushLabel = computed(() => this.currentBrush()?.label ?? '');

  ngAfterViewInit(): void {
    if (!this.platform.isBrowser || !this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    this.ctx = canvas.getContext('2d');
    if (this.ctx) {
      this.ctx.lineCap = 'round';
      this.ctx.strokeStyle = this.brushColor();
      this.ctx.lineWidth = this.brushSize();
    }
    this.loadDrawing();
  }

  setBrushType(type: BrushType): void {
    this.brushType.set(type);
    this.isBrushMenuOpen.set(false);
  }

  setBrushColor(color: string): void {
    this.brushColor.set(color);
    if (this.ctx) this.ctx.strokeStyle = color;
  }

  setBrushSize(size: number): void {
    this.brushSize.set(size);
    if (this.ctx) this.ctx.lineWidth = size;
  }

  startDrawing(event: PointerEvent): void {
    this.isDrawing.set(true);
    this.canvasUsed.set(true);
    this.draw(event);
  }

  stopDrawing(): void {
    this.isDrawing.set(false);
    if (this.ctx) this.ctx.beginPath();
    this.saveDrawing();
  }

  draw(event: PointerEvent): void {
    if (!this.isDrawing() || !this.ctx || !this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    switch (this.brushType()) {
      case 'normal': this.drawNormal(x, y); break;
      case 'rainbow': this.drawRainbow(x, y); break;
      case 'symmetry': this.drawSymmetry(x, y); break;
      case 'pattern': this.drawPattern(x, y); break;
      case 'eraser': this.erase(x, y); break;
    }
  }

  updateCursorPosition(event: PointerEvent): void {
    if (!this.canvasContainerRef) return;
    const rect = this.canvasContainerRef.nativeElement.getBoundingClientRect();
    this.cursorPosition.set({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  }

  clearCanvas(): void {
    if (!this.ctx || !this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.platform.storage.remove(STORAGE_KEY);
    this.canvasUsed.set(false);
    this.drawingChange.emit(null);
    this.showAlert('Canvas cleared!');
  }

  downloadImage(): void {
    if (!this.canvasRef || !this.platform.isBrowser) return;
    const link = this.platform.document.createElement('a');
    link.download = 'drawing.png';
    link.href = this.canvasRef.nativeElement.toDataURL();
    link.click();
    this.showAlert('Image downloaded!');
  }

  copyToClipboard(): void {
    if (!this.canvasRef || !this.platform.isBrowser) return;
    this.canvasRef.nativeElement.toBlob(blob => {
      if (!blob) return;
      const item = new ClipboardItem({ 'image/png': blob });
      navigator.clipboard.write([item]).then(
        () => this.showAlert('Copied to clipboard!'),
        () => this.showAlert('Failed to copy')
      );
    });
  }

  reset(): void {
    this.clearCanvas();
  }

  getDrawingData(): string | null {
    if (!this.canvasRef || !this.canvasUsed()) return null;
    const dataUrl = this.canvasRef.nativeElement.toDataURL('image/png');
    return dataUrl.split(',')[1] ?? null;
  }

  private drawNormal(x: number, y: number): void {
    if (!this.ctx) return;
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
  }

  private drawRainbow(x: number, y: number): void {
    if (!this.ctx) return;
    const hue = (x + y) % 360;
    this.ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
  }

  private drawSymmetry(x: number, y: number): void {
    if (!this.ctx || !this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const points = [[x, y], [cx - (x - cx), y], [x, cy - (y - cy)], [cx - (x - cx), cy - (y - cy)]];
    points.forEach(([px, py]) => {
      this.ctx!.beginPath();
      this.ctx!.arc(px, py, this.brushSize() / 2, 0, Math.PI * 2);
      this.ctx!.fill();
    });
  }

  private drawPattern(x: number, y: number): void {
    if (!this.ctx) return;
    for (let i = 0; i < 5; i++) {
      const ox = (Math.random() - 0.5) * 20;
      const oy = (Math.random() - 0.5) * 20;
      this.ctx.beginPath();
      this.ctx.arc(x + ox, y + oy, this.brushSize() / 2, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  private erase(x: number, y: number): void {
    if (!this.ctx) return;
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.brushSize() * 2, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.globalCompositeOperation = 'source-over';
  }

  private saveDrawing(): void {
    if (!this.canvasRef) return;
    const data = this.canvasRef.nativeElement.toDataURL();
    this.platform.storage.set(STORAGE_KEY, data);
    this.drawingChange.emit(this.getDrawingData());
  }

  private loadDrawing(): void {
    if (!this.ctx || !this.canvasRef) return;
    const saved = this.platform.storage.get(STORAGE_KEY);
    if (!saved) return;
    const img = new Image();
    img.onload = () => {
      this.ctx?.drawImage(img, 0, 0);
      this.canvasUsed.set(true);
      this.drawingChange.emit(this.getDrawingData());
    };
    img.src = saved;
  }

  private showAlert(message: string): void {
    this.alertMessage.set(message);
    setTimeout(() => this.alertMessage.set(null), 3000);
  }
}

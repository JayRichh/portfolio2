import { Component, ViewChild, ElementRef, AfterViewInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { InputComponent } from '@shared/components/ui/input/input.component';
import { TextareaComponent } from '@shared/components/ui/textarea/textarea.component';
import { SliderComponent } from '@shared/components/ui/slider/slider.component';
import { BrushType, BrushTypeOption } from './models/brush-type.interface';
import { FormData, FormStatus } from './models/form-data.interface';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, InputComponent, TextareaComponent, SliderComponent],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements AfterViewInit {
  private readonly http = inject(HttpClient);

  @ViewChild('canvas') canvasRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasContainer') canvasContainerRef?: ElementRef<HTMLDivElement>;

  private ctx?: CanvasRenderingContext2D | null;

  // Rate limiting
  private lastChallengeTime = 0;
  private challengeAttempts = 0;
  private readonly CHALLENGE_COOLDOWN_MS = 2000; // 2 seconds between requests
  private readonly MAX_CHALLENGES_PER_MINUTE = 30;
  private challengeTimestamps: number[] = [];

  // Verification caching (24 hours)
  private readonly VERIFICATION_CACHE_KEY = 'human-verification';
  private readonly VERIFICATION_EXPIRY = 24 * 60 * 60 * 1000;

  readonly formData = signal<FormData>({ name: '', email: '', message: '' });
  readonly brushColor = signal('#000000');
  readonly brushSize = signal(2);
  readonly isDrawing = signal(false);
  readonly cursorPosition = signal({ x: 0, y: 0 });
  readonly isOverCanvas = signal(false);
  readonly alertMessage = signal<string | null>(null);
  readonly brushType = signal<BrushType>('normal');
  readonly status = signal<FormStatus | null>(null);
  readonly canvasUsed = signal(false);
  readonly challenge = signal('');
  readonly userAnswer = signal('');
  readonly sessionId = signal<string | null>(null);
  readonly isBrushMenuOpen = signal(false);
  readonly isColorPickerOpen = signal(false);
  readonly isSubmitting = signal(false);
  readonly fieldErrors = signal<{ name?: string; email?: string; message?: string }>({});
  readonly isChallengeLoading = signal(false);

  readonly brushTypes: readonly BrushTypeOption[] = [
    { type: 'normal', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 22a5 5 0 0 1-2-4"/><path d="M12 13a3 3 0 0 0 0-6H9v6"/><path d="M12 13a3 3 0 0 1 0 6H9v-6"/></svg>', label: 'Normal' },
    { type: 'rainbow', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364-.707-.707M6.343 6.343l-.707-.707m12.728 0-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"/></svg>', label: 'Rainbow' },
    { type: 'symmetry', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m17 17 4-4-4-4"/><path d="m7 7-4 4 4 4"/><path d="M3 13h18M3 11h18"/></svg>', label: 'Symmetry' },
    { type: 'pattern', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="18" cy="18" r="3"/></svg>', label: 'Pattern' },
    { type: 'eraser', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>', label: 'Eraser' }
  ];

  readonly presetColors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF'];

  readonly currentBrush = computed(() => this.brushTypes.find(b => b.type === this.brushType()));
  readonly currentBrushIcon = computed(() => this.currentBrush()?.icon || '');
  readonly currentBrushLabel = computed(() => this.currentBrush()?.label || '');
  readonly statusSuccess = computed(() => this.status()?.success || false);
  readonly statusMessage = computed(() => this.status()?.message || '');

  get formDataName(): string {
    return this.formData().name;
  }
  set formDataName(value: string) {
    this.formData.set({ ...this.formData(), name: value });
  }

  get formDataEmail(): string {
    return this.formData().email;
  }
  set formDataEmail(value: string) {
    this.formData.set({ ...this.formData(), email: value });
  }

  get formDataMessage(): string {
    return this.formData().message;
  }
  set formDataMessage(value: string) {
    this.formData.set({ ...this.formData(), message: value });
  }

  get userAnswerValue(): string {
    return this.userAnswer();
  }
  set userAnswerValue(value: string) {
    this.userAnswer.set(value);
  }

  ngAfterViewInit(): void {
    if (this.canvasRef) {
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
    this.loadCachedVerification() || this.fetchChallenge();
  }

  private loadCachedVerification(): boolean {
    try {
      const cached = localStorage.getItem(this.VERIFICATION_CACHE_KEY);
      if (!cached) return false;

      const { challenge, sessionId, timestamp } = JSON.parse(cached);

      if (Date.now() - timestamp > this.VERIFICATION_EXPIRY) {
        localStorage.removeItem(this.VERIFICATION_CACHE_KEY);
        return false;
      }

      this.challenge.set(challenge);
      this.sessionId.set(sessionId);
      return true;
    } catch {
      return false;
    }
  }

  private saveCachedVerification(): void {
    try {
      const data = {
        challenge: this.challenge(),
        sessionId: this.sessionId(),
        timestamp: Date.now()
      };
      localStorage.setItem(this.VERIFICATION_CACHE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to cache verification:', error);
    }
  }

  fetchChallenge(): void {
    const now = Date.now();

    // Clean up old timestamps (older than 1 minute)
    this.challengeTimestamps = this.challengeTimestamps.filter(
      (timestamp) => now - timestamp < 60000
    );

    // Check if rate limit exceeded
    if (this.challengeTimestamps.length >= this.MAX_CHALLENGES_PER_MINUTE) {
      this.status.set({
        success: false,
        message: `Too many verification requests. Please try again later.`
      });
      return;
    }

    // Check cooldown
    if (now - this.lastChallengeTime < this.CHALLENGE_COOLDOWN_MS) {
      this.status.set({
        success: false,
        message: `Please wait ${Math.ceil((this.CHALLENGE_COOLDOWN_MS - (now - this.lastChallengeTime)) / 1000)}s before requesting a new challenge`
      });
      return;
    }

    this.isChallengeLoading.set(true);
    this.lastChallengeTime = now;
    this.challengeTimestamps.push(now);

    this.http.get<{ challenge: string; sessionId: string }>('/api/verify-human').subscribe({
      next: (data) => {
        this.challenge.set(data.challenge);
        this.sessionId.set(data.sessionId);
        this.saveCachedVerification();
        this.isChallengeLoading.set(false);
      },
      error: () => {
        this.isChallengeLoading.set(false);
        this.status.set({ success: false, message: 'Failed to load verification challenge' });
      }
    });
  }

  setBrushType(type: BrushType): void {
    this.brushType.set(type);
    this.isBrushMenuOpen.set(false);
  }

  setBrushColor(color: string): void {
    this.brushColor.set(color);
    if (this.ctx) {
      this.ctx.strokeStyle = color;
    }
  }

  setBrushSize(size: number): void {
    this.brushSize.set(size);
    if (this.ctx) {
      this.ctx.lineWidth = size;
    }
  }

  startDrawing(event: PointerEvent): void {
    this.isDrawing.set(true);
    this.canvasUsed.set(true);
    this.draw(event);
  }

  stopDrawing(): void {
    this.isDrawing.set(false);
    if (this.ctx) {
      this.ctx.beginPath();
    }
    this.saveDrawing();
  }

  draw(event: PointerEvent): void {
    if (!this.isDrawing() || !this.ctx || !this.canvasRef) return;

    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const type = this.brushType();
    switch (type) {
      case 'normal':
        this.drawNormal(x, y);
        break;
      case 'rainbow':
        this.drawRainbow(x, y);
        break;
      case 'symmetry':
        this.drawSymmetry(x, y);
        break;
      case 'pattern':
        this.drawPattern(x, y);
        break;
      case 'eraser':
        this.erase(x, y);
        break;
    }
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
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    [
      [x, y],
      [centerX - (x - centerX), y],
      [x, centerY - (y - centerY)],
      [centerX - (x - centerX), centerY - (y - centerY)]
    ].forEach(([px, py]) => {
      this.ctx!.beginPath();
      this.ctx!.arc(px, py, this.brushSize() / 2, 0, Math.PI * 2);
      this.ctx!.fill();
    });
  }

  private drawPattern(x: number, y: number): void {
    if (!this.ctx) return;
    for (let i = 0; i < 5; i++) {
      const offsetX = (Math.random() - 0.5) * 20;
      const offsetY = (Math.random() - 0.5) * 20;
      this.ctx.beginPath();
      this.ctx.arc(x + offsetX, y + offsetY, this.brushSize() / 2, 0, Math.PI * 2);
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

  updateCursorPosition(event: PointerEvent): void {
    if (!this.canvasContainerRef) return;
    const rect = this.canvasContainerRef.nativeElement.getBoundingClientRect();
    this.cursorPosition.set({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
  }

  clearCanvas(): void {
    if (!this.ctx || !this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('savedDrawing');
    }
    this.showAlert('Canvas cleared!');
  }

  downloadImage(): void {
    if (!this.canvasRef) return;
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = this.canvasRef.nativeElement.toDataURL();
    link.click();
    this.showAlert('Image downloaded!');
  }

  copyToClipboard(): void {
    if (!this.canvasRef) return;
    this.canvasRef.nativeElement.toBlob((blob) => {
      if (blob) {
        const item = new ClipboardItem({ 'image/png': blob });
        navigator.clipboard.write([item]).then(
          () => this.showAlert('Copied to clipboard!'),
          () => this.showAlert('Failed to copy')
        );
      }
    });
  }

  private saveDrawing(): void {
    if (!this.canvasRef || typeof localStorage === 'undefined') return;
    localStorage.setItem('savedDrawing', this.canvasRef.nativeElement.toDataURL());
  }

  private loadDrawing(): void {
    if (!this.ctx || !this.canvasRef || typeof localStorage === 'undefined') return;
    const saved = localStorage.getItem('savedDrawing');
    if (saved) {
      const img = new Image();
      img.onload = () => {
        this.ctx?.drawImage(img, 0, 0);
      };
      img.src = saved;
    }
  }

  private showAlert(message: string): void {
    this.alertMessage.set(message);
    setTimeout(() => this.alertMessage.set(null), 3000);
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const data = this.formData();
    const errors: { name?: string; email?: string; message?: string } = {};

    // Validate fields
    if (!data.name?.trim()) {
      errors.name = 'Name is required';
    }
    if (!data.email?.trim()) {
      errors.email = 'Email is required';
    }
    if (!data.message?.trim()) {
      errors.message = 'Message is required';
    }

    // Set field errors
    this.fieldErrors.set(errors);

    // Check if there are any errors
    if (Object.keys(errors).length > 0) {
      this.status.set({ success: false, message: 'Please fill in all required fields' });
      return;
    }

    if (!this.canvasUsed() && (!data.name || !data.email || !data.message)) {
      this.status.set({ success: false, message: 'Please fill in all fields or draw something' });
      return;
    }

    if (!this.userAnswer()) {
      this.status.set({ success: false, message: 'Please answer the verification question' });
      return;
    }

    if (!this.sessionId()) {
      this.status.set({ success: false, message: 'Session expired. Please refresh the page.' });
      return;
    }

    this.isSubmitting.set(true);

    try {
      let drawing: string | null = null;
      if (this.canvasRef) {
        drawing = this.canvasRef.nativeElement.toDataURL('image/png');
      }

      const verifyRes = await this.http.post('/api/verify-human', {
        userAnswer: parseInt(this.userAnswer()),
        sessionId: this.sessionId()
      }).toPromise();

      this.saveCachedVerification();

      const emailRes = await this.http.post('/api/send-email', {
        ...data,
        drawing: drawing ? drawing.split(',')[1] : null
      }).toPromise();

      this.status.set({ success: true, message: 'Message sent successfully!' });
      this.clearForm();
    } catch (error: any) {
      const errorMessage = error?.error?.error || 'Failed to send message. Please try again.';
      this.status.set({ success: false, message: errorMessage });
    } finally {
      this.isSubmitting.set(false);
    }
  }

  clearForm(): void {
    this.formData.set({ name: '', email: '', message: '' });
    this.userAnswer.set('');
    this.fieldErrors.set({});
    this.clearCanvas();
    this.canvasUsed.set(false);
  }
}

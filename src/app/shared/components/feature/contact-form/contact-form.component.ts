import { Component, OnInit, signal, computed, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { InputComponent } from '@shared/components/ui/input/input.component';
import { TextareaComponent } from '@shared/components/ui/textarea/textarea.component';
import { DrawingCanvasComponent } from '@shared/components/feature/drawing-canvas/drawing-canvas.component';
import { FormData, FormStatus } from './models/form-data.interface';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    InputComponent,
    TextareaComponent,
    DrawingCanvasComponent
  ],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {
  @ViewChild(DrawingCanvasComponent) canvas?: DrawingCanvasComponent;

  private readonly http = inject(HttpClient);

  readonly formData = signal<FormData>({ name: '', email: '', message: '' });
  readonly honeypot = signal('');
  readonly formToken = signal<string | null>(null);
  readonly status = signal<FormStatus | null>(null);
  readonly fieldErrors = signal<Partial<Record<keyof FormData, string>>>({});
  readonly isSubmitting = signal(false);

  readonly statusSuccess = computed(() => this.status()?.success ?? false);
  readonly statusMessage = computed(() => this.status()?.message ?? '');

  ngOnInit(): void {
    this.fetchFormToken();
  }

  updateField<K extends keyof FormData>(key: K, value: FormData[K]): void {
    this.formData.update(prev => ({ ...prev, [key]: value }));
    if (this.fieldErrors()[key]) {
      this.fieldErrors.update(prev => ({ ...prev, [key]: undefined }));
    }
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const data = this.formData();
    const errors: Partial<Record<keyof FormData, string>> = {};
    if (!data.name.trim()) errors.name = 'Name is required';
    if (!data.email.trim()) errors.email = 'Email is required';
    if (!data.message.trim()) errors.message = 'Message is required';
    this.fieldErrors.set(errors);

    if (Object.keys(errors).length > 0) {
      this.status.set({ success: false, message: 'Please fill in all required fields' });
      return;
    }

    if (!this.formToken()) {
      await this.fetchFormToken();
    }
    const token = this.formToken();
    if (!token) {
      this.status.set({ success: false, message: 'Could not initialize form. Please refresh.' });
      return;
    }

    this.isSubmitting.set(true);
    try {
      const drawing = this.canvas?.getDrawingData() ?? null;
      await firstValueFrom(this.http.post('/api/send-email', {
        ...data,
        drawing,
        formToken: token,
        website: this.honeypot()
      }));
      this.status.set({ success: true, message: 'Message sent successfully!' });
      this.clearForm();
      await this.fetchFormToken();
    } catch (error) {
      const errorMessage = (error as { error?: { error?: string } })?.error?.error ?? 'Failed to send message. Please try again.';
      this.status.set({ success: false, message: errorMessage });
      await this.fetchFormToken();
    } finally {
      this.isSubmitting.set(false);
    }
  }

  clearForm(): void {
    this.formData.set({ name: '', email: '', message: '' });
    this.honeypot.set('');
    this.fieldErrors.set({});
    this.canvas?.reset();
  }

  private async fetchFormToken(): Promise<void> {
    try {
      const res = await firstValueFrom(this.http.get<{ formToken: string }>('/api/send-email'));
      this.formToken.set(res.formToken);
    } catch {
      this.formToken.set(null);
    }
  }
}

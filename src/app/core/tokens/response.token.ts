import { InjectionToken } from '@angular/core';

export interface ResponseState {
  status?: number;
}

export const RESPONSE_INIT = new InjectionToken<ResponseState>('RESPONSE_INIT');

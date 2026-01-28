export type BrushType = 'normal' | 'rainbow' | 'symmetry' | 'pattern' | 'eraser';

export interface BrushTypeOption {
  readonly type: BrushType;
  readonly icon: string;
  readonly label: string;
}

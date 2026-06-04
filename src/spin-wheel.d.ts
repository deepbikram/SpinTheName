declare module 'spin-wheel' {
  // Minimal typings to satisfy TypeScript for this app.
  export type WheelItem = {
    label: string;
    weight?: number;
    [key: string]: any;
  };

  export type WheelProps = {
    isInteractive?: boolean;
    radius?: number;
    rotationResistance?: number;
    itemLabelRadius?: number;
    itemLabelRadiusMax?: number;
    itemLabelRotation?: number;
    itemLabelAlign?: string;
    itemLabelColors?: string[];
    itemLabelBaselineOffset?: number;
    itemLabelFont?: string;
    itemLabelFontSizeMax?: number;
    itemBackgroundColors?: string[];
    rotationSpeedMax?: number;
    lineWidth?: number;
    lineColor?: string;
    items?: WheelItem[];
    [key: string]: any;
  };

  export class Wheel {
    constructor(container: any, props: WheelProps);
    items: WheelItem[];
    rotationResistance: number;
    itemLabelRadiusMax: number;
    itemBackgroundColors: string[];
    itemLabelFont: string;
    itemLabelFontSizeMax: number;
    rotationSpeedMax: number;

    onRest?: (event: any) => void;
    onSpin?: () => void;
    onCurrentIndexChange?: (index: number) => void;

    spin(speed: number): void;
    spinToItem(index: number, duration?: number, easing?: boolean, rotations?: number, direction?: number): void;
    stop(): void;
  }
}

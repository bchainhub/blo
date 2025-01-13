// The data structure needed to render an icon.
export type Address = string;

// 4x8 grid of the image left side, as 32 PaletteIndex items.
// The right side is omitted as it's a mirror of the left side.
export type BloImage = [Uint8Array, Palette];

// Colors used by a given icon.
export type Palette = {
  background: Hsl;
  primary: Hsl;
  accent: Hsl;
};

// Or using const for better type inference
export const PaletteIndexes = {
  BACKGROUND: 0,
  PRIMARY: 1,
  ACCENT: 2,
} as const;
export type PaletteIndex = 0 | 1 | 2;

// A color in the HSL color space.
// [0]: 0-360 (hue)
// [1]: 0-100 (saturation)
// [2]: 0-100 (lightness)
export type Hsl = Uint16Array;

// Add size constraints
export type ValidSize = number;
// Or more strictly:
// export type ValidSize = 16 | 32 | 64 | 128 | 256;

// Function signatures with improved type safety
export type BloFunction = (address: Address, options: BloOptions) => string;
export type BloSvgFunction = (address: Address, options: BloOptions) => string;
export type BloImageFunction = (address: Address, options: BloOptions) => BloImage;

export type HslValues = {
  hue: number;        // 0-360
  saturation: number; // 0-100
  lightness: number;  // 0-100
};

export interface BloOptions {
  size?: number;
  seed?: string;
}

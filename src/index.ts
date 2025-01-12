import type { Address, BloImage, BloOptions } from "./types";
import { image } from "./image";
import { svg } from "./svg";

export type {
  Address,
  BloImage,
  BloImageData,
  BloOptions,
  Hsl,
  Palette,
  PaletteIndex,
} from "./types";

const DEFAULT_OPTIONS: BloOptions = {
  size: 64,
  seed: undefined
};

export function blo(address: Address, options: BloOptions = {}): string {
  return "data:image/svg+xml;base64," + btoa(bloSvg(address, options));
}

export function bloSvg(address: Address, options: BloOptions = {}): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  return svg(address, opts);
}

export function bloImage(address: Address, options: BloOptions = {}): BloImage {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  return image(address, opts);
}

import type { Address, BloImage } from "./types";

import { image } from "./image";
import { svg } from "./svg";

export type {
  Address,
  BloImage,
  BloImageData,
  Hsl,
  Palette,
  PaletteIndex,
} from "./types";

export function blo(address: Address, uppercase: boolean = true, size: number = 64): string {
  return "data:image/svg+xml;base64," + btoa(bloSvg(address, uppercase, size));
}

export function bloSvg(address: Address, uppercase: boolean = true, size: number = 64): string {
  const processedAddress = uppercase ? address.toUpperCase() : address;
  return svg(processedAddress, size);
}

export function bloImage(address: Address, uppercase: boolean = true): BloImage {
  const processedAddress = uppercase ? address.toUpperCase() : address;
  return image(processedAddress);
}

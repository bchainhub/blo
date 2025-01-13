import type { Address, BloImage, BloOptions, Hsl, Palette } from "./types";
import { seedRandom } from "./random";

// Pre-calculate constants
const COLOR_THRESHOLD = 2.3;
const SATURATION_BASE = 40;
const SATURATION_RANGE = 60;
const LIGHTNESS_DIVISOR = 25;

export function image(address: Address, options: BloOptions = {}): BloImage {
  const { seed } = options;
  const random = seedRandom(seed || address.toLowerCase());
  const palette = randomPalette(random);
  const data = randomImageData(random);
  return [data, palette];
}

export function randomImageData(random: () => number): Uint8Array {
  // Use a single allocation
  const data = new Uint8Array(32);

  // Unroll the loop for better performance
  for (let i = 0; i < 32; i += 4) {
    data[i] = Math.floor(random() * COLOR_THRESHOLD);
    data[i + 1] = Math.floor(random() * COLOR_THRESHOLD);
    data[i + 2] = Math.floor(random() * COLOR_THRESHOLD);
    data[i + 3] = Math.floor(random() * COLOR_THRESHOLD);
  }

  return data;
}

export function randomPalette(random: () => number): Palette {
  return {
    primary: randomColor(random),
    background: randomColor(random),
    accent: randomColor(random)
  };
}

export function randomColor(rand: () => number): Hsl {
  // Pre-allocate the array
  const color = new Uint16Array(3);

  // Optimize calculations
  color[0] = rand() * 360;
  color[1] = SATURATION_BASE + (rand() * SATURATION_RANGE);
  color[2] = (rand() + rand() + rand() + rand()) * LIGHTNESS_DIVISOR;

  return color;
}

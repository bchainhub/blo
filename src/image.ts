import type { Address, BloImage, BloImageData, Hsl, Palette, PaletteIndex } from "./types";

import { seedRandom } from "./random";

// The random() calls must happen in this exact order:
// 1. palette: main color (6 calls)
// 2. palette: background (6 calls)
// 3. palette: spot color (6 calls)
// 4. image data (32 calls)

export function image(address: Address): BloImage {
  const random = seedRandom(address.toLowerCase());
  const palette = randomPalette(random);
  const data = randomImageData(random);
  return [data, palette];
}

export function randomImageData(random: () => number): BloImageData {
  const data = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    data[i] = Math.floor(
      // background: 43% chances
      // color:      43% chances
      // spot:       13% chances
      random() * 2.3,
    ) as PaletteIndex; // guaranteed to be 0 | 1 | 2
  }
  return data;
}

export function randomPalette(random: () => number): Palette {
  // calls order is significant
  const primary = randomColor(random);
  const background = randomColor(random);
  const accent = randomColor(random);
  return { background, primary, accent };
}

export function randomColor(rand: () => number): Hsl {
  // Math.floor() calls omitted since Uint16Array() does it
  return new Uint16Array([
    // hue = 0 to 360 (whole color spectrum)
    rand() * 360,
    // saturation = 40 to 100 (avoid greyish colors)
    40 + rand() * 60,
    // lightness = 0 to 100 but probabilities are a bell curve around 50%
    (rand() + rand() + rand() + rand()) * 25,
  ]);
}

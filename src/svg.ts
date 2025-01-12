import type { Address, BloOptions } from "./types";

import { randomPalette } from "./image";
import { seedRandom } from "./random";

// Pre-define constants
const SVG_START = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" shape-rendering="optimizeSpeed"`;
const PATH_START = '<path fill="hsl(';
const PATH_MID = ')" d="';
const PATH_END = '"/>';

export function svg(address: Address, options: BloOptions = {}): string {
  const { size = 64, seed } = options;
  const random = seedRandom(seed || address.toLowerCase());
  const { background: b, primary: c, accent: s } = randomPalette(random);

  // Pre-allocate arrays for better performance
  const paths = new Array(3);
  paths[0] = 'M0,0H8V8H0z'; // background
  paths[1] = ''; // color
  paths[2] = ''; // spot

  // Unroll the loop for better performance
  let x, colorIndex;
  for (let i = 0; i < 32; i += 4) {
    x = i % 4;
    colorIndex = Math.floor(random() * 2.3);
    if (colorIndex > 0) paths[colorIndex] += `M${x},${i>>2}h1v1h-1zM${7-x},${i>>2}h1v1h-1z`;

    x = (i + 1) % 4;
    colorIndex = Math.floor(random() * 2.3);
    if (colorIndex > 0) paths[colorIndex] += `M${x},${(i+1)>>2}h1v1h-1zM${7-x},${(i+1)>>2}h1v1h-1z`;

    x = (i + 2) % 4;
    colorIndex = Math.floor(random() * 2.3);
    if (colorIndex > 0) paths[colorIndex] += `M${x},${(i+2)>>2}h1v1h-1zM${7-x},${(i+2)>>2}h1v1h-1z`;

    x = (i + 3) % 4;
    colorIndex = Math.floor(random() * 2.3);
    if (colorIndex > 0) paths[colorIndex] += `M${x},${(i+3)>>2}h1v1h-1zM${7-x},${(i+3)>>2}h1v1h-1z`;
  }

  // Use template literals for faster string concatenation
  return `${SVG_START} width="${size}" height="${size}">`
    + `${PATH_START}${b[0]} ${b[1]}% ${b[2]}%${PATH_MID}${paths[0]}${PATH_END}`
    + `${PATH_START}${c[0]} ${c[1]}% ${c[2]}%${PATH_MID}${paths[1]}${PATH_END}`
    + `${PATH_START}${s[0]} ${s[1]}% ${s[2]}%${PATH_MID}${paths[2]}${PATH_END}`
    + '</svg>';
}

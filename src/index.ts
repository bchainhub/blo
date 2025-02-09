import type { Address, BloOptions } from "./types.js";
import { image, randomImageData, randomPalette, randomColor } from "./image.js";
import { svg } from "./svg.js";
import { seedRandom } from "./random.js";

export type {
	Address,
	BloImage,
	BloOptions,
	Hsl,
	Palette,
	PaletteIndex,
} from "./types.js";

const defaultOpts: BloOptions = { size: 64 };
const mergeOpts = (opts: BloOptions = {}) => ({ ...defaultOpts, ...opts });

export const blo = (a: Address, o: BloOptions = {}) =>
	"data:image/svg+xml;base64," + btoa(bloSvg(a, o));

export const bloSvg = (a: Address, o: BloOptions = {}) =>
	svg(a, mergeOpts(o));

export const bloImage = (a: Address, o: BloOptions = {}) =>
	image(a, mergeOpts(o));

export { image, randomImageData, randomPalette, randomColor };
export { seedRandom };

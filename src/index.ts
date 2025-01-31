import type { Address, BloOptions } from "./types";
import { image } from "./image";
import { svg } from "./svg";

export type {
  Address,
  BloImage,
  BloOptions,
  Hsl,
  Palette,
  PaletteIndex,
} from "./types";

const defaultOpts: BloOptions = { size: 64 };
const mergeOpts = (opts: BloOptions = {}) => ({ ...defaultOpts, ...opts });

export const blo = (a: Address, o: BloOptions = {}) =>
  "data:image/svg+xml;base64," + btoa(bloSvg(a, o));

export const bloSvg = (a: Address, o: BloOptions = {}) =>
  svg(a, mergeOpts(o));

export const bloImage = (a: Address, o: BloOptions = {}) =>
  image(a, mergeOpts(o));

# blo generator

blo is a small and fast library to generate Blockchain identicons.

[![npm version](https://badge.fury.io/js/@blockchainhub%2Fblo.svg)](https://badge.fury.io/js/@blockchainhub%2Fblo)
[![License: CORE](https://img.shields.io/badge/License-CORE-yellow)](LICENSE)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@blockchainhub/blo)](https://bundlephobia.com/package/@blockchainhub/blo)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)

## Features

- 🐥 **Small**: **[0.665 KB](https://bundlejs.com/?bundle&q=%40blockchainhub%2Fblo)** gzipped.
- 💥 **Fast**: **[3.5x faster](#library-comparison)** than the second fastest solution.
- 🔍 **Optimized**: Leverages SVG to generate compact and sharp images at any size.
- 💆 **Simple**: Covering all blockchain networks, focusing on uniformity.
- 🗂 **Typed**: Ships with [types included](#types).
- 👫 **Works everywhere**: browsers, [Bun](https://bun.sh/), [Node.js](http://nodejs.org/).
- ☁️ **Zero dependencies**.

## Library Comparison

Library | Renders/sec[^1] | Size | Types | Environment[^2] | Rendering
--------|---------------:|------|--------|----------------|----------:
**blo** | **💥 8,197** | [![Bundle size](https://img.shields.io/badge/0.67kB-6ead0a)](https://bundlejs.com/?q=%40blockchainhub%2Fblo) | ![Types support](https://img.shields.io/badge/yes-6ead0a) | ![Environment support](https://img.shields.io/badge/all-6ead0a) | SVG
ethereum-blockies-base64 | 807 | [![Bundle size](https://img.shields.io/badge/2.75kB-ee4433)](https://bundlejs.com/?bundle&q=ethereum-blockies-base64) | ![Types support](https://img.shields.io/badge/no-ee4433) | ![Environment support](https://img.shields.io/badge/all-6ead0a) | PNG
blockies-react-svg | 1,749 | [![Bundle size](https://img.shields.io/badge/4kB-ee4433)](https://bundlejs.com/?bundle&q=blockies-react-svg) | ![Types support](https://img.shields.io/badge/yes-6ead0a) | ![Environment support](https://img.shields.io/badge/react-ee4433) | SVG
@download/blockies | 334 | [![Bundle size](https://img.shields.io/badge/0.67kB-6ead0a)](https://bundlejs.com/?bundle&q=%6ead0a%2Fblockies) | ![Types support](https://img.shields.io/badge/no-ee4433) | ![Environment support](https://img.shields.io/badge/dom-ee4433) | Canvas
blockies-ts | 342 | [![Bundle size](https://img.shields.io/badge/1.31kB-6ead0a)](https://bundlejs.com/?bundle&q=blockies-ts) | ![Types support](https://img.shields.io/badge/yes-6ead0a) | ![Environment support](https://img.shields.io/badge/dom-ee4433) | Canvas
react-blockies | 2,361 | [![Bundle size](https://img.shields.io/badge/4.72kB-ee4433)](https://bundlejs.com/?bundle&q=react-blockies) | ![Types support](https://img.shields.io/badge/no-ee4433) | ![Environment support](https://img.shields.io/badge/react-ee4433) | Canvas

[^1]: The number of renders per second. It was measured on Chrome 117 Linux with an AMD Ryzen 7 PRO 4750U. [See ./benchmark](https://github.com/bpierre/blo/tree/main/benchmark) for the methodology.
[^2]: The term "all" refers to libraries that are framework agnostic and that run in browsers, Bun and Node.js.

## Getting Started

```sh
npm i -S @blockchainhub/blo
```

```sh
pnpm add @blockchainhub/blo
```

```sh
yarn add @blockchainhub/blo
```

```ts
import { blo } from "@blockchainhub/blo";

img.src = blo("cb7147879011ea207df5b35a24ca6f0859dcfb145999");
```

### React / Vue / Others

blo is fast enough to not require memoization or async rendering for common use cases.

```tsx
function AddressIcon(address: string) {
  return (
    <img
      alt={address}
      src={blo(address)}
    />
  );
}
```

## API

[**`blo(address: Address, uppercase?: boolean | null, size = 64): string`**](#blo)

### blo

Get a data URI string representing the identicon as an SVG image.

Parameters:

- `address`: The blockchain address to generate the identicon for
- `uppercase`: Case handling for the address (default: false)
  - `true`: Force uppercase
  - `false`: Force lowercase
  - `null`: Preserve original case
- `size`: The SVG size in pixels (default: 64)

Example:

```ts
import { blo } from "@blockchainhub/blo";

// Default usage (lowercase, 64px)
img.src = blo(address);

// Force uppercase
img2.src = blo(address, true);

// Force lowercase
img3.src = blo(address, false);

// Preserve original case
img4.src = blo(address, null);

// Customize case and size
img5.src = blo(address, false, 24); // lowercase, 24px
```

[**`bloSvg(address: Address, uppercase?: boolean | null, size = 64): string`**](#blosvg)

### bloSvg

Same as above except it returns the SVG code instead of a data URI string.

[**`bloImage(address: Address, uppercase?: boolean | null): BloImage`**](#bloimage)

### bloImage

Get a `BloImage` data structure that can be used to render the image in different formats.

See [`src/svg.ts`](./src/svg.ts) for an example of how to use it.

## Address Case Handling

By default, blo displays addresses in lowercase. You have three options for case handling:

- **Lowercase (default)**: Set `uppercase` to `false` or omit it
- **Uppercase**: Set `uppercase` to `true`
- **Preserve original case**: Set `uppercase` to `null`

Example:

```ts
import { blo } from "@blockchainhub/blo";

const address = "cb7147879011ea207df5b35a24ca6f0859dcfb145999";

// Default behavior (lowercase)
const identicon1 = blo(address);

// Force uppercase
const identicon2 = blo(address, true);

// Preserve original case
const identicon3 = blo(address, null);
```

Note: The case of the address only affects its visual representation. Internally, the identicon generation algorithm always uses lowercase for consistency.

## Types

The library ships with TypeScript types included:

```ts
// Function signatures
export type BloFunction = (address: Address, uppercase?: boolean, size?: ValidSize) => string;
export type BloSvgFunction = (address: Address, uppercase?: boolean, size?: ValidSize) => string;
export type BloImageFunction = (address: Address, uppercase?: boolean) => BloImage;

// BloImage contains the data needed to render an icon
export type BloImage = [BloImageData, Palette];

// 4x8 grid of the image left side, as 32 PaletteIndex items
// The right side is omitted as it's a mirror of the left side
export type BloImageData = Uint8Array;

// Colors used by a given icon
export type Palette = {
  background: Hsl;
  primary: Hsl;
  accent: Hsl;
};

// Points to one of the three Palette colors
export const PaletteIndexes = {
  BACKGROUND: 0,
  PRIMARY: 1,
  ACCENT: 2,
} as const;

// A color in the HSL color space
// [0]: 0-360 (hue)
// [1]: 0-100 (saturation)
// [2]: 0-100 (lightness)
export type Hsl = Uint16Array;

// An Ethereum address
export type Address = string;
```

## Acknowledgements

- blo is a modernized version of [ethereum-blockies-base64](https://github.com/MyCryptoHQ/ethereum-blockies-base64), which I think was based on [ethereum/blockies](https://github.com/ethereum/blockies).

## FAQ

### Does it work with CNS, ENS names?

Yes. You can use the ENS name directly as the `address` parameter.

### Can blo render other formats than SVG?

You can render to any format you want by using the `bloImage()` function, which returns a data structure (see [API](#api) above). Check out the [Bun](./demos/bun) and [Node](./demos/node) demos for examples of rendering an identicon in the terminal.

### Can it be used to generate other types of identicons?

blo focuses on the blockchain algorithm but you can use it with any data.

### Why is it named blo?

blo is short for blockies, which is the name of [the original library](https://github.com/ethereum/blockies) it is based on.

## License

[CORE](LICENSE)

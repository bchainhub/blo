# blo - Blockchain Identicons Generator

blo is a small and fast library to generate Blockchain identicons.

[![npm](https://img.shields.io/npm/v/@blockchainhub/blo?label=npm&color=cb3837&logo=npm)](https://www.npmjs.com/package/@blockchainhub/blo)
[![License: CORE](https://img.shields.io/badge/License-CORE-yellow?logo=googledocs)](LICENSE)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@blockchainhub/blo?label=Size&logo=tsnode)](https://bundlephobia.com/package/@blockchainhub/blo?label=Size)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![GitHub Sponsors](https://img.shields.io/github/sponsors/bchainhub?label=Sponsors&logo=githubsponsors&color=EA4AAA)](https://github.com/sponsors/bchainhub)

## Features

- 🐥 **Small**: **[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@blockchainhub/blo?label=&color=6ead0a)](https://bundlejs.com/?bundle&q=%40blockchainhub%2Fblo)** gzipped.
- 🔍 **Optimized**: Leverages SVG to generate compact and sharp images at any size.
- 💆 **Simple**: Covering all blockchain networks, focusing on uniformity.
- 🗂 **Typed**: Ships with [types included](#types).
- 👫 **Works everywhere**: browsers, [Bun](https://bun.sh/), [Node.js](http://nodejs.org/).
- ☁️ **Zero dependencies**.

## Library Comparison

Library | Renders/sec[^1] | Size[^2] | Types | Environment[^3] | Rendering
--------|---------------:|------|--------|----------------|----------:
**blo** | **500** | [![Bundle Size](https://img.shields.io/bundlephobia/minzip/@blockchainhub/blo?label=&color=6ead0a)](https://bundlejs.com/?q=%40blockchainhub%2Fblo) | ![Types support](https://img.shields.io/badge/yes-6ead0a) | ![Environment support](https://img.shields.io/badge/all-6ead0a) | SVG
blockies-react-svg | 620 | [![Bundle size](https://img.shields.io/bundlephobia/minzip/blockies-react-svg?label=&color=ee4433)](https://bundlejs.com/?bundle&q=blockies-react-svg) | ![Types support](https://img.shields.io/badge/yes-6ead0a) | ![Environment support](https://img.shields.io/badge/react-ee4433) | SVG
ethereum-blockies-base64 | 450 | [![Bundle Size](https://img.shields.io/bundlephobia/minzip/ethereum-blockies-base64?label=&color=ee4433)](https://bundlejs.com/?bundle&q=ethereum-blockies-base64) | ![Types support](https://img.shields.io/badge/no-ee4433) | ![Environment support](https://img.shields.io/badge/all-6ead0a) | PNG
@download/blockies | 350 | [![Bundle size](https://img.shields.io/bundlephobia/minzip/@download/blockies?label=&color=6ead0a)](https://bundlejs.com/?bundle&q=%6ead0a%2Fblockies) | ![Types support](https://img.shields.io/badge/no-ee4433) | ![Environment support](https://img.shields.io/badge/dom-ee4433) | Canvas
blockies-ts | 360 | [![Bundle size](https://img.shields.io/bundlephobia/minzip/blockies-ts?label=&color=6ead0a)](https://bundlejs.com/?bundle&q=blockies-ts) | ![Types support](https://img.shields.io/badge/yes-6ead0a) | ![Environment support](https://img.shields.io/badge/dom-ee4433) | Canvas
react-blockies | 700 | [![Bundle size](https://img.shields.io/bundlephobia/minzip/react-blockies?label=&color=ee4433)](https://bundlejs.com/?bundle&q=react-blockies) | ![Types support](https://img.shields.io/badge/no-ee4433) | ![Environment support](https://img.shields.io/badge/react-ee4433) | Canvas

[^1]: The number of renders per second. It was measured on Chromium Engine 131, MacOS with an Apple M2 Max. [See ./benchmark](https://github.com/blockchainhub/blo/tree/main/benchmark) for the methodology.
[^2]: Minizipped bundle size. Good to be < 1 KiB.
[^3]: The term "all" refers to libraries that are framework agnostic and that run in browsers, Bun and Node.js.

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

### `blo(address: Address, options?: BloOptions): string`

Get a data URI string representing the identicon as an SVG image.

```ts
import { blo } from "@blockchainhub/blo";

// Default usage (64px)
img.src = blo("0x123...");

// With options
img.src = blo("0x123...", {
  size: 32,         // Custom size (default: 64)
  seed: "custom"    // Custom seed (default: undefined)
});
```

### `bloSvg(address: Address, options?: BloOptions): string`

Same as `blo()` but returns SVG code instead of a data URI.

```ts
const svg = bloSvg("0x123...", {
  size: 32,
  seed: "custom"
});
```

### `bloImage(address: Address, options?: BloOptions): BloImage`

Get a `BloImage` data structure that can be used to render the image in different formats.

```ts
const [imageData, palette] = bloImage("0x123...", {
  seed: "custom"
});
```

### Options

```ts
interface BloOptions {
  // Size in pixels (default: 64)
  size?: number;

  // Custom seed for generation (default: undefined)
  // If undefined, uses the address as seed
  seed?: string;
}
```

### Types

The library ships with TypeScript types included:

```ts
export type Address = string;
export type BloImage = [BloImageData, Palette];
export type BloImageData = Uint8Array;

export interface BloOptions {
  size?: number;
  seed?: string;
}

export type Palette = {
  background: Hsl;
  primary: Hsl;
  accent: Hsl;
};

export type Hsl = Uint16Array;
```

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

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## Sponsor BlockchainHub

BlockchainHub is a platform for building Open Source applications.

[Sponsor us](https://github.com/sponsors/bchainhub) to support our work.

Current GitHub Sponsors: [![GitHub Sponsors](https://img.shields.io/github/sponsors/bchainhub?label=Sponsors&logo=githubsponsors&color=EA4AAA)](https://github.com/sponsors/bchainhub)

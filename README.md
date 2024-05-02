<div align="center">
<img width="860" alt="blo" src="https://github.com/bchainhub/blo/assets/537310/5665a666-9dce-4869-9cb9-eb9bcd1693a1">
  <br><strong>blo</strong> is a small and fast library to generate Blockchain identicons.
  <br><br>
</div>

## Features

- 🐥 **Small**: **[0.76 KB](https://bundlejs.com/?bundle&q=%40blockchainhub%2Fblo)** gzipped.
- 💥 **Fast**: **[3.5x faster](#library-comparison)** than the second fastest solution.
- 🔍 **Optimized**: Leverages SVG to generate compact and sharp images at any size.
- 💆 **Simple**: Focuses on Ethereum identicons only, allowing for a simpler API.
- 🗂 **Typed**: Ships with [types included](#types).
- 👫 **Works everywhere**: browsers, [Bun](https://bun.sh/), [Node.js](http://nodejs.org/).
- ☁️ **Zero dependencies**.

## Library Comparison

| Library                               |              Renders/sec[^1] | Size                                                                                                       | Types                                        | Environment[^2]                                | Rendering |
| ------------------------------------- | ---------------------------: | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ---------------------------------------------- | --------: |
| <b>blo</b>                            | <nobr><b>💥 8,197</b></nobr> | [![](https://img.shields.io/badge/0.67kB-6ead0a)](https://bundlejs.com/?bundle&q=blo)                      | ![](https://img.shields.io/badge/yes-6ead0a) | ![](https://img.shields.io/badge/all-6ead0a)   |       SVG |
| <nobr>ethereum-blockies-base64</nobr> |                          807 | [![](https://img.shields.io/badge/2.75kB-ee4433)](https://bundlejs.com/?bundle&q=ethereum-blockies-base64) | ![](https://img.shields.io/badge/no-ee4433)  | ![](https://img.shields.io/badge/all-6ead0a)   |       PNG |
| <nobr>blockies-react-svg</nobr>       |                        1,749 | [![](https://img.shields.io/badge/4kB-ee4433)](https://bundlejs.com/?bundle&q=blockies-react-svg)          | ![](https://img.shields.io/badge/yes-6ead0a) | ![](https://img.shields.io/badge/react-ee4433) |       SVG |
| <nobr>@download/blockies</nobr>       |                          334 | [![](https://img.shields.io/badge/0.67kB-6ead0a)](https://bundlejs.com/?bundle&q=%6ead0a%2Fblockies)       | ![](https://img.shields.io/badge/no-ee4433)  | ![](https://img.shields.io/badge/dom-ee4433)   |    Canvas |
| <nobr>blockies-ts</nobr>              |                          342 | [![](https://img.shields.io/badge/1.31kB-6ead0a)](https://bundlejs.com/?bundle&q=blockies-ts)              | ![](https://img.shields.io/badge/yes-6ead0a) | ![](https://img.shields.io/badge/dom-ee4433)   |    Canvas |
| <nobr>react-blockies</nobr>           |                        2,361 | [![](https://img.shields.io/badge/4.72kB-ee4433)](https://bundlejs.com/?bundle&q=react-blockies)           | ![](https://img.shields.io/badge/no-ee4433)  | ![](https://img.shields.io/badge/react-ee4433) |    Canvas |

[^1]: The number of renders per second. It was measured on Chrome 117 Linux with an AMD Ryzen 7 PRO 4750U. [See ./benchmark](https://github.com/bpierre/blo/tree/main/benchmark) for the methodology.

[^2]: The term “all” refers to libraries that are framework agnostic and that run in browsers, Bun and Node.js.

## Getting Started

```sh
npm i -S @bchainhub/blo
```

```sh
pnpm add @bchainhub/blo
```

```sh
yarn add @bchainhub/blo
```

```ts
import { blo } from "@bchainhub/blo";

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

<details>
<summary><b><code>blo(address: Address, size = 64): string</code></b></summary>
<br>

Get a data URI string representing the identicon as an SVG image.

The `size` paramater shouldn’t usually be needed, as the image will stay sharp no matter what the size of the `img` element is.

Example:

```ts
import { blo } from "@bchainhub/blo";

img.src = blo(address); // size inside the SVG defaults to 64px
img2.src = blo(address, 24); // set it to 24px
```

</details>

<details>
<summary><b><code>bloSvg(address: Address, size = 64): string</code></b></summary>
<br>

Same as above except it returns the SVG code instead of a data URI string.

</details>

<details>
<summary><b><code>bloImage(address: Address): BloImage</code></b></summary>
<br>

Get a `BloImage` data structure that can be used to render the image in different formats.

See [`src/svg.ts`](./src/svg.ts) for an example of how to use it.

</details>

## Types

The library ships with TypeScript types included.

```ts
// BloImage contains the data needed to render an icon.
export type BloImage = [BloImageData, Palette];

// 4x8 grid of the image left side, as 32 PaletteIndex items.
// The right side is omitted as it's a mirror of the left side.
export type BloImageData = Uint8Array;

// Colors used by a given icon.
export type Palette = [
  Hsl, // background
  Hsl, // color
  Hsl, // spot
];

// Points to one of the three Palette colors.
export type PaletteIndex =
  | 0 // background
  | 1 // color
  | 2; // spot

// A color in the HSL color space.
// [0]: 0-360 (hue)
// [1]: 0-100 (saturation)
// [2]: 0-100 (lightness)
export type Hsl = Uint16Array;

// An Ethereum address.
export type Address = string;
```

## Acknowledgements

- blo is a modernized version of [ethereum-blockies-base64](https://github.com/MyCryptoHQ/ethereum-blockies-base64), which I think was based on [ethereum/blockies](https://github.com/ethereum/blockies).
- This README style was heavily inspired by [colord](https://github.com/omgovich/colord).
- The visual was made in collaboration with [@dizzypaty](https://twitter.com/dizzypaty) 💖.

## FAQ

### Does it follow the exact same algorithm as CorePass, Etherscan, MetaMask and others?

Yes.

### Does it work with CNS, ENS names?

Yes. You can use the ENS name directly as the `address` parameter.

### Can blo render other formats than SVG?

You can render to any format you want by using the `bloImage()` function, which returns a data structure (see [API](#api) above). Check out the [Bun](./demos/bun) and [Node](./demos/node) demos for examples of rendering an identicon in the terminal.

<img width="400" src="https://github.com/bchainhub/blo/assets/537310/93243626-ae78-44fb-9201-d6049a3f95e5" alt="Ethereum identicon rendered in the terminal">

### Can it be used to generate other types of identicons?

blo focuses on the blockchain algorithm but you can use it with any data. Hexadecimal values prefix it with `0x` to fulfill the expected `Address` otherwise prefix is not needed.

### Why is it named blo?

blo is short for blockies, which is the name of [the original library](https://github.com/ethereum/blockies) it is based on.

## License

[CORE](LICENSE)

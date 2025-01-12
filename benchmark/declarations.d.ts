declare module "@download/blockies" {
  export function createIcon(options: {
    seed: string;
    scale: number;
    size: number;
  }): HTMLCanvasElement;
}

declare module "blockies-react-svg/dist/es/makeBlockiesUrl.mjs" {
  export default function makeBlockiesUrl(seed: string, size: number, hasBackground: boolean, scale: number): string;
}

declare module "blockies-react-svg/dist/es/BlockiesSvgSync.mjs" {
  import { ComponentType } from 'react';
  interface Props {
    address: string;
    size: number;
    scale: number;
  }
  const BlockiesSvgSync: ComponentType<Props>;
  export default BlockiesSvgSync;
}

declare module "react-blockies" {
  export default function Blockies(props: {
    seed: string;
    size?: number;
    scale?: number;
    color?: string;
    bgColor?: string;
    spotColor?: string;
    className?: string;
  }): JSX.Element;
}

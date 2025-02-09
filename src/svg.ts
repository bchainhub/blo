import type { Address, BloOptions } from "./types";

import { randomPalette } from "./image";
import { seedRandom } from "./random";

export const svg = (a: Address, o: BloOptions): string => {
	const r = seedRandom(o.seed || a);
	const { background: b, primary: p, accent: c } = randomPalette(r);
	const s = o.size || 64;
	const scale = s / 8;
	const d = new Array(64);

	for (let i = 0; i < 32; i++) {
		const x = i % 4, y = i / 4 | 0;
		const v = Math.floor(r() * 2.3);
		d[y * 8 + x] = v;
		d[y * 8 + (7 - x)] = v;
	}

	return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
<rect width="${s}" height="${s}" fill="hsl(${b[0]},${b[1]}%,${b[2]}%)"/>
<g fill="hsl(${p[0]},${p[1]}%,${p[2]}%)">
${d.map((v,i)=>v===1?`<rect width="${scale}" height="${scale}" x="${(i%8)*scale}" y="${(i/8|0)*scale}"/>`:'').join('')}
</g>
<g fill="hsl(${c[0]},${c[1]}%,${c[2]}%)">
${d.map((v,i)=>v===2?`<rect width="${scale}" height="${scale}" x="${(i%8)*scale}" y="${(i/8|0)*scale}"/>`:'').join('')}
</g></svg>`;
};

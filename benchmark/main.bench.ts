import makeBlockiesUrl from "blockies-react-svg/dist/es/makeBlockiesUrl.mjs";
import makeBlockie from "ethereum-blockies-base64";
import Rand from "rand-seed";
import { bench, describe } from "vitest";
import { blo } from "../src";

let rand: Rand;

function address(): string {
  return Array.from({ length: 40 })
    .map(() => Math.floor(rand.next() * 16).toString(16))
    .join("");
}

const benchOptions = {
  iterations: 1000,
  setup() {
    rand = new Rand("1234");
  },
};

describe("blockies benchmarks", () => {
  bench("blo", () => {
    blo(address(), false, 64);
  }, benchOptions);

  bench("ethereum-blockies-base64", () => {
    makeBlockie(address());
  }, benchOptions);

  bench("blockies-react-svg", () => {
    makeBlockiesUrl(address(), 8, false, 8);
  }, benchOptions);
});

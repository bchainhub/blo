import React from "react";
import type { BenchmarkRef } from "react-component-benchmark";

import { createIcon as blockiesCreateIcon } from "@download/blockies";
import BlockiesSvgSync from "blockies-react-svg/dist/es/BlockiesSvgSync.mjs";
import * as blockiesTs from "blockies-ts";
import makeBlockie from "ethereum-blockies-base64";
import { useRef, useState, useEffect } from "react";
import ReactBlockies from "react-blockies";
import { Benchmark } from "react-component-benchmark";
import { blo } from "../../src";

const SAMPLES = 1000;

// Generate a larger pool of unique addresses
const addresses = Array.from({ length: SAMPLES * 10 }).map(() => {
  const chars = '0123456789abcdefABCDEF';
  return '0x' + Array.from({ length: 40 })
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join('');
});

// Shuffle the addresses array to ensure random distribution
function shuffleAddresses() {
  for (let i = addresses.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [addresses[i], addresses[j]] = [addresses[j], addresses[i]];
  }
}

let addressIndex = 0;
function nextAddress() {
  // Reset and reshuffle when we've used all addresses
  if (addressIndex >= addresses.length) {
    addressIndex = 0;
    shuffleAddresses();
  }
  const address = addresses[addressIndex++];
  return address;
}

// All benchmarks are rendering a 64x64 image on a @2x display,
// which requires to render the raster images at 128x128.
const BENCHMARKS: Record<
  string,
  React.ComponentType<{ address: string }>
> = {
  "@blockchainhub/blo": React.memo(({ address }) => (
    <img
      width={64}
      height={64}
      src={blo(address)}
    />
  )),
  "ethereum-blockies-base64": React.memo(({ address }) => (
    <img
      width={64}
      height={64}
      src={makeBlockie(address)}
    />
  )),
  "blockies-react-svg": React.memo(({ address }) => (
    <BlockiesSvgSync
      size={8}
      scale={8}
      address={address}
    />
  )),
  "@download/blockies": React.memo(({ address }) => (
    <img
      width={64}
      height={64}
      src={blockiesCreateIcon({
        seed: address.toLowerCase(),
        scale: 16,
        size: 8,
      }).toDataURL()}
    />
  )),
  "blockies-ts": React.memo(({ address }) => (
    <img
      width={64}
      height={64}
      src={blockiesTs.create({
        seed: address.toLowerCase(),
        scale: 16,
        size: 8,
      }).toDataURL()}
    />
  )),
  "react-blockies": React.memo(({ address }) => (
    // className is used to force the display size to 64x64
    <ReactBlockies
      className="react-blockies"
      seed={address.toLowerCase()}
      scale={16}
      size={8}
    />
  )),
} as const;

interface BenchmarkResult {
  startTime: number;
  endTime: number;
  runTime: number;
  sampleCount: number;
  samples: Array<{ start: number; end: number; }>;
}

export default function App() {
  const [results, setResults] = useState<
    Record<string, null | BenchmarkResult & { rps: number }>
  >({});

  const refs = Object.fromEntries(
    Object.keys(BENCHMARKS).map((name) => [
      name,
      useRef<BenchmarkRef | null>(null),
    ]),
  );

  const [running, setRunning] = useState<null | keyof typeof BENCHMARKS>(null);

  const best = Object.values(results).reduce((best, result) => (
    Math.max(result?.rps ?? 0, best)
  ), 0);

  // Shuffle addresses on initial load
  useEffect(() => {
    shuffleAddresses();
  }, []);

  return (
    <>
      <style>{`
        ${STYLES}
        .render-zone img,
        .render-zone svg,
        .render-zone canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          image-rendering: pixelated;
        }
      `}</style>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Library</th>
            <th colSpan={2}>Renders per second</th>
            <th>Preview</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(BENCHMARKS).map((benchmark) => {
            const [name, Component] = benchmark;
            const result = results[name];

            // Create a wrapper component that forces new addresses
            const BenchmarkWrapper = React.memo(function BenchmarkWrapper() {
              const address = nextAddress();
              return <Component address={address} />;
            });

            return (
              <tr key={name}>
                <td
                  align="right"
                  valign="middle"
                  style={{ minWidth: "100px" }}
                >
                  <div
                    style={{
                      width: `${result?.rps ? (result.rps / best) * 100 : 0}px`,
                      height: "8px",

                      // 120 = green, 0 = red
                      background: `hsl(${result?.rps ? Math.round((result.rps / best) * 120) : 0}, 50%, 70%)`,
                    }}
                  />
                </td>
                <td>
                  {name}
                </td>
                <td
                  style={{
                    minWidth: "100px",
                  }}
                >
                  {result?.rps ? new Intl.NumberFormat("en-US").format(result.rps) : "-"}
                </td>
                <td>
                  <button
                    disabled={running !== null}
                    onClick={() => {
                      if (!running) {
                        refs[name].current?.start();
                        setRunning(name);
                      }
                    }}
                  >
                    Run
                  </button>
                </td>
                <td>
                  <div className="render-zone">
                    <div className="benchmark">
                      <Benchmark
                        ref={refs[name]}
                        component={BenchmarkWrapper}
                        onComplete={(benchResult: BenchmarkResult) => {

                          const totalTime = benchResult.endTime - benchResult.startTime;
                          const timePerSample = totalTime / benchResult.sampleCount;

                          if (timePerSample > 0) {
                            const rps = Math.round(1000 / timePerSample);

                            setResults(prevResults => ({
                              ...prevResults,
                              [name]: {
                                ...benchResult,
                                mean: timePerSample,
                                rps
                              }
                            }));
                          }
                          setRunning(null);
                        }}
                        samples={SAMPLES}
                        type="mount"
                        timeout={30000}
                      />
                    </div>
                    <div className="sample">
                      <Component
                        address="cb7147879011ea207df5b35a24ca6f0859dcfb145999"
                      />
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

const STYLES = `
  body {
    font-family: sans-serif;
    padding-top: 40px;
  }
  table {
    margin: 0 auto;
    border-collapse: collapse;
    border-spacing: 0;
  }
  th {
    text-align: left;
    padding: 10px 20px;
  }
  td {
    padding: 10px 20px;
  }
  .render-zone {
    display: flex;
    gap: 20px;
  }
  .render-zone div {
    position: relative;
    contain: strict;
    width: 64px;
    height: 64px;
    outline: 2px solid #000;
  }

  .render-zone img,
  .render-zone svg,
  .render-zone canvas {
    position: absolute;
    inset: 0;
  }

  .react-blockies {
    width: 64px !important;
    height: 64px !important;
  }
`;

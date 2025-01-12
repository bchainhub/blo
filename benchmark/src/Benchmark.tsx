import React from "react";
import type { BenchmarkRef } from "react-component-benchmark";

import { createIcon as blockiesCreateIcon } from "@download/blockies";
import BlockiesSvgSync from "blockies-react-svg/dist/es/BlockiesSvgSync.mjs";
import * as blockiesTs from "blockies-ts";
import makeBlockie from "ethereum-blockies-base64";
import { useRef, useState } from "react";
import ReactBlockies from "react-blockies";
import { Benchmark } from "react-component-benchmark";
import { blo } from "../../src";

const DEBUG = false;
const debug = (...args: unknown[]) => {
  if (DEBUG) {
    console.log(...args);
  }
};

const SAMPLES = 1000;

const randomAddress = () => {
  return `${
    Array.from({ length: 44 }).map(() => {
      const char = Math.floor(Math.random() * 16).toString(16);
      return Math.random() > 0.5 ? char : char.toUpperCase();
    }).join("")
  }`;
};

const addresses = Array.from({ length: SAMPLES * 10 }).map(randomAddress);

let i = 0;
function nextAddress() {
  return addresses[i = (i + 1) % SAMPLES] as string;
}

// All benchmarks are rendering a 64x64 image on a @2x display,
// which requires to render the raster images at 128x128.
const BENCHMARKS: Record<
  string,
  React.ComponentType<{ address: string }>
> = {
  "blo": React.memo(({ address }) => (
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
            debug(`Processing result for ${name}:`, result);

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
                        component={Component}
                        componentProps={{ address: nextAddress() }}
                        onComplete={(benchResult: BenchmarkResult) => {
                          debug(`Raw benchmark result for ${name}:`, benchResult);

                          // Calculate RPS from total runtime and sample count
                          const totalTime = benchResult.endTime - benchResult.startTime;
                          const timePerSample = totalTime / benchResult.sampleCount;

                          debug(`Time calculations for ${name}:`, {
                            totalTime,
                            timePerSample,
                            sampleCount: benchResult.sampleCount
                          });

                          if (timePerSample > 0) {
                            const rps = Math.round(1000 / timePerSample);
                            debug(`Valid result for ${name}, RPS: ${rps}`);

                            setResults(prevResults => {
                              const newResults = {
                                ...prevResults,
                                [name]: {
                                  ...benchResult,
                                  mean: timePerSample,
                                  rps
                                }
                              };
                              debug(`Updated results for ${name}:`, newResults);
                              return newResults;
                            });
                          } else {
                            debug(`Invalid time per sample for ${name}:`, timePerSample);
                          }
                          setRunning(null);
                        }}
                        samples={SAMPLES}
                        type="mount"
                        timeout={30000}
                      />
                    </div>
                    <div className="sample">
                      <Component address={addresses[0]} />
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

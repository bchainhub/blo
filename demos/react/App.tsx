import { blo } from "@blockchainhub/blo";
import { useState } from "react";

export default function App() {
  const [size, setSize] = useState(128);
  const [address, setAddress] = useState(
    "cb7147879011ea207df5b35a24ca6f0859dcfb145999",
  );
  return (
    <>
      <style>
        {`
        body {
          margin: 0;
          padding: 0;
          background: #1f2b5b;
        }
        .app {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100vw;
          height: 100vh;
        }
        .app img {
          border: 8px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          overflow: hidden;
        }
        .controls {
          position: absolute;
          top: 20px;
          left: 0;
          right: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        .size {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 50%;
          gap: 16px;
          padding: 16px;
          color: #fff;
        }
        .size input {
          width: 100%;
        }
        .address {
          width: 40%;
        }
        .address input {
          display: block;
          width: 100%;
          padding: 16px;
          font-size: 16px;
          font-family: monospace;
          text-align: center;
          color: #fff;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 16px;
        }
      `}
      </style>
      <div className="app">
        <div className="controls">
          <div className="address">
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
            />
          </div>
          <div className="size">
            <input
              type="range"
              min="8"
              max="400"
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
            />
            <span style={{ whiteSpace: "nowrap" }}>size: {size}</span>
          </div>
        </div>
          <img
            alt="blo"
            width={size}
            height={size}
            src={blo(address as string)}
          />
      </div>
    </>
  );
}

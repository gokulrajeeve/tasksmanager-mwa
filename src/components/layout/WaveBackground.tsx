const WaveBackground = () => (
  <>
    <style>
      {`
        .wave-container { position: absolute; top: 0; left: 0; width: 100%; height: auto; max-height: 50vh; z-index: 0; pointer-events: none; overflow: hidden; }
        @keyframes moveWave { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .wave-1 { animation: moveWave 18s linear infinite alternate; }
        .wave-2 { animation: moveWave 15s linear infinite alternate; }
        .wave-3 { animation: moveWave 10s linear infinite alternate; }
      `}
    </style>
    <div className="wave-container">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1080 540"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className="wave-3">
          <path fill="#f9fafb" d="M0 0 C1080 300, 2160 150, 4320 350 V0 H0 Z" />
        </g>
        <g className="wave-2">
          <path fill="#f3f4f6" d="M0 0 C1080 250, 2160 100, 4320 300 V0 H0 Z" />
        </g>
        <g className="wave-1">
          <path fill="#e5e7eb" d="M0 0 C1080 200, 2160 50, 4320 250 V0 H0 Z" />
        </g>
      </svg>
    </div>
  </>
);

export default WaveBackground;
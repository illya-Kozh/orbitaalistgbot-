import React from 'react';

interface CandleData {
  open: number;
  high: number;
  low: number;
  close: number;
}

interface CandlestickChartProps {
  data: CandleData[];
  width?: number;
  height?: number;
}

export function CandlestickChart({ data, width = 300, height = 150 }: CandlestickChartProps) {
  if (!data.length) return null;

  const minPrice = Math.min(...data.map(d => d.low)) * 0.99;
  const maxPrice = Math.max(...data.map(d => d.high)) * 1.01;
  const priceRange = maxPrice - minPrice;
  const candleWidth = (width - 40) / data.length;

  const getY = (price: number) => {
    return height - 20 - ((price - minPrice) / priceRange) * (height - 40);
  };

  return (
    <div className="bg-slate-900/50 rounded-lg p-2">
      <svg width={width} height={height} className="overflow-visible">
        {/* Background grid pattern - larger squares, cleaner look */}
        <defs>
          <pattern
            id="grid"
            width="30"
            height="25"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 30 0 L 0 0 0 25"
              fill="none"
              stroke="rgba(100, 116, 139, 0.08)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        
        {/* Grid background */}
        <rect
          x="20"
          y="20"
          width={width - 40}
          height={height - 40}
          fill="url(#grid)"
        />

        {/* Subtle major horizontal grid lines */}
        {[0, 0.33, 0.66, 1].map((ratio, i) => {
          const y = height - 20 - ratio * (height - 40);
          return (
            <line
              key={`h-major-${i}`}
              x1="20"
              x2={width - 20}
              y1={y}
              y2={y}
              stroke="rgba(100, 116, 139, 0.15)"
              strokeWidth="0.5"
            />
          );
        })}

        {/* Subtle major vertical grid lines */}
        {Array.from({ length: Math.floor(data.length / 4) + 1 }, (_, i) => i * 4).map((index) => {
          if (index < data.length) {
            const x = 20 + index * candleWidth + candleWidth / 2;
            return (
              <line
                key={`v-major-${index}`}
                x1={x}
                x2={x}
                y1="20"
                y2={height - 20}
                stroke="rgba(100, 116, 139, 0.12)"
                strokeWidth="0.5"
              />
            );
          }
          return null;
        })}

        {/* Candlesticks */}
        {data.map((candle, i) => {
          const x = 20 + i * candleWidth + candleWidth / 2;
          const isGreen = candle.close > candle.open;
          const color = isGreen ? '#22c55e' : '#ef4444';
          
          const bodyTop = getY(Math.max(candle.open, candle.close));
          const bodyBottom = getY(Math.min(candle.open, candle.close));
          const bodyHeight = Math.max(bodyBottom - bodyTop, 1);

          return (
            <g key={i}>
              {/* Wick */}
              <line
                x1={x}
                x2={x}
                y1={getY(candle.high)}
                y2={getY(candle.low)}
                stroke={color}
                strokeWidth="1"
              />
              
              {/* Body - Always solid filled */}
              <rect
                x={x - candleWidth * 0.3}
                y={bodyTop}
                width={candleWidth * 0.6}
                height={bodyHeight}
                fill={color}
                stroke={color}
                strokeWidth="1"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
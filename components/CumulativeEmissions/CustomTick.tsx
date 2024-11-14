import { CustomTickProps } from './types';
import { WEEKS_PER_YEAR } from './constants';

export function CustomTick({ x, y, payload }: CustomTickProps) {
  const week = payload.value;
  const year = week / WEEKS_PER_YEAR;
  const isYear = year % 1 === 0;

  return (
    <g transform={`translate(${x},${y})`}>
      {isYear ? (
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          fill="#666"
          fontSize={12}
        >
          {`Year ${Math.floor(year)}`}
        </text>
      ) : (
        <line
          x1={0}
          y1={0}
          x2={0}
          y2={5}
          stroke="#ccc"
          strokeWidth={1}
        />
      )}
    </g>
  );
}
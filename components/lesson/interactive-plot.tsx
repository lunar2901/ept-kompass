"use client";

import { useMemo, useState } from "react";
import { evaluate } from "mathjs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { InteractivePlotProps } from "../lesson-components";

/**
 * Small explorable plot: user drags sliders, the chart redraws.
 * Expression is evaluated with mathjs (never `eval`), so authors can write
 * `"1 - T_cold / T_hot"` etc. The variable listed as `xVariable` is the
 * axis; others become sliders.
 */
export function InteractivePlot({
  title_de,
  title_en,
  xLabel,
  yLabel,
  expression,
  variables,
  xVariable,
}: InteractivePlotProps) {
  const [vals, setVals] = useState<Record<string, number>>(() =>
    Object.fromEntries(variables.map((v) => [v.name, v.initial])),
  );

  const xVar = variables.find((v) => v.name === xVariable);

  const data = useMemo(() => {
    if (!xVar) return [];
    const N = 120;
    const step = (xVar.max - xVar.min) / (N - 1);
    const rows: { x: number; y: number | null }[] = [];
    for (let i = 0; i < N; i++) {
      const x = xVar.min + i * step;
      const scope = { ...vals, [xVar.name]: x };
      try {
        const y = Number(evaluate(expression, scope));
        rows.push({ x, y: Number.isFinite(y) ? y : null });
      } catch {
        rows.push({ x, y: null });
      }
    }
    return rows;
  }, [expression, vals, xVar]);

  const sliders = variables.filter((v) => v.name !== xVariable);

  return (
    <figure className="my-6 rounded-lg border border-[color:var(--border)] bg-[color:var(--card)] p-4">
      <figcaption className="mb-3">
        <div className="font-sans font-semibold">{title_de}</div>
        <div className="text-sm text-[color:var(--muted-foreground)] klausur-hide-en:hidden">
          {title_en}
        </div>
      </figcaption>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 8, right: 24, left: 8, bottom: 24 }}
          >
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis
              dataKey="x"
              type="number"
              domain={[xVar?.min ?? 0, xVar?.max ?? 1]}
              label={{
                value: `${xLabel.de} (${xLabel.unit})`,
                position: "insideBottom",
                offset: -8,
                fill: "var(--muted-foreground)",
              }}
              stroke="var(--muted-foreground)"
            />
            <YAxis
              type="number"
              label={{
                value: `${yLabel.de} (${yLabel.unit})`,
                angle: -90,
                position: "insideLeft",
                fill: "var(--muted-foreground)",
              }}
              stroke="var(--muted-foreground)"
            />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
                fontSize: "0.85rem",
              }}
            />
            <Line
              type="monotone"
              dataKey="y"
              stroke="var(--accent)"
              dot={false}
              isAnimationActive={false}
              strokeWidth={2}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sliders.map((v) => (
          <label key={v.name} className="flex flex-col text-sm">
            <span className="flex justify-between">
              <span>
                {v.label_de}{" "}
                <span className="text-[color:var(--muted-foreground)] klausur-hide-en:hidden">
                  ({v.label_en})
                </span>
              </span>
              <span className="font-mono">
                {vals[v.name]?.toFixed(2)} {v.unit}
              </span>
            </span>
            <input
              type="range"
              min={v.min}
              max={v.max}
              step={v.step}
              value={vals[v.name]}
              onChange={(e) =>
                setVals((prev) => ({
                  ...prev,
                  [v.name]: Number(e.target.value),
                }))
              }
              className="mt-1 accent-[color:var(--accent)]"
            />
          </label>
        ))}
      </div>
    </figure>
  );
}

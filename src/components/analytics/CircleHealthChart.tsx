import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import { TierHealthPoint } from '../../types';

interface CircleHealthChartProps {
  data: TierHealthPoint[];
}

export const CircleHealthChart: React.FC<CircleHealthChartProps> = ({ data }) => {
  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Circle Tier Health vs Benchmark
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Current average health score compared against ideal tier targets
          </p>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          Cadence Health
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
            <XAxis
              dataKey="tier"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(51, 65, 85, 0.6)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px',
              }}
              formatter={(value: any, name: any) => [
                `${value}%`,
                name === 'avgScore' ? 'Current Average' : 'Target Benchmark',
              ]}
            />
            <Bar
              dataKey="avgScore"
              name="avgScore"
              fill="#10b981"
              radius={[6, 6, 0, 0]}
              barSize={20}
            />
            <Bar
              dataKey="benchmark"
              name="benchmark"
              fill="#94a3b8"
              opacity={0.4}
              radius={[6, 6, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Current Average
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 opacity-50" /> Target Benchmark
          </span>
        </div>
        <span>0–100 Scale</span>
      </div>
    </div>
  );
};

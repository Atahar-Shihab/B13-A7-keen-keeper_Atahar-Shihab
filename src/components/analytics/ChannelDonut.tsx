import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';
import { ChannelMixPoint, ChannelType } from '../../types';

interface ChannelDonutProps {
  data: ChannelMixPoint[];
}

const COLORS: Record<ChannelType, string> = {
  'In-Person': '#10b981', // Emerald
  Video: '#3b82f6', // Blue
  Call: '#6366f1', // Indigo
  Text: '#14b8a6', // Teal
};

export const ChannelDonut: React.FC<ChannelDonutProps> = ({ data }) => {
  const totalInteractions = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            Channel Breakdown & Weights
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Weighted interaction channels driving relationship scores
          </p>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
          Channel Mix
        </span>
      </div>

      <div className="h-64 w-full relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={90}
              paddingAngle={4}
              dataKey="count"
              nameKey="channel"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.channel] || '#94a3b8'}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(51, 65, 85, 0.6)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px',
              }}
              formatter={(value: any, name: any, item: any) => [
                `${value} logs (${item.payload.percentage}%)`,
                name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Donut Stat */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {totalInteractions}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total Logs
          </span>
        </div>
      </div>

      {/* Channel weight legend */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        {data.map((item) => (
          <div key={item.channel} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: COLORS[item.channel] }}
            />
            <div className="min-w-0">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                {item.channel}
              </span>
              <span className="text-[10px] text-slate-400">
                {item.count} logs ({item.percentage}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

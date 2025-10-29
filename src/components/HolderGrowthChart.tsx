'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface HistoryPoint {
  date: string;
  totalHolders: number;
  newHolders: number;
}

interface HolderGrowthChartProps {
  data: HistoryPoint[];
}

export default function HolderGrowthChart({ data }: HolderGrowthChartProps) {
  // Format data for chart
  const chartData = data.map(point => ({
    date: new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    'Total Holders': point.totalHolders,
    'New Holders': point.newHolders,
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Holder Growth Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="date"
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
          <Legend
            wrapperStyle={{
              color: '#9ca3af',
              fontSize: '14px'
            }}
          />
          <Line
            type="monotone"
            dataKey="Total Holders"
            stroke="#818cf8"
            strokeWidth={2}
            dot={{ fill: '#818cf8', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="New Holders"
            stroke="#34d399"
            strokeWidth={2}
            dot={{ fill: '#34d399', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


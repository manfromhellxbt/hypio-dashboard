'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface Holder {
  address: string;
  count: number;
  percentage: string;
}

interface DistributionChartProps {
  holders: Holder[];
}

const COLORS = ['#818cf8', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#60a5fa', '#fb923c', '#ec4899'];

export default function DistributionChart({ holders }: DistributionChartProps) {
  // Берём топ-8 холдеров для читаемости
  const top8 = holders.slice(0, 8);
  
  const chartData = top8.map(holder => ({
    name: `${holder.address.slice(0, 6)}...${holder.address.slice(-4)}`,
    value: holder.count,
    percentage: holder.percentage,
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Distribution (Top 8 Holders)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ percentage }) => `${percentage}`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff'
            }}
            formatter={(value: number) => [`${value} NFTs`, 'Count']}
          />
          <Legend
            wrapperStyle={{
              fontSize: '12px',
              color: '#9ca3af'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

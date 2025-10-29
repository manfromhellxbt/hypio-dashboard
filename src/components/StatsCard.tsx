interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
}

export default function StatsCard({ title, value, subtitle, trend, icon }: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="ml-4 text-indigo-600 dark:text-indigo-400">
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
        </div>
      )}
    </div>
  );
}

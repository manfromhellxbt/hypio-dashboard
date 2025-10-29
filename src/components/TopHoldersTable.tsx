interface Holder {
  address: string;
  count: number;
  percentage: string;
}

interface TopHoldersTableProps {
  holders: Holder[];
}

export default function TopHoldersTable({ holders }: TopHoldersTableProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top 10 Holders</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">#</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Address</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">NFTs</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Share</th>
            </tr>
          </thead>
          <tbody>
            {holders.map((holder, index) => (
              <tr key={holder.address} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">{index + 1}</td>
                <td className="py-3 px-4">
                  <a
                    href={`https://hyperevmscan.io/address/${holder.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-mono"
                  >
                    {holder.address.slice(0, 6)}...{holder.address.slice(-4)}
                  </a>
                </td>
                <td className="py-3 px-4 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                  {holder.count}
                </td>
                <td className="py-3 px-4 text-right text-sm text-gray-600 dark:text-gray-400">
                  {holder.percentage}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { AreaChart } from "@tremor/react";

// Define the type for stock data
interface StockData {
  id: number;
  co_code: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  mcap: number;
  volume: number;
}

// Define the type for chart data (formatted for Tremor)
interface ChartData {
  date: string;
  Close: number;
  mcap: number;
  volume: number;
}

interface ChartProps {
  data: StockData[];
}

export const Chart = ({ data }: ChartProps) => {
  // Format the data for Tremor's AreaChart
  const chartData: ChartData[] = data.map((item) => ({
    date: new Date(item.date)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      })
      .replace(/(\d{2}) (\w{3}) (\d{2})/, "$1 $2 $3"), // Format: "14 Dec 24"
    Close: item.close,
    mcap: item.mcap,
    volume: item.volume,
  }));

  // Custom tooltip
  const customTooltip = ({
    payload,
    label,
  }: {
    payload: any[];
    label: string;
  }) => {
    if (!payload || !payload.length) return null;
    const data = payload[0].payload;
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
        <p className="text-gray-700 font-medium">{label}</p>
        <p className="text-gray-700">Close: ₹{data.Close.toLocaleString()}</p>
        <p className="text-gray-700">
          Market Cap: ₹{data.mcap.toLocaleString()} Cr
        </p>
        <p className="text-gray-700">Volume: {data.volume.toLocaleString()}</p>
      </div>
    );
  };

  return (
    <AreaChart
      className="h-72"
      data={chartData}
      index="date"
      categories={["Close"]}
      colors={["blue"]}
      valueFormatter={(number: number) =>
        `₹${Intl.NumberFormat("us").format(number).toString()}`
      }
      yAxisWidth={60}
      showLegend={false}
      showGridLines={false} // No vertical grid lines
      showXAxis={true}
      showYAxis={true}
      autoMinValue={true}
      customTooltip={customTooltip}
      onValueChange={(v) => console.log(v)}
    />
  );
};

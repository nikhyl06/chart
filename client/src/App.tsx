import { useState, useEffect } from "react";
import axios from "axios";
import { Chart } from "./components/Chart";

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

function App() {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [selectedRange, setSelectedRange] = useState<string>("ALL");

  // Fetch data from the backend
  const fetchStockData = async (range: string) => {
    try {
      const response = await axios.get<StockData[]>(
        "http://localhost:5001/api/stock-data",
        {
          params: { range },
        }
      );
      setStockData(response.data);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  // Fetch data when the component mounts or the range changes
  useEffect(() => {
    fetchStockData(selectedRange);
  }, [selectedRange]);

  // Calculate percentage change
  const percentageChange =
    stockData.length > 1
      ? ((stockData[stockData.length - 1].close - stockData[0].close) /
          stockData[0].close) *
        100
      : 0;

  // Time range buttons
  const timeRanges = ["1W", "1M", "3M", "6M", "1Y", "2Y", "ALL"];

  return (
    <div className="h-screen flex items-center justify-center bg-[rgb(245,247,249)]">
      <div className="container mx-auto p-4 border border-gray-200 rounded shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold mr-4">
              TCS Consultancy Services
            </h1>
            <div className="text-green-500">
              {percentageChange > 0 ? "↑" : "↓"}{" "}
              {Math.abs(percentageChange).toFixed(2)}%
            </div>
          </div>
          <div>
            {timeRanges.map((range) => (
              <button
                key={range}
                className={`px-3 py-1 mr-1 rounded text-sm ${
                  selectedRange === range
                    ? "bg-[rgb(255,255,255)] shadow-md"
                    : "bg-[rgb(245,247,249)] text-gray-700"
                }`}
                onClick={() => setSelectedRange(range)}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
        <Chart data={stockData} />
      </div>
    </div>
  );
}

export default App;

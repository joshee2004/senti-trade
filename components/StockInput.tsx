
import React, { useState } from 'react';
import { TICKER_EXAMPLES } from '../constants';

interface StockInputProps {
  onPredict: (ticker: string) => void;
  isLoading: boolean;
}

const StockInput: React.FC<StockInputProps> = ({ onPredict, isLoading }) => {
  const [ticker, setTicker] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticker.trim()) {
      onPredict(ticker.trim().toUpperCase());
    }
  };

  const handleExampleClick = (exampleTicker: string) => {
    setTicker(exampleTicker);
    onPredict(exampleTicker);
  };

  return (
    <div className="mb-8 p-6 bg-gray-800 rounded-lg shadow-xl">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-center">
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          placeholder="Enter Stock Ticker (e.g., AAPL)"
          className="flex-grow p-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          disabled={isLoading || !ticker.trim()}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              Predict
            </>
          )}
        </button>
      </form>
      <div className="mt-4 text-sm text-gray-400">
        Try an example:
        {TICKER_EXAMPLES.map((exTicker) => (
          <button
            key={exTicker}
            onClick={() => handleExampleClick(exTicker)}
            className="ml-2 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-blue-400 hover:text-blue-300 transition-colors"
            disabled={isLoading}
          >
            {exTicker}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StockInput;

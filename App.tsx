
import React, { useState, useCallback, useEffect } from 'react';
import StockInput from './components/StockInput';
import PredictionDisplay from './components/PredictionDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import { getStockSentimentPrediction } from './services/geminiService';
import { FullPredictionResponse, Sentiment, Trend } from './types'; // Import Sentiment and Trend

const App: React.FC = () => {
  const [predictionData, setPredictionData] = useState<FullPredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTicker, setCurrentTicker] = useState<string | null>(null);

  const handlePredict = useCallback(async (ticker: string) => {
    setIsLoading(true);
    setError(null);
    setPredictionData(null); 
    setCurrentTicker(ticker.toUpperCase());
    try {
      const result = await getStockSentimentPrediction(ticker);
      setPredictionData(result); // Set data regardless of error, PredictionDisplay will handle it
      if (result.error) {
        // If there's an error from Gemini, we might still have partial data.
        // setError can be used for a more generic banner if needed, 
        // but PredictionDisplay now handles specific error display with ticker.
        // setError(result.error); 
      }
    } catch (e: unknown) { // Use unknown for better type safety
      console.error("Prediction failed in App:", e);
      const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
      setError(errorMessage);
      // Construct a minimal error object for PredictionDisplay
      setPredictionData({
        ticker: ticker.toUpperCase(),
        sentiment: Sentiment.Error, 
        trend: Trend.Unknown,
        confidence_score: 0,
        summary: errorMessage,
        key_factors: [],
        potential_risks: [],
        recent_news_highlights: [],
        error: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    document.body.classList.add('transition-colors', 'duration-500');
    // Consider adding a default font to body if not already set in index.html or global styles
    // document.body.style.fontFamily = "'Inter', sans-serif"; // Example, if Inter is linked
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 text-gray-100 flex flex-col items-center p-4 sm:p-8 selection:bg-blue-500 selection:text-white">
      <header className="text-center my-8 sm:my-12">
        <h1 className="text-5xl sm:text-6xl font-extrabold">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">SentiTrade</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-400 mt-3">AI-Powered Stock Sentiment Analysis</p>
      </header>

      <main className="w-full max-w-2xl">
        <StockInput onPredict={handlePredict} isLoading={isLoading} />
        
        {isLoading && <LoadingSpinner />}
        
        {!isLoading && error && !predictionData && ( // General error if API call itself failed hard before returning any structure
          <div className="mt-8 p-6 bg-red-900/30 border border-red-700 rounded-lg shadow-xl text-center">
            <p className="text-xl text-red-400">Error</p>
            <p className="text-gray-300 mt-2">{error}</p>
          </div>
        )}

        {!isLoading && predictionData && (
          <PredictionDisplay data={predictionData} />
        )}
        
        {/* Placeholder when no ticker has been searched yet */}
        {!isLoading && !predictionData && !error && !currentTicker && (
             <div className="mt-12 p-8 bg-gray-800/70 rounded-lg shadow-xl text-center border-2 border-dashed border-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-gray-600 mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                </svg>
                <h3 className="text-2xl font-semibold text-gray-300 mb-2">Ready for Insights?</h3>
                <p className="text-gray-400">Enter a stock ticker symbol above to get its sentiment analysis and short-term trend prediction.</p>
            </div>
        )}
      </main>

      <footer className="text-center py-8 mt-auto">
        <p className="text-sm text-gray-500">
          SentiTrade | Created by Joshua Royar.
        </p>
        <p className="text-xs text-gray-600 mt-1">
          Disclaimer: This tool provides predictions based on AI analysis and should not be considered financial advice. Always do your own research before making investment decisions.
        </p>
      </footer>
    </div>
  );
};

export default App;

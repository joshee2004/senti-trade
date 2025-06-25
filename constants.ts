
import { Sentiment, Trend } from './types';

export const GEMINI_MODEL_NAME = "gemini-2.5-flash-preview-04-17";

export const SENTIMENT_COLORS: Record<Sentiment, string> = {
  [Sentiment.Positive]: "text-green-400",
  [Sentiment.Negative]: "text-red-400",
  [Sentiment.Neutral]: "text-yellow-400",
  [Sentiment.Error]: "text-gray-500",
};

export const SENTIMENT_BG_COLORS: Record<Sentiment, string> = {
  [Sentiment.Positive]: "bg-green-500/20",
  [Sentiment.Negative]: "bg-red-500/20",
  [Sentiment.Neutral]: "bg-yellow-500/20",
  [Sentiment.Error]: "bg-gray-500/20",
};

export const TREND_ICONS: Record<Trend, string> = {
  [Trend.Up]: "▲",
  [Trend.Down]: "▼",
  [Trend.Stable]: "▬",
  [Trend.Unknown]: "?",
};

export const TREND_COLORS: Record<Trend, string> = {
  [Trend.Up]: "text-green-400",
  [Trend.Down]: "text-red-400",
  [Trend.Stable]: "text-yellow-400",
  [Trend.Unknown]: "text-gray-500",
};

export const TICKER_EXAMPLES = ["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN"];

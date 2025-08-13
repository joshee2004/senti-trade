import React from "react";
import { FullPredictionResponse, KeyFactor, Sentiment, Trend } from "../types";
import { SENTIMENT_COLORS, TREND_ICONS, TREND_COLORS } from "../constants";
import SentimentIndicator from "./SentimentIndicator";

interface PredictionDisplayProps {
    data: FullPredictionResponse | null;
}

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => (
    <h3 className="text-lg font-semibold text-blue-300 mt-6 mb-2 border-b border-gray-700 pb-1">
        {children}
    </h3>
);

const KeyFactorItem: React.FC<{ item: KeyFactor }> = ({ item }) => (
    <li className="flex items-start py-2">
        <span
            className={`mr-2 text-xl ${SENTIMENT_COLORS[item.impact] || SENTIMENT_COLORS[Sentiment.Neutral]}`}
        >
            {item.impact === Sentiment.Positive
                ? "✚"
                : item.impact === Sentiment.Negative
                  ? "▬"
                  : "•"}
        </span>
        <span className="text-gray-300">{item.factor}</span>
    </li>
);

const PredictionDisplay: React.FC<PredictionDisplayProps> = ({ data }) => {
    if (!data) {
        return null;
    }

    if (data.error && (!data.summary || data.summary === data.error)) {
        // Check if error is the main message
        return (
            <div className="mt-8 p-6 bg-gray-800 rounded-lg shadow-xl text-center">
                <SentimentIndicator sentiment={Sentiment.Error} size="large" />
                <p className="text-xl text-red-400 mt-4">
                    Prediction Error for {data.ticker}
                </p>
                <p className="text-gray-300 mt-2">
                    {data.summary || data.error}
                </p>
            </div>
        );
    }

    const confidencePercentage = (data.confidence_score * 100).toFixed(0);

    return (
        <div className="mt-8 p-6 bg-gray-800 rounded-lg shadow-xl transition-opacity duration-500 ease-out opacity-100">
            {" "}
            {/* Removed animate-fadeIn, added basic transition */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-700">
                <div>
                    <h2 className="text-4xl font-bold text-white">
                        {data.ticker}
                    </h2>
                    <p className="text-gray-400 text-lg">{data.summary}</p>
                </div>
                <div
                    className={`mt-4 sm:mt-0 text-5xl font-bold ${TREND_COLORS[data.trend] || TREND_COLORS[Trend.Unknown]}`}
                >
                    {TREND_ICONS[data.trend] || TREND_ICONS[Trend.Unknown]}
                    <span className="ml-2 text-3xl">{data.trend}</span>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="p-4 bg-gray-700/50 rounded-md">
                    <h4 className="text-md font-semibold text-blue-300 mb-2">
                        Overall Sentiment
                    </h4>
                    <SentimentIndicator
                        sentiment={data.sentiment}
                        size="large"
                    />
                </div>
                <div className="p-4 bg-gray-700/50 rounded-md">
                    <h4 className="text-md font-semibold text-blue-300 mb-2">
                        Prediction Confidence
                    </h4>
                    <div className="w-full bg-gray-600 rounded-full h-2.5 dark:bg-gray-700">
                        <div
                            className={`bg-blue-500 h-2.5 rounded-full transition-all duration-500 ease-out`}
                            style={{ width: `${confidencePercentage}%` }}
                        ></div>
                    </div>
                    <p className="text-right text-blue-400 mt-1">
                        {confidencePercentage}%
                    </p>
                </div>
            </div>
            {data.key_factors && data.key_factors.length > 0 && (
                <div>
                    <SectionTitle>Key Factors</SectionTitle>
                    <ul className="list-none pl-0 space-y-1">
                        {data.key_factors.map((item, index) => (
                            <KeyFactorItem key={index} item={item} />
                        ))}
                    </ul>
                </div>
            )}
            {data.potential_risks && data.potential_risks.length > 0 && (
                <div>
                    <SectionTitle>Potential Risks</SectionTitle>
                    <ul className="list-disc list-inside pl-1 space-y-1 text-gray-300">
                        {data.potential_risks.map((risk, index) => (
                            <li key={index}>{risk}</li>
                        ))}
                    </ul>
                </div>
            )}
            {data.recent_news_highlights &&
                data.recent_news_highlights.length > 0 && (
                    <div>
                        <SectionTitle>Recent News Highlights</SectionTitle>
                        <ul className="list-none pl-0 space-y-2">
                            {data.recent_news_highlights.map((news, index) => (
                                <li
                                    key={index}
                                    className="p-3 bg-gray-700/50 rounded-md text-gray-300 text-sm"
                                >
                                    <span className="font-semibold text-gray-200">
                                        📰 {news}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            {data.sources && data.sources.length > 0 && (
                <div>
                    <SectionTitle>
                        Information Sources (from Google Search)
                    </SectionTitle>
                    <ul className="list-none pl-0 space-y-1">
                        {data.sources.map((source, index) => (
                            <li key={index} className="text-sm">
                                <a
                                    href={source.uri}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 hover:underline break-all"
                                >
                                    {source.title || source.uri}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PredictionDisplay;

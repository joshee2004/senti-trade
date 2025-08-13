export enum Sentiment {
    Positive = "Positive",
    Negative = "Negative",
    Neutral = "Neutral",
    Error = "Error",
}

export enum Trend {
    Up = "Up",
    Down = "Down",
    Stable = "Stable",
    Unknown = "Unknown",
}

export interface KeyFactor {
    factor: string;
    impact: Sentiment;
}

export interface PredictionData {
    ticker: string;
    sentiment: Sentiment;
    trend: Trend;
    confidence_score: number;
    summary: string;
    key_factors: KeyFactor[];
    potential_risks: string[];
    recent_news_highlights: string[];
    error?: string; // Optional error message if API call or parsing fails for a specific ticker
}

export interface GroundingSource {
    uri: string;
    title: string;
}

export interface FullPredictionResponse extends PredictionData {
    sources?: GroundingSource[];
}

import {
    GoogleGenAI,
    GenerateContentResponse,
    GroundingChunk,
} from "@google/genai";
import { GEMINI_MODEL_NAME } from "../constants";
import {
    PredictionData,
    FullPredictionResponse,
    GroundingSource,
    Sentiment,
    Trend,
} from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    // This error will be thrown at build/runtime if API_KEY is not set.
    // For a production app, you might handle this more gracefully,
    // but for this context, an early error is informative.
    console.error(
        "API_KEY environment variable not set. Please ensure it is configured in your environment.",
    );
    // To avoid app crash during development if API_KEY is not immediately available,
    // we can proceed but the API calls will fail. A real app should block functionality.
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "MISSING_API_KEY" }); // Use a placeholder if not found to avoid immediate crash

const generatePrompt = (ticker: string): string => `
You are an expert financial market analyst named SentiTrade specializing in sentiment analysis.
For the stock ticker "${ticker.toUpperCase()}", analyze recent news, social media discussions, and market data from the past 7 days to determine its sentiment and predict its likely short-term price trend for the next 1-3 trading days.

Please provide your analysis strictly in the following JSON format:
{
  "ticker": "${ticker.toUpperCase()}",
  "sentiment": "Positive" | "Negative" | "Neutral",
  "trend": "Up" | "Down" | "Stable",
  "confidence_score": 0.0,
  "summary": "A brief summary of your analysis (2-3 sentences).",
  "key_factors": [
    { "factor": "Factor description", "impact": "Positive" | "Negative" | "Neutral" }
  ],
  "potential_risks": [
     "Risk description"
  ],
  "recent_news_highlights": [
    "News item 1"
  ]
}

If you cannot find sufficient information for the ticker, or if the ticker is invalid, return a JSON object like this:
{
  "ticker": "${ticker.toUpperCase()}",
  "error": "Could not find sufficient information for the specified ticker or the ticker is invalid."
}

Do not include any Markdown formatting like \`\`\`json or \`\`\` around the JSON object.
Ensure the output is a single, valid JSON object and nothing else.
The confidence_score should be a number between 0.0 and 1.0, representing your confidence in the prediction.
`;

export const getStockSentimentPrediction = async (
    ticker: string,
): Promise<FullPredictionResponse> => {
    if (!API_KEY) {
        return {
            ticker: ticker.toUpperCase(),
            sentiment: Sentiment.Error,
            trend: Trend.Unknown,
            confidence_score: 0,
            summary:
                "API Key is not configured. Please set the API_KEY environment variable.",
            key_factors: [],
            potential_risks: [],
            recent_news_highlights: [],
            error: "API Key is not configured.",
        };
    }

    try {
        const prompt = generatePrompt(ticker);
        const result: GenerateContentResponse = await ai.models.generateContent(
            {
                model: GEMINI_MODEL_NAME,
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                config: {
                    temperature: 0.3,
                    topP: 0.9,
                    topK: 32,
                },
                // To enable Google Search grounding, uncomment the following:
                // tools: [{ googleSearch: {} }],
            },
        );

        let rawJsonText = result.text.trim();

        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = rawJsonText.match(fenceRegex);
        if (match && match[2]) {
            rawJsonText = match[2].trim();
        }

        const parsedData = JSON.parse(rawJsonText) as PredictionData;

        if (parsedData.error) {
            return {
                ...parsedData, // This will include the error message
                ticker: ticker.toUpperCase(),
                sentiment: parsedData.sentiment || Sentiment.Error,
                trend: parsedData.trend || Trend.Unknown,
                confidence_score: parsedData.confidence_score || 0,
                summary: parsedData.summary || parsedData.error, // Ensure summary also shows error if present
                key_factors: parsedData.key_factors || [],
                potential_risks: parsedData.potential_risks || [],
                recent_news_highlights: parsedData.recent_news_highlights || [],
                // sources: extractSources(result.candidates?.[0]?.groundingMetadata?.groundingChunks) // if using googleSearch
            };
        }

        const validatedSentiment = Object.values(Sentiment).includes(
            parsedData.sentiment,
        )
            ? parsedData.sentiment
            : Sentiment.Neutral;
        const validatedTrend = Object.values(Trend).includes(parsedData.trend)
            ? parsedData.trend
            : Trend.Unknown;
        const validatedKeyFactors = (parsedData.key_factors || []).map(
            (kf) => ({
                ...kf,
                impact: Object.values(Sentiment).includes(kf.impact)
                    ? kf.impact
                    : Sentiment.Neutral,
            }),
        );

        const predictionResponse: FullPredictionResponse = {
            ...parsedData,
            ticker: parsedData.ticker.toUpperCase(),
            sentiment: validatedSentiment,
            trend: validatedTrend,
            key_factors: validatedKeyFactors,
            potential_risks: parsedData.potential_risks || [],
            recent_news_highlights: parsedData.recent_news_highlights || [],
            // sources: extractSources(result.candidates?.[0]?.groundingMetadata?.groundingChunks), // if using googleSearch
        };

        // Example of extracting sources if googleSearch tool was used
        // const groundingMetadata = result.candidates?.[0]?.groundingMetadata;
        // if (groundingMetadata && groundingMetadata.groundingChunks) {
        //   predictionResponse.sources = extractSources(groundingMetadata.groundingChunks);
        // }

        return predictionResponse;
    } catch (error) {
        console.error(
            `Error fetching or parsing stock sentiment for ${ticker}:`,
            error,
        );
        let errorMessage =
            "Failed to get prediction. The model might be unavailable or returned an unexpected format.";
        if (error instanceof Error) {
            errorMessage = error.message;
            if (error.message.includes("JSON.parse")) {
                errorMessage =
                    "Failed to parse prediction data from the model. The format might be incorrect.";
            } else if (
                error.message.toLowerCase().includes("api key not valid")
            ) {
                errorMessage =
                    "Invalid API Key. Please check your API_KEY environment variable.";
            }
        }

        return {
            ticker: ticker.toUpperCase(),
            sentiment: Sentiment.Error,
            trend: Trend.Unknown,
            confidence_score: 0,
            summary:
                "An error occurred while fetching or processing the prediction.",
            key_factors: [],
            potential_risks: [],
            recent_news_highlights: [],
            error: errorMessage,
            // sources: [],
        };
    }
};

// Helper function to extract sources if googleSearch tool is used
// @ts-ignore Unused function for now unless googleSearch is enabled
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const extractSources = (
    chunks: GroundingChunk[] | undefined,
): GroundingSource[] => {
    if (!chunks) return [];
    return chunks
        .filter((chunk) => chunk.web && chunk.web.uri) // title is optional for web chunk
        .map((chunk) => ({
            uri: chunk.web!.uri!,
            title: chunk.web!.title || chunk.web!.uri!, // Use URI as title if title is missing
        }));
};

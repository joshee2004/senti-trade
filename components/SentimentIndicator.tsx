
import React from 'react';
import { Sentiment } from '../types';
import { SENTIMENT_COLORS, SENTIMENT_BG_COLORS } from '../constants';

interface SentimentIndicatorProps {
  sentiment: Sentiment;
  size?: 'small' | 'medium' | 'large';
}

const SentimentIndicator: React.FC<SentimentIndicatorProps> = ({ sentiment, size = 'medium' }) => {
  const colorClass = SENTIMENT_COLORS[sentiment] || SENTIMENT_COLORS[Sentiment.Neutral];
  const bgColorClass = SENTIMENT_BG_COLORS[sentiment] || SENTIMENT_BG_COLORS[Sentiment.Neutral];
  
  let icon;
  let textSizeClass = "text-lg"; // Default for medium
  let iconSizeClass = "w-6 h-6"; // Default for medium

  if (size === 'small') {
    textSizeClass = "text-sm";
    iconSizeClass = "w-5 h-5";
  }
  if (size === 'large') {
    textSizeClass = "text-xl"; // Adjusted for large
    iconSizeClass = "w-7 h-7"; // Adjusted for large
  }


  switch (sentiment) {
    case Sentiment.Positive:
      icon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${iconSizeClass} ${colorClass}`}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
             </svg>;
      break;
    case Sentiment.Negative:
      icon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${iconSizeClass} ${colorClass}`}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
             </svg>;
      break;
    case Sentiment.Neutral:
      icon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${iconSizeClass} ${colorClass}`}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
             </svg>;
      break;
    case Sentiment.Error:
    default: // Default to error icon if sentiment is unrecognized or Error
      icon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${iconSizeClass} ${colorClass}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>;
      break;
  }


  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${bgColorClass} ${textSizeClass}`}>
      {icon}
      <span className={`${colorClass} font-medium`}>{sentiment}</span>
    </div>
  );
};

export default SentimentIndicator;

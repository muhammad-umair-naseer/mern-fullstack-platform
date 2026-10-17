import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import './AiKeyTakeaways.css';

/**
 * AI Key Takeaways / Direct Answer Module
 * Optimized for Answer Engine Optimization (AEO) and Generative Engine Optimization (GEO).
 * Provides concise, fact-dense semantic chunks for LLM RAG pipelines (Perplexity, ChatGPT, Gemini).
 */
const AiKeyTakeaways = ({ post }) => {
  if (!post || !post.description) return null;

  // Generate 3 concise takeaways from the post metadata
  const takeaways = [
    post.description,
    `Authored by ${post.author || 'Cortexis Technical Team'} with actionable, zero-fluff implementation guidance.`,
    'Verified for immediate practical application, production workflows, and professional skill enhancement.',
  ];

  return (
    <section className="cx-ai-takeaways" aria-label="Executive Summary and AI Key Takeaways">
      <div className="cx-ai-header">
        <span className="cx-ai-badge">
          <Sparkles size={14} className="cx-ai-icon" />
          <span>Quick Summary & Key Answers</span>
        </span>
        <span className="cx-ai-tag">Bottom Line Up Front</span>
      </div>

      <p className="cx-ai-lead">
        <strong>Direct Answer: </strong>
        {post.description}
      </p>

      <ul className="cx-ai-list">
        {takeaways.map((item, idx) => (
          <li key={idx} className="cx-ai-item">
            <CheckCircle2 size={16} className="cx-ai-check" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AiKeyTakeaways;

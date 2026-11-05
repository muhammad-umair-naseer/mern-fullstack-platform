import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import './ClaudeAnnouncementBar.css';

export default function ClaudeAnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const location = useLocation();

  // If in final exam mode, don't distract the student
  const isExam = location.pathname.includes('/final');

  useEffect(() => {
    const isHidden = sessionStorage.getItem('cortexis_claude_bar_dismissed');
    if (isHidden === 'true') {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDismissed(true);
    sessionStorage.setItem('cortexis_claude_bar_dismissed', 'true');
  };

  if (dismissed || isExam) return null;

  const tickerText = "LIMITED TIME INCENTIVE: Get Claude Pro for Free for 1 Month upon successful completion of course! • 100% Free Certified Training • Sponsored Access • Apply Upon Course Completion • ";

  return (
    <div className="claude-bar" role="region" aria-label="Claude Pro Special Promotion">
      <Link to="/courses" className="claude-bar-link">
        <div className="claude-bar-badge">
          <span>Claude Pro Grant</span>
        </div>
        <div className="claude-bar-ticker-wrap">
          <div className="claude-bar-ticker">
            <span className="claude-bar-msg">{tickerText}</span>
            <span className="claude-bar-msg" aria-hidden="true">{tickerText}</span>
          </div>
        </div>
        <div className="claude-bar-action">
          <span>Explore Courses</span>
          <ArrowRight size={13} aria-hidden="true" />
        </div>
      </Link>
      <button
        type="button"
        className="claude-bar-close"
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
        title="Dismiss announcement"
      >
        <X size={14} />
      </button>
    </div>
  );
}

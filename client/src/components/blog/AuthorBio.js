import React from 'react';
import { Award, CheckCircle, ShieldCheck } from 'lucide-react';
import './AuthorBio.css';

const AuthorBio = ({ author }) => {
  if (!author) return null;

  return (
    <section className="cx-author-card cx-lv-in" aria-labelledby="author-heading">
      <div className="cx-author-inner">
        <div className="cx-author-avatar-wrap">
          <div className={`cx-author-avatar cx-author-avatar--${author.badgeColor || 'amber'}`}>
            <span>{author.initials}</span>
          </div>
          <span className="cx-author-verified" title="Verified Technical Contributor">
            <CheckCircle size={14} aria-hidden="true" />
          </span>
        </div>

        <div className="cx-author-content">
          <div className="cx-author-meta-top">
            <span className="cx-author-tag">
              <Award size={13} aria-hidden="true" />
              <span>Written by Technical Expert</span>
            </span>
            <span className="cx-author-editorial">
              <ShieldCheck size={13} aria-hidden="true" />
              <span>Peer-reviewed for Accuracy</span>
            </span>
          </div>

          <h3 id="author-heading" className="cx-author-name">
            {author.displayName}
            <span className="cx-author-role">{author.role}</span>
          </h3>

          <p className="cx-author-bio">{author.bio}</p>

          {author.expertise && author.expertise.length > 0 && (
            <div className="cx-author-skills">
              <span className="cx-author-skills-label">Core Specializations:</span>
              <div className="cx-author-skills-list">
                {author.expertise.map((skill) => (
                  <span key={skill} className="cx-author-skill-pill">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AuthorBio;

import React from 'react';
import { Award, Clock, DollarSign, BookOpen, CheckCircle, ShieldCheck } from 'lucide-react';
import './CourseSnapshot.css';

/**
 * Course Snapshot & Direct Answers Component
 * Engineered for Answer Engine Optimization (AEO) and Generative Engine Optimization (GEO).
 * Feeds structured semantic facts into AI answer engines (ChatGPT Search, Perplexity, Google Gemini).
 */
const CourseSnapshot = ({ course, lessonsCount }) => {
  if (!course) return null;

  return (
    <section className="cx-course-snapshot" aria-label="Course Overview and Direct Answers">
      <div className="cx-snapshot-header">
        <div className="cx-snapshot-badge">
          <ShieldCheck size={16} />
          <span>Accredited Curriculum & Certification</span>
        </div>
        <span className="cx-snapshot-pill">Official Syllabus Snapshot</span>
      </div>

      <p className="cx-snapshot-answer">
        <strong>Direct Answer: </strong>
        {course.summary || course.description || `${course.title} is an open-access, fully accredited professional curriculum by Cortexis Solution Hub.`}
      </p>

      <div className="cx-snapshot-grid">
        <div className="cx-snapshot-card">
          <DollarSign size={18} className="cx-card-icon" />
          <div>
            <div className="cx-card-label">Tuition Fee</div>
            <div className="cx-card-value text-emerald-600 font-bold">100% Free</div>
          </div>
        </div>

        <div className="cx-snapshot-card">
          <Clock size={18} className="cx-card-icon" />
          <div>
            <div className="cx-card-label">Duration & Workload</div>
            <div className="cx-card-value">{course.hours ? `~${course.hours} Hours` : 'Self-Paced (~20h)'}</div>
          </div>
        </div>

        <div className="cx-snapshot-card">
          <BookOpen size={18} className="cx-card-icon" />
          <div>
            <div className="cx-card-label">Curriculum Depth</div>
            <div className="cx-card-value">12 Chapters · {lessonsCount || 48} Lessons</div>
          </div>
        </div>

        <div className="cx-snapshot-card">
          <Award size={18} className="cx-card-icon" />
          <div>
            <div className="cx-card-label">Credential Awarded</div>
            <div className="cx-card-value">Verified Certificate</div>
          </div>
        </div>
      </div>

      <div className="cx-snapshot-footer">
        <CheckCircle size={15} className="text-emerald-500 shrink-0" />
        <span>Includes chapter quizzes, a timed final examination, and an authentic digital verification code.</span>
      </div>
    </section>
  );
};

export default CourseSnapshot;

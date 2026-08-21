import React from 'react';
import { Link } from 'react-router-dom';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import SectionHeading from './SectionHeading';
import './CoursesPreview.css';
import fullstackImg from '../assets/courses/full-stack-web.webp';
import dataSciImg from '../assets/data science.webp';
import uiuxImg from '../assets/courses/ui-ux-bootcamp.webp';

const CoursesPreview = () => {
  const scope = useRevealOnScroll();
  const courses = [
    {
      title: "Full-Stack Web Development",
      duration: "12 weeks",
      level: "Beginner to Advanced",
      image: fullstackImg
    },
    {
      title: "Data Science Fundamentals",
      duration: "10 weeks",
      level: "Intermediate",
      image: dataSciImg
    },
    {
      title: "UI/UX Design Bootcamp",
      duration: "8 weeks",
      level: "Beginner",
      image: uiuxImg
    }
  ];

  return (
    <section className="courses-container" aria-labelledby="courses-heading" ref={scope}>
      <div className="container">
        <SectionHeading
          id="courses-heading"
          eyebrow="Learn with us"
          title="Featured Courses"
          subtitle="Outcome-driven programs with hands-on projects and expert mentorship"
          titleClassName="courses-title"
        />
        <ul className="courses-row row" role="list" aria-label="Featured course cards">
          {courses.map((course, index) => {
            const titleId = `course-title-${index}`;
            return (
              <li key={index} className="col-md-4 mb-4" role="listitem" data-reveal>
                <Link
                  to="/courses"
                  className="card course-preview-card h-100 course-link"
                  aria-labelledby={titleId}
                >
                  <div className="course-media">
                    <img src={course.image} className="card-img-top" alt="" />
                    <span className="visually-hidden">{course.title}</span>
                  </div>
                  <div className="card-body">
                    <h3 id={titleId} className="card-title">{course.title}</h3>
                    <div className="course-details" aria-label="Course details">
                      <span className="badge badge-chip badge-primary" aria-label={`Duration ${course.duration}`}>
                        {course.duration}
                      </span>
                      <span className="badge badge-chip badge-neutral" aria-label={`Level ${course.level}`}>
                        {course.level}
                      </span>
                    </div>
                    <p className="card-text">
                      Comprehensive training with hands-on projects and expert mentorship.
                    </p>
                    <span className="course-btn as-link">Learn More</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="text-center" data-reveal>
          <Link to="/courses" className="btn-view-all">View All Courses</Link>
        </div>
      </div>
    </section>
  );
};

export default CoursesPreview;

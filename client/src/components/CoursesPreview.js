import React from 'react';
import { Link } from 'react-router-dom';
import './CoursesPreview.css';

const CoursesPreview = () => {
  const courses = [
    {
      title: "Full-Stack Web Development",
      duration: "12 weeks",
      level: "Beginner to Advanced",
      image: "https://images.unsplash.com/photo-1581276879432-15e50529f34b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Data Science Fundamentals",
      duration: "10 weeks",
      level: "Intermediate",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "UI/UX Design Bootcamp",
      duration: "8 weeks",
      level: "Beginner",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <section className="courses-container" aria-labelledby="courses-heading">
      <div className="container">
        <h2 id="courses-heading" className="courses-title">Featured Courses</h2>
        <p className="courses-subtitle">Outcome-driven programs with hands-on projects and expert mentorship</p>
        <ul className="courses-row row" role="list" aria-label="Featured course cards">
          {courses.map((course, index) => {
            const titleId = `course-title-${index}`;
            return (
              <li key={index} className="col-md-4 mb-4" role="listitem">
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
        <div className="text-center">
          <Link to="/courses" className="btn-view-all">View All Courses</Link>
        </div>
      </div>
    </section>
  );
};

export default CoursesPreview;

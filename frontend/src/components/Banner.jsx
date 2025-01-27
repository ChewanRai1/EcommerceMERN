// import { Button, Row, Col } from 'react-bootstrap';
// import { Link } from 'react-router-dom';

// export default function Banner({data}) {

//     console.log(data);
//     const {title, content, destination, buttonLabel} = data;

//     return (
//         <Row>
//             <Col>
//                 <h1>{title}</h1>
//                 <p>{content}</p>
//                 <Link variant="primary"to={destination}>{buttonLabel}</Link>
//             </Col>
//         </Row>
//     )
// }

//2nd

import { useState, useEffect } from "react";
import { Carousel, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import animateImg from "../assets/animate.jpg";
import webImg from "../assets/web.jpg";
import cybersecurityImg from "../assets/cybersecurity.jpg";

export default function Banner() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    fetch(`${import.meta.env.VITE_API_URL}/courses/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched courses:", data);

        if (!data || data.message === "No active courses found") {
          setCourses([]);
          return;
        }

        const coursesArray = Array.isArray(data) ? data : data.courses || [];

        if (coursesArray.length === 0) {
          setCourses([]);
          return;
        }

        // Add predefined images to courses
        const coursesWithImages = coursesArray.map((course, index) => ({
          ...course,
          image: [animateImg, webImg, cybersecurityImg][index % 3], // Cycle through images
        }));

        setCourses(coursesWithImages);
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
        setError(err.message);
      });
  }, []);

  if (error) {
    return <div>Error loading courses: {error}</div>;
  }

  return (
    <Carousel interval={5000} fade>
      {courses.length > 0 ? (
        courses.map((course) => (
          <Carousel.Item key={course._id}>
            <div className="d-flex justify-content-between align-items-center banner-content">
              <div>
                <h1>{course.name}</h1>
                <ul className="list-unstyled">
                  <li>
                    <span className="me-2">📘</span> {course.description}
                  </li>
                </ul>
                <Button
                  as={Link}
                  to={`/courses/${course._id}`}
                  className="btn-primary"
                >
                  Explore Courses
                </Button>
              </div>
              <img
                src={course.image}
                alt={course.name}
                className="banner-img"
              />
            </div>
          </Carousel.Item>
        ))
      ) : (
        <Carousel.Item>
          <div className="text-center">No courses available</div>
        </Carousel.Item>
      )}
    </Carousel>
  );
}

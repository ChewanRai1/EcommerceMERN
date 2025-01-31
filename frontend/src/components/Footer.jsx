import { Container, Row, Col } from "react-bootstrap";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-5">
      <Container>
        <Row>
          <Col md={4}>
            <h4 className="mb-3">Course Booking</h4>
            <p>
              We offer a wide range of technical courses in Web Development,
              Cyber Security, 3D Animation & VFX, AI, and Data Science,
              providing industry-relevant training with over a decade of
              expertise.
            </p>
            <div className="social-icons">
              <a href="#" className="me-3 text-white">
                <FaFacebookF />
              </a>
              <a href="#" className="me-3 text-white">
                <FaInstagram />
              </a>
              <a href="#" className="me-3 text-white">
                <FaLinkedinIn />
              </a>
              <a href="#" className="text-white">
                <FaYoutube />
              </a>
            </div>
          </Col>
          <Col md={2}>
            <h5>Courses</h5>
            <ul className="list-unstyled">
              <li>Cyber Security</li>
              <li>Web Development</li>
              <li>Animation</li>
              <li>Design</li>
              <li>IOT</li>
              <li>AI</li>
            </ul>
          </Col>
          <Col md={2}>
            <h5>About</h5>
            <ul className="list-unstyled">
              <li>About Us</li>
              <li>Our Faculties</li>
              <li>Our Clients</li>
              <li>Our Partners</li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Contact Us</h5>
            <p>
              Kathmandu, Nepal
              <br />
              +977-9851034453, +977-9842324401
            </p>
          </Col>
        </Row>
        <hr />
        <p className="text-center m-0">© All Rights Reserved.</p>
      </Container>
    </footer>
  );
}

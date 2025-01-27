import { Container, Row, Col } from "react-bootstrap";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-5">
      <Container>
        <Row>
          <Col md={4}>
            <h4 className="mb-3">DanpheLink Academy</h4>
            <p>
              We excel in Web Development, Cyber Security, 3D Animation & VFX, AI, and Data Science, delivering over a decade of innovative solutions.
            </p>
            <div className="social-icons">
              <a href="#" className="me-3 text-white"><FaFacebookF /></a>
              <a href="#" className="me-3 text-white"><FaInstagram /></a>
              <a href="#" className="me-3 text-white"><FaLinkedinIn /></a>
              <a href="#" className="text-white"><FaYoutube /></a>
            </div>
          </Col>
          <Col md={2}>
            <h5>Courses</h5>
            <ul className="list-unstyled">
              <li>Cyber Security</li>
              <li>Web Development</li>
              <li>Animation</li>
              <li>Design</li>
              <li>Marketing</li>
              <li>Programming</li>
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
              P&P Building, Kamalpokhari 01, Kathmandu, Nepal<br />
              +977-9707861393, +977-9707861394
            </p>
            <p>
              AL Aryam Tower, Abu Dhabi, UAE<br />
              +971 026228107
            </p>
          </Col>
        </Row>
        <hr />
        <p className="text-center m-0">© 2025 DanpheLink. All Rights Reserved.</p>
      </Container>
    </footer>
  );
}

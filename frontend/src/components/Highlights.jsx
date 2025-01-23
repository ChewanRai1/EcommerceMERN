import { Row, Col, Card } from "react-bootstrap";

export default function Highlights() {
  return (
    <Row className="mt-3 mb-3">
      <Col xs={12} md={4}>
        <Card className="cardHighlight p-3">
          <Card.Body>
            <Card.Title>
              <h2>Learn from Home</h2>
            </Card.Title>
            <Card.Text>
              Transform your learning experience with our flexible remote
              education platform. Master new skills from the comfort of your
              home, with access to expert instructors, comprehensive course
              materials, and interactive learning sessions. Our virtual
              classrooms are designed to provide the same quality of education
              as traditional settings, allowing you to balance your studies with
              other commitments while saving time and money on commuting.
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={12} md={4}>
        <Card className="cardHighlight p-3">
          <Card.Body>
            <Card.Title>
              <h2>Study Now, Pay Later</h2>
            </Card.Title>
            <Card.Text>
              We believe financial constraints shouldn't limit your educational
              journey. Our Study Now, Pay Later program offers flexible payment
              options that let you start your courses immediately and manage
              payments at your own pace. With easy installment plans and zero
              upfront fees, you can focus on your learning while spreading the
              cost over time. Invest in your future without the immediate
              financial burden.
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={12} md={4}>
        <Card className="cardHighlight p-3">
          <Card.Body>
            <Card.Title>
              <h2>Be Part of Our Community</h2>
            </Card.Title>
            <Card.Text>
              Join a thriving community of learners, professionals, and industry
              experts. Our platform goes beyond just courses - we create an
              interactive environment where students can collaborate, share
              experiences, and build lasting professional networks. Participate
              in group discussions, work on team projects, and get mentorship
              from experienced practitioners. Your learning journey becomes more
              enriching when you're part of a supportive community that shares
              your passion for growth.
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

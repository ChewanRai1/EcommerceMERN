import {Col, Card} from 'react-bootstrap';
import {Link} from 'react-router-dom';

// props - the sent props by the FeaturedCourses.jsx
export default function PreviewCourses(props){

	const {breakPoint, data} = props;	

	// From the destructured prop we should be able to access the data that contains course properties.
	// Now, here we desctrucured all the course properties so we could directly use just the property name in our return statement.
	const {_id, name, description, price} = data;

	
	return(
		<Col xs={12} md={breakPoint}>
			<Card className="cardHighlight mx-2">
				<Card.Body>
					<Card.Title className="text-center">
						<Link to={`/courses/${_id}`}>{name}</Link>
						<Card.Text>{description}</Card.Text>
					</Card.Title>
				</Card.Body>
				<Card.Footer>
					<Link className="btn btn-primary" to={`/courses/${_id}`}>Details</Link>
				</Card.Footer>
			</Card>
		</Col>
	);

}
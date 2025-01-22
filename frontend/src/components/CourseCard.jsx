import { Card, Button } from 'react-bootstrap';
import {useState} from 'react';
import {Link} from "react-router-dom";
export default function CourseCard({courseProp}) {
    // Object Destructuring
    const {_id, name, description, price} = courseProp;
        // getter  // setter function
    const [count, setCount] = useState(0);
    // getter - retrieves the state
    // setter - sets/updates the state

    // function enroll(){
    //     setCount(count+1);

    //     // condition (if the count exceeds to 10 it should display alert box "No more slots available")   
    // }

    return (
        <Card>
            <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Subtitle>Description:</Card.Subtitle>
                <Card.Text>{description}</Card.Text>
                <Card.Subtitle>Price:</Card.Subtitle>
                <Card.Text>{price}</Card.Text>
                <Link className="btn btn-primary" to={`/courses/${_id}`}>Details</Link>
            </Card.Body>
        </Card>
    )
}
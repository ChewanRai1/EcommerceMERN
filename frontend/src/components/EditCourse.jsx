import { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import {Notyf} from "notyf";
import "notyf/notyf.min.css";

export default function EditCourse({course, fetchData}){

	const notyf = new Notyf(); // <---

	const[courseId, setCourseId] = useState(course._id); // <---

	// state for input boxes
	const [name, setName] = useState(course.name);
	const [description, setDescription] = useState(course.description);
	const [price, setPrice] = useState(course.price);

	// state to show or not to show our edit form
	const [showEdit, setShowEdit] = useState(false);


	const editCourse = (e, courseId) => {
		// the default behaviour of our browser in form submission is, it refreshes when submit button is being clicked.
		// .preventDefault() prevents this default behaviour
		e.preventDefault();

		fetch(`${import.meta.env.VITE_API_URL}/courses/${courseId}`,{
			method: 'PATCH',
			headers: {
				'Content-Type' : 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify({
				name: name,
				description: description,
				price: price
			})
		})
		.then(res => res.json())
		.then(data => {
			console.log(data);

			if(data.success === true){
				notyf.success("Succesfully Updated");
				closeEdit();
				fetchData(); // fetchData function, according to Courses.jsx, this is a function that request all courses.
				// Meaning, it will fetch all the courses including the recently updated one.
			}
			else{
				notyf.error("Something went wrong");
				closeEdit();
				fetchData();
			}
		})
	}

	// Updating the showEdit state allows the form to be shown or not.
	const openEdit = () => {
		setShowEdit(true);
		// showEdit = true
	}

	const closeEdit = () => {
		setShowEdit(false);
	}

	return(
		<>
		<Button variant="primary" size="sm" onClick={()=>openEdit()}>Edit</Button>

		{/* Edit Form */}
		{/* show = true*/}
		<Modal show={showEdit} onHide={closeEdit}>
			<Form onSubmit = {event => editCourse(event, courseId)}>

				<Modal.Header closeButton>
					<Modal.Title>Edit Course</Modal.Title>
				</Modal.Header>

				<Modal.Body> 
					<Form.Group controlId="courseName">
						<Form.Label>Name</Form.Label>
						<Form.Control 
							type="text"
							value={name}
							onChange={e => setName(e.target.value)}
							required />
					</Form.Group>

					<Form.Group controlId="courseDescription">
						<Form.Label>Description</Form.Label>
						<Form.Control 
							type="text"
							value={description}
							onChange={e => setDescription(e.target.value)}
							required />
					</Form.Group>

					<Form.Group controlId="coursePrice">
						<Form.Label>Price</Form.Label>
						<Form.Control 
							type="text"
							value={price}
							onChange={e=> setPrice(e.target.value)}
							required />
					</Form.Group>
				</Modal.Body>

				<Modal.Footer>
					<Button variant="secondary" onClick={closeEdit}>Close</Button>
					<Button variant="success" type="submit">Submit</Button>
				</Modal.Footer>

			</Form>
		</Modal>

		</>
		)


}
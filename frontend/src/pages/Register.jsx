// import { useState, useEffect, useContext } from 'react';
// import { Form, Button } from 'react-bootstrap';

// import UserContext from '../context/UserContext';
// import { Navigate } from 'react-router-dom';

// import { Notyf } from 'notyf'; // imports the notyf module
// import 'notyf/notyf.min.css'; // imports the style for notyf boxes

// export default function Register(){

// 	const notyf = new Notyf(); // <---

// 	// s63 Activity
// 	const {user} = useContext(UserContext);

// 	// State hooks to store the values of the input fields
// 		// getter    // setterfunction
//     const [firstName,setFirstName] = useState("");
//     const [lastName,setLastName] = useState("");
//     const [email,setEmail] = useState("");
//     const [mobileNo,setMobileNo] = useState(0);
//     const [password,setPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     // State to determine whether submit button is enabled or not
//     const [isActive, setIsActive] = useState(false);

//     // Used to check if values are successfully binded
//     // This is a proof that everytime we input a value in our inputboxes the states are also updated.
//     console.log(firstName);
//     console.log(lastName);
//     console.log(email);
//     console.log(mobileNo);
//     console.log(password);
//     console.log(confirmPassword);

//     // getter - retrieve a state
//     // setter function - set/update  a state
//     // useState() - to declare the initial state

//     useEffect(()=>{

//     	if((firstName !== "" && lastName !== "" && email !== "" && mobileNo !== 0 && password !== "" && confirmPassword !== "" ) && (password === confirmPassword))
//     	{

//     		setIsActive(true); // isActive = true
//     	}
//     	else{
//     		setIsActive(false); // isActive = false
//     	}
//     }, [firstName, lastName, email, mobileNo, password, confirmPassword] );

//     function registerUser(e){

//     	// prevents page redirection via form submission
//     	e.preventDefault();

//     	fetch(`${import.meta.env.VITE_API_URL}/users/register`,{

//     		method: "POST",
//     		headers: { "Content-Type" : "application/json" },

// 	    	body: JSON.stringify({
// 	    		// field : state
// 	    		firstName: firstName,
// 	    		lastName: lastName,
// 	    		email:email,
// 	    		mobileNo: mobileNo,
// 	    		password: password
// 	    	})
// 	    })
// 	    .then(res => res.json())
// 	    .then(data => {
// 	    	console.log(data);

// 	    	if(data.message === "User registered successfully"){

// 	    		notyf.success("Registration successfully");

// 	    		setFirstName("");
// 	    		setLastName("");
// 	    		setEmail("");
// 	    		setMobileNo(0);
// 	    		setPassword("");
// 	    		setConfirmPassword("");
// 	    	}
// 	    	else if (data.message === "Email invalid") {

//             	notyf.error("Email is invalid");

//         	}
//         	else if(data.message === "Mobile number is invalid"){
// 	    		notyf.error("10 Digit Number is Required");
// 	    	}
// 	    	else if (data.message === "Password must be atleast 8 characters long") {
// 	    	    notyf.error("Password must be at least 8 characters");

// 	    	}
// 	    	else{
// 	    		notyf.error("Something went wrong");
// 	    	}
// 	    })
//     }

// 	return (

// 		(user.id !== null) ?
//         <Navigate to="/courses" />
//         :
// 		<Form onSubmit={(e) => registerUser(e)}>
// 			<h1 className="my-5 text-center">Register</h1>
// 			<Form.Group>
// 				<Form.Label>First Name:</Form.Label>
// 				<Form.Control type="text"
// 					placeholder="Enter First Name "
// 					required
// 					value = {firstName}
// 					onChange = {e => setFirstName(e.target.value)}
// 				/>
// 			</Form.Group>

// 			<Form.Group>
// 				<Form.Label>Last Name:</Form.Label>
// 				<Form.Control type="text"
// 					placeholder="Enter Last Name "
// 					required
// 					value = {lastName}
// 					onChange = {e => setLastName(e.target.value)}
// 					/>
// 			</Form.Group>

// 			<Form.Group>
// 				<Form.Label>Email</Form.Label>
// 				<Form.Control type="email"
// 					placeholder="Enter Email "
// 					required
// 					value = {email}
// 					onChange = {e => setEmail(e.target.value)}
// 				/>
// 			</Form.Group>

// 			<Form.Group>
// 				<Form.Label>Mobile No.:</Form.Label>
// 				<Form.Control type="number"
// 					placeholder="Enter Mobile Number "
// 					required
// 					value = {mobileNo}
// 					onChange = {e => setMobileNo(e.target.value)}
// 				/>
// 			</Form.Group>

// 			<Form.Group>
// 				<Form.Label>Password:</Form.Label>
// 				<Form.Control type="password"
// 					placeholder="Enter Password"
// 					required
// 					value = {password}
// 					onChange = {e => setPassword(e.target.value)}
// 				/>
// 			</Form.Group>

// 			<Form.Group>
// 				<Form.Label>Confirm Password:</Form.Label>
// 				<Form.Control type="password"
// 					placeholder="Confirm Password"
// 					required
// 					value = {confirmPassword}
// 					onChange = {e => setConfirmPassword(e.target.value)}
// 				/>
// 			</Form.Group>
// 			{ isActive ?
// 			// true
// 			<Button variant="primary" type="submit">Submit</Button>
// 			:
// 			// false
// 			<Button variant="danger" type="submit" disabled>Submit</Button>
// 			}

// 		</Form>

// 	)
// }

import { useState, useContext } from 'react';  
import { Form, Button } from 'react-bootstrap';

import UserContext from '../context/UserContext'; 
import { Navigate } from 'react-router-dom'; 

import { Notyf } from 'notyf'; // Notification module
import 'notyf/notyf.min.css'; // Notyf styles

export default function Register() {
	const notyf = new Notyf(); 

	const { user } = useContext(UserContext);

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [mobileNo, setMobileNo] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [formSubmitted, setFormSubmitted] = useState(false);

	// Function to validate password complexity
	const validatePassword = (password) => {
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
		return passwordRegex.test(password);
	};

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
		if (formSubmitted && !validatePassword(e.target.value)) {
			setPasswordError("Password must be at least 8 characters, including uppercase, lowercase, number, and special character.");
		} else {
			setPasswordError("");
		}
	};

	function registerUser(e) {
		e.preventDefault();
		setFormSubmitted(true);

		// Check password validation on submit
		if (!validatePassword(password)) {
			setPasswordError("Password must be at least 8 characters, including uppercase, lowercase, number, and special character.");
			return;
		}

		// Confirm password validation
		if (password !== confirmPassword) {
			notyf.error("Passwords do not match.");
			return;
		}

		fetch(`${import.meta.env.VITE_API_URL}/users/register`, {
			method: "POST",
			headers: { "Content-Type" : "application/json" },
			body: JSON.stringify({
				firstName,
				lastName,
				email,
				mobileNo,
				password
			})
		})
		.then(res => res.json())
		.then(data => {
			console.log(data);

			if(data.message === "User registered successfully"){
				notyf.success("Registration successful");
				setFirstName("");
				setLastName("");
				setEmail("");
				setMobileNo("");
				setPassword("");
				setConfirmPassword("");
				setFormSubmitted(false);
			} else if (data.message === "Invalid email format") {
				notyf.error("Email is invalid");
			} else if (data.message === "Mobile number is invalid") {
				notyf.error("10-digit mobile number is required");
			} else {
				notyf.error("Something went wrong");
			}
		});
	}

	return (
		user.id !== null ? 
			<Navigate to="/courses" />
			:
			<Form onSubmit={registerUser}>
				<h1 className="my-5 text-center">Register</h1> 

				<Form.Group>
					<Form.Label>First Name:</Form.Label>
					<Form.Control 
						type="text" 
						placeholder="Enter First Name" 
						required 
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
					/>
				</Form.Group>

				<Form.Group>
					<Form.Label>Last Name:</Form.Label>
					<Form.Control 
						type="text" 
						placeholder="Enter Last Name" 
						required 
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
					/>
				</Form.Group>

				<Form.Group>
					<Form.Label>Email:</Form.Label>
					<Form.Control 
						type="email" 
						placeholder="Enter Email" 
						required 
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</Form.Group>

				<Form.Group>
					<Form.Label>Mobile No.:</Form.Label>
					<Form.Control 
						type="text" 
						placeholder="Enter Mobile Number" 
						required 
						maxLength="10"
						value={mobileNo}
						onChange={(e) => setMobileNo(e.target.value)}
					/>
				</Form.Group>

				<Form.Group>
					<Form.Label>Password:</Form.Label>
					<Form.Control 
						type="password" 
						placeholder="Enter Password" 
						required 
						value={password}
						onChange={handlePasswordChange}
					/>
					{passwordError && <Form.Text className="text-danger">{passwordError}</Form.Text>}
				</Form.Group>

				<Form.Group>
					<Form.Label>Confirm Password:</Form.Label>
					<Form.Control 
						type="password" 
						placeholder="Confirm Password" 
						required 
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
				</Form.Group>

				<Button variant="primary" type="submit">Submit</Button>
			</Form>
	);
}

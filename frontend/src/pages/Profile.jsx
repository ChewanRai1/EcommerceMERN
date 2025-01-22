import { useState, useEffect, useContext } from 'react';
import { Container } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';

import UserContext from '../context/UserContext';

import { Notyf } from 'notyf'; // imports the notyf module
import 'notyf/notyf.min.css'; // imports the style for notyf boxes

import ResetPassword from '../components/ResetPassword';

export default function Profile(){

    const notyf = new Notyf(); // <---
    const { user } = useContext(UserContext);

    const [details,setDetails] = useState({});

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/users/details`, {
            headers: {
                Authorization: `Bearer ${ localStorage.getItem('token') }`
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            // Set the user states values with the user details upon successful login.
            if (typeof data !== undefined) {


                setDetails(data);

            } else if (data.error === "User not found") {

                notyf.error("User not found.");

            } else {

                notyf.error("Something went wrong, kindly contact us for assistance.")

            }
        });
    }, [])

    return (
        (user.id === null) ?
            <Navigate to="/courses" />
            :
            <>
                <Container className="mt-5 p-5 bg-primary text-white">
                    <h1 className=" ">Profile</h1>
                    <h2 className="mt-3">{`${details.firstName} ${details.lastName}`}</h2>
                    <hr />
                    <h4>Contacts</h4>
                    <ul>
                        <li>Email: {details.email}</li>
                        <li>Mobile No: {details.mobileNo}</li>
                    </ul>
                </Container>
                <Container>
                    <ResetPassword />
                </Container>
            </>
    )

}
// import { useEffect, useState, useContext } from 'react';
// import CourseCard from '../components/CourseCard';
// // import coursesData from '../data/coursesData';
// import UserContext from '../context/UserContext';
// import UserView from '../components/UserView';
// import AdminView from '../components/AdminView';

// export default function Courses() {

//     const { user } = useContext(UserContext);

//     // Checks to see if the mock data was captured
//     // console.log(coursesData);
//     // console.log(coursesData[0]);

//     // State that will be used to store the courses retrieved from the database
//     const [courses, setCourses] = useState([]);


//     const fetchData = () => {

//         // Allows to have a dynamic url depending whether the user that's logged in is an admin or not
//         let fetchUrl = user.isAdmin === true ? `${process.env.REACT_APP_API_URL}/courses/all` : `${process.env.REACT_APP_API_URL}/courses/`

//         // headers is included for both /courses/all and /courses/ to allow flexibility even if it is not needed.
//         fetch(fetchUrl, {
//             headers: {
//                 Authorization: `Bearer ${ localStorage.getItem('token') }`
//             }
//         })
//         .then(res => res.json())
//         .then(data => {

//             setCourses(data);

//         });
//     }

//     // Retrieves the courses from the database upon initial render of the "Courses" component
//     useEffect(() => {

//         fetchData()

//     }, [user]);

//     // The "map" method loops through the individual course objects in our array and returns a component for each course
//     // Multiple components created through the map method must have a unique key that will help React JS identify which components/elements have been changed, added or removed
//     // Everytime the map method loops through the data, it creates a "CourseCard" component and then passes the current element in our coursesData array using the courseProp
//     // const courses = coursesData.map(course => {
//     //     return (
//     //         <CourseCard key={course.id} courseProp={course}/>
//     //     );
//     // })

//     return(
//         <>
//             {
//                 (user.isAdmin === true) ?
//                     <AdminView coursesData={courses} fetchData={fetchData} />

//                     :

//                     <UserView coursesData={courses} />

//             }
//         </>
//     )
// }

import { useEffect, useState, useContext } from 'react';
import CourseCard from '../components/CourseCard';
import UserContext from '../context/UserContext';
import UserView from '../components/UserView';
import AdminView from '../components/AdminView';

export default function Courses() {
    const { user } = useContext(UserContext);
    const [courses, setCourses] = useState([]);

    const fetchData = () => {
        const token = localStorage.getItem('token');
        let fetchUrl = user.isAdmin === true 
            ? `${import.meta.env.VITE_API_URL}/courses/all` 
            : `${import.meta.env.VITE_API_URL}/courses/`;
    
        fetch(fetchUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            // Ensure data is always an array
            const coursesArray = Array.isArray(data) ? data : [];
            setCourses(coursesArray);
        })
        .catch(error => {
            console.error('Error fetching courses:', error);
            setCourses([]);
        });
    };

    useEffect(() => {
        if (user && typeof user.isAdmin !== 'undefined') {
            fetchData();
        }
    }, [user]);

    return(
        <>
            {user.isAdmin === true 
                ? <AdminView coursesData={courses} fetchData={fetchData} />
                : <UserView coursesData={courses} />
            }
        </>
    )
}
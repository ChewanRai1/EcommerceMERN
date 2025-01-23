// import {useState, useEffect} from 'react';
// import {CardGroup } from 'react-bootstrap';
// import {Link} from "react-router-dom";
// import PreviewCourses from "./PreviewCourses" // This will be our page where we preview/display our courses to advertise

// export default function FeaturedCourses(){

// 	// previews state - will  contain all courses card to feature to be loaded in the return statement.
// 	const [previews, setPreviews] = useState([])

// 	useEffect(() => {
// 		fetch(`${import.meta.env.VITE_API_URL}/courses/`)
// 		.then(res => res.json())
// 		.then(data => {
// 			console.log(data);

// 			            // Guard clause - check if data exists and is an array
// 						if (!data || !Array.isArray(data) || data.length === 0) {
// 							console.log('No courses data available');
// 							return;
// 						}

// 			// array to store random numbers / random indeces to select a random course
// 			const numbers = [];

// 			// featured array - will store all the preview courses cards before it will be given to the previews state.
// 			const featured = [];

// 			// generateRandomNums - is a function to generate random index number
// 			const generateRandomNums = () => {
// 				// this code is to generate random number based on the  total number courses (length of data array that contains all courses)
// 				let randomNum = Math.floor(Math.random() * data.length)

// 				// To assure no duplication of courses that will be advertised, we will be cheking if the current random number is already existing in the numbers array, if not yet we should add the random number
// 				if(!numbers.includes(randomNum)){
// 					numbers.push(randomNum);
// 				}
// 				// else, we will generate another random number
// 				else{
// 					generateRandomNums();
// 				}
// 			}

// 			for(let i=0; i<5 ; i++){

// 				generateRandomNums();

// 				// Adds the PreviewCourses Card to the featured array
// 				// data prop - contains the random course
//                 // key prop - will be used to identify the each element uniquely, the reason we used the data's (course) id 
//                 // breakPoint prop - will be used to set the occupied columns per PreviewCourses card
// 				featured.push(
// 					<PreviewCourses data={data[numbers[i]]} key={data[numbers[i]]._id} breakPoint={2} />
// 				)
// 			}

// 			setPreviews(featured);
// 			// previews = PreviewCourses cards that will contain random courses

// 			console.log(numbers)
// 		})
// 	}, []);

// 	return(
// 		<>
// 			<h2 className="text-center">Featured Courses</h2>
// 			<CardGroup className="justify-content-center">
// 				{previews} 
// 			</CardGroup>
// 		</>
// 	)


// }
import {useState, useEffect} from 'react';
import {CardGroup } from 'react-bootstrap';
import {Link} from "react-router-dom";
import PreviewCourses from "./PreviewCourses"

export default function FeaturedCourses(){
    const [previews, setPreviews] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        fetch(`${import.meta.env.VITE_API_URL}/courses/`, {
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
            console.log('Fetched courses:', data);
            
            if (!data || data.message === 'No active courses found') {
                setPreviews([]);
                return;
            }

            const coursesArray = Array.isArray(data) ? data : data.courses || [];
            
            if (coursesArray.length === 0) {
                setPreviews([]);
                return;
            }

            // Take up to 5 random courses
            const randomCourses = [];
            const used = new Set();
            
            while (randomCourses.length < Math.min(5, coursesArray.length)) {
                const randomIndex = Math.floor(Math.random() * coursesArray.length);
                if (!used.has(randomIndex)) {
                    used.add(randomIndex);
                    randomCourses.push(coursesArray[randomIndex]);
                }
            }

            const featured = randomCourses.map(course => (
                <PreviewCourses 
                    data={course} 
                    key={course._id} 
                    breakPoint={2} 
                />
            ));

            setPreviews(featured);
        })
        .catch(err => {
            console.error('Error fetching courses:', err);
            setError(err.message);
        });
    }, []);

    if (error) {
        return <div>Error loading courses: {error}</div>;
    }

    return(
        <>
            <h2 className="text-center">Featured Courses</h2>
            <CardGroup className="justify-content-center">
                {previews.length > 0 ? previews : <p>No courses available</p>} 
            </CardGroup>
        </>
    )
}
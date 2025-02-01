// import { Navigate } from 'react-router-dom';
// import UserContext from "../context/UserContext";
// import {useEffect, useContext} from "react";

// export default function Logout() {

//     const {setUser, unsetUser} = useContext(UserContext);

//     unsetUser();
//     // localStorage.clear(); // this is commented because unsetUser has the same job/purpose

//     useEffect(()=>{
//         setUser({
//             id: null,
//             email: null,
//             firstName: null,
//             lastName: null,
//             mobileNo: null,
//             isAdmin: null
//         })
//     })


//     // Redirect back to login
//     return (
//         <Navigate to='/login' />
//     )

// }


import { Navigate } from 'react-router-dom';
import UserContext from "../context/UserContext";
import { useEffect, useContext } from "react";

export default function Logout() {
    const { setUser, unsetUser } = useContext(UserContext);

    useEffect(() => {
        const logoutUser = async () => {
            try {
                // Call backend logout API
                const response = await fetch("https://localhost:4000/users/logout", {
                    method: "GET",
                    credentials: "include", // Ensures cookies are sent with the request
                });

                if (!response.ok) {
                    console.error("❌ Logout request failed.");
                } else {
                    console.log("✅ User logged out, session destroyed.");
                }

                // Clear user context (frontend state)
                unsetUser();
                setUser({
                    id: null,
                    email: null,
                    firstName: null,
                    lastName: null,
                    mobileNo: null,
                    isAdmin: null
                });

            } catch (error) {
                console.error("❌ Error logging out:", error);
            }
        };

        logoutUser();
    }, [setUser, unsetUser]);

    // Redirect back to login
    return <Navigate to='/login' />;
}

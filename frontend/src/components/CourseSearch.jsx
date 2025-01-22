import React, { useState } from 'react';
import CourseCard from "./CourseCard";

export default function CourseSearch() { // <---

  const [courseName, setCourseName] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!courseName.trim()) {
      setError('Please enter a course name.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSearchResults([]);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/courses/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },					
        					// key:        value
        					// req.body property name :   state variable
        body: JSON.stringify({ courseName: courseName }),
      });

      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        setError(data.message || 'Error searching for course.');
      } else {
        setSearchResults(data || []);
      }
    } catch (err) {
      setError('An error occurred while searching for the course.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <h2>Search for a Course</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="alert alert-info">Loading...</div>}
      <form onSubmit={handleSearch}>
        <div className="form-group">
          <label htmlFor="courseName">Course Name</label>
          <input
            type="text"
            className="form-control"
            id="courseName"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Search</button>
      </form>
      {searchResults.length > 0 && (
        <div className="mt-4">
          <h3>Search Results</h3>
          <ul className="list-group" >
            {searchResults.map((course) => (
            	<>
            	<CourseCard key={course._id} courseProp={course} />

              {/*<li key={course._id} className="list-group-item">
                {course.name}
              </li>*/}
              </>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};



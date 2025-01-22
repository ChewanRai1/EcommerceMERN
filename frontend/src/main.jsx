// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
import React from 'react'
import ReactDOM from 'react-dom/client'
// import the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// const name = 'John Smith';

// // JSX element that utilizes html and JS to properly load html elements and JS code together
// const element = <h1>Hello, {name}</h1>

// // root varialbe created to select root element found in the index.html file
// const root = ReactDOM.createRoot(document.getElementById('root'));

// // renders the JSX element created in the "element" variable in the root element from the index.html
// root.render(element);
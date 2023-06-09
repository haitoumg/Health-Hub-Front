import Cookies from "js-cookie";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Welcome() {
  const { state } = useLocation();
  const navigate = useNavigate();

  function logout() {
    Cookies.remove("token");
    window.location.reload();
  }
  // const token = Cookies.get("token");
  const token ="1";

  // Parse the token value into an object
  const tokenObject = JSON.parse(token);

  // Access the properties of the token object
  console.log(tokenObject.email); // Output: 123
  console.log(tokenObject.role); // Output: admin

  // const handleLogout = () => {
  //   // Send a GET request to the backend to log the user out
  //   fetch('http://localhost:8083/logout', {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.success) {
  //         // Logout was successful, navigate back to the login page
  //         navigate('/');
  //       } else {
  //         // Logout was unsuccessful, display an error message
  //         console.log('Logout error:', data.message);
  //       }
  //     });
  // };

  return (
    <div>
      <h1> Welcome, </h1> <p> You have successfully logged in . </p>{" "}
      <button onClick={logout}> Logout </button>{" "}
    </div>
  );
}

export default Welcome;

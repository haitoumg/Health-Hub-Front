import Cookies from "js-cookie";
import React from "react";

function Welcome() {


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

  return (
    <div>
      <h1> Welcome, {tokenObject.email} </h1> <p> You have successfully logged in . </p>{" "}
      <button onClick={logout}> Logout </button>{" "}
    </div>
  );
}

export default Welcome;

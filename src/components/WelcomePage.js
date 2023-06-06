import Cookies from "js-cookie";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Welcome() {
  // const { state } = useLocation();

  return (
    <div>
      <h1> Welcome, {state.login}! </h1>{" "}
      <p> You have successfully logged in . </p> <button> Logout </button>{" "}
    </div>
  );
}

export default Welcome;

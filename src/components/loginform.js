import React, { Component, useState } from "react";
import "./loginform.css";
import { BrowserRouter, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

function LoginForm() {

  const [errorMessage, setErrorMessage] = useState("");
  const [personne, setUser] = useState({
    email: "",
    password: "",
  });
  const { email, password } = personne;

  const navigate = useNavigate();
  const onInputChange = (e) => {
    setUser({ ...personne, [e.target.name]: e.target.value });
  };
  const onSubmet = async (e) => {
    e.preventDefault();
    await axios
      .post("http://localhost:9090/login", personne)

      .then((data) => {
        // Serialize the token object into a JSON string
        const personne = JSON.stringify(data.data);

        // Set the cookie with a name 'token' and the serialized token object
        Cookies.set("token", personne);
        // Handle the data returned from the API
        console.log("Response data:", data);
        window.location.reload();
      })
      .catch((error) => {
        // Handle any error that occurred during the request
        setErrorMessage(error.response.data.message);
        console.error("Error:", error.message);
      });
  };


  React.useEffect(() => {
    const home = document.querySelector(".home");
    const formContainer = document.querySelector(".form_container");
    const signupBtn = document.querySelector("#signup");
    const loginBtn = document.querySelector("#login");

    home.classList.add("show");

    signupBtn.addEventListener("click", (e) => {
      e.preventDefault();
      formContainer.classList.add("active");
    });
    loginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      formContainer.classList.remove("active");
    });
  }, []);
  return (
    <div className="cover">
      <head>
        <link
          rel="stylesheet"
          href="https://unicons.iconscout.com/release/v4.0.0/css/line.css"
        />
      </head>{" "}
      <header className="header">
        <nav className="nav">
          <a href="#" className="nav_logo">
            <img className="logo" src="/ntt.png" alt="Logo" />
          </a>{" "}
        </nav>{" "}
      </header>{" "}
      <section className="home">
        <div className="form_container">
          <div className="form login_form show">
            <form onSubmit={(e) => onSubmet(e)}>
              <h2> Login </h2>{" "}
              <div className="input_box">
                <input
                  type="text"
                  placeholder="Enter your login"
                  required
                  value={email}
                  name="email"
                  onChange={(e) => onInputChange(e)}
                />{" "}
                <i className="uil uil-envelope-alt email"> </i>{" "}
              </div>{" "}
              <div className="input_box">
                <input
                  type="password"
                  placeholder="Enter your password"
                  required
                  value={password}
                  name="password"
                  onChange={(e) => onInputChange(e)}
                />{" "}
                <i className="uil uil-lock password"> </i>{" "}
              </div>{" "}
              <button className="button" type="submit">
                Login Now{" "}
              </button>{" "}
              <div className="login_signup">
                Forgot password ?{" "}
                <a href="#signup" id="signup">
                  click here{" "}
                </a>{" "}
              </div>{" "}
              {errorMessage && (
                <div className="error_message"> {errorMessage} </div>
              )}{" "}
            </form>{" "}
          </div>{" "}
          <div className="form signup_form">
            <form action="#">
              <h2> Forgot Password </h2>{" "}
              <div className="input_box">
                <input type="email" placeholder="Enter your email" required />
                <i className="uil uil-envelope-alt email"> </i>{" "}
              </div>{" "}
              <button className="button"> Send Requisite </button>{" "}
              <div className="login_signup">
                Back to{" "}
                <a href="#" id="login">
                  Login{" "}
                </a>{" "}
              </div>{" "}
            </form>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
    </div>
  );
}

export default LoginForm;

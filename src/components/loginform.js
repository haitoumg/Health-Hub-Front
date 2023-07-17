import React, { useState, useEffect } from "react";
import "./loginform.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from 'sweetalert2';

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
    try {
      const response = await axios.post("http://localhost:9090/login", personne);

      const data = response.data;

      const tokenObject = JSON.stringify(data);
      
      Cookies.set("token", tokenObject);
      console.log("Response data:", data);
      console.log("Login successful!"); // Success message

      window.location.reload();

    } catch (error) {
      setErrorMessage(error.response.data.message);
      console.error("Error:", error.message);
    }
  };
    
    const validationAndSendEmail = async (emailVar) => {
      try {
        const response = await fetch(`http://localhost:9090/resetpasswordrequest`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ "email" : emailVar }),

        });

        if (response.ok) {
          Swal.fire(
            'Password updated!',
            'Your temporary password was sent in your email. \n please check your email box and change you password once logged in.',
            'success'
          );
          console.log(response);
        } else {
          console.error('Invalid Email');
          Swal.fire({
            title: "Sorry, we can't recognize your email.\n You might be not registered!",
            confirmButtonColor:"#13274F", 
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            }
          })
        }
      } catch (error) {
        console.error('Error:', error);
        setErrorMessage('An error occurred while validating the email');
      }
    };



  useEffect(() => {
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
    const sendreq = document.getElementById("sendreq");

    const handleClick = (e) => {
      console.log("I'm clicked");
      validationAndSendEmail(document.getElementById("emailForReset").value);
    };

    sendreq.addEventListener("click", handleClick);
  }, []);

  return (
    <div className="cover">
      <head>
        <link
          rel="stylesheet"
          href="https://unicons.iconscout.com/release/v4.0.0/css/line.css"
        />
      </head>
      <header className="header">
        <nav className="nav">
          <a href="#" className="nav_logo">
            <img className="logo" src="/ntt.png" alt="Logo" />
          </a>
        </nav>
      </header>
      <section className="home">
        <div className="form_container">
          <div className="form login_form show">
            <form onSubmit={(e) => onSubmet(e)}>
              <h2>Login</h2>
              <div className="input_box">
                <input
                  type="text"
                  placeholder="Enter your login"
                  required
                  value={email}
                  name="email"
                  onChange={(e) => onInputChange(e)}
                />
                <i className="uil uil-envelope-alt email"></i>
              </div>
              <div className="input_box">
                <input
                  type="password"
                  placeholder="Enter your password"
                  required
                  value={password}
                  name="password"
                  onChange={(e) => onInputChange(e)}
                />
                <i className="uil uil-lock password"></i>
              </div>
              <button className="button" type="submit">
                Login Now
              </button>
              <div className="login_signup">
                Forgot password?
                <a href="#signup" id="signup">
                  click here
                </a>
              </div>
              {errorMessage && (
                <div className="error_message">{errorMessage}</div>
              )}
            </form>
          </div>
          <div className="form signup_form">
            <form action="#">
              <h2>Forgot Password</h2>
              <div className="input_box">
                <input
                  id="emailForReset"
                  type="email"
                  placeholder="Enter your email"
                  required
                />
                <i className="uil uil-envelope-alt email"></i>
              </div>
              <button className="button" id="sendreq">Send Requisite</button> 
              <div className="login_signup">
                Back to
                <a href="#" id="login">
                  Login
                </a>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LoginForm;

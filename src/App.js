import React, { Component } from "react";
import Scheduler from "./component/Scheduler";
import Menu from "./component/Menu/Menu"; // updated path
import Home from "./pages/Home";
import Tet from "./pages/Tet";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@fortawesome/fontawesome-free/js/all.js";

import LoginForm from "./components/loginform";

import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import "./App.css";
import Welcome from "./pages/Welcome";
import Cookies from "js-cookie";

class App extends Component {
  // Check if the user is logged in

  // Log out the user

  isLoggedIn() {
    return !!Cookies.get("token");
  }

  logout() {
    Cookies.remove("token");
  }

  state = {
    currentTimeFormatState: true,
    messages: [],
    events: [],
    loading: true,
  };

  componentDidMount() {
    this.fetchEvents();
  }

  fetchEvents = async () => {
    const response = await fetch("http://localhost:9090/appointments");
    const events = await response.json();
    this.setState({ events });
  };

  // addMessage(message) {
  //   const maxLogLength = 5;
  //   const newMessage = { message };
  //   const messages = [newMessage, ...this.state.messages];

  //   if (messages.length > maxLogLength) {
  //     messages.length = maxLogLength;
  //   }
  //   this.setState({ messages });
  // }

  logDataUpdate = (action, ev, id) => {
    const text = ev && ev.text ? ` (${ev.text})` : "";
    const message = `appointment ${action}: ${id} ${text}`;
    this.addMessage(message);
  };

  handleTimeFormatStateChange = (state) => {
    this.setState({
      currentTimeFormatState: state,
    });
  };

  render() {
    const { loading, events, currentTimeFormatState } = this.state;
    // if (loading) {
    //   return <div> Loading... </div>;
    // }
    return (
      <div>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                this.isLoggedIn() ? <Navigate to="/scheduler" /> : <LoginForm />
              }
            />{" "}
            <Route
              path="Welcome"
              element={this.isLoggedIn() ? <Welcome /> : <Navigate to="/" />}
            />{" "}
            <Route
              path="/scheduler"
              element={
                this.isLoggedIn() ? (
                  <Menu>
                    <div className="scheduler-container">
                      <Home />
                      <Scheduler
                        events={events}
                        timeFormatState={currentTimeFormatState}
                        onDataUpdated={this.logDataUpdate}
                        onNewEvent={this.handleNewEvent}
                      />{" "}
                    </div>{" "}
                  </Menu>
                ) : (
                  <Navigate to="/" />
                )
              }
            />{" "}
            <Route
              path="/Tet"
              element={
                <Menu>
                  <div className="scheduler-container">
                    <Home />
                    <Tet />
                  </div>{" "}
                </Menu>
              }
            />{" "}
            <Route
              path="/EmployeeS"
              element={
                <Menu>
                  <div className="scheduler-container">
                    <Home />
                  </div>{" "}
                </Menu>
              }
            />{" "}
          </Routes>{" "}
        </BrowserRouter>{" "}
      </div>
    );
  }
}

export default App;

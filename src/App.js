import React, { Component, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Scheduler from "./component/Scheduler";
import SchedulerCasa from "./component/employeeSchedulerCasa";
import SchedulerTetouan from "./component/employeeSchedulerTetouan";
import Menu from "./component/Menu/Menu";
import Home from "./pages/Home";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@fortawesome/fontawesome-free/js/all.js";
import LoginForm from "./components/loginform";
import "./App.css";
import Welcome from "./pages/Welcome";
import Cookies from "js-cookie";

import ChangePassword from "./components/ChangePassword";
import MyReservation from "./pages/MyReservation";
import Appointment from "./pages/Appointment";
// import ResetPasswordForm from "./pages/ResetPasswordForm";
import ListReservation from "./pages/ListReservation";


class App extends Component {
  isLoggedIn() {
    if(!!Cookies.get("token")=== true){
      console.log("yeah logged in");
    }else {
      console.log("not logged in");
    }
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
    this.fetchReservations();
  }

  fetchReservations = async () => {
    const response = await fetch("http://localhost:9090/calendarsByHub?city="+Cookies.get("token").hubCity);
    const events = await response.json();
    this.setState({ events, loading: false });
  };

  addMessage(message) {
    const maxLogLength = 5;
    const newMessage = { message };
    const messages = [newMessage, ...this.state.messages];

    if (messages.length > maxLogLength) {
      messages.length = maxLogLength;
    }
    this.setState({ messages });
  }

  logDataUpdate = (action, reservation, id) => {
    const text = reservation && reservation.text ? ` (${reservation.text})` : "";
    const message = `reservation ${action}: ${id} ${text}`;
    this.addMessage(message);
  };

  handleTimeFormatStateChange = (state) => {
    this.setState({
      currentTimeFormatState: state,
    });
  };

  handleNewEvent = (newEvent) => {
    // Handle adding a new event
    // Update the state with the new event
    const updatedEvents = [...this.state.events, newEvent];
    this.setState({ events: updatedEvents });
  };

  handleDeleteEvent = (eventId) => {
    // Handle deleting an event
    // Update the state by filtering out the deleted event
    const updatedEvents = this.state.events.filter((event) => event.id !== eventId);
    this.setState({ events: updatedEvents });
  };

  render() {
    const { loading, currentTimeFormatState, events } = this.state;

    const token = Cookies.get("token");
    const tokenObject = token ? JSON.parse(token) : null;

    return (
     
      <div>
      
        {
        
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                this.isLoggedIn() ? (
                  
                  tokenObject.role === "Doctor" ? (
                    <Navigate to="/scheduler" />
                  ) : tokenObject.role === "Employee" && tokenObject.hubCity === "Casablanca" ? (
                    <Navigate to="/schedulerCasablanca" />
                  ) : tokenObject.role === "Employee" && tokenObject.hubCity === "Tetouan" ? (
                    <Navigate to="/schedulerTetouan" />
                  ) : (
                    <LoginForm />
                  )
                ) : (
                  <LoginForm />
                )
              }
            />
            <Route
              path="/"
              element={
                this.isLoggedIn() ? (
                  tokenObject.role === "Employee" ? (
                    <Navigate to="/scheduler" />
                  ) : tokenObject.role === "Employee" && tokenObject.hubCity === "Casablanca" ? (
                    <Navigate to="/schedulerCasablanca" />
                  ) : tokenObject.role === "Employee" && tokenObject.hubCity === "Tetouan" ? (
                    <Navigate to="/schedulerTetouan" />
                  ) : (
                    <LoginForm />
                  )
                ) : (
                  <LoginForm />
                )
              }
            />

            {/* <Route path="/ResetPasswordForm/:resetToken" element={<ResetPasswordForm />} /> */}
            <Route path="/ChangePassword" element={<ChangePassword />} />
            <Route
              path="/Welcome"
              element={this.isLoggedIn() ? <Welcome /> : <Navigate to="/" />}
            />
            <Route
              path="/SchedulerTetouan"
              element={
                this.isLoggedIn() ? (
                  <Menu>
                    <div className="scheduler-container">
                      <Home />
                      <SchedulerTetouan
                        events={events}
                        timeFormatState={currentTimeFormatState}
                        onDataUpdated={this.logDataUpdate}
                        onNewEvent={this.handleNewEvent}
                        onDeleteEvent={this.handleDeleteEvent}
                      />
                    </div>
                  </Menu>
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/SchedulerCasablanca"
              element={
                this.isLoggedIn() ? (
                  <Menu>
                    <div className="scheduler-container">
                      <Home />
                      <SchedulerCasa
                        events={events}
                        timeFormatState={currentTimeFormatState}
                        onDataUpdated={this.logDataUpdate}
                        onNewEvent={this.handleNewEvent}
                        onDeleteEvent={this.handleDeleteEvent}
                      />
                    </div>
                  </Menu>
                ) : (
                  <Navigate to="/" />
                )
              }
            />
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
                        onDeleteEvent={this.handleDeleteEvent}
                      />
                    </div>
                  </Menu>
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/MyReservation"
              element={
                this.isLoggedIn() ? (

                  <Menu>
                    <div className="scheduler-container">
                      <Home />
                      <MyReservation />
                    </div>
                  </Menu>
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/Appointment"
              element={
                this.isLoggedIn() ? (

                  <Menu>
                    <div className="scheduler-container">
                      <Home />
                      <Appointment />
                    </div>
                  </Menu>
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/ListReservation"
              element={
                this.isLoggedIn() ? (

                  <Menu>
                    <div className="scheduler-container">
                      <Home />
                      <ListReservation />
                    </div>
                  </Menu>
                ) : (
                  <Navigate to="/" />
                )
              }
            />
          </Routes>
        </BrowserRouter>
  }
      </div>
    );
  }

}
export default App;

import React, { Component } from 'react';
import 'dhtmlx-scheduler';
// import { toast, ToastContainer } from 'react-toastify';
import 'dhtmlx-scheduler/codebase/dhtmlxscheduler_material.css';
import axios from 'axios';
import './Scheduler.css';
import Cookies from "js-cookie";


// const getUserByLogin = async (login) => {
//   try {
//     const response = await axios.get(`http://localhost:9090/user?login=${login}`);
//     if (response.status === 200) {
//       const userData = response.data;
//       return userData;
//     } else {
//       throw new Error('Failed to fetch user data');
//     }
//   } catch (error) {
//     throw new Error(`Error: ${error.message}`);
//   }
// };

export default class SchedulerCasa extends Component {
  state = {
    userId: null,
    availableAppointments: [],
    whatHubReservation: 'Casablanca', // Add the whatHubReservation state
  };

  componentDidMount() {
    const scheduler = window.scheduler;
    scheduler.skin = 'material';
    scheduler.config.header = [
      'day',
      'week',
      'month',
      'date',
      'prev',
      'today',
      'next'
    ];
    scheduler.config.hour_date = '%g:%i %A';
    scheduler.config.time_step = 30;
    scheduler.xy.scale_width = 100;
    scheduler.config.hour_size_px = 88;

    scheduler.attachEvent('onViewChange', (mode) => {
      if (mode === 'month') {
        scheduler.config.readonly = true; // Make the month view readonly
        scheduler.config.show_lightbox = false; // Hide the new event card in the month view
      } else if (mode === 'week') {
        scheduler.config.readonly = true; // Enable editing in the week view
        scheduler.config.show_lightbox = true; // Show the new event card in the week view
      } else if (mode === 'day') {
        scheduler.config.readonly = true; // Enable editing in the week view
        scheduler.config.show_lightbox = true; // Show the new event card in the week view

      } else {
        scheduler.config.readonly = false; // Enable editing in other views
        scheduler.config.show_lightbox = true; // Show the new event card in other views
      }
      return true;
    });

    scheduler.init(this.schedulerContainer, new Date());
    scheduler.clearAll();

    const isLoggedIn = !!Cookies.get("token")=== true;
    if (!isLoggedIn) {
      // User not logged in, redirect to the login page
      window.location.href = '/';
      return;
    }
      // Retrieve the logged-in user's login from session storage
      let userData = JSON.parse(Cookies.get("token"));
      const login = sessionStorage.getItem('login');
      this.setState({ userId: userData.userId });
      // getUserByLogin(login)
      //   .then(userData => {
      //     this.setState({ userId: userData.userId });
      //   })
      //   .catch(error => {
      //     console.error(error);
      //   });
    

    this.fetchData(scheduler); // Move fetchData before initSchedulerEvents

    // Call initSchedulerEvents after fetching data
    this.initSchedulerEvents(scheduler);
  }
  fetchCalendarsInfos=async ()=> {
    let userData = JSON.parse(Cookies.get("token"));
    console.log(userData);
    console.log("uuuuser id: "+userData.personneId);
    const response = await axios.post(
      `http://localhost:9090/calendarsInfosByEmployee`, {"city": "Casablanca","personneId": userData.personneId}
    );
    const allcalendarsInfos = response.data;
    return allcalendarsInfos;
  }

  fetchData(scheduler) {
    scheduler.clearAll();
    const calendarsInfos=this.fetchCalendarsInfos();
    calendarsInfos.then((calendarsInfos)=>{
      console.log("show after modification");
      console.log(calendarsInfos);
      console.log(scheduler);
      let calendars=[];
      for (let calendarInfos of calendarsInfos) {
        calendars.push({
          text: (calendarInfos.employeeLastName!=null && calendarInfos.employeeFirstName!=null)?calendarInfos.employeeLastName+" "+calendarInfos.employeeFirstName:"",
          start_date: calendarInfos.workingDay.substring(0,11)+calendarInfos.startTime,
          end_date: calendarInfos.workingDay.substring(0,11)+calendarInfos.endTime,
          color: (calendarInfos.booked == true)?"green":"blue",
          calendarId: calendarInfos.calendarId
        });
    }

      scheduler.parse(calendars,"json");
    }).catch ((error)=>{

      console.error("Error in nex fetchData:", error);
     
    }
      );

    // Promise.all([this.fetchAvailableAppointments(), this.fetchAllReservations()])
    //   .then(([availableAppointments, reservations]) => {
    //     const timeZoneOffset = new Date().getTimezoneOffset();
    //     const parsedAppointments = availableAppointments.map(appointment => ({
    //       id: appointment.schedulerId,
    //       text: appointment.text,
    //       start_date: new Date(appointment.startDate),
    //       end_date: new Date(appointment.endDate),
    //     }));

    //     const parsedReservations = reservations.map(reservation => ({
    //       id: reservation.scheduler.schedulerId,
    //       text: reservation.scheduler.text,
    //       start_date: new Date(reservation.scheduler.startDate),
    //       end_date: new Date(reservation.scheduler.endDate),
    //       color: reservation.color,
    //       status: reservation.status,
    //     }));

    //     parsedAppointments.forEach(appointment => {
    //       appointment.start_date.setMinutes(appointment.start_date.getMinutes() - timeZoneOffset);
    //       appointment.end_date.setMinutes(appointment.end_date.getMinutes() - timeZoneOffset);
    //     });

    //     parsedReservations.forEach(reservation => {
    //       reservation.start_date.setMinutes(reservation.start_date.getMinutes() - timeZoneOffset);
    //       reservation.end_date.setMinutes(reservation.end_date.getMinutes() - timeZoneOffset);
    //     });

    //     this.setState({ availableAppointments: parsedAppointments });
    //     scheduler.clearAll();
    //     scheduler.parse([...parsedAppointments, ...parsedReservations]);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching data:', error);
    //   });
  }







  async fetchAllReservations() {
    try {
      const response = await axios.get(`http://localhost:9090/findAll?what_hub_reservation=${this.state.whatHubReservation}&is_cancelled=0`);
      const allReservations = response.data;
      const storedLogin = sessionStorage.getItem('login');
      const loggedInUserReservations = allReservations.filter(reservation => reservation.user.login === storedLogin);
      const otherUsersReservations = allReservations.filter(reservation => reservation.user.login !== storedLogin);

      // Apply color to the logged-in user's reservations
      const coloredLoggedInUserReservations = loggedInUserReservations.map(reservation => ({
        ...reservation,
        color: 'green'
      }));

      // Apply color to other users' reservations
      const coloredOtherUsersReservations = otherUsersReservations.map(reservation => ({
        ...reservation,
        color: 'red'
      }));

      // Combine the reservations
      const allColoredReservations = [...coloredLoggedInUserReservations, ...coloredOtherUsersReservations];

      return allColoredReservations;
    } catch (error) {
      throw new Error('Error fetching reservations:', error);
    }
  }



  async fetchAvailableAppointments() {
    try {
      const response = await axios.get('http://localhost:9090/Casablanca'); // Replace with the correct URL for fetching available appointments for Casablanca
      return response.data;
    } catch (error) {
      throw new Error('Error fetching available appointments:', error);
    }
  }


  async fetchReservations() {
    try {
      const storedLogin = sessionStorage.getItem('login');
      const response = await axios.get(`http://localhost:9090/hub_reservations?login=${storedLogin}&what_hub_reservation=${this.state.whatHubReservation}`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching reservations:', error);
    }
  }


  initSchedulerEvents(scheduler) {
    if (scheduler._$initialized) {
      return;
    }

    scheduler.attachEvent('onClick', async (id, e) => {
      const event = scheduler.getEvent(id);
      console.log('Clicked event:', event);

      if (event.status) {
        // Event is already reserved, do not allow further actions
        return;
      }

      // Ask the user if they want to reserve the appointment
      const confirmed = window.confirm('Do you want to reserve this appointment?');
      if (!confirmed) {
        return;
      }


      // Perform your desired actions for making a reservation here

      // Update the status of the clicked event
      event.status = true; // Set the status to true or any other value you want

      // Change the color of the clicked event
      event.color = 'green'; // Set the desired color

      // Save the updated event to the backend
      try {
        let userData = JSON.parse(Cookies.get("token"));
        let date = new Date();
        let dateFormat = date.getFullYear() + "-" + (('0'+date.getMonth()+1).slice(-2)) + "-" + ('0'+date.getDate()).slice(-2);
        console.log(dateFormat, userData.personneId, event.calendarId);
        const response = await axios.post(`http://localhost:9090/appointment`, {"dateAppointment":dateFormat, "employeeId": userData.personneId, "calendarId": event.calendarId});        console.log('Updated event:', response.data);
      } catch (error) {
        console.error('Error updating event:', error);
      }

      // Refresh the scheduler to apply the color change
      scheduler.updateEvent(id);
      this.fetchData(scheduler);
      try {
        const reservationData = {
          user: { userId: this.state.userId },
          scheduler: { schedulerId: event.id },
          status: event.status, // Set the status
          whatHubReservation: this.state.whatHubReservation, // Use the whatHubReservation state
        };

        const reservationResponse = await axios.post('http://localhost:9090/reservations', reservationData);
        console.log('Reservation saved:', reservationResponse.data);

        // Update the available appointments state by removing the booked appointment
        const { availableAppointments } = this.state;
        const updatedAppointments = availableAppointments.filter(appointment => appointment.id !== id);
        this.setState({ availableAppointments: updatedAppointments });
      } catch (error) {
        console.error('Error saving reservation:', error);
      }

      // Perform any additional actions you want with the clicked event here
    });

    scheduler.attachEvent('onBeforeDrag', (id, mode, e) => {
      const event = scheduler.getEvent(id);

      if (event.status) {
        // Event is already reserved, do not allow dragging
        return false;
      }

      return true;
    });

    scheduler.attachEvent('onDblClick', (id, e) => {
      const event = scheduler.getEvent(id);

      if (event.status) {
        // Event is already reserved, do not allow further actions
        return false;
      }

      // Perform your desired actions for making a reservation here

      return false;
    });

    scheduler._$initialized = true;
  }


  render() {
    return (
      <div
        ref={input => {
          this.schedulerContainer = input;
        }}
        style={{
          width: '100%',
          height: '105.5%',
        }}
      />
    );
  }
}

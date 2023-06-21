import React, { Component } from "react";
import "dhtmlx-scheduler";
import "dhtmlx-scheduler/codebase/dhtmlxscheduler_material.css";
import axios from "axios";
import "./Scheduler.css";
import Cookies from "js-cookie";
import { scheduler } from "dhtmlx-scheduler";
export default class Scheduler extends Component {
  state = {
    userId: null,
    hubName: "",
    availableAppointments: [],
    whatHubReservation: "Casablanca",
  };

  componentDidMount() {
    this.initializeScheduler();
  }

  initializeScheduler = async () => {
    const scheduler = window.scheduler;
    scheduler.skin = "material";
    scheduler.config.header = [
      "day",
      "week",
      "month",
      "date",
      "prev",
      "today",
      "next",
    ];
    scheduler.config.hour_date = "%g:%i %A";
    scheduler.config.time_step = 30;
    scheduler.xy.scale_width = 100;
    scheduler.config.hour_size_px = 88;

    scheduler.init(this.schedulerContainer, new Date());
    scheduler.clearAll();

    const isLoggedIn= !!Cookies.get("token") === true;
    if (!isLoggedIn) {
      // User not logged in, redirect to the login page
      window.location.href = "/"; // Use this to redirect
      return;
    }

    const login = sessionStorage.getItem("login");
    try {

      //const userData = await this.getUserByLogin(login);
      let userData = JSON.parse(Cookies.get("token"));//+++
      
      // console.log(" heeeeeeeeeeeeeeeeeeeeeeeeeere here");
      // console.log("this is aall " + userData);
      // console.log("this is a role "+userData.role);
      if (userData.role != "Doctor") {
        // User does not have the required role, redirect to a different page
        window.location.href = "/access-denied"; // Use this to redirect
        return;
      }
      this.setState({
        userId: userData.personneId,
        hubName: userData.hubName,
      }, () => {
        this.fetchData(scheduler);
        this.initSchedulerEvents(scheduler);
      });
    } catch (error) {
      console.error(error);
    }
  };

  // getUserByLogin = async (login) => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:9090/personne?login=${login}`
  //     );
  //     if (response.status === 200) {
  //       const userData = response.data;
  //       return userData;
  //     } else {
  //       throw new Error("Failed to fetch user data");
  //     }
  //   } catch (error) {
  //     throw new Error(`Error: ${error.message}`);
  //   }
  // };

  fetchData=async (scheduler)=>{
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
  }
 /* fetchData = async (scheduler) => {
    try {
     
      //   const [availableAppointments, reservations] = await Promise.all([
      //   this.fetchAvailableAppointments(),
      //   this.fetchAllReservations(),
      // ]);
      const timeZoneOffset = new Date().getTimezoneOffset();
      const availableAppointments= this.fetchAvailableAppointments();
      const reservations=this.fetchAllReservations();
      // console.log(availableAppointments, reservations);
    Promise.all([availableAppointments, reservations]).then(([availableAppointments, reservations])=>{
        console.log("ccc  speeeeecial");
        console.log(availableAppointments, reservations);
        const parsedAppointments = availableAppointments.map((appointment) => ({
          id: appointment.appointmentId,
          // text: appointment.text,
          start_date: appointment.calendar.startTime,
          end_date: appointment.calendar.endTime,
        }));
        console.log("ccc2  speeeeecial");
        console.log(parsedAppointments);
        // parsedAppointments.forEach((appointment) => {
        //   appointment.start_date.setMinutes(
        //     appointment.start_date.getMinutes() - timeZoneOffset
        //   );
        //   appointment.end_date.setMinutes(
        //     appointment.end_date.getMinutes() - timeZoneOffset
        //   );
        // });
        console.log("ccc3  speeeeecial");
        console.log(parsedAppointments);
        this.setState({ availableAppointments: parsedAppointments });
        console.log("ccc4  speeeeecial");

          const parsedReservations = reservations.map((reservation) => ({
            id: reservation.calendarId,
            text: reservation.text,
            start_date: reservation.startTime,
            end_date: reservation.endTime,
            color: reservation.color,
            // status: reservation.status,
          }));
          console.log("ccc5  speeeeecial");
          console.log("parsed reservations");
          console.log(parsedReservations);
          // parsedReservations.forEach((reservation) => {
          //   reservation.start_date.setMinutes(
          //     reservation.start_date.getMinutes() - timeZoneOffset
          //   );
          //   reservation.end_date.setMinutes(
          //     reservation.end_date.getMinutes() - timeZoneOffset
          //   );
          // });
        console.log("1", scheduler);
        scheduler.clearAll();
        console.log("2", scheduler);
        console.log("ccc 1118");
        scheduler.parse([...parsedAppointments, ...parsedReservations]);
        console.log("3", scheduler);
        console.log("ccc 1119");
      }).catch ((error)=>{

      console.error("Error fetching data:", error);
      // console.log( this.fetchAvailableAppointments());
      // console.log((this.fetchAllReservations()));
    }
      );
  }catch(error){
    console.error("Error heere:", error);
  }
};
  // padZero(nombre) {
  //   return nombre < 10 ? "0" + nombre : nombre;
  // }
  */
  fetchCalendarsInfos=async ()=> {
    let userData = JSON.parse(Cookies.get("token"));
    console.log(userData);
    console.log("uuuuser id: "+userData.personneId);
    const response = await axios.post(
      `http://localhost:9090/calendarsInfosByDoctor`, {"id": userData.personneId}
    );
    const allcalendarsInfos = response.data;
    return allcalendarsInfos;
  }

  fetchAllReservations = async () => {
    try {
      let userData = JSON.parse(Cookies.get("token"));
      const response = await axios.get(
        `http://localhost:9090/calendarsByHub?city=${userData.hubCity}`
      );
      const allReservations = response.data;
      console.log(allReservations);
      // const storedLogin = sessionStorage.getItem("login");
      const storedLogin = JSON.parse(Cookies.get("token")).email;
      console.log("returned all colored reservtions-3");
      const loggedInUserReservations = allReservations.filter(
        (reservation) => reservation.doctor.email === storedLogin
      );
      console.log("returned all colored reservtions-2");
      const otherUsersReservations = allReservations.filter(
        (reservation) => reservation.doctor.email !== storedLogin
      );
      console.log("returned all colored reservtions-1");
      // Apply color to the logged-in user's reservations
      const coloredLoggedInUserReservations = loggedInUserReservations.map(
        (reservation) => ({
          ...reservation,
          color: "green",
        })
      );
      console.log("returned all colored reservtions0");
      // Apply color to other users' reservations
      const coloredOtherUsersReservations = otherUsersReservations.map(
        (reservation) => ({
          ...reservation,
          color: "red",
        })
      );
      console.log("returned all colored reservtions1");
      // Combine the reservations
      const allColoredReservations = [
        ...coloredLoggedInUserReservations,
        ...coloredOtherUsersReservations,
      ];
      console.log("returned all colored reservtions2");
      return allColoredReservations;
    } catch (error) {
      return new Error("Error fetching reservations:", error);
    }
  };

  fullDate(currentDate){
    var annee = currentDate.getFullYear();
    var mois = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    var jour = ('0' + currentDate.getDate()).slice(-2);

    var fullDate = annee + '-' + mois + '-' + jour;
    return fullDate;
  }

  fullTime(currentDate){
    let heure = ('0' + currentDate.getHours()).slice(-2);
    let minute = ('0' + currentDate.getMinutes()).slice(-2);
    let seconde = ('0' + currentDate.getSeconds()).slice(-2);
    return heure + ':' + minute + ':' + seconde;
  }
  
  fetchAvailableAppointments = async () => {
    try {
      let userData = JSON.parse(Cookies.get("token"));
      console.log("user data personneId: "+userData.personneId);
      const response = await axios.get(
        `http://localhost:9090/availableAppointments?personneId=${userData.personneId}`
      );
      console.log("fetchAvailableAppointments");
      console.log(response.data);
      return response.data;
    } catch (error) {
        return new Error("Error fetching available appointments:", error);
    }
};
  initSchedulerEvents(scheduler) {
    if (scheduler._$initialized) {
      return;
    }
  
    const onDataUpdated = this.props.onDataUpdated;
  
    scheduler.attachEvent('onEventAdded', async (id, ev) => {
      if (onDataUpdated) {
        onDataUpdated('create', ev, id);
      }
      
      const schedulerData = {
        doctorId:  this.state.userId,
        startTime: ev.start_date.toISOString(),
        endTime: ev.end_date.toISOString(),
        workingDay: ev.workingDay,
        text: ev.text,
      };
  
      const startTime = ev.start_date.getTime(); // Start time in milliseconds
      const endTime = ev.end_date.getTime(); // End time in milliseconds
      const halfHour = 30 * 60 * 1000; // Half hour in milliseconds
      
      for (let time = startTime; time < endTime; time += halfHour) {
        const currentDate = new Date(time);
        const nextHalfHour = new Date(time + halfHour);
        // var heures = padZero(date.getHours());
        // var minutes = padZero(date.getMinutes());
        // var secondes = padZero(date.getSeconds());
        
        // var heureFormattee = heures + ":" + minutes + ":" + secondes;
        // console.log(heureFormattee);
        // schedulerData.startTime = currentDate.toISOString();
        // schedulerData.endTime = nextHalfHour.toISOString();
        
      

        schedulerData.startTime = this.fullTime(currentDate);
        schedulerData.endTime = this.fullTime(nextHalfHour);
        schedulerData.workingDay= this.fullDate(currentDate);
        try {
          console.log(schedulerData);
          const schedulerResponse = await axios.post('http://localhost:9090/calendar', schedulerData);
          const schedulerId = schedulerResponse.data.calendarId;
          console.log("schedulerResponse"+schedulerResponse.data);
          // Instead of creating a reservation, update the event directly in the scheduler
          // scheduler.getEvent(id).schedulerId = schedulerId;
  
          console.log('Appointment added:', schedulerResponse.data);
  
          // Refresh the display of the modified event
          // scheduler.updateEvent(id);
        } catch (error) {
          console.error('Error adding appointment:', error);
        }
      }
  
      // Refresh the scheduler to display the new reservations
      this.fetchData(scheduler);
    });
  
    // Rest of the code...
    scheduler.attachEvent('onEventDeleted', async (id, ev) => {
      if (onDataUpdated) {
        console.log("in deleting");
        onDataUpdated('delete', ev, id);
      }
      console.log("in deleting 2");
      console.log(ev);
     axios
      .delete(`http://localhost:9090/calendar/${ev.calendarId}`).then((response) => {
        console.log('Event updated:', response.data);
        // Refresh the scheduler to display the updated reservations
        this.fetchData(scheduler);
      })
  });
    scheduler.attachEvent('onEventChanged', async (id, ev) => {
      if (onDataUpdated) {
        onDataUpdated('update', ev, id);
      }

      // Get the user ID from the event
      const userId = ev.user ? ev.user.userId : null;
      const startTime = ev.start_date.getTime(); // Start time in milliseconds
      const endTime = ev.end_date.getTime(); // End time in milliseconds
      const halfHour = 30 * 60 * 1000; // Half hour in milliseconds

    
      // Update the changed event in the backend
      
      let personId=this.state.userId
      let calendarId=ev.schedulerId;
      // console.log("workingDay"+ workingDay);
      // console.log("startTime"+ startTime);
      // console.log("endTime"+ endTime);
      // console.log("text "+ev.text);
      // console.log("userId"+personId);
      // console.log("id calendrier"+ calendarId);
      console.log(ev);
      for (let time = startTime; time < endTime; time += halfHour) {
        const currentDate = new Date(time);
        const nextHalfHour = new Date(time + halfHour);
        let workingDay=this.fullDate(currentDate);
        let startTime= this.fullTime(currentDate);
        let endTime=this.fullTime(nextHalfHour);
        axios
        .put(`http://localhost:9090/calendar/${calendarId}`, {
          workingDay: workingDay,
          startTime: startTime,
          endTime: endTime,
          text: ev.text,
          doctorId: personId,
        })
        .then((response) => {
          console.log('Event updated:', response.data);
          // Refresh the scheduler to display the updated reservations
          this.fetchReservations(scheduler);
        })
        .catch((error) => {
          console.error('Error updating event:', error);
        });
      }

     
    });

    // Rest of the code...

    scheduler._$initialized = true;
  }

  render() {
    return (
      <div
        ref={(input) => {
          this.schedulerContainer = input;
        }}
        style={{ width: '100%', height: '105%' }}
      ></div>
    );
  }
}

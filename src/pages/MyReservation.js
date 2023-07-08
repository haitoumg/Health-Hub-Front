import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from "js-cookie";

export default function Reservations() {
    const [reservations, setReservations] = useState([]);
    const [loggedInUserLogin, setLoggedInUserLogin] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(13);
    const [sortOption, setSortOption] = useState("");
    const [originalList, setOriginalList]=useState([]);
    const [cancellOption, setCancellOption]=useState("#");
    const [test, setTest]=useState("*");
    const [test2, setTest2]=useState("*");
    const [test3, setTest3]=useState("*");
    const [employees, setEmployees] = useState([]);
    const [employee, setEmployeeOption] = useState("all");
    const navigate = useNavigate();

    useEffect(() => {
        checkLoggedIn();
        loadDoctors();
    }, []);

    useEffect(() => {
        if (loggedInUserLogin) {
            loadReservations();
        }
    }, [loggedInUserLogin, currentPage]); // Trigger the effect when either loggedInUserLogin or currentPage changes
    useEffect(() => {
        console.log("111");
        filterListIsCancelled(1);
       
    
  }, [cancellOption]);
  useEffect(() => {
    console.log("222");
    filterListIsCancelled(0);
   

}, [test2]);
// loadReservations();
useEffect(() => {
    console.log("333");
    console.log("reservations ddd:", reservations);
    sortListReservations();
  }, [sortOption, test]);

  useEffect(() => {
    console.log("444");
    handleEmployeeChange(1);
  }, [employee]);
  useEffect(() => {
    console.log("555");
    handleEmployeeChange(0);
  }, [test3]);
    const checkLoggedIn = () => {
        const isLoggedIn = !!Cookies.get("token")=== true;
        if (!isLoggedIn) {
            // User not logged in, navigate to the login page
            navigate('/');
        } else {
            // Retrieve the logged-in user's login from session storage
            const login =  JSON.parse(Cookies.get("token")).email;
            setLoggedInUserLogin(login);
        }
    };

    const loadReservations = async () => {
        try {
            let userData=JSON.parse(Cookies.get("token"));
            // console.log("ppppppersonId", userData.personneId);
            const response = await axios.post(
                `http://localhost:9090/appointments`, {"id": userData.personneId}
            );
            if (response.status === 200) {
                const sortedReservations = response.data.sort((a, b) => b.appointmentId - a.appointmentId);
                console.log("sorted reservations;", sortedReservations);
                setReservations(sortedReservations);
                setOriginalList(sortedReservations);
            } else {
                throw new Error('Failed to fetch reservations');
            }
        } catch (error) {
            console.error('Error loading reservations:', error);
        }
    };

    const cancelReservation = async (id) => {
        try {
            const updatedReservation = {
                "id": id
            };
            const response = await axios.put(`http://localhost:9090/appointment`, updatedReservation);
            if (response.status === 200) {
                loadReservations();
            } else {
                throw new Error('Failed to cancel reservation');
            }
        } catch (error) {
            console.error('Error canceling reservation:', error);
        }
    };
    const sortListReservations = () => {
        let sortedReservations = [...reservations];
        console.log("sortedReservations here :", sortedReservations, reservations);
        if (sortOption === "recent") {
            console.log("recent");
            sortedReservations.sort(
            (a, b) => new Date(b.startDate) - new Date(a.startDate)
          );
        } else if (sortOption === "old") {
            console.log("old");

            sortedReservations.sort(
            (a, b) => new Date(a.startDate) - new Date(b.startDate)
          );
        }
     
           
            setReservations(sortedReservations);
              
        
      };

      const filterListIsCancelled = (isThisTheFirstFilter) => {
        let sortedReservations = [...originalList];
        if(employee!="all" && isThisTheFirstFilter==0){
            sortedReservations=[...reservations];
        }
        console.log("sortedReservations here 2:", sortedReservations, reservations);
        let filteredReservations=sortedReservations;
        if (cancellOption === "yes") {
            console.log("yes");
            filteredReservations=sortedReservations.filter(
            (e) => e.cancelled === true
          );
        } else if (cancellOption === "no") {
            console.log("no");
            filteredReservations=sortedReservations.filter(
                (e) => e.cancelled == false
              );
            
        }
        console.log("filteredReservations",filteredReservations);
        setReservations(filteredReservations);
        if(employee!="all" && isThisTheFirstFilter==1){
            setTest3(test3+"*");
        }
        setTest(test+"*");
       
        
      };
      const handleEmployeeChange=(isThisTheFirstFilter)=>{
        let sortedReservations = [...originalList];
        if(cancellOption!="#" && isThisTheFirstFilter==0){
            sortedReservations=[...reservations];
        }
        console.log("sortedReservations here 2:", sortedReservations, reservations);
        let filteredReservations=sortedReservations;
        if(employee!="all"){
            filteredReservations=sortedReservations.filter(
                (e) => e.description.substring(12) === employee
              );
        }

        console.log("filteredReservations for employees",filteredReservations);
        setReservations(filteredReservations);
        if(cancellOption!="#" && isThisTheFirstFilter==1){
            setTest2(test2+"*");
        }
        
      };

      const loadDoctors = async () => {
        const result1 = await axios.get("http://localhost:9090/doctorsInfos");
        setEmployees(result1.data);
      };
    // Calculate the indexes of the items to display on the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = reservations.slice(indexOfFirstItem, indexOfLastItem);

    // Change the page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container">
            <div className="py-4">
            <select
                    className="form-control-sm text-center mb-3"
                    style={{ width: "200px" }}
                    value={sortOption}
                    onChange={(event) => setSortOption(event.target.value)}
                >
                <option value="#"> Sort by </option>{" "}
                <option value="recent"> Recent Date </option>{" "}
                <option value="old"> Old Date </option>{" "}
            </select>{" "}
            <select
                    className="form-control-sm text-center mb-3"
                    style={{ width: "200px" }}
                    value={cancellOption}
                    onChange={(event) => setCancellOption(event.target.value)}
                >
                <option value="#"> Filter by is cancelled</option>{" "}
                <option value="yes"> Cancelled </option>{" "}
                <option value="no"> Not Cancelled </option>{" "}
            </select>{" "}
            <select
              className="form-control-sm text-center mb-3"
              style={{ width: "200px", marginRight: "10px" }}
              
              onChange={(event) => setEmployeeOption(event.target.value)}
            >
              <option value="all"> Select a doctor </option>{" "}
              {employees.map((employee) => (
                <option value={employee.fullName} >
                  {" "}
                  {employee.fullName}{" "}
                </option>
              ))}{" "}
            </select>{" "}

                <table className="table border shadow ">
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Start Date</th>
                            <th scope="col">End Date</th>
                            <th scope="col">Description</th>
                            <th scope="col">Hub</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((reservation, index) => (
                            <tr key={reservation.appointmentId}>
                                <th scope="row">{reservation.appointmentId}</th>
                                <td>{reservation.startDate}</td>
                                <td>{reservation.endDate}</td>
                                <td>{reservation.description}</td>
                                <td>{reservation.hub}</td>
                                <td>
                                    {reservation.cancelled ? (
                                        <span>Cancelled by {reservation.cancelledBy}</span>
                                    ) : (
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => cancelReservation(reservation.appointmentId)}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <ul className="pagination justify-content-center">
                    {Array(Math.ceil(reservations.length / itemsPerPage))
                        .fill()
                        .map((_, index) => (
                            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => paginate(index + 1)}>
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
}

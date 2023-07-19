import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from "js-cookie";
import Swal from 'sweetalert2';

export default function Appointment() {
    const [schedulers, setSchedulers] = useState([]);
    const [loggedInUserLogin, setLoggedInUserLogin] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(13);
    const [sortOption, setSortOption] = useState("");
    const [deleteOption, setDeleteOption] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        checkLoggedIn();
    }, []);

    useEffect(() => {
        if (loggedInUserLogin) {
            loadSchedulers();
        }
    }, [loggedInUserLogin, currentPage, deleteOption]); // Trigger the effect when either loggedInUserLogin or currentPage changes
    useEffect(() => {
        console.log("333");
        console.log("schedulers ddd:", schedulers);
        sortListSchedulers();
      }, [sortOption]);

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

    const loadSchedulers = async () => {
        try {
            const userData=  JSON.parse(Cookies.get("token"));
            const response = await axios.post(`http://localhost:9090/calendarsAvailableByDoctor`, {"id": userData.personneId});
            console.log("resssssponse: ", response);
            const sortedSchedulers = response.data.sort((a, b) => b.schedulerId - a.schedulerId);
            setSchedulers(sortedSchedulers);
            setSortOption("recent");
        } catch (error) {
            console.error('Error fetching schedulers:', error);
        }
    };

    const cancelAppointment = async (calendarId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to cancell this appointment?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, cancell it!'
          }).then((result) => {
            if (result.isConfirmed) {
                try {
                    console.log("calendarId : "+calendarId);
                    const response0 = async () => {
                        let response=await axios.delete("http://localhost:9090/calendar/"+calendarId);
                        return response;
                    }
                    (async () => {
                        const deleteResponse = await response0();
                        // Continue with the rest of your code after the delete operation is complete
                        console.log("deleted normally");
                        setDeleteOption(deleteOption+"*");
                        Swal.fire(
                            'Cancelled!',
                            'Your appointement has been cancelled.',
                            'success'
                          );
                      })();

                   
                } catch (error) {
                    console.error('Error canceling reservation:', error);
                }

               
    }});
          };

        const sortListSchedulers = () => {
            let sortedSchedulers = [...schedulers];
            console.log("sortedReservations here :", sortedSchedulers, schedulers);
            if (sortOption === "recent") {
                console.log("recent");
                sortedSchedulers.sort(
                (a, b) => new Date(b.startDate) - new Date(a.startDate)
              );
            } else if (sortOption === "old") {
                console.log("old");
    
                sortedSchedulers.sort(
                (a, b) => new Date(a.startDate) - new Date(b.startDate)
              );
            }
         
               
            setSchedulers(sortedSchedulers);
                  
            
          };
    // Calculate the indexes of the items to display on the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = schedulers.slice(indexOfFirstItem, indexOfLastItem);

    // Change the page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Calculate the actual scheduler index
    const getActualIndex = (index) => {
        return schedulers.length - index - (currentPage - 1) * itemsPerPage;
    };

    return (
        <div>
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
                    <table className="table border shadow">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Start Date</th>
                                <th scope="col">End Date</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((scheduler, index) => (
                                <tr key={scheduler.calendarId}>
                                    <th scope="row">{getActualIndex(index)}</th>
                                    <td>{scheduler.startDate}</td>
                                    <td>{scheduler.endDate}</td>
                                    <td>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => cancelAppointment(scheduler.calendarId)}
                                        >
                                            Cancel
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <ul className="pagination justify-content-center">
                        {Array(Math.ceil(schedulers.length / itemsPerPage))
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
        </div>
    );
}

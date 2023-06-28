import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from "js-cookie";

export default function Appointment() {
    const [schedulers, setSchedulers] = useState([]);
    const [loggedInUserLogin, setLoggedInUserLogin] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(13);
    const navigate = useNavigate();

    useEffect(() => {
        checkLoggedIn();
    }, []);

    useEffect(() => {
        if (loggedInUserLogin) {
            loadSchedulers();
        }
    }, [loggedInUserLogin, currentPage]); // Trigger the effect when either loggedInUserLogin or currentPage changes

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
            const sortedSchedulers = response.data.sort((a, b) => b.schedulerId - a.schedulerId);
            setSchedulers(sortedSchedulers);
        } catch (error) {
            console.error('Error fetching schedulers:', error);
        }
    };

    const cancelAppointment = async (calendarId) => {
        try {
            console.log("calendarId : "+calendarId)
            const response = await axios.delete("http://localhost:9090/calendar/"+calendarId);
            console.log(response);
            if (response.status == 200) {
               console.log("deleted normally");
               loadSchedulers();
            } else {
                throw new Error('Failed to cancel reservation');
            }
        } catch (error) {
            console.error('Error canceling reservation:', error);
        }    };

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

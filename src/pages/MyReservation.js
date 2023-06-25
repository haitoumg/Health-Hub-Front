import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from "js-cookie";

export default function Reservations() {
    const [reservations, setReservations] = useState([]);
    const [loggedInUserLogin, setLoggedInUserLogin] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(13);
    const navigate = useNavigate();

    useEffect(() => {
        checkLoggedIn();
    }, []);

    useEffect(() => {
        if (loggedInUserLogin) {
            loadReservations();
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

    // Calculate the indexes of the items to display on the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = reservations.slice(indexOfFirstItem, indexOfLastItem);

    // Change the page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container">
            <div className="py-4">
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

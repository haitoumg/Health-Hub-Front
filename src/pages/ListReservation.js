import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Reservations() {
    const [reservations, setReservations] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);

    useEffect(() => {
        const fetchUserInformation = async () => {
            const login = sessionStorage.getItem('login');
            if (login) {
                try {
                    const response = await fetch(`http://localhost:9090/user?login=${login}`);
                    if (response.ok) {
                        const user = await response.json();
                        const hubName = user.hub.hubName;
                        loadReservations(hubName);
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        };

        fetchUserInformation();
    }, []);

    const loadReservations = async (hubName) => {
        try {
            const response = await axios.get(`http://localhost:9090/findAllReservation_in_whatHubReservation/hub`);
            const sortedReservations = response.data.sort((a, b) => b.reservationId - a.reservationId);
            setReservations(sortedReservations);
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    };

    // Get current reservations based on pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = reservations.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Calculate page numbers to display in the center
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(reservations.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div>
            <div className="container">
                <div className="py-4">
                    <table className="table border shadow">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Full Name</th>
                                <th scope="col">Start Date</th>
                                <th scope="col">End Date</th>
                                <th scope="col">Is Cancelled</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((reservation, index) => (
                                <tr key={reservation.reservationId}>
                                    <th scope="row">{reservation.reservationId}</th>
                                    <td>{reservation.user.firstName} {reservation.user.lastName}</td>
                                    <td>{reservation.scheduler.startDate}</td>
                                    <td>{reservation.scheduler.endDate}</td>
                                    <td>{reservation.isCancelled === 0 ? 'No' : 'Yes'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <ul className="pagination justify-content-center"> {/* Updated class */}
                    {pageNumbers.map((number) => (
                        <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => paginate(number)}>
                                {number}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

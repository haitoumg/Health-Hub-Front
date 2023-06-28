import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";

export default function Reservations() {
    const [reservations, setReservations] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);

    useEffect(() => {
        const fetchUserInformation = async () => {
            const login = JSON.parse(Cookies.get("token")).email;
            if (login) {
             
                    // const response = await fetch(`http://localhost:9090/user?login=${login}`);
                    
                        const user = JSON.parse(Cookies.get("token"));
                        const hubName = user.hubName;
                        loadReservations();
                   
                // } catch (error) {
                //     console.error('Error:', error);
                // }
            }
        };

        fetchUserInformation();
    }, []);
    // loadReservations();

    const loadReservations = async () => {
        try {
            let userData = JSON.parse(Cookies.get("token"));
            const response = await axios.post(`http://localhost:9090/appointmentsByDoctor`, {"id": userData.personneId});
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
                                    <td>{reservation.fullName}</td>
                                    <td>{reservation.startDate}</td>
                                    <td>{reservation.endDate}</td>
                                    <td>{reservation.cancelled === false ? 'No' : 'Yes, by '+reservation.cancelledBy}</td>
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

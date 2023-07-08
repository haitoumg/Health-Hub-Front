import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";

export default function Reservations() {
    const [reservations, setReservations] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);
    const [sortOption, setSortOption] = useState("");
    const [originalList, setOriginalList]=useState([]);
    const [cancellOption, setCancellOption]=useState("#");
    const [test, setTest]=useState("*");
    const [test2, setTest2]=useState("*");
    const [test3, setTest3]=useState("*");
    const [employees, setEmployees] = useState([]);
    const [employee, setEmployeeOption] = useState("all");
    
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
                (e) => e.fullName === employee
              );
        }

        console.log("filteredReservations for employees",filteredReservations);
        setReservations(filteredReservations);
        if(cancellOption!="#" && isThisTheFirstFilter==1){
            setTest2(test2+"*");
        }
        
      };

      const loadEmployees = async () => {
        const result1 = await axios.get("http://localhost:9090/employeesInfos");
        setEmployees(result1.data);
      };
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
        loadEmployees();
    }, []);
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

    const loadReservations = async () => {
        try {
            let userData = JSON.parse(Cookies.get("token"));
            const response = await axios.post(`http://localhost:9090/appointmentsByDoctor`, {"id": userData.personneId});
            const sortedReservations = response.data.sort((a, b) => b.reservationId - a.reservationId);
            console.log("sortedReservations0 ", sortedReservations);
            setOriginalList(sortedReservations);
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
              <option value="all"> Select an employee </option>{" "}
              {employees.map((employee) => (
                <option value={employee.fullName} >
                  {" "}
                  {employee.fullName}{" "}
                </option>
              ))}{" "}
            </select>{" "}
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

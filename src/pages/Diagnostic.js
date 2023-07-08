import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

export default function Diagnostic() {
  const navigate = useNavigate();
  const [diagnostics, setDiagnostics] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [idSearch, setIdSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [sortOption, setSortOption] = useState("");
  ///
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(13);
  ///
  const handleInputChange = (event) => {
    setIdSearch(event.target.value);
  };

  const redirectAddClick = () => {
    navigate("/AddDiagnostic");
  };

  const loadDiagnostic = async () => {
    const token = Cookies.get("token");
    const tokenObject = token ? JSON.parse(token) : null;
    const result = await axios.get(
      `http://localhost:9090/diagnosticByDoctor/${tokenObject.personneId}`
    );
    setDiagnostics(result.data);
  };

  const loadEmployee = async () => {
    const result1 = await axios.get("http://localhost:9090/employees");
    setEmployees(result1.data);
  };

  const loadIdSearch = async () => {
    const token = Cookies.get("token");
    const tokenObject = token ? JSON.parse(token) : null;
    try {
      const result2 = await axios.get(
        `http://localhost:9090/diagnosticByEmployeeAndDoctor/${tokenObject.personneId}/${idSearch}`
      );
      setDiagnostics(result2.data);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const sortDiagnostics = () => {
    let sortedDiagnostics = [...diagnostics];
    if (sortOption === "recent") {
      sortedDiagnostics.sort(
        (a, b) => new Date(b.diagnosticDate) - new Date(a.diagnosticDate)
      );
    } else if (sortOption === "old") {
      sortedDiagnostics.sort(
        (a, b) => new Date(a.diagnosticDate) - new Date(b.diagnosticDate)
      );
    }
    setDiagnostics(sortedDiagnostics);
  };

  useEffect(() => {
    loadDiagnostic();
    loadEmployee();
  }, []);
  useEffect(() => {
    loadDiagnostic();
    loadEmployee();
  }, [currentPage]);

  useEffect(() => {
    sortDiagnostics();
  }, [sortOption]);
  // Calculate the indexes of the items to display on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = diagnostics.slice(indexOfFirstItem, indexOfLastItem);

  // Change the page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <div className="container">
      <div className="py-4">
        <form className="form-group row">
          <div>
            <button
              onClick={redirectAddClick}
              style={{ width: "200px" }}
              className="btn btn-primary mb-3"
              type="submit"
            >
              Add Notes{" "}
            </button>{" "}
          </div>{" "}
          <div className="d-flex justify-content-center align-items-center">
            <select
              className="form-control-sm text-center mb-3"
              style={{ width: "200px", marginRight: "10px" }}
              value={idSearch}
              onChange={handleInputChange}
            >
              <option value=""> Select an employee </option>{" "}
              {employees.map((employee) => (
                <option value={employee.personneId} key={employee.personneId}>
                  {" "}
                  {employee.lastName} {employee.firstName}{" "}
                </option>
              ))}{" "}
            </select>{" "}
            <button
              style={{ width: "150px", marginRight: "50px" }}
              type="button"
              className="btn btn-success mb-3"
              onClick={loadIdSearch}
            >
              Search{" "}
            </button>{" "}
            <select
              className="form-control-sm text-center mb-3"
              style={{ width: "200px" }}
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value)}
            >
              <option value=""> Sort by </option>{" "}
              <option value="recent"> Recent Date </option>{" "}
              <option value="old"> Old Date </option>{" "}
            </select>{" "}
          </div>{" "}
        </form>{" "}
        <table className="border shadow table">
          <thead>
            <tr>
              <th scope="col"> # </th> <th scope="col"> Complet Name </th>{" "}
              <th scope="col"> Note </th> <th scope="col"> Date </th>{" "}
            </tr>{" "}
          </thead>{" "}
          <tbody>
            {" "}
            {diagnostics.map((diagnostic, index) => {
              const matchedEmployee = employees.find(
                (employee) =>
                  employee.personneId === diagnostic.employee.personneId
              );
              return (
                <tr key={index}>
                  <th scope="row"> {index + 1} </th>{" "}
                  {matchedEmployee ? (
                    <td>
                      {" "}
                      {matchedEmployee.lastName} {matchedEmployee.firstName}{" "}
                    </td>
                  ) : (
                    <td> - </td>
                  )}{" "}
                  <td> {diagnostic.note} </td>{" "}
                  <td> {diagnostic.diagnosticDate} </td>{" "}
                </tr>
              );
            })}{" "}
          </tbody>{" "}
        </table>{" "}
        <ul className="pagination justify-content-center">
          {" "}
          {Array(Math.ceil(diagnostics.length / itemsPerPage))
            .fill()
            .map((_, index) => (
              <li
                key={index}
                className={`page-item ${
                  currentPage === index + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => paginate(index + 1)}
                >
                  {" "}
                  {index + 1}{" "}
                </button>{" "}
              </li>
            ))}{" "}
        </ul>{" "}
      </div>{" "}
    </div>
  );
}
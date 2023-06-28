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
  const [idSearch, setIdSearch] = useState(""); // Updated to empty string
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState(null);

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
        `http://localhost:9090/diagnosticByEmployeeAndDoctor/${tokenObject.personneId}/` +
          idSearch
      );
      setDiagnostics(result2.data); // Updated to set diagnostics instead of employees
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  useEffect(() => {
    loadDiagnostic();
    loadEmployee();
    console.log(Cookies.get("token").personneId);
  }, []);

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
              Add Notes
            </button>
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <select
              className="form-control-sm text-center mb-3"
              style={{ width: "400px" }}
              value={idSearch} // Updated to use the idSearch value
              onChange={handleInputChange}
            >
              <option value="">Select an employee</option>
              {employees.map((employee) => (
                <option value={employee.personneId} key={employee.personneId}>
                  { employee.lastName } {employee.firstName} 
                </option>
              ))}
            </select>
            &nbsp; &nbsp;
            <button
              style={{ width: "150px" }}
              type="button" // Updated to prevent form submission
              className="btn btn-success mb-3"
              onClick={loadIdSearch} // Removed the parentheses from onClick
            >
              Search
            </button>
          </div>
        </form>
        <table className="border shadow table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Complet Name</th>
              <th scope="col">Note</th>
              <th scope="col">Date</th>
            </tr>
          </thead>
          <tbody>
            {diagnostics.map((diagnostic, index) => {
              const matchedEmployee = employees.find(
                (employee) =>
                  employee.personneId === diagnostic.employee.personneId
              );
              console.log(diagnostic.employee.personneId);
              return (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  {matchedEmployee ? (
                    <td>
                      {matchedEmployee.lastName} {matchedEmployee.firstName}
                    </td>
                  ) : (
                    <td>-</td>
                  )}
                  <td>{diagnostic.note}</td>
                  <td>{diagnostic.diagnosticDate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

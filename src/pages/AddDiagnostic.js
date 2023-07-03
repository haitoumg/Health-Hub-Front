import React, { useEffect, useState } from "react";
import axios from "axios";
import Diagnostic from "./Diagnostic";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const AddDiagnostic = () => {
  const [errorMessage, setErrorMessage] = useState("");
  let navigate = useNavigate();
  const [idSearch, setIdSearch] = useState("");
  const [employees, setEmployees] = useState([]);
  const [diagnostics, setDiagnostics] = useState({
    note: "",
    employeeId: "",
    doctorId: "",
  });
  const loadDiagnostic = async () => {
    const token = Cookies.get("token");
    const tokenObject = token ? JSON.parse(token) : null;
    const result = await axios.get(
      `http://localhost:9090/diagnosticByDoctor/${tokenObject.personneId}`
    );
    setDiagnostics(result.data);
  };
  const handleInputChange = (event) => {
    setIdSearch(event.target.value);
  };
  const onInputChange = (e) => {
    setDiagnostics({ ...diagnostics, [e.target.name]: e.target.value });
  };
  const onSubmet = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");
    const tokenObject = token ? JSON.parse(token) : null;
    diagnostics.doctorId = tokenObject.personneId;
    await axios.post("http://localhost:9090/diagnostic", diagnostics);

    //window.location.reload();
    navigate("/Diagnostic");

    //document.location.href = "http://localhost:3000/Diagnostic";
  };
  const loadEmployee = async () => {
    const result1 = await axios.get("http://localhost:9090/employees");
    setEmployees(result1.data);
  };
  useEffect(() => {
    loadDiagnostic();
    loadEmployee();
  }, []);

  return (
    <div className="container">
      <form onSubmit={(e) => onSubmet(e)}>
        <br></br>
        <br></br>
        <div className="d-flex justify-content-center align-items-center">
          <select
            className="form-control-sm text-center mb-3"
            onChange={(e) => onInputChange(e)}
            name="employeeId"
            style={{ width: "400px" }}
            required
            // Updated to use the idSearch value
          >
            <option value="">Select an employee</option>
            {employees.map((employee) => (
              <option value={employee.personneId} key={employee.personneId}>
                { employee.lastName } {employee.firstName} 
              </option>
            ))}
          </select>
        </div>

        <div className="form-group row">
          <label className="col-sm-2 col-form-label">Note:</label>
          <div className="col-sm-10">
            <textarea
              maxLength={600}
              rows={6}
              type="text"
              name="note"
              className="form-control"
              placeholder="Enter the Notes...."
              onChange={(e) => onInputChange(e)}
              required
            />
          </div>
        </div>
        <br></br>
        <br></br>
        <div className="form-group row">
          <div className="col-sm-10 offset-sm-2">
            <button
              style={{ width: "200px" }}
              type="submit"
              className="btn btn-primary ml-2 button"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddDiagnostic;

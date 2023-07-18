import React, { useEffect, useState } from "react";
import axios from "axios";
import Diagnostic from "./Diagnostic";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Autocomplete from "react-autocomplete";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

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
    const selectedValue = idSearch; // Store the selected value

    const selectedEmployee = employees.find(
      (employee) => employee.fullName === selectedValue
    );
    diagnostics.doctorId = tokenObject.personneId;
    if (selectedEmployee) {
      diagnostics.employeeId = selectedEmployee.idPersone;
      await axios.post("http://localhost:9090/diagnostic", diagnostics);

      //window.location.reload();
      Swal.fire(
        "Diagnostic Added!",
        "Your Diagnostic has been Added.",
        "success"
      );
      toast.success("Add Diagnostic successfully");
      navigate("/Diagnostic");

      //document.location.href = "http://localhost:3000/Diagnostic";
    }
  };
  const loadEmployee = async () => {
    const result1 = await axios.get("http://localhost:9090/employeesInfos");
    setEmployees(result1.data);
  };
  useEffect(() => {
    loadDiagnostic();
    loadEmployee();
  }, []);

  return (
    <div className="container">
      <form onSubmit={(e) => onSubmet(e)}>
        <br /> <br />
        <div className="d-flex justify-content-center align-items-center">
          <Autocomplete
            className="form-control-sm text-center mb-3"
            style={{ width: "200px", marginTop: "40px" }}
            value={idSearch}
            items={employees}
            getItemValue={(item) => item.fullName}
            onChange={(event) => setIdSearch(event.target.value)}
            onSelect={(value) => setIdSearch(value)}
            renderInput={(props) => (
              <input
                {...props}
                type="text"
                className="form-control-sm text-center mb-3"
                placeholder="Select an employee"
              />
            )}
            renderItem={(item, isHighlighted) => (
              <div
                key={item.idPersone}
                style={{ background: isHighlighted ? "lightgray" : "white" }}
              >
                {" "}
                {item.fullName}{" "}
              </div>
            )}
          />{" "}
        </div>{" "}
        <div className="form-group row">
          <label className="col-sm-2 col-form-label"> Note: </label>{" "}
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
          </div>{" "}
        </div>{" "}
        <div className="form-group row">
          <div className="col-sm-10 offset-sm-2">
            <button
              style={{
                width: "200px",
                marginTop: "40px",
                background: "#13274F",
              }}
              type="submit"
              className="btn btn-primary ml-2 button"
            >
              Save{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
      </form>{" "}
    </div>
  );
};

export default AddDiagnostic;

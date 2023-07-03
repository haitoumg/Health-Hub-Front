import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Navbar from "../Nabar/Navbar";
import ItemMenu from "./ItemMenu";
import "./Menu.style.css";
import Cookies from "js-cookie";


const Menu = ({ children }) => {
    const [tokenObject, setTokenObject] = useState(null);

    useEffect(() => {
        const token = Cookies.get("token");
        if (token) {
            try {
                const parsedTokenObject = JSON.parse(token);
                setTokenObject(parsedTokenObject);
            } catch (error) {
                console.error("Error parsing token:", error);
            }
        }
    }, []);

    const [open, setOpen] = useState("aberto");

    const handleMenu = () => {
        setOpen((prevState) => (prevState === "aberto" ? "fechado" : "aberto"));
    };

    return (
        <>
            <div className={`menu ${open}`}>
                <img src="/images/ntt.png" className="logo" />
                <hr className="divisor" />

                <ul className="conteudo-menu">
                    {tokenObject?.role === "Doctor" && (
                        <ItemMenu title="Health Menu" icon="fa-solid fa-user">
                            <li>
                                <NavLink className="link-menu" to="/Scheduler">
                                    <i className="fa-solid fa-hospital"></i>
                                    <span>{tokenObject.hubCity}</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink className="link-menu" to="/Appointment">
                                    <i className="fa-solid fa-calendar-check"></i>
                                    <span>My Appointment</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink className="link-menu" to="/ListReservation">
                                    <i className="fa-solid fa-calendar-check"></i>
                                    <span>List Reservation</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink className="link-menu" to="/Diagnostic">
                                    <i className="fa-solid fa-calendar-check"></i>
                                    <span>Diagnostic of employee</span>
                                </NavLink>
                            </li>
                            
                            
                        </ItemMenu>
                    )}

                    {tokenObject?.role === "Employee" && (
                        <ItemMenu title="Health Menu" icon="fa-solid fa-user">
                            <li>
                                <NavLink
                                    className="link-menu"
                                    to="/SchedulerTetouan"
                                    onClick={() => (window.location.href = "/SchedulerTetouan")}
                                >
                                    <i className="fa-solid fa-hospital"></i>
                                    <span>Tetouan</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    className="link-menu"
                                    to="/SchedulerCasablanca"
                                    onClick={() => (window.location.href = "/SchedulerCasablanca")}
                                >
                                    <i className="fa-solid fa-hospital"></i>
                                    <span>Casablanca</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink className="link-menu" to="/MyReservation">
                                    <i className="fa-solid fa-calendar-check"></i>
                                    <span>My Reservation</span>
                                </NavLink>
                            </li>
                        </ItemMenu>
                    )}
                </ul>
            </div>

            <div className={`site ${open}`}>
                <Navbar tipoMenu={open} handleMenu={handleMenu} />
                {children}
            </div>
        </>
    );
};

export default Menu;

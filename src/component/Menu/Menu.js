import Cookies from "js-cookie";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import Navbar from "../Nabar/Navbar";

import ItemMenu from "./ItemMenu";
import "./Menu.style.css";



const Menu = ({ children }) => {

    const token = Cookies.get("token");
    const tokenObject = JSON.parse(token);

    console.log(tokenObject.role);
    console.log(tokenObject.hubCity);


    const [open, setOpen] = useState('aberto');

    const handleMenu = () => {
        (open === 'aberto') ? setOpen('fechado') : setOpen('aberto');
    };

    return (
        <>
            <div className={`menu ${open}`}>
                <img src="/images/ntt.png" className="logo" />
                <hr className="divisor" />

                <ul className="conteudo-menu">
                    <ItemMenu title="Health Menu" icon="fa-solid fa-user">
                        {tokenObject.role === "Doctor" && (
                            <>
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
                            </>

                        )}

                        {tokenObject.role === "Employee" && (
                            <>
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
                            </>

                        )}
                    </ItemMenu>
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

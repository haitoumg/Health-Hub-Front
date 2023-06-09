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

                    <ItemMenu title="Doctor Test" icon="fa-solid fa-user">
                        <li>
                            <NavLink className="link-menu" to="/scheduler">
                                <i class="fa-solid fa-hospital"></i>
                                <span>{tokenObject.hubCity}</span>
                            </NavLink>
                        </li>
                        
                        <li>
                            <NavLink className="link-menu" to="/EmployeeS">
                                <i class="fa-solid fa-hospital"></i>
                                <span>Casablanca</span>
                            </NavLink>
                        </li>
                        
                        <li>
                            <NavLink className="link-menu" to="/Tet">
                                <i class="fa-solid fa-calendar-check"></i>
                                <span>My Appointment</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className="link-menu" to="/Welcome">
                                <i class="fa-solid fa-calendar-check"></i>
                                <span> welcome</span>
                            </NavLink>
                        </li>
                    </ItemMenu>
                </ul>
            </div>

            <div className={`site ${open}`}>
                <Navbar
                    tipoMenu={open}
                    handleMenu={handleMenu}
                />

                {children}
            </div>
        </>
    );
};

export default Menu;
import { useState, useContext , useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as FiIcons from "react-icons/fi";
import * as FaIcons from "react-icons/fa";
import AuthContext from "../../context/authContext";
import useUser from "../../hooks/useUser";
import { NavBarData } from "./NavbarData";
import Logo from "../../assets/logo-el-gran-langostino.png";
import "./styles.css";

export default function Navbar() {
  const { isLogged, logout } = useUser();
  const [showSideBar, setShowSidebar] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [ruta, setRuta] = useState('');

  const handleClickImg = (e) => {
    if(user.role==='aprobador'){
      return navigate('/solicitudes')
    }else{
      return navigate('/inicio')
    }
  }

  useEffect(() => {
    setRuta(window.location.pathname);
  }, []);

  return (
    <>
      {isLogged && (
        <div
          className="position-fixed bg-light shadow w-100"
          style={{ fontSize: 11, left: 0, height: "50px", zIndex: 2 }}
        >
          <div className="d-flex flex-row justify-content-between align-items-center w-100 h-100 px-3 shadow">
            <div
              id="logo-header"
              className="d-flex flex-row align-items-center gap-2"
            >
              <img
                src={Logo}
                width={100}
                alt=""
              />
            </div>

            <div className="d-flex flex-row align-items-center pe-0 me-0">
              <span className="menu-bars m-0" style={{ cursor: "pointer" }}>
                <FaIcons.FaBars
                  className=""
                  style={{color:'#eb6146'}}
                  onClick={(e) => setShowSidebar(!showSideBar)}
                />
              </span>
            </div>
          </div>

          <nav
            className={showSideBar ? "bg-light nav-menu active" : "nav-menu"}
          >
            <ul
              className="nav-menu-items"
              onClick={(e) => setShowSidebar(!showSideBar)}
              style={{userSelect:'none'}}
            >
              {NavBarData.map((item, index) => {
                if (item.access.includes(user.role)) {
                  return (
                    <li key={index} className={item.cName} >
                      <Link 
                        to={item.path}
                        onClick={(e)=>setRuta(item.path)}
                        style={{backgroundColor:(ruta === item.path) ? '#eb6146' : 'transparent', color:(ruta===item.path) ? 'white' : 'black'}}
                      >
                        {item.icon}
                        <span>{item.title}</span>
                      </Link>
                    </li>
                  );
                }
              })}
            </ul>
            <ul
              className="nav-menu-items"
              onClick={(e) => setShowSidebar(!showSideBar)}
              style={{userSelect:'none' , listStyle:'none'}}
            >
              <li className="text-center text-secondary">
                {/* <span className="m-0">Gran Langostino S.A.S - v2.6.0</span> */}
                <button 
                  className="btn btn-sm btn-danger w-100 p-2"
                  
                  /* style={{backgroundColor:'#eb6146', color:'white'}} */
                  onClick={(e)=>(logout(e), setRuta('/registros/diarios'))}
                >
                  Cerrar sesión
                </button>
              </li>
              <li className="text-center text-secondary mt-1">
                <span className="m-0">Gran Langostino S.A.S</span>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}

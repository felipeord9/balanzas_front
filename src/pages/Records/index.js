import React from 'react';
import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TableRecords from "../../components/TableRecords";
import TableBalance from '../../components/TableBalance';
import AuthContext from "../../context/authContext";
import { MdOutlinePendingActions } from "react-icons/md";
import { findRecord } from '../../services/recordService'
import { findBalance } from '../../services/balanceService'
import * as GoIcons from "react-icons/go"
import * as MdIcons from "react-icons/md"
import Swal from 'sweetalert2';
import './styles.css'

export default function Records() {
  const { user } = useContext(AuthContext);
  const [records, setRecords] = useState([]);
  const [balances, setBalances] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [filterDate, setFilterDate] = useState({
    initialDate: null,
    finalDate: null,
  });
  const [loading, setLoading] = useState(false);

  //logica de cambio de tabla
  const [showPendientes, setShowPendientes] = useState(true);
  const [showVerificados, setShowVerificados] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900); // Establecer a true si la ventana es menor o igual a 768px
    };

    // Llama a handleResize al cargar y al cambiar el tamaño de la ventana
    window.addEventListener('resize', handleResize);
    handleResize(); // Llama a handleResize inicialmente para establecer el estado correcto

    // Elimina el event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    getDuoSearch()
    /* getAllRecords();
    getAllBalances(); */
  }, []);

  const getDuoSearch = () =>{
    setLoading(true)
    var registers = []
    //busqueda de los registros
    findRecord()
    .then(({data})=>{
      registers = data
      findBalance()
      .then(({data})=>{
        if(user.role==='admin' || user.role==='calidad'){
          const diferencia = data.filter(item1 => 
            !registers.some(item2 => item2.balance.id === item1.id)
          );
          setBalances(diferencia)
          setSuggestions(diferencia)
          setRecords(registers)
          setLoading(false)
        }else if(user.role==='planta'){
          const dataPlanta = data.filter((item)=>{
            return item.zone === 'planta'
          })
          const registerFill = registers.filter((item)=>{
            return item.balance.zone === 'planta'
          })
          const diferencia = dataPlanta.filter(item1 => 
            !registerFill.some(item2 => item2.balance.id === item1.id)
          );
          setBalances(diferencia)
          setSuggestions(diferencia)
          setRecords(registerFill)
          setLoading(false)
        }else if(user.role==='logistica'){
          const dataPlanta = data.filter((item)=>{
            return item.zone === 'logistica'
          })
          const registerFill = registers.filter((item)=>{
            return item.balance.zone === 'logistica'
          })
          const diferencia = dataPlanta.filter(item1 => 
            !registerFill.some(item2 => item2.balance.id === item1.id)
          );
          setBalances(diferencia)
          setSuggestions(diferencia)
          setRecords(registerFill)
          setLoading(false)
        }
      })
    })
    
  }

  const getAllRecords = () => {
    setLoading(true)
    findRecord()
    .then(({data})=>{
      setLoading(false)
      setRecords(data)
    })
    .catch((error)=>{
      setLoading(false)
      console.log(error)
    })
  };

  const getAllBalances = () => {
    findBalance()
    .then(({data})=>{
      setLoading(false)
      setBalances(data)
      setSuggestions(data)
    })
    .catch((error)=>{
      setLoading(false)
      console.log(error)
    })
  };

  const handleVerify = (e) =>{
    e.preventDefault();
    if(showPendientes === true){
      getDuoSearch()
      setShowPendientes(false);
      setShowVerificados(true)
    }else{
      getDuoSearch()
      setShowPendientes(true);
      setShowVerificados(false)
    }
  }

  return (
    <div className="d-flex flex-column container mt-5">
      <div className="d-flex flex-column gap-2 h-100">
        <div className="d-flex div-botons justify-content-center align-items-center">
          <button
            title="Nuevo usuario"
            style={{
              transform: showPendientes ? 'scale(1.1)' : 'scale(0.9)',
              transition: 'all 0.3s ease',
              backgroundColor: showVerificados && 'rgba(255, 176, 39, 0.837)',
              width: isMobile ? (showVerificados ? '50%':'75%'):(showVerificados ? '25%':'50%'),
            }}
            onClick={(e)=>handleVerify(e)}
            className="d-flex align-items-center text-nowrap btn btn-sm btn-warning text-light gap-1 mt-1 justify-content-center" 
          >
              PENDIENTES
              <MdOutlinePendingActions />
          </button>
          <button
            title="Nuevo usuario"
            style={{
              transform: showVerificados ? 'scale(1.1)' : 'scale(0.9)',
              transition: 'all 0.3s ease',
              backgroundColor: showPendientes ? 'rgba(74, 157, 38, 0.8)' : 'rgba(74, 157, 38, 1)',
              borderColor: showPendientes && 'rgba(88, 164, 54, 0.8)',
              width: isMobile ? (showPendientes ? '50%':'75%') : (showPendientes ? '25%':'50%'),
            }}
            onClick={(e)=>handleVerify(e)}
            className="d-flex align-items-center text-nowrap btn btn-sm text-light gap-1 justify-content-center" 
          >
              VERIFICADAS
              <MdIcons.MdOutlineInventory />
          </button>
        </div>
        {/* {JSON.stringify(suggestions)} */}
        {showPendientes && (
          <TableBalance balances={suggestions} getAllBalances={getDuoSearch} loading={loading}/>
        )}
        {showVerificados && (
          <TableRecords records={records} getAllRecords={getDuoSearch} loading={loading}/>
        )}
      </div>
    </div>
  );
}

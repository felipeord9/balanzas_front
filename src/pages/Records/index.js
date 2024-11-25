import React from 'react';
import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TableRecords from "../../components/TableRecords";
import TableBalance from '../../components/TableBalance';
import AuthContext from "../../context/authContext";
import { MdOutlinePendingActions } from "react-icons/md";
import { findRecord } from '../../services/recordService'
import { findBalance } from '../../services/balanceService'
import { Modal, Button } from "react-bootstrap";
import { Html5QrcodeScanner } from "html5-qrcode";
import * as MdIcons from "react-icons/md"
import Swal from 'sweetalert2';
import './styles.css'

export default function Records() {
  const { user } = useContext(AuthContext);
  const [records, setRecords] = useState([]);
  const [balances, setBalances] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  //logica del modal con el scanner
  const [showModal, setShowModal] = useState(false);
  const scannerRef = useRef(null);
  const openModal = () => {
    setShowModal(true)
  }
  const handleCloseModal  = () => {
    setShowModal(false)
  }

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

  //logica para abrir el scanner cuando se abra el modal
  useEffect(() => {
    if (showModal) {
      const config = {
        fps: 10, // Frames per second
        qrbox: { width: 250, height: 250 }, // Scanning area size
        
      };
      // Personalizar los textos del escáner
      const updateLabelsToSpanish = () => {
        const startScanningButton = document.querySelector(".html5-qrcode-button-camera-start");
        const stopScanningButton = document.querySelector(".html5-qrcode-button-camera-stop");
        const cameraPermissionText = document.querySelector(".html5-qrcode-camera-permission-text");
        const cameraUnavailableText = document.querySelector(".html5-qrcode-camera-setup-text");

        if (startScanningButton) startScanningButton.innerText = "Iniciar escaneo";
        if (stopScanningButton) stopScanningButton.innerText = "Detener escaneo";
        if (cameraPermissionText) cameraPermissionText.innerText = "Por favor, permita el acceso a la cámara.";
        if (cameraUnavailableText) cameraUnavailableText.innerText = "Cámara no disponible. Verifique su configuración.";
      };

      const scanner = new Html5QrcodeScanner("qr-reader", config, false);

      scanner.render(
        (decodedText) => {
          handleCloseModal(); // Close the modal after scanning
          scanner.clear(); // Clear the scanner
          window.location.href = decodedText;
        },
        (error) => {
          console.warn(error);
        }
      );
      
      // Modificar textos al español después de renderizar
      setTimeout(updateLabelsToSpanish, 500); // Esperar a que se renderice la interfaz
      
      scannerRef.current = scanner;
    }

    // Cleanup on modal close or component unmount
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, [showModal]);

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
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Escanear Código QR</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div id="qr-reader" style={{ width: "100%", textAlign: "center" }}></div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleCloseModal}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
        <div className="d-flex div-botons justify-content-center align-items-center">
          <button
            title="MARCACIONES PENDIENTES"
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
            title="MARCACIONES VERIFICADAS"
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
          {/* <button
            title='SCANNEAR CÓDIGO'
            className="d-flex align-items-center text-nowrap btn btn-sm btn-primary text-light gap-1 justify-content-center pe-3 ps-3"
            onClick={(e)=>openModal(e)}
          >
            Scanner
          </button> */}
        </div>
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

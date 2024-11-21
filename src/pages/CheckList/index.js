import React from 'react';
import { useState, useEffect, useContext } from "react";
import TableCheckList from '../../components/TableCheckList';
import AuthContext from "../../context/authContext";
import { findCheckList } from '../../services/recordService'
import { findBalance } from '../../services/balanceService'
import { Modal, Button, Form } from "react-bootstrap";
import * as XLSX from "xlsx";
import * as FaIcons from "react-icons/fa";
import { SiMicrosoftexcel } from "react-icons/si";
import { saveAs } from "file-saver";
import Swal from 'sweetalert2';
import './styles.css'

export default function CheckList() {
  const { user } = useContext(AuthContext);
  const [records, setRecords] = useState([]);
  const [balances, setBalances] = useState([]);
  const [filterDate, setFilterDate] = useState({
    initialDate: '',
    finalDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [searchRef, setSearchRef] = useState('')
  const [suggestions, setSuggestions] = useState([])

  const [showModal, setShowModal] = useState(false);
  const closeModal = () => {
    setShowModal(false);
  };
  const openModal = (number) => {
    setShowModal(true);
  };

  //logica para saber si es celular
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
    getCheckList();
    getBalances();
  }, []);

  //funcion para obtener los registros completos
  const getCheckList = () => {
    setLoading(true)
    findCheckList()
    .then(({data})=>{
      setLoading(false)
      setRecords(data)
      setSuggestions(data)
    })
    .catch((error)=>{
      setLoading(false)
      console.log(error)
    })
  };

  //funcion para buscar las balanzas y guardarlas en una constante
  const getBalances = () => {
    setLoading(true)
    findBalance()
    .then(({data})=>{
      setLoading(false)
      setBalances(data)
    })
    .catch((error)=>{
      setLoading(false)
      console.log(error)
    })
  };

  const [fillWithDate, setFillWithDate] = useState({})
  const [fillWithRef, setFillWithRef] = useState({})


  const duoSearch = (e) =>{
    e.preventDefault();
    if(searchRef !== '' && filterDate.finalDate === '' && filterDate.initialDate === ''){
      const valor = searchRef.toUpperCase()
      const filtered = records.filter((elem) => {
        if(elem.balance.reference.includes(valor)) {
          return elem
        }
      })
      if(filtered.length > 0) {  
        setSuggestions(filtered)
      } else {
        setSuggestions([])
      }
    }else if(searchRef === '' && filterDate.finalDate !== '' && filterDate.initialDate !== ''){
      const initialDate = new Date(filterDate?.initialDate?.split('-').join('/')).toLocaleDateString();
      const finalDate = new Date(filterDate?.finalDate?.split('-').join('/')).toLocaleDateString();
      const filtered = records.filter((elem) => {
        const splitDate = new Date(elem.date).toLocaleDateString();
        if (splitDate >= initialDate && splitDate <= finalDate) {
          return elem;
        }
        return 0;
      });
      setSuggestions(filtered);
    }else{
      if(filterDate.finalDate !== '' && filterDate.initialDate !== ''){
        const initialDate = new Date(filterDate?.initialDate?.split('-').join('/')).toLocaleDateString();
        const finalDate = new Date(filterDate?.finalDate?.split('-').join('/')).toLocaleDateString();
        const filtered = records.filter((elem) => {
          const splitDate = new Date(elem.date).toLocaleDateString();
          if (splitDate >= initialDate && splitDate <= finalDate) {
            return elem;
          }
          return 0;
        });
        const valor = searchRef.toUpperCase();
        const duoFiltered = filtered.filter((elem) => {
          if(elem.balance.reference.includes(valor)) {
            return elem
          }
        })
        if(duoFiltered.length > 0) {  
          setSuggestions(duoFiltered)
        } else {
          setSuggestions([])
        }
      }else if((filterDate.finalDate !== '' && filterDate.initialDate === '')||(filterDate.finalDate === '' && filterDate.initialDate !== '')){
        Swal.fire({
          icon:'warning',
          title:'¡ERROR!',
          text:'Para hacer un filtro por fecha debes de especificar la fecha inicial y la fecha final',
          confirmButtonColor:'red',
          confirmButtonText:'OK'
        })
      }
    }
  }


  //logica para buscar por referencia
  const searchReference = (e) => {
    const { value } = e.target
    if(value !== "") {
      if(
        filterDate.finalDate === '' && 
        filterDate.initialDate === ''
      ){
        const valor = value.toUpperCase()
        const filtered = records.filter((elem) => {
          if(elem.balance.reference.includes(valor)) {
            return elem
          }
        })
        if(filtered.length > 0) {  
          setSuggestions(filtered)
          setFillWithRef(filtered)
        } else {
          setSuggestions([])
        }
      }else{
        const valor = value.toUpperCase()
        const filtered = fillWithDate.filter((elem) => {
          if(elem.balance.reference.includes(valor)) {
            return elem
          }
        })
        if(filtered.length > 0) {
          setSuggestions(filtered)
        } else {
          setSuggestions([])
        }
      }
    }else {
      setSuggestions(records)
    }
    setSearchRef(value)
  }

  //logica para el filtro por fecha
  const getFiltered = () => {
    if (filterDate.initialDate !== '' && filterDate.finalDate !== '') {
      if(searchRef === ''){
        const initialDate = new Date(filterDate?.initialDate?.split('-').join('/')).toLocaleDateString();
        const finalDate = new Date(filterDate?.finalDate?.split('-').join('/')).toLocaleDateString();
        const filtered = records.filter((elem) => {
          const splitDate = new Date(elem.date).toLocaleDateString();
          if (splitDate >= initialDate && splitDate <= finalDate) {
            return elem;
          }
          return 0;
        });
        setSuggestions(filtered);
        setFillWithDate(filtered)
      }else{
        const initialDate = new Date(filterDate?.initialDate?.split('-').join('/')).toLocaleDateString();
        const finalDate = new Date(filterDate?.finalDate?.split('-').join('/')).toLocaleDateString();
        const filtered = fillWithRef.filter((elem) => {
          const splitDate = new Date(elem.date).toLocaleDateString();
          if (splitDate >= initialDate && splitDate <= finalDate) {
            return elem;
          }
          return 0;
        });
        setSuggestions(filtered);
      }
    }
  };

  const handleChangeFilterDate = (e) => {
    const { id, value } = e.target;
    setFilterDate({
      ...filterDate,
      [id]: value,
    });
  };

  const removeFilterDate = () => {
    setFilterDate({
      initialDate: '',
      finalDate: '',
    });
    setSearchRef('');
    getCheckList();
    setFillWithDate({})
  };  

  // Función para aplicar estilos a los títulos
  const applyStylesToHeaders = (worksheet) => {
    const headerCells = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1']; // Celdas de los encabezados
    headerCells.forEach((cell) => {
      worksheet[cell].s = {
        font: { bold: true }, // Texto en negrita
        fill: { fgColor: { rgb: 'D3D3D3' } }, // Fondo gris claro
      };
    });
  };

  //logica para exportar la tabla a un excel 
  const exportToExcel = (data) => {
    const filteredData = data.map((item) =>{
      const fecha = `${new Date(item?.date).getDate()}/${new Date(item?.date).getMonth()+1}/${new Date(item?.date).getFullYear()}`
      const referencia = item.balance.reference
      const peso_1 = item.firstWeight
      const peso_2 = item.secondWeight
      const peso_3 = item.thirdWeight
      const peso_4 = item.fourthWeight
      const peso_5 = item.fifthWeight
      const hora = item.hour
      const zona = item.balance.zone
      return ({referencia, peso_1, peso_2, peso_3, peso_4, peso_5, fecha, hora, zona })
    });
    const worksheet = XLSX.utils.json_to_sheet(filteredData); // Convierte los datos JSON a una hoja
    // Aplicar estilos a los títulos
    applyStylesToHeaders(worksheet);
    const workbook = XLSX.utils.book_new(); // Crea un libro de trabajo
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos"); // Añade la hoja al libro
    // Estilo global del libro (necesario si no está definido)
    workbook.Sheets["Datos"]["!cols"] = [{ wch: 10 }]; // Ajuste personal visual si lo quieres editable

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" }); // Genera el archivo en formato binario
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" }); // Convierte a Blob
    const filename = `verificaciones ${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()}`
    saveAs(dataBlob, `${filename}.xlsx`); // Guarda el archivo con FileSaver
  };

  //datos que se mostraran en el excel
  const data = [
      { referencia: 1, nombre: "Juan", edad: 30, ciudad: "Madrid" },
      { id: 2, nombre: "Ana", edad: 25, ciudad: "Barcelona" },
      { id: 3, nombre: "Luis", edad: 35, ciudad: "Sevilla" },
  ];

  return (
    <div className="d-flex flex-column container mt-5">
      <div className="d-flex flex-column gap-2 h-100">
        <div className="d-flex div-botons justify-content-center align-items-center">
          <Modal show={showModal} onHide={closeModal} centered>
            <Modal.Header closeButton>
              <Modal.Title className='d-flex justify-content-center w-100 fw-bold'>Detalles</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group controlId="formWeight">
              <div className='d-flex flex-column'>
                <label className='me-2'>Referencia</label>
                <select
                  value={searchRef && searchRef.toUpperCase()}
                  className="form-select form-select-sm"
                  onChange={(e)=>(setSearchRef(e.target.value)/* , searchReference(e) */)}
                  required
                >
                  <option selected value='' disabled>
                    -- Selecione una referencia --
                  </option>
                  {balances
                    .sort((a,b)=>a.id - b.id)
                    .map((elem)=>(
                      <option key={elem.id} id={elem.id} value={(elem.reference)}>
                        {elem.reference} 
                      </option>
                    ))
                  }
                  <option selected value=''>
                    Todos
                  </option>
                </select>
              </div>
              <hr className='mb-1 mt-3'/>
              <div className='d-flex flex-column'>
                <label className='me-2 mt-1'>Desde</label>
                <input
                  id="initialDate"
                  type="date"
                  value={filterDate.initialDate}
                  className="form-control form-control-sm"
                  max={filterDate.finalDate}
                  onChange={handleChangeFilterDate}
                />
              </div>
              <div className='d-flex flex-column '>
                <label className='me-2 mt-1'>Hasta</label>
                <input
                  id="finalDate"
                  type="date"
                  value={filterDate.finalDate}
                  className="form-control form-control-sm"
                  min={filterDate.initialDate}
                  onChange={handleChangeFilterDate}
                  disabled={filterDate.initialDate === '' ? true : false}
                />
              </div>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={(e)=>(duoSearch(e), closeModal(e))}>
                FILTRAR
              </Button>
              <Button variant="danger" onClick={(e)=>(removeFilterDate(e),closeModal(e))}>
              Borrar filtro
              </Button>
            </Modal.Footer>
          </Modal>
            <button
              className="btn btn-sm btn-primary d-flex justify-content-center "
              style={{width:isMobile ? '100%':'50%'}}
              onClick={openModal}
            >
              <FaIcons.FaFilter className='mt-1 me-1'/>
              Filtrar
            </button>
            <button 
              className='btn btn-sm btn-success d-flex justify-content-center' 
              style={{width:isMobile ? '100%':'50%'}}
              onClick={() => exportToExcel(suggestions)}
            >
              <SiMicrosoftexcel className='mt-1 me-1'/>
              Exportar
            </button>
        </div>
        <TableCheckList records={suggestions} getAllBalances={getCheckList} loading={loading}/>
      </div>
    </div>
  );
}

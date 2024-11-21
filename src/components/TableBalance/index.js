import { useState, useEffect, useContext } from "react";
import DataTable from "react-data-table-component";
import AuthContext from "../../context/authContext";
import { Modal, Button } from 'react-bootstrap';
import ModalVerifyBalance from "../ModalVerifyBalance";
import "./styles.css";

function TableBalance({ balances, getAllBalances, loading }) {
  const { user } = useContext(AuthContext);
  // Estado para el modal
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  //funcion para abrir el modal y darle los valores de la fila
  const handleRowClicked = (row) => {
    setSelectedRow(row);
    setShowModal(true);
  };

  //logica para saber si se esta visualizando en un celular
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

  const columns = [
    {
      id: "referencia",
      name: "REF",
      selector: (row) => row?.reference,
      sortable: true,
      width: isMobile ? '95px':'auto'
    },
    {
      id: "brand",
      name: "MARCA",
      selector: (row) => row?.brand,
      sortable: true,
    },
    {
      id: "model",
      name: `${'MODELO'}`,
      selector: (row) => row?.model,
      sortable: true,
    },
    {
      id: "serial",
      name: "SERIAL",
      selector: (row) => row?.serial,
      sortable: true,
    },
    {
      id: "maximumWeight",
      name: `${isMobile ? 'P. MAX':"PESO MÁXIMO"}`,
      selector: (row) => `${row?.maximumWeight} KG`,
      sortable: true,
    },
    {
      id: "minimumWeight",
      name: `${isMobile ? 'P. MIN':"PESO MÍNIMO"}`,
      selector: (row) => `${row?.minimumWeight} G`,
      sortable: true,
    },
  ];

  const customStyles = {
    cells: {
      style: {
        backgroundColor: 'rgba(255, 200, 39, 0.4)', // ajustar el tamaño de la fuente de las celdas
      },
    },
    rows: {
      style: {
        height:'15px', // ajusta el alto de las filas según tus necesidades
        cursor:'pointer'
      },
    },
    headCells: {
      style: {
        fontSize: '14px',
        height:'35px',
        fontWeight:'bold',
        color:'black',
        backgroundColor:'rgba(255, 200, 50, 0.8)'
      },
    },
  };

  return (
    <div
      className="d-flex flex-column rounded m-0 p-0 table-orders"
      style={{ width: "100%" }}
    >
      <ModalVerifyBalance 
        balance={selectedRow}
        setBalance={setSelectedRow}
        showModal={showModal}
        setShowModal={setShowModal}
        reloadInfo={getAllBalances}
      />
      <DataTable
        className="bg-light text-center border border-2 h-100 p-0 m-0"
        columns={columns}
        data={balances}
        customStyles={customStyles}
        onRowClicked={handleRowClicked}
        fixedHeaderScrollHeight={200}
        progressPending={loading}
        progressComponent={
          <div class="d-flex align-items-center text-danger gap-2 mt-2">
            <strong>Cargando...</strong>
            <div
              class="spinner-border spinner-border-sm ms-auto"
              role="status"
              aria-hidden="true"
            ></div>
          </div>
        }
        dense
        striped
        fixedHeader
        pagination
        paginationComponentOptions={{
          rowsPerPageText: "Filas por página:",
          rangeSeparatorText: "de",
          selectAllRowsItem: false,
        }}
        paginationPerPage={50}
        paginationRowsPerPageOptions={[15, 25, 50, 100]}
        noDataComponent={
          <div style={{ padding: 24 }}>Ningún resultado encontrado.</div>
        }
      />
    </div>
  );
}

export default TableBalance;

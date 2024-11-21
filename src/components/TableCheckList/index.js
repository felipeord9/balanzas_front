import { useState, useEffect, useContext } from "react";
import DataTable from "react-data-table-component";
import AuthContext from "../../context/authContext";
import ModalVerifyBalance from "../ModalVerifyBalance";
import "./styles.css";

function TableCheckList({ records, getAllRecords, loading }) {
  const { user } = useContext(AuthContext);
  // Estado para el modal
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

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
      selector: (row) => row?.balance.reference,
      sortable: true,
      width: isMobile ? '95px':'auto'
    },
    {
      id: "firstWeight",
      name: "Peso 1",
      selector: (row) => row?.firstWeight,
      sortable: true,
      width:'auto'
    },
    {
      id: "secondWeight",
      name: "Peso 2",
      selector: (row) => row?.secondWeight,
      sortable: true,
      width:'auto'
    },
    {
      id: "thirdWeight",
      name: "Peso 3",
      selector: (row) => row?.thirdWeight,
      sortable: true,
      width:'auto'
    },
    {
      id: "fourthWeight",
      name: "Peso 4",
      selector: (row) => row?.fourthWeight,
      sortable: true,
      width:'auto'
    },
    {
      id: "fifthWeight",
      name: "Peso 5",
      selector: (row) => row?.fifthWeight,
      sortable: true,
      width:'auto'
    },
    {
      id: "date",
      name: "Fecha",
      selector: (row) => `${new Date(row?.date).getDate()}/${new Date(row?.date).getMonth()+1}/${new Date(row?.date).getFullYear()}`,
      sortable: true,
    },
    {
      id: "Hour",
      name: "Hora",
      selector: (row) => row?.hour,
      sortable: true,
    },
    {
      id: "zone",
      name: "Zona",
      selector: (row) => row?.balance.zone,
      sortable: true,
    }
    
  ];

  const customStyles = {
    cells: {
      style: {
        backgroundColor: 'rgba(225, 76, 17, 0.1)', // ajustar el tamaño de la fuente de las celdas
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
        backgroundColor:'rgba(225, 76, 17, 0.7)'
      },
    },
  };

  return (
    <div
      className="d-flex flex-column rounded m-0 p-0 table-orders"
      style={{ height: "calc(100% - 60px)", width: "100%" }}
    >
      <ModalVerifyBalance 
        balance={selectedRow}
        setBalance={setSelectedRow}
        showModal={showModal}
        setShowModal={setShowModal}
        reloadInfo={getAllRecords}
      />
      <DataTable
        className="bg-light text-center border border-2 h-100 p-0 m-0"
        columns={columns}
        data={records}
        customStyles={customStyles}
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

export default TableCheckList;

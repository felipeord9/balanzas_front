import { useEffect, useState, useContext } from "react";
import { useParams , useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Modal, Button, Form } from "react-bootstrap";
import AuthContext from "../../context/authContext";
import { createRecord } from "../../services/recordService";
import { findOneByBalance } from "../../services/balanceService";
import Gramera from '../../assets/gramera.png'
import "./styles.css";

export default function SingleBalance() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(null);

  const openModal = (number) => {
    setSelectedNumber(number);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const [weights, setWeights] = useState({
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
  });
  const [um, setUm] = useState({
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
  });

  //logica para guardar los pesos de la balanza
  const handleWeightChange = (event) => {
    const { value } = event.target;
    setWeights((prevWeights) => ({
      ...prevWeights,
      [selectedNumber]: value,
    }));
  };

  //logica para guardar la unidad de medida de cada medición
  const handleUmChange = (event) => {
    const { value } = event.target;
    setUm((prevUm) => ({
      ...prevUm,
      [selectedNumber]: value,
    }));
  };

  const [loading, setLoading] = useState(false);

  //constante para guardar el valor del parametro
  const { balance } = useParams();
  //constante para guarda la informacion deacuerdo al parametro
  const [infoBalance, setInfoBalance] = useState({});

  useEffect(()=>{
    findOneByBalance(balance)
    .then(({data})=>{
      setInfoBalance(data);
    })
    .catch(()=>{
      setInfoBalance({})
      Swal.fire({
        icon:'warning',
        title:'¡ATENCIÓN!',
        text:'Ha ocurrido un error al momento de abrir el vínculo. Vuelve a intentarlo, si el problema persiste comunícate con el área de sistemas.',
        confirmButtonText:'OK',
        confirmButtonColor:'red'
      })
      .then(()=>{
        clearForm()
        navigate('/registros/diarios')
      })
    })
  },[])

  //logica para borrar todos los campos requeridos
  const refreshForm = () => {
    Swal.fire({
      title: "¿Está seguro?",
      text: "Se descartará todo el proceso que lleva",
      icon: "warning",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#dc3545",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
    }).then(({ isConfirmed }) => {
      if (isConfirmed){
        clearForm()
      }
    });
  };

  //logica para crear un registro 
  const handleCreateRecord = (e) => {
    e.preventDefault();
      if(
        weights[1] !== '' && um[1] !== '' &&
        weights[2] !== '' && um[2] !== '' &&
        weights[3] !== '' && um[3] !== '' &&
        weights[4] !== '' && um[4] !== '' &&
        weights[5] !== '' && um[5] !== '' 
      ){
        const body={
          firstWeight: `${weights[1]} ${um[1]}`,
          secondWeight:`${weights[2]} ${um[2]}`,
          thirdWeight:`${weights[3]} ${um[3]}`,
          fourthWeight:`${weights[4]} ${um[4]}`,
          fifthWeight:`${weights[5]} ${um[5]}`,
          date: new Date(),
          hour: `${new Date().getHours()}:${new Date().getMinutes()}`,
          balanceId: infoBalance.id,
          userId: user.id 
        }
        createRecord(body)
        .then((data) => {
          Swal.fire({
            title: '¡Correcto!',
            text: `El registro de la gramera se ha generado correctamente`,
            showConfirmButton: false,
            timer: 4000
          })
          clearForm()
        })
        .catch((error) => {
          Swal.fire({
            icon:'warning',
            title: '¡ERROR!',
            text: 'Ha ocurrido un error al momento de registrar la verificación. Vuelve a intentarlo, si el problema persiste comunicate con el área de sistemas.',
            showConfirmButton: false,
            timer: 5000
          })
        });
      }else{
        Swal.fire({
          icon:'warning',
          title: '¡ATENCIÓN!',
          text: 'Debes completar todos pesos en las diferentes posiciones para poder hacer el registro.',
          showConfirmButton: false,
          timer: 5000
        })
      }
  }

  const clearForm = () =>{
    setInfoBalance({})
    setUm({
      1: '',
      2: '',
      3: '',
      4: '',
      5: '',
    })
    setWeights({
      1: '',
      2: '',
      3: '',
      4: '',
      5: '',
    })
    navigate('/registros/diarios')
  }

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

  return (
    <div
      className="container d-flex flex-column w-100 py-3 mt-5"
      style={{ fontSize: 10.5 }}
    >
      <section className="d-flex flex-row justify-content-between align-items-center mb-2">
        <div className="d-flex flex-column">
          <h1 className="text-img-single fw-bold m-0">Verificación</h1>
          <h1 className="text-center text-img-single fw-bold">Gramera {balance}</h1>
        </div>
        <div className="d-flex flex-column align-items-center">
          <img 
            id="img-gramera"
            className="img-gramera"
            src={Gramera}
          />
        </div>
      </section>
      <form className="" style={{fontSize:12}} onSubmit={(e)=>handleCreateRecord(e)}>
        <div className="bg-light rounded shadow-sm p-2 mb-3">
          <div className="d-flex flex-column gap-1">
            <div>
              {/* Primera fila */}
              <div className="row row-cols-sm-2">
                <div className="d-flex flex-column align-items-start">
                  <label>Referencia:</label>
                  <input
                    id="reference"
                    type="text"
                    className="form-control form-control-sm"
                    placeholder=""
                    required
                    autoComplete="off"
                    disabled
                    style={{textTransform:'uppercase'}}
                    value={infoBalance.reference}
                  />
                </div>
                <div className="d-flex flex-column align-items-start">
                  <label>Marca:</label>
                  <input
                    id="brand"
                    value={infoBalance.brand}
                    type="text"
                    className="form-control form-control-sm"
                    placeholder=""
                    min={0}
                    disabled
                    required
                  />
                </div>
                
              </div>

              {/* Segunda fila */}
              <div className="row row-cols-sm-2">
                <div className="d-flex flex-column align-items-start">
                  <label>Modelo:</label>
                  <input
                    id="model"
                    value={infoBalance.model}
                    type="text"
                    className="form-control form-control-sm"
                    placeholder=""
                    min={0}
                    disabled
                    required
                  />
                </div>
                <div className="d-flex flex-column align-items-start">
                  <label>Serial:</label>
                  <input
                    id="serial"
                    type="text"
                    value={infoBalance.serial}
                    className="form-control form-control-sm"
                    placeholder=""
                    disabled
                    required
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Logica del cuadro con los pesos */}
              <label className="d-flex w-100 justify-content-center align-items-center mt-3">Posiciones</label> 
              <div className="container-ejemplo">
                <div className="square mb-3">
                  <div 
                    className="number top-left" 
                    onClick={() => openModal(2)}
                    style={{color: (weights[2] && um[2]) !== '' ? 'green' : 'orange'}}
                  >
                    2
                  </div>
                  <div 
                    className="number top-right" 
                    onClick={() => openModal(3)}
                    style={{color: (weights[3] && um[3]) !== '' ? 'green' : 'orange'}}
                  >
                    3
                  </div>
                  <div 
                    className="number center" 
                    onClick={() => openModal(1)}
                    style={{color: (weights[1] && um[1]) !== '' ? 'green' : 'orange'}}  
                  >
                    1
                  </div>
                  <div 
                    className="number bottom-left" 
                    onClick={() => openModal(4)}
                    style={{color: (weights[4] && um[4]) !== '' ? 'green' : 'orange'}}  
                  >
                    4
                  </div>
                  <div 
                    className="number bottom-right" 
                    onClick={() => openModal(5)}
                    style={{color: (weights[5] && um[5]) !== '' ? 'green' : 'orange'}}
                  >
                    5
                  </div>
                </div>

                {/* Logica del modal hijo */}
                <Modal show={modalIsOpen} onHide={closeModal} centered style={{backgroundColor:'rgba(0, 0, 0, 0.6)'}} size="sm">
                  <Modal.Header closeButton>
                    <Modal.Title>Peso {selectedNumber}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form.Group controlId="formWeight">
                      <Form.Control
                        type="number"
                        value={weights[selectedNumber] || ''}
                        onChange={handleWeightChange}
                        placeholder="Ingrese el peso"
                        className="mb-2"
                      />
                      <select
                        value={um[selectedNumber] || ''}
                        className="form-select form-select-sm"
                        onChange={handleUmChange}
                        required
                      >
                        <option selected disabled value="">
                          UM 
                        </option>
                        <option value="KG">KG</option>
                        <option value="G">G</option>
                      </select>
                    </Form.Group>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="success" onClick={closeModal}>
                      Guardar
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </div>
        </div>

        {/* Logica de los botones del final */}
        <Modal show={loading} centered>
          <Modal.Body>
            <div className="d-flex align-items-center">
              <strong className="text-danger" role="status">
                Cargando...
              </strong>
              <div
                className="spinner-grow text-danger ms-auto"
                role="status"
              ></div>
            </div>
          </Modal.Body>
        </Modal>
        <div className="d-flex flex-row gap-3 mb-3 mt-3">
          <button
            type="submit"
            className="btn btn-sm btn-success fw-bold w-100"
          >
            REGISTRAR
          </button>
          <button
            type="button"
            className="btn btn-sm btn-danger fw-bold w-100"
            onClick={refreshForm}
          >
            CANCELAR
          </button>
        </div>
      </form>
    </div>
  );
}

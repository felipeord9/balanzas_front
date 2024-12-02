import { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";
import AuthContext from "../../context/authContext";
import { findBalance , createBalance , updateBalance } from "../../services/balanceService";
import Gramera from '../../assets/gramera.png'
import "./styles.css";

export default function Balance() {
  const { user, setUser } = useContext(AuthContext);

  const [search, setSearch] = useState({
    id:'',
    reference: "",
    model: "",
    brand: "",
    serial: "",
    minimumWeight: "",
    umMin:'',
    maximumWeight:"",
    umMax:'',
    observations:"",
    zona:'',
    subZona:'',
  });

  const [actualizar,setActualizar] = useState(false)
  const [loading, setLoading] = useState(false);
  const [balances, setBalances] = useState({});
  const [referLooked, setReferLooked] = useState('');

  useEffect(()=>{
    getAllBalances();
  },[])

  const getAllBalances = () => {
    findBalance()
    .then(({data})=>{
      setBalances(data)
    })
    .catch(()=>{
      console.log('Any balance found')
    })
  };

  const handlerChangeSearch = (e) => {
    const { id, value } = e.target;
    setSearch({
      ...search,
      [id]: value,
    });
  };

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

  //logica para registrar
  const handleSubmit = (e) => {
    e.preventDefault();
    if(actualizar === true){
      const body = {
        reference: (search.reference).toUpperCase(),
        model: search.model,
        brand: search.brand,
        maximumWeight: search.maximumWeight,
        minimumWeight: search.minimumWeight,
        serial: search.serial,
        zone: search.zona,
        subZone: search.subZona,
        updateBy: user.id,
        updateAt: new Date(),
        observations: search.observations,
      }
      updateBalance(search.id,body)
      .then(()=>{
        Swal.fire({
          title:'¡CORRECTO!',
          text:'Se ha editado correctamente la gramera.',
          confirmButtonColor:'green',
          confirmButtonText:'OK'
        })
        getAllBalances()
        clearForm()
      })
      .catch(()=>{
        Swal.fire({
          icon:'info',
          title:'¡ATENCIÓN!',
          text:'Ha ocurrido un error al momento de editar la gramera en el sistema. vuelve a intentarlo, si el problema persiste comunicate con el área de sistemas.',
          confirmButtonColor:'red',
          confirmButtonText:'OK'
        })
        clearForm()
      })
    }else{
      const body = {
        reference: (search.reference).toUpperCase(),
        model: search.model,
        brand: search.brand,
        maximumWeight: search.maximumWeight,
        minimumWeight: search.minimumWeight,
        serial: search.serial,
        zone: search.zona,
        subZone: search.subZona,
        createdAt: new Date(),
        userId: user.id,
        observations: search.observations,
      }
      createBalance(body)
      .then(()=>{
        Swal.fire({
          title:'¡CORRECTO!',
          text:'Se ha creado correctamente la gramera.',
          confirmButtonColor:'green',
          confirmButtonText:'OK'
        })
        getAllBalances()
        clearForm()
      })
      .catch(()=>{
        Swal.fire({
          icon:'info',
          title:'¡ATENCIÓN!',
          text:'Ha ocurrido un error al momento de crear la gramera en el sistema. vuelve a intentarlo, si el problema persiste comunicate con el área de sistemas.',
          confirmButtonColor:'red',
          confirmButtonText:'OK'
        })
        clearForm()
      })
    }
  }

  const clearForm = () =>{
    setSearch({
      brand:'',
      id:'',
      maximumWeight:'',
      minimumWeight:'',
      model:'',
      observations:'',
      reference:'',
      serial:'',
      subZona:'',
      zona:'',
    })
    setActualizar(false)
    setReferLooked('')
  }

  //logica para hacer la busqueda de la gramera cuando se escriba o se borre algo en el input reference
  const handleLookFor = (e) =>{
    const { id, value } = e.target;
    setSearch({
      ...search,
      [id]:value
    })
    var filterBalance = balances.filter((item)=>{
      if((item.reference)===(value.toUpperCase())){
        return item
      }else{
        return null
      }
    })
    if(filterBalance.length > 0){
      filterBalance.map((item)=>{
        setSearch({
          ...search,
          id: item.id,
          reference: item.reference,
          model:item.model,
          brand: item.brand,
          maximumWeight: item.maximumWeight,
          minimumWeight: item.minimumWeight,
          observations: item.observations,
          serial: item.serial,
          zona: item.zone,
          subZona: item.subZone,
        })
        setReferLooked(item.reference)
      })
      setActualizar(true)
    }else{
      setSearch({
        id: '',
        model: '',
        brand: '',
        maximumWeight: '',
        minimumWeight: '',
        observations: '',
        serial: '',
        zona:'',
        subZona:'',
        reference:value
      })
      setActualizar(false)
    }
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
          <h1 className="text-img fw-bold m-0">Adicionar y/o editar</h1>
          <h1 className="text-center text-img fw-bold">GRAMERAS</h1>
        </div>
        <div className="d-flex flex-column align-items-center">
          <img 
            id="img-gramera"
            className="img-gramera"
            src={Gramera}
          />
        </div>
      </section>
      <form className="" style={{fontSize:12}} onSubmit={handleSubmit}>
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
                    style={{textTransform:'uppercase'}}
                    value={search.reference}
                    onChange={(e)=>(handlerChangeSearch(e),handleLookFor(e))}
                    /* onKeyPress={actualizar === false ? handleKeyPress:null}
                    onBlur={actualizar === false ? handleInputBlur:null} */
                  />
                </div>
                <div className="d-flex flex-column align-items-start">
                  <label>Marca:</label>
                  <input
                    id="brand"
                    value={search.brand}
                    type="text"
                    onChange={(e)=>handlerChangeSearch(e)}
                    className="form-control form-control-sm"
                    placeholder=""
                    min={0}
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
                    value={search.model}
                    type="text"
                    onChange={(e)=>handlerChangeSearch(e)}
                    className="form-control form-control-sm"
                    placeholder=""
                    min={0}
                    required
                  />
                </div>
                <div className="d-flex flex-column align-items-start">
                  <label>Serial:</label>
                  <input
                    id="serial"
                    type="text"
                    value={search.serial}
                    className="form-control form-control-sm"
                    placeholder="*Campo Opcional*"
                    autoComplete="off"
                    onChange={(e)=>handlerChangeSearch(e)}
                  />
                </div>
              </div>

              {/* Tercer fila */}
              <div className="row row-cols-sm-2">
                <div className="d-flex flex-column align-items-start">
                  <label>Peso máximo:</label>
                  <div className="input-container w-100 gap-1">
                    <input
                      id="maximumWeight"
                      type="number"
                      className="form-control form-control-sm input-con-sufijo"
                      placeholder=""
                      value={search.maximumWeight}
                      required
                      autoComplete="off"
                      onChange={(e)=>handlerChangeSearch(e)}
                    />
                    <span>KG</span>
                    {/* <select
                      id="umMax"
                      value={search.umMax}
                      className="select-um form-select form-select-sm"
                      onChange={handlerChangeSearch}
                      required
                      style={{backgroundColor:'#dcdcdc', width: isMobile ? '37%':'15%'}}
                    >
                      <option selected disabled value="">
                        UM 
                      </option>
                      <option className="select-um" value="usuario">KG</option>
                      <option value="admin">G</option>
                    </select> */}
                  </div>
                </div>
                <div className="d-flex flex-column align-items-start">
                  <label>Peso mínimo:</label>
                  <div className="input-container w-100 gap-1">
                    <input
                      id="minimumWeight"
                      type="number"
                      className="form-control form-control-sm input-con-sufijo"
                      placeholder=""
                      value={search.minimumWeight}
                      required
                      autoComplete="off"
                      onChange={(e)=>handlerChangeSearch(e)}
                    />
                    <span>G</span>
                    {/* <select
                      id="umMin"
                      value={search.umMin}
                      className="select-um form-select form-select-sm"
                      onChange={handlerChangeSearch}
                      required
                      style={{backgroundColor:'#dcdcdc', width: isMobile ? '37%':'15%'}}
                    >
                      <option selected disabled value="">
                        UM 
                      </option>
                      <option className="select-um" value="usuario">KG</option>
                      <option value="admin">G</option>
                    </select> */}
                  </div>
                </div>
              </div>

              {/* Cuarta fila */}
              <div className="row row-cols-sm-2">
                <div className="d-flex flex-column align-items-start">
                  <label>Zona:</label>
                  <select
                    id="zona"
                    value={search.zona}
                    className="select-um form-select form-select-sm"
                    onChange={handlerChangeSearch}
                    required
                  >
                    <option selected disabled value="">
                      -- Seleccione la zona a la que pertenece -- 
                    </option>
                    <option className="select-um" value="planta">PLANTA</option>
                    <option value="logistica">LOGÍSTICA</option>
                  </select>
                </div>
                <div className="d-flex flex-column align-items-start">
                  <label>Sub zona:</label>
                  <select
                    id="subZona"
                    value={search.subZona}
                    className="select-um form-select form-select-sm"
                    onChange={handlerChangeSearch}
                    required
                    disabled={search.zona !== '' ? false:true}
                  >
                    <option selected disabled value="">
                      -- Seleccione la sub zona a la que pertenece -- 
                    </option>
                    {search.zona === 'planta' && (
                      <option className="select-um" value="planta principal">PLANTA PRINCIPAL</option>
                    )}
                    {search.zona === 'planta' && (
                      <option value="embutidos">EMBUTIDOS</option>
                    )}
                    {search.zona === 'logistica' && (
                      <option className="select-um" value="yumbo 1">YUMBO 1</option>
                    )}
                    {search.zona === 'logistica' && (
                      <option value="yumbo 2">YUMBO 2</option>
                    )}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex flex-column mb-3">
          <label className="fw-bold">OBSERVACIONES</label>
          <textarea
            id="observations"
            className="form-control"
            value={search.observations}
            autoComplete="off"
            onChange={handlerChangeSearch}
            style={{ minHeight: 70, maxHeight: 100, fontSize: 12 }}
          ></textarea>
        </div>
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
        <div className="d-flex flex-row gap-3 mb-3">
          <button
            type="submit"
            className="btn btn-sm btn-success fw-bold w-100"
          >
            {actualizar ? 'ACTUALIZAR' : 'REGISTRAR'}
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
